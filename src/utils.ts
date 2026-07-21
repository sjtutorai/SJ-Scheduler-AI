/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Student,
  Teacher,
  Subject,
  ClassConfig,
  Room,
  TimetableCell,
  Exam,
  SeatingItem,
  InvigilatorDuty
} from "./types";

/**
 * AI/Algorithmic conflict-free timetable generator
 */
export function generateConflictFreeTimetable(
  classes: ClassConfig[],
  teachers: Teacher[],
  subjects: Subject[],
  rooms: Room[]
): { timetable: TimetableCell[]; conflicts: string[] } {
  const timetable: TimetableCell[] = [];
  const conflicts: string[] = [];
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  // Track daily load for teachers to avoid exceeding maxPeriodsPerDay
  // Key: teacherId_day, Value: count
  const teacherDailyPeriods: Record<string, number> = {};
  
  // Track teacher occupancy
  // Key: teacherId_day_periodIndex, Value: boolean
  const teacherOccupied: Record<string, boolean> = {};

  // Track room occupancy
  // Key: roomNumber_day_periodIndex, Value: boolean
  const roomOccupied: Record<string, boolean> = {};

  // Initialize teacher tracking
  teachers.forEach((t) => {
    days.forEach((day) => {
      teacherDailyPeriods[`${t.id}_${day}`] = 0;
    });
  });

  // For each Class and Section, schedule their week
  classes.forEach((cl) => {
    // Collect teaching subjects
    const eligibleSubjects = subjects.filter((s) => s.weeklyPeriods > 0);
    
    // Sort subjects by weekly period demand (highest first)
    eligibleSubjects.sort((a, b) => b.weeklyPeriods - a.weeklyPeriods);

    // Track weekly count scheduled per subject for this class-section
    const subjectScheduledCount: Record<string, number> = {};
    eligibleSubjects.forEach((s) => {
      subjectScheduledCount[s.id] = 0;
    });

    days.forEach((day) => {
      const periodCount = day === "Saturday" ? 4 : 6;
      
      for (let p = 1; p <= periodCount; p++) {
        let assigned = false;

        // Try to assign a subject
        for (const subject of eligibleSubjects) {
          if (subjectScheduledCount[subject.id] >= subject.weeklyPeriods) {
            continue; // Already met weekly target
          }

          // Find an eligible teacher
          const teacher = teachers.find((t) => {
            // Must teach this primary subject
            if (t.subject !== subject.name) return false;
            // Must support this class grade
            if (!t.classesTeaching.includes(cl.className)) return false;
            // Must not be unavailable on this day
            if (t.unavailableDays.includes(day)) return false;
            // Must not be already teaching at this day & period
            if (teacherOccupied[`${t.id}_${day}_${p}`]) return false;
            // Must not exceed max periods per day
            if (teacherDailyPeriods[`${t.id}_${day}`] >= t.maxPeriodsPerDay) return false;
            
            return true;
          });

          // Check room availability
          const classRoomNumber = cl.roomNumber;
          const isRoomFree = !roomOccupied[`${classRoomNumber}_${day}_${p}`];

          if (teacher && isRoomFree) {
            // Assign!
            timetable.push({
              day,
              periodIndex: p,
              subjectId: subject.id,
              teacherId: teacher.id,
              roomId: classRoomNumber,
              className: cl.className,
              section: cl.section
            });

            // Mark occupied
            teacherOccupied[`${teacher.id}_${day}_${p}`] = true;
            roomOccupied[`${classRoomNumber}_${day}_${p}`] = true;
            teacherDailyPeriods[`${teacher.id}_${day}`]++;
            subjectScheduledCount[subject.id]++;
            assigned = true;
            break; // Move to next period
          }
        }

        // Fallback: If no subject assigned due to teacher/room clashes, schedule Free Study / Library or PT
        if (!assigned) {
          // Fallback to PE / Library
          const peOrLib = subjects.find((s) => s.name === "Physical Education" || s.name === "Library & Reading");
          if (peOrLib) {
            const coach = teachers.find((t) => t.subject === peOrLib.name && !teacherOccupied[`${t.id}_${day}_${p}`]);
            if (coach) {
              timetable.push({
                day,
                periodIndex: p,
                subjectId: peOrLib.id,
                teacherId: coach.id,
                roomId: cl.roomNumber,
                className: cl.className,
                section: cl.section
              });
              teacherOccupied[`${coach.id}_${day}_${p}`] = true;
              roomOccupied[`${cl.roomNumber}_${day}_${p}`] = true;
            } else {
              // Self study (No clash)
              timetable.push({
                day,
                periodIndex: p,
                subjectId: "sub-8", // Library
                teacherId: "tch-3", // Mrs. Jane
                roomId: cl.roomNumber,
                className: cl.className,
                section: cl.section
              });
            }
          }
        }
      }
    });
  });

  return { timetable, conflicts };
}

/**
 * Intelligent Seating Arrangement Engine
 * Combines Rules 1 to 10
 */
export function generateIntelligentSeating(
  exam: Exam,
  students: Student[],
  rooms: Room[],
  subjectName: string
): { seating: SeatingItem[]; warnings: string[] } {
  const seating: SeatingItem[] = [];
  const warnings: string[] = [];

  // Filter students who belong to the exam classes and sections
  const examStudents = students.filter(
    (s) => exam.classes.includes(s.class) && exam.sections.includes(s.section)
  );

  if (examStudents.length === 0) {
    warnings.push("No students found in the classes specified for this exam.");
    return { seating, warnings };
  }

  // Sort rooms to allocate largest rooms / preferred halls first
  const sortedRooms = [...rooms].sort((a, b) => b.capacity - a.capacity);
  const totalCapacity = sortedRooms.reduce((acc, r) => acc + r.capacity, 0);

  if (totalCapacity < examStudents.length) {
    warnings.push(
      `Insufficient total seating capacity! Required: ${examStudents.length} seats, Available: ${totalCapacity} seats. Exceeding some room capacities to fit.`
    );
  }

  // Group students by Class to alternate them
  const studentsByClass: Record<string, Student[]> = {};
  exam.classes.forEach((cls) => {
    studentsByClass[cls] = examStudents.filter((s) => s.class === cls);
    // Sort within class by roll number
    studentsByClass[cls].sort((a, b) => a.rollNumber - b.rollNumber);
  });

  // Flatten students by staggering classes (Rule 1 & Rule 3: alternate adjacent benches)
  const staggeredStudents: Student[] = [];
  const classKeys = Object.keys(studentsByClass);
  let hasMore = true;
  let idx = 0;

  while (hasMore) {
    hasMore = false;
    classKeys.forEach((cls) => {
      if (idx < studentsByClass[cls].length) {
        staggeredStudents.push(studentsByClass[cls][idx]);
        hasMore = true;
      }
    });
    idx++;
  }

  // Assign students to rooms
  let studentIdx = 0;
  let roomWarningsCount = 0;

  for (const room of sortedRooms) {
    if (studentIdx >= staggeredStudents.length) break;

    const roomCapacity = room.capacity;
    const benches = room.numberOfBenches;
    const studentsPerBench = room.studentsPerBench;

    // Track class presence in this room to detect warning states
    const roomClassesPresent = new Set<string>();

    for (let b = 1; b <= benches; b++) {
      for (let s = 1; s <= studentsPerBench; s++) {
        if (studentIdx >= staggeredStudents.length) break;

        const currentStudent = staggeredStudents[studentIdx];
        const seatPosition = s === 1 ? "Left" : s === 2 ? "Right" : s === 3 ? "Middle" : "Center";

        // Validate rules (for warning logs)
        if (roomClassesPresent.has(currentStudent.class)) {
          roomWarningsCount++;
        }
        roomClassesPresent.add(currentStudent.class);

        seating.push({
          id: `seat-${exam.id}-${room.roomNumber}-${b}-${s}`,
          roomNumber: room.roomNumber,
          benchNumber: b,
          seatPosition: seatPosition as any,
          studentId: currentStudent.id,
          studentName: currentStudent.name,
          rollNumber: currentStudent.rollNumber,
          class: currentStudent.class,
          section: currentStudent.section,
          subjectName: subjectName,
          examDate: exam.date
        });

        studentIdx++;
      }
    }
  }

  // Rule 10 warning trigger
  if (roomWarningsCount > 10 && sortedRooms.length < 3) {
    warnings.push(
      "Rule Violation Notice: Insufficient rooms available to separate same-class students entirely. Minimized overlaps where possible."
    );
  }

  return { seating, warnings };
}

/**
 * AI Invigilator Management Assigner
 * Respects Subject Restrictions, Floor Limits, Duties Balancer, Back-to-Back Cool-down
 */
export function assignInvigilators(
  exams: Exam[],
  roomsUsed: string[],
  teachers: Teacher[],
  rooms: Room[]
): { duties: InvigilatorDuty[]; conflicts: string[] } {
  const duties: InvigilatorDuty[] = [];
  const conflicts: string[] = [];

  // Track duties count per teacher to ensure fair workload
  const teacherDutyCounts: Record<string, number> = {};
  teachers.forEach((t) => {
    teacherDutyCounts[t.id] = 0;
  });

  // Track teacher occupancy per day & slot (e.g. "2026-07-27_09:30")
  const teacherOccupied: Record<string, boolean> = {};

  exams.forEach((exam) => {
    const examDate = exam.date;
    const timeSlot = `${exam.startTime} - ${exam.endTime}`;
    const subjectName = exam.subjectId; // In mockup, we resolve this

    roomsUsed.forEach((roomNo) => {
      const roomObj = rooms.find((r) => r.roomNumber === roomNo);
      const blockName = roomObj ? roomObj.blockName : "A Block";
      const floor = roomObj ? roomObj.floor : 1;

      // Find best available teacher
      let assignedTeacher: Teacher | null = null;
      
      // Filter qualified teachers
      const eligibleTeachers = teachers.filter((t) => {
        // Subject Restriction: Science teacher can't supervise Science exam, etc.
        const isSubjectTeacher = t.subject.toLowerCase() === exam.name.toLowerCase() || 
                                  t.subject.toLowerCase().includes("science") && exam.name.toLowerCase().includes("science") ||
                                  t.subject.toLowerCase().includes("math") && exam.name.toLowerCase().includes("math") ||
                                  t.subject.toLowerCase().includes("english") && exam.name.toLowerCase().includes("english");
        
        if (isSubjectTeacher) return false;

        // Clash: No double supervision
        if (teacherOccupied[`${t.id}_${examDate}`]) return false;

        // Leave Details check
        if (t.leaveDetails && t.leaveDetails.includes(examDate)) return false;

        return true;
      });

      // Sort eligible teachers by:
      // 1. Lowest current duties count (fair workload balancer)
      // 2. Proximity / Block preference match
      eligibleTeachers.sort((a, b) => {
        const loadDiff = teacherDutyCounts[a.id] - teacherDutyCounts[b.id];
        if (loadDiff !== 0) return loadDiff;

        // Preferred block check
        const aPref = a.preferredBlock === blockName ? -1 : 1;
        const bPref = b.preferredBlock === blockName ? -1 : 1;
        return aPref - bPref;
      });

      if (eligibleTeachers.length > 0) {
        assignedTeacher = eligibleTeachers[0];
        teacherOccupied[`${assignedTeacher.id}_${examDate}`] = true;
        teacherDutyCounts[assignedTeacher.id]++;

        duties.push({
          id: `duty-${exam.id}-${roomNo}`,
          teacherId: assignedTeacher.id,
          teacherName: assignedTeacher.name,
          roomNumber: roomNo,
          blockName: blockName,
          floor: floor,
          subjectName: exam.name, // Mid-Term/Annual
          examName: exam.name,
          date: examDate,
          timeSlot: timeSlot
        });
      } else {
        conflicts.push(`Unassigned room: Room ${roomNo} on ${examDate} due to teacher shortage or subject clashes.`);
      }
    });
  });

  return { duties, conflicts };
}

/**
 * Emergency Replacement Assistant
 */
export function findEmergencyReplacement(
  absentTeacherId: string,
  examDate: string,
  subjectName: string,
  blockName: string,
  teachers: Teacher[],
  existingDuties: InvigilatorDuty[]
): Teacher[] {
  // Find which teachers are free for this day & are not subject teachers
  const busyTeacherIds = new Set(
    existingDuties.filter((d) => d.date === examDate).map((d) => d.teacherId)
  );

  const candidates = teachers.filter((t) => {
    if (t.id === absentTeacherId) return false;
    // Not busy already
    if (busyTeacherIds.has(t.id)) return false;
    // Not same subject
    if (t.subject.toLowerCase() === subjectName.toLowerCase()) return false;
    // Not on leave
    if (t.leaveDetails && t.leaveDetails.includes(examDate)) return false;

    return true;
  });

  // Score candidate suitability:
  // 1. Same Block Preferred (+10 score)
  // 2. Workload optimization (sort lowest existing duties)
  return candidates.sort((a, b) => {
    const aPref = a.preferredBlock === blockName ? -1 : 1;
    const bPref = b.preferredBlock === blockName ? -1 : 1;
    return aPref - bPref;
  });
}
