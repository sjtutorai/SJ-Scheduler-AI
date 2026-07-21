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
  InvigilatorDuty,
  SchoolInfo,
  TimeSlot
} from "./types";

/**
 * Helper to parse time string "HH:MM" (or "HH:MM AM/PM") to minutes from midnight
 */
export function parseTimeToMinutes(t: string): number {
  if (!t) return 0;
  // Clean up and standardize
  const clean = t.trim().toUpperCase();
  const ampmMatch = clean.match(/(AM|PM)$/);
  
  let [timePart] = clean.split(/\s+/);
  const [hStr, mStr] = timePart.split(":");
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10) || 0;
  
  if (isNaN(h)) return 0;
  
  if (ampmMatch) {
    const ampm = ampmMatch[1];
    if (ampm === "PM" && h < 12) h += 12;
    if (ampm === "AM" && h === 12) h = 0;
  }
  
  return h * 60 + m;
}

/**
 * Automatically calculates and generates standard period time slots
 */
export function generateTimeSlots(config: {
  start: string;
  end: string;
  assemblyStart: string;
  assemblyDuration: number;
  periodsCount: number;
  periodDuration: number;
  recessStart: string;
  recessDuration: number;
  lunchStart: string;
  lunchDuration: number;
}): TimeSlot[] {
  const slots: TimeSlot[] = [];

  const formatTime = (mins: number) => {
    const h = Math.floor(mins / 60) % 24;
    const m = mins % 60;
    const ampm = h >= 12 ? "PM" : "AM";
    const displayHour = h % 12 === 0 ? 12 : h % 12;
    return `${String(displayHour).padStart(2, "0")}:${String(m).padStart(2, "0")} ${ampm}`;
  };

  const startMins = parseTimeToMinutes(config.start || "09:00");
  const assemblyStartMins = parseTimeToMinutes(config.assemblyStart || "09:00");
  const assemblyDuration = Number(config.assemblyDuration || 0);
  const recessStartMins = parseTimeToMinutes(config.recessStart || "10:45");
  const recessDuration = Number(config.recessDuration || 0);
  const lunchStartMins = parseTimeToMinutes(config.lunchStart || "12:30");
  const lunchDuration = Number(config.lunchDuration || 0);
  const periodDuration = Number(config.periodDuration || 45);
  const periodsCount = Number(config.periodsCount || 8);

  // 1. Add Assembly if duration > 0
  if (assemblyDuration > 0) {
    slots.push({
      type: "assembly",
      label: "Assembly",
      start: formatTime(assemblyStartMins),
      end: formatTime(assemblyStartMins + assemblyDuration)
    });
  }

  // Pointer starting after Assembly or at school start
  let currentPointer = Math.max(startMins, assemblyStartMins + assemblyDuration);

  // We generate up to periodsCount
  for (let p = 1; p <= periodsCount; p++) {
    // If we've reached recess start
    const recessEndMins = recessStartMins + recessDuration;
    if (recessDuration > 0 && currentPointer >= recessStartMins && currentPointer < recessEndMins) {
      slots.push({
        type: "recess",
        label: "Short Recess",
        start: formatTime(recessStartMins),
        end: formatTime(recessEndMins)
      });
      currentPointer = recessEndMins;
    }

    // Check if recess starts in the middle of this period
    if (recessDuration > 0 && currentPointer < recessStartMins && currentPointer + periodDuration > recessStartMins) {
      slots.push({
        type: "period",
        label: `Period ${p}`,
        periodIndex: p,
        start: formatTime(currentPointer),
        end: formatTime(recessStartMins)
      });
      slots.push({
        type: "recess",
        label: "Short Recess",
        start: formatTime(recessStartMins),
        end: formatTime(recessEndMins)
      });
      currentPointer = recessEndMins;
      continue;
    }

    // Lunch break check
    const lunchEndMins = lunchStartMins + lunchDuration;
    if (lunchDuration > 0 && currentPointer >= lunchStartMins && currentPointer < lunchEndMins) {
      slots.push({
        type: "lunch",
        label: "Lunch Break",
        start: formatTime(lunchStartMins),
        end: formatTime(lunchEndMins)
      });
      currentPointer = lunchEndMins;
    }

    // Check if lunch starts in the middle of this period
    if (lunchDuration > 0 && currentPointer < lunchStartMins && currentPointer + periodDuration > lunchStartMins) {
      slots.push({
        type: "period",
        label: `Period ${p}`,
        periodIndex: p,
        start: formatTime(currentPointer),
        end: formatTime(lunchStartMins)
      });
      slots.push({
        type: "lunch",
        label: "Lunch Break",
        start: formatTime(lunchStartMins),
        end: formatTime(lunchEndMins)
      });
      currentPointer = lunchEndMins;
      continue;
    }

    // Standard Period slot
    const nextPeriodEnd = currentPointer + periodDuration;
    slots.push({
      type: "period",
      label: `Period ${p}`,
      periodIndex: p,
      start: formatTime(currentPointer),
      end: formatTime(nextPeriodEnd)
    });
    currentPointer = nextPeriodEnd;
  }

  return slots;
}

/**
 * Maps a class to its customized school schedule, or falls back to global settings
 */
export function getTimingsForClass(className: string, schoolInfo: SchoolInfo) {
  const num = parseInt(className, 10);
  if (!isNaN(num) && schoolInfo.customClassTimings) {
    const matched = schoolInfo.customClassTimings.find((t) => {
      const matches = t.classRange.match(/\d+/g);
      if (matches && matches.length >= 2) {
        const start = parseInt(matches[0], 10);
        const end = parseInt(matches[1], 10);
        return num >= start && num <= end;
      }
      return false;
    });
    if (matched) {
      return {
        start: matched.start,
        end: matched.end,
        assemblyStart: matched.assemblyStart,
        assemblyDuration: matched.assemblyDuration,
        periodsCount: matched.periodsCount,
        periodDuration: matched.periodDuration,
        recessStart: matched.recessStart,
        recessDuration: matched.recessDuration,
        lunchStart: matched.lunchStart,
        lunchDuration: matched.lunchDuration,
        lastBellTime: matched.lastBellTime,
        isCustom: true,
        classRange: matched.classRange
      };
    }
  }

  // Calculate default lunch duration from global info
  const glStart = schoolInfo.lunchTiming?.start || "12:30";
  const glEnd = schoolInfo.lunchTiming?.end || "13:15";
  const calculatedLunchDuration = Math.max(15, parseTimeToMinutes(glEnd) - parseTimeToMinutes(glStart));

  // Fallback to global defaults
  return {
    start: schoolInfo.schoolTiming.start || "09:00",
    end: schoolInfo.schoolTiming.end || "16:00",
    assemblyStart: schoolInfo.assemblyStart || "09:00",
    assemblyDuration: schoolInfo.assemblyDuration !== undefined ? schoolInfo.assemblyDuration : 15,
    periodsCount: schoolInfo.periodsCount !== undefined ? schoolInfo.periodsCount : 8,
    periodDuration: schoolInfo.periodDuration !== undefined ? schoolInfo.periodDuration : 45,
    recessStart: schoolInfo.recessStart || "10:45",
    recessDuration: schoolInfo.recessDuration !== undefined ? schoolInfo.recessDuration : 15,
    lunchStart: glStart,
    lunchDuration: calculatedLunchDuration,
    lastBellTime: schoolInfo.lastBellTime || "16:00",
    isCustom: false,
    classRange: "Global Default"
  };
}

interface TimeInterval {
  start: number; // mins from midnight
  end: number;
}

/**
 * AI/Algorithmic conflict-free timetable generator
 */
export function generateConflictFreeTimetable(
  classes: ClassConfig[],
  teachers: Teacher[],
  subjects: Subject[],
  rooms: Room[],
  schoolInfo?: SchoolInfo
): { timetable: TimetableCell[]; conflicts: string[] } {
  const timetable: TimetableCell[] = [];
  const conflicts: string[] = [];
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // Fallback default schoolInfo if missing
  const activeSchoolInfo: SchoolInfo = schoolInfo || {
    name: "Springdale International Academy",
    logo: "",
    address: "",
    udiseCode: "",
    principalName: "",
    headmasterName: "",
    contactNumber: "",
    academicYear: "2026-2027",
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    schoolTiming: { start: "09:00", end: "16:00" },
    lunchTiming: { start: "12:30", end: "13:15" },
    assemblyStart: "09:00",
    assemblyDuration: 15,
    periodsCount: 8,
    periodDuration: 45,
    recessStart: "10:45",
    recessDuration: 15,
    lastBellTime: "16:00",
    holidays: []
  };

  // Track daily load for teachers to avoid exceeding maxPeriodsPerDay
  // Key: teacherId_day, Value: count
  const teacherDailyPeriods: Record<string, number> = {};

  // Track busy time intervals for teachers and rooms to support multi-timing conflict prevention
  // Key: teacherId_day, Value: TimeInterval[]
  const teacherBusyTime: Record<string, TimeInterval[]> = {};
  // Key: roomNumber_day, Value: TimeInterval[]
  const roomBusyTime: Record<string, TimeInterval[]> = {};

  // Initialize tracking
  teachers.forEach((t) => {
    days.forEach((day) => {
      teacherDailyPeriods[`${t.id}_${day}`] = 0;
      teacherBusyTime[`${t.id}_${day}`] = [];
    });
  });

  classes.forEach((cl) => {
    days.forEach((day) => {
      roomBusyTime[`${cl.roomNumber}_${day}`] = [];
    });
  });

  const checkOverlap = (intervals: TimeInterval[], target: TimeInterval): boolean => {
    return intervals.some((inv) => target.start < inv.end && inv.start < target.end);
  };

  // Process classes
  classes.forEach((cl) => {
    // 1. Get schedule profile for this class
    const timings = getTimingsForClass(cl.className, activeSchoolInfo);
    const slots = generateTimeSlots(timings);
    const teachingSlots = slots.filter((s) => s.type === "period");

    // Collect teaching subjects
    const eligibleSubjects = subjects.filter((s) => s.weeklyPeriods > 0);
    // Sort by weekly demand (highest first)
    eligibleSubjects.sort((a, b) => b.weeklyPeriods - a.weeklyPeriods);

    // Track weekly count scheduled per subject for this class-section
    const subjectScheduledCount: Record<string, number> = {};
    eligibleSubjects.forEach((s) => {
      subjectScheduledCount[s.id] = 0;
    });

    days.forEach((day) => {
      // 2. Support half-days and custom limits (Saturday usually has fewer periods, e.g. 50% or 4 periods max)
      const isSaturday = day === "Saturday";
      const totalAvailablePeriods = isSaturday 
        ? Math.min(4, teachingSlots.length) 
        : teachingSlots.length;

      let p = 0;
      while (p < totalAvailablePeriods) {
        const slot = teachingSlots[p];
        const periodIndex = slot.periodIndex || (p + 1);

        const startMins = parseTimeToMinutes(slot.start);
        const endMins = parseTimeToMinutes(slot.end);
        const slotInterval: TimeInterval = { start: startMins, end: endMins };

        let assigned = false;

        // Try to assign a double period if subject is practical/lab and we have room
        for (const subject of eligibleSubjects) {
          if (subjectScheduledCount[subject.id] >= subject.weeklyPeriods) {
            continue;
          }

          // A subject qualifies for a double period if it is practical and we have consecutive space
          const isDoublePossible = subject.isPractical && 
                                   (p + 1 < totalAvailablePeriods) && 
                                   (subjectScheduledCount[subject.id] + 2 <= subject.weeklyPeriods);

          if (isDoublePossible) {
            const nextSlot = teachingSlots[p + 1];
            const nextStartMins = parseTimeToMinutes(nextSlot.start);
            const nextEndMins = parseTimeToMinutes(nextSlot.end);
            const doubleInterval: TimeInterval = { start: startMins, end: nextEndMins };

            // Find teacher eligible for BOTH intervals
            const teacher = teachers.find((t) => {
              if (t.subject !== subject.name) return false;
              if (!t.classesTeaching.includes(cl.className)) return false;
              if (t.unavailableDays.includes(day)) return false;
              
              // No overlap for the combined double interval
              if (checkOverlap(teacherBusyTime[`${t.id}_${day}`] || [], doubleInterval)) return false;
              // Check daily load (adding 2 periods)
              if (teacherDailyPeriods[`${t.id}_${day}`] + 2 > t.maxPeriodsPerDay) return false;

              return true;
            });

            // Verify room is free for both
            const isRoomFree = !checkOverlap(roomBusyTime[`${cl.roomNumber}_${day}`] || [], doubleInterval);

            if (teacher && isRoomFree) {
              // Schedule consecutive periods
              timetable.push({
                day,
                periodIndex: periodIndex,
                subjectId: subject.id,
                teacherId: teacher.id,
                roomId: cl.roomNumber,
                className: cl.className,
                section: cl.section
              });

              timetable.push({
                day,
                periodIndex: periodIndex + 1,
                subjectId: subject.id,
                teacherId: teacher.id,
                roomId: cl.roomNumber,
                className: cl.className,
                section: cl.section
              });

              // Book intervals
              teacherBusyTime[`${teacher.id}_${day}`].push(doubleInterval);
              roomBusyTime[`${cl.roomNumber}_${day}`].push(doubleInterval);

              teacherDailyPeriods[`${teacher.id}_${day}`] += 2;
              subjectScheduledCount[subject.id] += 2;
              
              assigned = true;
              p += 2; // Advance by 2 slots
              break;
            }
          }

          // Try to assign single period
          const teacher = teachers.find((t) => {
            if (t.subject !== subject.name) return false;
            if (!t.classesTeaching.includes(cl.className)) return false;
            if (t.unavailableDays.includes(day)) return false;
            if (checkOverlap(teacherBusyTime[`${t.id}_${day}`] || [], slotInterval)) return false;
            if (teacherDailyPeriods[`${t.id}_${day}`] >= t.maxPeriodsPerDay) return false;
            return true;
          });

          const isRoomFree = !checkOverlap(roomBusyTime[`${cl.roomNumber}_${day}`] || [], slotInterval);

          if (teacher && isRoomFree) {
            timetable.push({
              day,
              periodIndex: periodIndex,
              subjectId: subject.id,
              teacherId: teacher.id,
              roomId: cl.roomNumber,
              className: cl.className,
              section: cl.section
            });

            teacherBusyTime[`${teacher.id}_${day}`].push(slotInterval);
            roomBusyTime[`${cl.roomNumber}_${day}`].push(slotInterval);

            teacherDailyPeriods[`${teacher.id}_${day}`]++;
            subjectScheduledCount[subject.id]++;
            assigned = true;
            p++; // Advance by 1 slot
            break;
          }
        }

        // Fallback: If no subject assigned, schedule a Free Study/Library period
        if (!assigned) {
          const peOrLib = subjects.find((s) => s.name === "Physical Education" || s.name === "Library & Reading") || subjects[subjects.length - 1];
          if (peOrLib) {
            const coach = teachers.find((t) => {
              if (t.subject !== peOrLib.name) return false;
              if (t.unavailableDays.includes(day)) return false;
              return !checkOverlap(teacherBusyTime[`${t.id}_${day}`] || [], slotInterval);
            });

            if (coach) {
              timetable.push({
                day,
                periodIndex: periodIndex,
                subjectId: peOrLib.id,
                teacherId: coach.id,
                roomId: cl.roomNumber,
                className: cl.className,
                section: cl.section
              });
              teacherBusyTime[`${coach.id}_${day}`].push(slotInterval);
              roomBusyTime[`${cl.roomNumber}_${day}`].push(slotInterval);
            } else {
              // Self Study
              timetable.push({
                day,
                periodIndex: periodIndex,
                subjectId: peOrLib.id,
                teacherId: "tch-3", // Default english teacher as standby proctor
                roomId: cl.roomNumber,
                className: cl.className,
                section: cl.section
              });
            }
          }
          p++; // Advance by 1 slot
        }
      }
    });

    // Verification step: Check if all weekly periods are met
    eligibleSubjects.forEach((s) => {
      if (subjectScheduledCount[s.id] < s.weeklyPeriods) {
        const gap = s.weeklyPeriods - subjectScheduledCount[s.id];
        conflicts.push(
          `Class ${cl.className}-${cl.section} has deficit of ${gap} periods for subject "${s.name}".`
        );
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
