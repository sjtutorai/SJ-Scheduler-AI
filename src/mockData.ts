/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  SchoolInfo,
  Student,
  Teacher,
  Subject,
  ClassConfig,
  Block,
  Room,
  TimetableCell,
  Exam,
  SeatingItem,
  InvigilatorDuty,
  Notification,
  RecentActivity
} from "./types";

export const initialSchoolInfo: SchoolInfo = {
  name: "Springdale International Academy",
  logo: "", // Empty so we can draw a beautiful text/icon logo
  address: "742 Evergreen Terrace, Sector-4, Greenfield, Karnataka, PIN-560001",
  udiseCode: "29200310405",
  principalName: "Dr. Arthur Pendelton",
  headmasterName: "Mrs. Clara Higgins",
  contactNumber: "+91 98765 43210",
  academicYear: "2026-2027",
  workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  schoolTiming: { start: "08:30", end: "14:30" },
  lunchTiming: { start: "12:00", end: "12:40" },
  holidays: [
    { date: "2026-08-15", name: "Independence Day" },
    { date: "2026-10-02", name: "Gandhi Jayanti" },
    { date: "2026-11-01", name: "Kannada Rajyotsava" },
    { date: "2026-12-25", name: "Christmas Day" }
  ]
};

export const initialSubjects: Subject[] = [
  { id: "sub-1", name: "Mathematics", code: "MTH-101", weeklyPeriods: 6, isTheory: true, isPractical: false, labRequired: false },
  { id: "sub-2", name: "General Science", code: "SCI-201", weeklyPeriods: 6, isTheory: true, isPractical: true, labRequired: true },
  { id: "sub-3", name: "English Literature", code: "ENG-301", weeklyPeriods: 5, isTheory: true, isPractical: false, labRequired: false },
  { id: "sub-4", name: "Social Science", code: "SOC-401", weeklyPeriods: 5, isTheory: true, isPractical: false, labRequired: false },
  { id: "sub-5", name: "Computer Application", code: "CMP-501", weeklyPeriods: 4, isTheory: true, isPractical: true, labRequired: true },
  { id: "sub-6", name: "Kannada Language", code: "KAN-601", weeklyPeriods: 5, isTheory: true, isPractical: false, labRequired: false },
  { id: "sub-7", name: "Physical Education", code: "PET-701", weeklyPeriods: 2, isTheory: false, isPractical: true, labRequired: false },
  { id: "sub-8", name: "Library & Reading", code: "LIB-801", weeklyPeriods: 1, isTheory: false, isPractical: false, labRequired: false }
];

export const initialTeachers: Teacher[] = [
  {
    id: "tch-1",
    name: "Mr. Ramesh Kumar",
    employeeId: "EMP-202601",
    subject: "Mathematics",
    department: "Science & Math",
    qualification: "M.Sc., B.Ed. Mathematics",
    experience: 12,
    phone: "9845100101",
    email: "ramesh.kumar@springdale.edu",
    classesTeaching: ["8", "9", "10"],
    sections: ["A", "B"],
    maxPeriodsPerDay: 5,
    maxDutiesPerDay: 1,
    preferredBlock: "A Block",
    unavailableDays: ["Saturday"],
    leaveDetails: ""
  },
  {
    id: "tch-2",
    name: "Dr. Sunita Sharma",
    employeeId: "EMP-202602",
    subject: "General Science",
    department: "Science & Math",
    qualification: "Ph.D. in Physics, M.Ed.",
    experience: 15,
    phone: "9845100102",
    email: "sunita.sharma@springdale.edu",
    classesTeaching: ["8", "9", "10"],
    sections: ["A", "B", "C"],
    maxPeriodsPerDay: 5,
    maxDutiesPerDay: 1,
    preferredBlock: "A Block",
    unavailableDays: [],
    leaveDetails: ""
  },
  {
    id: "tch-3",
    name: "Mrs. Jane D'Souza",
    employeeId: "EMP-202603",
    subject: "English Literature",
    department: "Languages",
    qualification: "M.A. English, B.Ed.",
    experience: 8,
    phone: "9845100103",
    email: "jane.dsouza@springdale.edu",
    classesTeaching: ["6", "7", "8"],
    sections: ["A", "B"],
    maxPeriodsPerDay: 5,
    maxDutiesPerDay: 1,
    preferredBlock: "B Block",
    unavailableDays: [],
    leaveDetails: ""
  },
  {
    id: "tch-4",
    name: "Mr. Anand Gowda",
    employeeId: "EMP-202604",
    subject: "Social Science",
    department: "Social Sciences",
    qualification: "M.A. History, B.Ed.",
    experience: 10,
    phone: "9845100104",
    email: "anand.gowda@springdale.edu",
    classesTeaching: ["9", "10"],
    sections: ["A", "B"],
    maxPeriodsPerDay: 5,
    maxDutiesPerDay: 1,
    preferredBlock: "C Block",
    unavailableDays: [],
    leaveDetails: "Planned leave on July 25th"
  },
  {
    id: "tch-5",
    name: "Mrs. Manjula Rao",
    employeeId: "EMP-202605",
    subject: "Kannada Language",
    department: "Languages",
    qualification: "M.A. Kannada, B.Ed.",
    experience: 14,
    phone: "9845100105",
    email: "manjula.rao@springdale.edu",
    classesTeaching: ["6", "7", "8", "9", "10"],
    sections: ["A", "B", "C"],
    maxPeriodsPerDay: 6,
    maxDutiesPerDay: 1,
    preferredBlock: "B Block",
    unavailableDays: [],
    leaveDetails: ""
  },
  {
    id: "tch-6",
    name: "Mr. Vikranth Patil",
    employeeId: "EMP-202606",
    subject: "Computer Application",
    department: "Computers",
    qualification: "M.C.A., B.Ed.",
    experience: 6,
    phone: "9845100106",
    email: "vikranth.patil@springdale.edu",
    classesTeaching: ["6", "7", "8", "9", "10"],
    sections: ["A", "B"],
    maxPeriodsPerDay: 5,
    maxDutiesPerDay: 1,
    preferredBlock: "D Block",
    unavailableDays: [],
    leaveDetails: ""
  },
  {
    id: "tch-7",
    name: "Coach Joseph Pinto",
    employeeId: "EMP-202607",
    subject: "Physical Education",
    department: "Sports",
    qualification: "B.P.Ed., M.P.Ed.",
    experience: 11,
    phone: "9845100107",
    email: "joseph.pinto@springdale.edu",
    classesTeaching: ["6", "7", "8", "9", "10"],
    sections: ["A", "B", "C"],
    maxPeriodsPerDay: 4,
    maxDutiesPerDay: 2,
    preferredBlock: "Playground",
    unavailableDays: [],
    leaveDetails: ""
  }
];

export const initialBlocks: Block[] = [
  { id: "blk-1", name: "A Block", numberOfFloors: 3, rooms: ["101", "102", "201", "202", "301"], supervisor: "Mr. Ramesh Kumar" },
  { id: "blk-2", name: "B Block", numberOfFloors: 2, rooms: ["103", "104", "203", "204"], supervisor: "Mrs. Jane D'Souza" },
  { id: "blk-3", name: "C Block", numberOfFloors: 2, rooms: ["105", "106", "205"], supervisor: "Mr. Anand Gowda" },
  { id: "blk-4", name: "D Block", numberOfFloors: 1, rooms: ["Computer Lab 1", "Science Lab 1"], supervisor: "Mr. Vikranth Patil" }
];

export const initialRooms: Room[] = [
  { id: "rm-1", roomNumber: "101", blockName: "A Block", floor: 1, capacity: 40, numberOfBenches: 20, studentsPerBench: 2, isSmartClassroom: true, isLab: false, isComputerLab: false },
  { id: "rm-2", roomNumber: "102", blockName: "A Block", floor: 1, capacity: 40, numberOfBenches: 20, studentsPerBench: 2, isSmartClassroom: true, isLab: false, isComputerLab: false },
  { id: "rm-3", roomNumber: "201", blockName: "A Block", floor: 2, capacity: 40, numberOfBenches: 20, studentsPerBench: 2, isSmartClassroom: false, isLab: false, isComputerLab: false },
  { id: "rm-4", roomNumber: "202", blockName: "A Block", floor: 2, capacity: 40, numberOfBenches: 20, studentsPerBench: 2, isSmartClassroom: false, isLab: false, isComputerLab: false },
  { id: "rm-5", roomNumber: "103", blockName: "B Block", floor: 1, capacity: 36, numberOfBenches: 18, studentsPerBench: 2, isSmartClassroom: true, isLab: false, isComputerLab: false },
  { id: "rm-6", roomNumber: "104", blockName: "B Block", floor: 1, capacity: 36, numberOfBenches: 18, studentsPerBench: 2, isSmartClassroom: false, isLab: false, isComputerLab: false },
  { id: "rm-7", roomNumber: "Science Lab 1", blockName: "D Block", floor: 1, capacity: 30, numberOfBenches: 15, studentsPerBench: 2, isSmartClassroom: false, isLab: true, isComputerLab: false },
  { id: "rm-8", roomNumber: "Computer Lab 1", blockName: "D Block", floor: 1, capacity: 30, numberOfBenches: 30, studentsPerBench: 1, isSmartClassroom: true, isLab: false, isComputerLab: true }
];

export const initialClasses: ClassConfig[] = [
  { id: "cls-1", className: "10", section: "A", classTeacherId: "tch-1", totalStudents: 32, roomNumber: "101", floor: 1, blockName: "A Block" },
  { id: "cls-2", className: "10", section: "B", classTeacherId: "tch-2", totalStudents: 30, roomNumber: "102", floor: 1, blockName: "A Block" },
  { id: "cls-3", className: "9", section: "A", classTeacherId: "tch-4", totalStudents: 34, roomNumber: "201", floor: 2, blockName: "A Block" },
  { id: "cls-4", className: "9", section: "B", classTeacherId: "tch-6", totalStudents: 28, roomNumber: "202", floor: 2, blockName: "A Block" },
  { id: "cls-5", className: "8", section: "A", classTeacherId: "tch-3", totalStudents: 35, roomNumber: "103", floor: 1, blockName: "B Block" },
  { id: "cls-6", className: "8", section: "B", classTeacherId: "tch-5", totalStudents: 32, roomNumber: "104", floor: 1, blockName: "B Block" }
];

// Generate seed students
export const generateSeedStudents = (): Student[] => {
  const students: Student[] = [];
  const classes = ["8", "9", "10"];
  const sections = ["A", "B"];
  const houses = ["Red Jaguar", "Blue Falcon", "Green Emerald", "Yellow Cheetah"];
  const bloodGroups = ["A+", "B+", "O+", "AB+", "A-", "B-"];

  let count = 1;
  classes.forEach((cls) => {
    sections.forEach((sec) => {
      const classLimit = cls === "10" ? 30 : cls === "9" ? 25 : 32;
      for (let i = 1; i <= classLimit; i++) {
        const admissionNum = `ADM-2026-${String(count).padStart(3, "0")}`;
        const gender = i % 2 === 0 ? "Female" : "Male";
        const firstName = gender === "Male" 
          ? ["Aditya", "Rahul", "Amit", "Karthik", "Rohan", "Sanjay", "Vijay", "Preetham", "Arjun", "Yash"][i % 10]
          : ["Anjali", "Priyanka", "Deepa", "Sneha", "Kavya", "Ritu", "Meghana", "Shreya", "Nisha", "Swathi"][i % 10];
        const lastName = ["Gowda", "Kumar", "Sharma", "Rao", "Patil", "Shetty", "Reddy", "Nair", "Prasad", "Singh"][i % 10];
        
        students.push({
          id: `std-${count}`,
          name: `${firstName} ${lastName}`,
          admissionNumber: admissionNum,
          rollNumber: i,
          class: cls,
          section: sec,
          gender: gender as any,
          dob: `2012-05-${String((i % 28) + 1).padStart(2, "0")}`,
          parentName: `${gender === "Male" ? "Mr." : "Mrs."} ${lastName}`,
          parentMobile: `98860${String(count).padStart(5, "0")}`,
          house: houses[count % 4],
          bloodGroup: bloodGroups[count % 6]
        });
        count++;
      }
    });
  });

  return students;
};

export const initialStudents: Student[] = generateSeedStudents();

// Generate typical pre-defined timetable cells to avoid "no data" state
export const generateSeedTimetable = (): TimetableCell[] => {
  const cells: TimetableCell[] = [];
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const classes = ["10", "9", "8"];
  const sections = ["A", "B"];

  // Mapping of subjects for balanced rotation
  const subjectList = [
    "sub-1", // Math
    "sub-2", // Science
    "sub-3", // English
    "sub-4", // Social
    "sub-5", // Computer
    "sub-6", // Kannada
    "sub-7", // PT
    "sub-8"  // Library
  ];

  // Mapping of primary teacher per subject
  const teacherMapping: Record<string, string> = {
    "sub-1": "tch-1", // Mr. Ramesh (Math)
    "sub-2": "tch-2", // Dr. Sunita (Science)
    "sub-3": "tch-3", // Mrs. Jane (English)
    "sub-4": "tch-4", // Mr. Anand (Social)
    "sub-6": "tch-5", // Mrs. Manjula (Kannada)
    "sub-5": "tch-6", // Mr. Vikranth (Computer)
    "sub-7": "tch-7", // Coach Joseph (PT)
    "sub-8": "tch-3"  // Mrs. Jane (Library)
  };

  classes.forEach((cls) => {
    sections.forEach((sec) => {
      // Find default room
      const classConf = initialClasses.find((c) => c.className === cls && c.section === sec);
      const roomId = classConf ? classConf.roomNumber : "101";

      days.forEach((day) => {
        // We have 6 periods standard (Saturday has 4)
        const periodCount = day === "Saturday" ? 4 : 6;
        for (let p = 0; p < periodCount; p++) {
          // Lunch is between period index 3 and 4, let's keep period index simple: 0 to 5
          // Choose subject deterministically to avoid clashes
          const subIdx = (p + day.length + cls.charCodeAt(0) + sec.charCodeAt(0)) % subjectList.length;
          const subjectId = subjectList[subIdx];
          const teacherId = teacherMapping[subjectId] || "tch-1";

          cells.push({
            day,
            periodIndex: p + 1, // 1-indexed
            subjectId,
            teacherId,
            roomId,
            className: cls,
            section: sec
          });
        }
      });
    });
  });

  return cells;
};

export const initialTimetable: TimetableCell[] = generateSeedTimetable();

export const initialExams: Exam[] = [
  {
    id: "ex-1",
    name: "Mid-Term Examination",
    startDate: "2026-07-27",
    endDate: "2026-08-01",
    subjectId: "sub-1",
    date: "2026-07-27",
    startTime: "09:30",
    endTime: "12:30",
    duration: 180,
    classes: ["9", "10"],
    sections: ["A", "B"]
  },
  {
    id: "ex-2",
    name: "Mid-Term Examination",
    startDate: "2026-07-27",
    endDate: "2026-08-01",
    subjectId: "sub-2",
    date: "2026-07-28",
    startTime: "09:30",
    endTime: "12:30",
    duration: 180,
    classes: ["9", "10"],
    sections: ["A", "B"]
  },
  {
    id: "ex-3",
    name: "Mid-Term Examination",
    startDate: "2026-07-27",
    endDate: "2026-08-01",
    subjectId: "sub-3",
    date: "2026-07-29",
    startTime: "09:30",
    endTime: "12:30",
    duration: 180,
    classes: ["9", "10"],
    sections: ["A", "B"]
  },
  {
    id: "ex-4",
    name: "Mid-Term Examination",
    startDate: "2026-07-27",
    endDate: "2026-08-01",
    subjectId: "sub-4",
    date: "2026-07-30",
    startTime: "09:30",
    endTime: "12:30",
    duration: 180,
    classes: ["9", "10"],
    sections: ["A", "B"]
  }
];

export const initialSeating: SeatingItem[] = [
  // Prep some seed seating so seating view has beautiful bento arrangement immediately
  { id: "seat-1", roomNumber: "101", benchNumber: 1, seatPosition: "Left", studentId: "std-1", studentName: "Aditya Gowda", rollNumber: 1, class: "10", section: "A", subjectName: "Mathematics", examDate: "2026-07-27" },
  { id: "seat-2", roomNumber: "101", benchNumber: 1, seatPosition: "Right", studentId: "std-50", studentName: "Deepa Sharma", rollNumber: 1, class: "9", section: "A", subjectName: "Mathematics", examDate: "2026-07-27" },
  { id: "seat-3", roomNumber: "101", benchNumber: 2, seatPosition: "Left", studentId: "std-2", studentName: "Rahul Gowda", rollNumber: 2, class: "10", section: "A", subjectName: "Mathematics", examDate: "2026-07-27" },
  { id: "seat-4", roomNumber: "101", benchNumber: 2, seatPosition: "Right", studentId: "std-51", studentName: "Kavya Patil", rollNumber: 2, class: "9", section: "A", subjectName: "Mathematics", examDate: "2026-07-27" },
  { id: "seat-5", roomNumber: "101", benchNumber: 3, seatPosition: "Left", studentId: "std-3", studentName: "Amit Kumar", rollNumber: 3, class: "10", section: "A", subjectName: "Mathematics", examDate: "2026-07-27" },
  { id: "seat-6", roomNumber: "101", benchNumber: 3, seatPosition: "Right", studentId: "std-52", studentName: "Ritu Rao", rollNumber: 3, class: "9", section: "A", subjectName: "Mathematics", examDate: "2026-07-27" },
  { id: "seat-7", roomNumber: "102", benchNumber: 1, seatPosition: "Left", studentId: "std-4", studentName: "Karthik Kumar", rollNumber: 4, class: "10", section: "A", subjectName: "Mathematics", examDate: "2026-07-27" },
  { id: "seat-8", roomNumber: "102", benchNumber: 1, seatPosition: "Right", studentId: "std-53", studentName: "Nisha Reddy", rollNumber: 4, class: "9", section: "A", subjectName: "Mathematics", examDate: "2026-07-27" }
];

export const initialInvigilators: InvigilatorDuty[] = [
  { id: "duty-1", teacherId: "tch-3", teacherName: "Mrs. Jane D'Souza", roomNumber: "101", blockName: "A Block", floor: 1, subjectName: "Mathematics", examName: "Mid-Term Examination", date: "2026-07-27", timeSlot: "09:30 AM - 12:30 PM" },
  { id: "duty-2", teacherId: "tch-4", teacherName: "Mr. Anand Gowda", roomNumber: "102", blockName: "A Block", floor: 1, subjectName: "Mathematics", examName: "Mid-Term Examination", date: "2026-07-27", timeSlot: "09:30 AM - 12:30 PM" },
  { id: "duty-3", teacherId: "tch-5", teacherName: "Mrs. Manjula Rao", roomNumber: "201", blockName: "A Block", floor: 2, subjectName: "Mathematics", examName: "Mid-Term Examination", date: "2026-07-27", timeSlot: "09:30 AM - 12:30 PM" },
  { id: "duty-4", teacherId: "tch-6", teacherName: "Mr. Vikranth Patil", roomNumber: "202", blockName: "A Block", floor: 2, subjectName: "Mathematics", examName: "Mid-Term Examination", date: "2026-07-27", timeSlot: "09:30 AM - 12:30 PM" }
];

export const initialNotifications: Notification[] = [
  { id: "notif-1", title: "Mid-Term Exams Loaded", message: "Mid-Term examination details have been registered. Seating Optimizer is ready.", type: "success", timestamp: "10 mins ago" },
  { id: "notif-2", title: "Absentee Warning", message: "Mr. Anand Gowda is marked on planned leave on July 25th. Standby assigner loaded.", type: "warning", timestamp: "1 hour ago" },
  { id: "notif-3", title: "No Conflict Confirmed", message: "AI Conflict Engine ran 12 core tests. 0 teacher clashes detected.", type: "info", timestamp: "3 hours ago" }
];

export const initialRecentActivities: RecentActivity[] = [
  { id: "act-1", description: "Generated 10th Standard Mathematics Exam Timetable", timestamp: "15 mins ago", user: "Admin Clerk" },
  { id: "act-2", description: "Bulk updated 162 Student details from spreadsheet", timestamp: "2 hours ago", user: "Principal Office" },
  { id: "act-3", description: "Created new Room config: Science Lab 1 (Block D)", timestamp: "1 day ago", user: "System Scheduler" }
];
