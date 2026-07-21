/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SchoolInfo {
  name: string;
  logo: string; // Base64 or placeholder URL
  address: string;
  udiseCode: string;
  principalName: string;
  headmasterName: string;
  contactNumber: string;
  academicYear: string;
  workingDays: string[]; // e.g., ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  schoolTiming: { start: string; end: string };
  lunchTiming: { start: string; end: string };
  holidays: { date: string; name: string }[];
}

export interface Student {
  id: string;
  name: string;
  admissionNumber: string;
  rollNumber: number;
  class: string; // e.g., "6", "7", "8", "9", "10"
  section: string; // e.g., "A", "B", "C"
  gender: "Male" | "Female" | "Other";
  dob: string;
  parentName: string;
  parentMobile: string;
  house: string;
  bloodGroup?: string;
}

export interface Teacher {
  id: string;
  name: string;
  employeeId: string;
  subject: string; // Primary subject
  department: string;
  qualification: string;
  experience: number; // in years
  phone: string;
  email: string;
  classesTeaching: string[]; // e.g., ["6", "7", "8"]
  sections: string[]; // e.g., ["A", "B"]
  maxPeriodsPerDay: number;
  maxDutiesPerDay: number;
  preferredBlock: string;
  unavailableDays: string[]; // e.g., ["Saturday"]
  leaveDetails?: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  weeklyPeriods: number;
  isTheory: boolean;
  isPractical: boolean;
  labRequired: boolean;
}

export interface ClassConfig {
  id: string;
  className: string; // e.g., "6"
  section: string; // e.g., "A"
  classTeacherId: string; // Teacher ID
  totalStudents: number;
  roomNumber: string;
  floor: number;
  blockName: string;
}

export interface Block {
  id: string;
  name: string; // e.g., "A Block"
  numberOfFloors: number;
  rooms: string[]; // Room Numbers
  supervisor: string; // Supervisor name/ID
}

export interface Room {
  id: string;
  roomNumber: string;
  blockName: string;
  floor: number;
  capacity: number;
  numberOfBenches: number;
  studentsPerBench: number;
  isSmartClassroom: boolean;
  isLab: boolean;
  isComputerLab: boolean;
}

export interface TimetableCell {
  day: string; // e.g., "Monday"
  periodIndex: number; // 0-indexed (e.g. 1 to 8)
  subjectId: string;
  teacherId: string;
  roomId: string;
  className: string;
  section: string;
}

export interface Exam {
  id: string;
  name: string; // e.g., "Mid-Term", "Annual"
  startDate: string;
  endDate: string;
  subjectId: string;
  date: string; // Exam specific date
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  classes: string[]; // e.g., ["9", "10"]
  sections: string[]; // e.g., ["A", "B"]
}

export interface SeatingItem {
  id: string;
  roomNumber: string;
  benchNumber: number;
  seatPosition: "Left" | "Right" | "Middle" | "Center"; // bench layout
  studentId: string;
  studentName: string;
  rollNumber: number;
  class: string;
  section: string;
  subjectName: string;
  examDate: string;
}

export interface InvigilatorDuty {
  id: string;
  teacherId: string;
  teacherName: string;
  roomNumber: string;
  blockName: string;
  floor: number;
  subjectName: string;
  examName: string;
  date: string;
  timeSlot: string; // e.g., "09:30 AM - 12:45 PM"
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "danger";
  timestamp: string;
}

export interface RecentActivity {
  id: string;
  description: string;
  timestamp: string;
  user: string;
}
