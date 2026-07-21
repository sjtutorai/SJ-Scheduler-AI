/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Award,
  BookOpen,
  GraduationCap,
  MapPin,
  Clock,
  Calendar,
  BarChart3,
  Settings,
  Shield,
  Bell,
  X,
  Menu,
  Globe,
  LogOut
} from "lucide-react";

// Types
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

// Mock Data
import {
  initialSchoolInfo,
  initialSubjects,
  initialTeachers,
  initialBlocks,
  initialRooms,
  initialClasses,
  initialStudents,
  initialTimetable,
  initialExams,
  initialSeating,
  initialInvigilators,
  initialNotifications,
  initialRecentActivities
} from "./mockData";

// Custom Sub-components
import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";
import StudentManager from "./components/StudentManager";
import TeacherManager from "./components/TeacherManager";
import SubjectManager from "./components/SubjectManager";
import ClassManager from "./components/ClassManager";
import BlockRoomManager from "./components/BlockRoomManager";
import TimetableEditor from "./components/TimetableEditor";
import ExamScheduler from "./components/ExamScheduler";
import ReportsPanel from "./components/ReportsPanel";
import SchoolInfoView from "./components/SchoolInfoView";
import SettingsPanel from "./components/SettingsPanel";
import Login from "./components/Login";
import RegistrationWizard from "./components/RegistrationWizard";
import PremiumBackground from "./components/PremiumBackground";
import { useEffect } from "react";
import {
  auth,
  db,
  doc,
  getDoc,
  setDoc,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut,
  onAuthStateChanged
} from "./firebase";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLandingActive, setIsLandingActive] = useState(true);

  // Central Application States (Shared context simulation)
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo>(initialSchoolInfo);
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [classes, setClasses] = useState<ClassConfig[]>(initialClasses);
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [timetable, setTimetable] = useState<TimetableCell[]>(initialTimetable);
  const [exams, setExams] = useState<Exam[]>(initialExams);
  const [seating, setSeating] = useState<SeatingItem[]>(initialSeating);
  const [duties, setDuties] = useState<InvigilatorDuty[]>(initialInvigilators);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [activities, setActivities] = useState<RecentActivity[]>(initialRecentActivities);

  // Session / Authentication state
  const [currentSchoolSession, setCurrentSchoolSession] = useState<any | null>(null);
  const [authScreen, setAuthScreen] = useState<"login" | "register" | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [firebaseUser, setFirebaseUser] = useState<any | null>(null);

  // Handle incoming passwordless email sign-in link
  useEffect(() => {
    const handleEmailLinkSignIn = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        setIsAuthLoading(true);
        let email = localStorage.getItem("emailForSignIn");
        if (!email) {
          email = window.prompt("Please confirm your email address to complete signing in:");
        }
        if (email) {
          try {
            await signInWithEmailLink(auth, email, window.location.href);
            localStorage.removeItem("emailForSignIn");
            // Remove the URL parameters so they don't trigger again on reload
            window.history.replaceState({}, document.title, window.location.pathname);
          } catch (err: any) {
            console.error("Error signing in with email link:", err);
            alert(err.message || "The sign-in link was invalid or expired.");
          }
        }
        setIsAuthLoading(false);
      }
    };
    handleEmailLinkSignIn();
  }, []);

  // Sync Firebase authentication with user profiles and active school sessions
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        setIsAuthLoading(true);
        try {
          // Check/create user document in Firestore users/{uid}
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          let schoolId = "";

          if (!userDocSnap.exists()) {
            await setDoc(userDocRef, {
              uid: user.uid,
              fullName: user.displayName || "",
              email: user.email || "",
              photoURL: user.photoURL || "",
              provider: user.providerData[0]?.providerId || "email-link",
              schoolId: "",
              createdAt: new Date().toISOString()
            });
          } else {
            const userData = userDocSnap.data();
            schoolId = userData.schoolId || "";
          }

          if (schoolId) {
            // Load school details from Firestore schools/{schoolId}
            const schoolDocRef = doc(db, "schools", schoolId);
            const schoolDocSnap = await getDoc(schoolDocRef);
            if (schoolDocSnap.exists()) {
              const schoolData = schoolDocSnap.data();
              // Cache school session locally
              localStorage.setItem("active_school_session", JSON.stringify(schoolData));
              setCurrentSchoolSession(schoolData);
              setIsLandingActive(false);
              setAuthScreen(null);
            } else {
              // School ID exists but school document not found, route to wizard
              setIsLandingActive(false);
              setAuthScreen("register");
            }
          } else {
            // No school profile registered, route to wizard
            setIsLandingActive(false);
            setAuthScreen("register");
          }
        } catch (error) {
          console.error("Error syncing authenticated user profile:", error);
        } finally {
          setIsAuthLoading(false);
        }
      } else {
        // Logged out
        localStorage.removeItem("active_school_session");
        setCurrentSchoolSession(null);
        setIsLandingActive(true);
        setAuthScreen(null);
        setIsAuthLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Load school session states on mount / change
  useEffect(() => {
    if (currentSchoolSession) {
      initializeSchoolSession(currentSchoolSession);
    }
  }, [currentSchoolSession]);

  // Save dynamic school state changes to local storage when they occur
  useEffect(() => {
    if (currentSchoolSession && currentSchoolSession.regNumber) {
      const dbKey = `school_data_${currentSchoolSession.regNumber}`;
      const payload = {
        schoolInfo,
        students,
        teachers,
        subjects,
        classes,
        blocks,
        rooms,
        timetable,
        exams,
        seating,
        duties,
        activities,
        notifications
      };
      localStorage.setItem(dbKey, JSON.stringify(payload));
    }
  }, [
    currentSchoolSession,
    schoolInfo,
    students,
    teachers,
    subjects,
    classes,
    blocks,
    rooms,
    timetable,
    exams,
    seating,
    duties,
    activities,
    notifications
  ]);

  const initializeSchoolSession = (schoolData: any) => {
    const dbKey = `school_data_${schoolData.regNumber}`;
    const cached = localStorage.getItem(dbKey);

    if (cached) {
      const parsed = JSON.parse(cached);
      setSchoolInfo(parsed.schoolInfo);
      setStudents(parsed.students);
      setTeachers(parsed.teachers);
      setSubjects(parsed.subjects);
      setClasses(parsed.classes);
      setBlocks(parsed.blocks);
      setRooms(parsed.rooms);
      setTimetable(parsed.timetable);
      setExams(parsed.exams);
      setSeating(parsed.seating);
      setDuties(parsed.duties);
      setNotifications(parsed.notifications);
      setActivities(parsed.activities);
    } else {
      // Automatic Setup - build dynamic default matrices from registration inputs!
      
      // 1. School Info
      const formattedAddress = `${schoolData.schoolAddress}, ${schoolData.city}, ${schoolData.taluk}, ${schoolData.district}, ${schoolData.state} - ${schoolData.pinCode}`;
      const newSchoolInfo: SchoolInfo = {
        name: schoolData.schoolName,
        logo: "",
        address: formattedAddress,
        udiseCode: schoolData.udiseNumber,
        principalName: schoolData.principalName,
        headmasterName: schoolData.principalName,
        contactNumber: schoolData.schoolPhone,
        academicYear: schoolData.academicYear,
        workingDays: schoolData.workingDays,
        schoolTiming: { start: schoolData.timings.schoolStartTime, end: schoolData.timings.schoolEndTime },
        lunchTiming: { start: schoolData.timings.lunchStartTime, end: schoolData.timings.lunchStartTime },
        holidays: [],
        assemblyStart: schoolData.timings.assemblyTime,
        assemblyDuration: Number(schoolData.timings.assemblyDuration) || 15,
        periodsCount: Number(schoolData.timings.periodsCount) || 8,
        periodDuration: Number(schoolData.timings.periodDuration) || 40,
        recessStart: schoolData.timings.recessTime,
        recessDuration: Number(schoolData.timings.recessDuration) || 15,
        lastBellTime: schoolData.timings.schoolEndTime
      };

      // 2. Blocks & Rooms
      const totalBlocks = Number(schoolData.infrastructure.totalBlocks) || 2;
      const totalFloors = Number(schoolData.infrastructure.totalFloors) || 3;
      const totalRooms = Number(schoolData.infrastructure.totalRooms) || 15;
      
      const newBlocks: Block[] = [];
      const blockNames = ["Main Wing", "Science Block", "Secondary Hall", "Administrative Block"];
      for (let b = 0; b < totalBlocks; b++) {
        newBlocks.push({
          id: `block-${b + 1}`,
          name: blockNames[b] || `Block ${String.fromCharCode(65 + b)}`,
          numberOfFloors: totalFloors,
          rooms: [],
          supervisor: schoolData.principalName
        });
      }

      const newRooms: Room[] = [];
      for (let r = 0; r < totalRooms; r++) {
        const blockIdx = r % totalBlocks;
        const targetBlock = newBlocks[blockIdx];
        const floor = (Math.floor(r / totalBlocks) % totalFloors) + 1;
        const roomNumber = `${floor}${String(r + 1).padStart(2, "0")}`;
        
        targetBlock.rooms.push(roomNumber);
        newRooms.push({
          id: `room-${r + 1}`,
          roomNumber,
          blockName: targetBlock.name,
          floor,
          capacity: (Number(schoolData.infrastructure.benchesPerRoom) || 20) * (Number(schoolData.infrastructure.studentsPerBench) || 2),
          numberOfBenches: Number(schoolData.infrastructure.benchesPerRoom) || 20,
          studentsPerBench: Number(schoolData.infrastructure.studentsPerBench) || 2,
          isSmartClassroom: r % 3 === 0,
          isLab: r % 5 === 0,
          isComputerLab: r === 0 && (Number(schoolData.infrastructure.computerLabs) > 0)
        });
      }

      // 3. Classes & Sections
      const newClasses: ClassConfig[] = [];
      schoolData.availableClasses.forEach((cls: string) => {
        schoolData.availableSections.forEach((sec: string, sIdx: number) => {
          const roomObj = newRooms[newClasses.length % newRooms.length];
          newClasses.push({
            id: `class-${cls}-${sec}`,
            className: cls,
            section: sec,
            classTeacherId: `teacher-${sIdx + 1}`,
            totalStudents: Math.floor(Number(schoolData.totalStudents) / (schoolData.availableClasses.length * schoolData.availableSections.length)) || 40,
            roomNumber: roomObj?.roomNumber || "101",
            floor: roomObj?.floor || 1,
            blockName: roomObj?.blockName || "Main Wing"
          });
        });
      });

      // 4. Subjects
      const newSubjects: Subject[] = [
        { id: "sub-1", name: "Mathematics", code: "MTH-101", weeklyPeriods: 6, isTheory: true, isPractical: false, labRequired: false },
        { id: "sub-2", name: "English", code: "ENG-102", weeklyPeriods: 5, isTheory: true, isPractical: false, labRequired: false },
        { id: "sub-3", name: "Science", code: "SCI-103", weeklyPeriods: 6, isTheory: true, isPractical: true, labRequired: true },
        { id: "sub-4", name: "Social Science", code: "SST-104", weeklyPeriods: 5, isTheory: true, isPractical: false, labRequired: false },
        { id: "sub-5", name: "Computers", code: "COMP-105", weeklyPeriods: 4, isTheory: false, isPractical: true, labRequired: true }
      ];

      // 5. Teachers
      const newTeachers: Teacher[] = [];
      const firstNames = ["James", "Emma", "Vance", "Alisha", "George", "Sarah", "Rajesh", "Priya", "Robert", "Nancy"];
      const lastNames = ["Smith", "Jones", "Watson", "Verma", "Hegde", "Patil", "Taylor", "Miller", "Davis", "Wilson"];
      const depts = ["Sciences", "Languages", "Sciences", "Humanities", "Technology"];
      const teacherCount = Math.max(8, Number(schoolData.totalTeachers) || 12);
      
      for (let t = 0; t < teacherCount; t++) {
        const sub = newSubjects[t % newSubjects.length];
        newTeachers.push({
          id: `teacher-${t + 1}`,
          name: `Mr./Mrs. ${firstNames[t % firstNames.length]} ${lastNames[t % lastNames.length]}`,
          employeeId: `T-${String(501 + t)}`,
          subject: sub.name,
          department: depts[t % depts.length],
          qualification: t % 2 === 0 ? "M.Sc. B.Ed." : "M.A. B.Ed.",
          experience: (t % 10) + 3,
          phone: `9876500${String(100 + t)}`,
          email: `${firstNames[t % firstNames.length].toLowerCase()}@school.edu`,
          classesTeaching: schoolData.availableClasses.slice(0, 3),
          sections: schoolData.availableSections.slice(0, 2),
          maxPeriodsPerDay: 5,
          maxDutiesPerDay: 1,
          preferredBlock: newBlocks[0]?.name || "Main Wing",
          unavailableDays: []
        });
      }

      // 6. Students
      const newStudents: Student[] = [];
      const sFirst = ["Karan", "Sneha", "Aman", "Pooja", "Vikram", "Anjali", "Rohan", "Deepa", "Arjun", "Neha"];
      const sLast = ["Sharma", "Patil", "Verma", "Hegde", "Singh", "Nair", "Das", "Joshi", "Gowda", "Rao"];
      const houses = ["Emerald", "Ruby", "Sapphire", "Topaz"];
      const bloodGroups = ["A+", "B+", "O+", "AB+"];
      
      let studId = 1;
      schoolData.availableClasses.forEach((cls: string) => {
        schoolData.availableSections.forEach((sec: string) => {
          for (let s = 1; s <= 5; s++) {
            newStudents.push({
              id: `stud-${studId}`,
              name: `${sFirst[(studId + s) % sFirst.length]} ${sLast[(studId * 3) % sLast.length]}`,
              admissionNumber: `ADM-${schoolData.academicYear.split("-")[0]}-${String(studId).padStart(3, "0")}`,
              rollNumber: s,
              class: cls,
              section: sec,
              gender: s % 2 === 0 ? "Female" : "Male",
              dob: `201${15 - parseInt(cls) || 5}-05-12`,
              parentName: `Mr. ${sLast[(studId * 3) % sLast.length]}`,
              parentMobile: `981234${String(1000 + studId)}`,
              house: houses[(studId) % houses.length],
              bloodGroup: bloodGroups[(studId) % bloodGroups.length]
            });
            studId++;
          }
        });
      });

      // 7. Initial Conflict-free Timetable
      const newTimetable: TimetableCell[] = [];
      schoolData.availableClasses.forEach((cls: string) => {
        schoolData.availableSections.forEach((sec: string) => {
          schoolData.workingDays.forEach((day: string) => {
            for (let pIdx = 1; pIdx <= 4; pIdx++) {
              const sub = newSubjects[(pIdx + cls.charCodeAt(0)) % newSubjects.length];
              const tIdx = (pIdx + cls.charCodeAt(0) + sec.charCodeAt(0)) % newTeachers.length;
              const roomNum = newClasses.find(c => c.className === cls && c.section === sec)?.roomNumber || "101";
              newTimetable.push({
                day,
                periodIndex: pIdx,
                subjectId: sub.id,
                teacherId: newTeachers[tIdx]?.id || "teacher-1",
                roomId: roomNum,
                className: cls,
                section: sec
              });
            }
          });
        });
      });

      // 8. Exams, Seating, Duties, Activities, Notifications
      const newExams: Exam[] = [
        {
          id: "exam-1",
          name: "Terminal Evaluation 1",
          startDate: "2026-09-14",
          endDate: "2026-09-22",
          subjectId: "sub-1",
          date: "2026-09-14",
          startTime: "09:30 AM",
          endTime: "12:45 PM",
          duration: 195,
          classes: schoolData.availableClasses.slice(0, 3),
          sections: schoolData.availableSections
        }
      ];

      const newSeating: SeatingItem[] = [];
      newStudents.slice(0, 6).forEach((stud, idx) => {
        newSeating.push({
          id: `seat-${idx + 1}`,
          roomNumber: newRooms[idx % newRooms.length]?.roomNumber || "101",
          benchNumber: Math.floor(idx / 2) + 1,
          seatPosition: idx % 2 === 0 ? "Left" : "Right",
          studentId: stud.id,
          studentName: stud.name,
          rollNumber: stud.rollNumber,
          class: stud.class,
          section: stud.section,
          subjectName: "Mathematics",
          examDate: "2026-09-14"
        });
      });

      const newDuties: InvigilatorDuty[] = [];
      newTeachers.slice(0, 3).forEach((teacher, idx) => {
        newDuties.push({
          id: `duty-${idx + 1}`,
          teacherId: teacher.id,
          teacherName: teacher.name,
          roomNumber: newRooms[idx % newRooms.length]?.roomNumber || "101",
          blockName: newRooms[idx % newRooms.length]?.blockName || "Main Wing",
          floor: newRooms[idx % newRooms.length]?.floor || 1,
          subjectName: "Mathematics",
          examName: "Terminal Evaluation 1",
          date: "2026-09-14",
          timeSlot: "09:30 AM - 12:45 PM"
        });
      });

      const newActivities: RecentActivity[] = [
        { id: "act-1", description: "Institution automated registration completed successfully", timestamp: "Just now", user: "System Console" },
        { id: "act-2", description: "Standard curriculum subjects and academic databases provisioned", timestamp: "Just now", user: "Administrator" },
        { id: "act-3", description: "Classes & sections matrix structure built", timestamp: "Just now", user: "AI Planner" }
      ];

      const newNotifications: Notification[] = [
        { id: "notif-1", title: "Registration Setup Finished", message: `Welcome to ${schoolData.schoolName}! Your workspace is now active.`, type: "success", timestamp: "Just now" },
        { id: "notif-2", title: "Conflict-Free Timetable Seeded", message: "Initial timetable matrix generated for classes and faculty.", type: "info", timestamp: "Just now" }
      ];

      setSchoolInfo(newSchoolInfo);
      setStudents(newStudents);
      setTeachers(newTeachers);
      setSubjects(newSubjects);
      setClasses(newClasses);
      setBlocks(newBlocks);
      setRooms(newRooms);
      setTimetable(newTimetable);
      setExams(newExams);
      setSeating(newSeating);
      setDuties(newDuties);
      setNotifications(newNotifications);
      setActivities(newActivities);

      // Save initial dataset to cache
      const initialPayload = {
        schoolInfo: newSchoolInfo,
        students: newStudents,
        teachers: newTeachers,
        subjects: newSubjects,
        classes: newClasses,
        blocks: newBlocks,
        rooms: newRooms,
        timetable: newTimetable,
        exams: newExams,
        seating: newSeating,
        duties: newDuties,
        notifications: newNotifications,
        activities: newActivities
      };
      localStorage.setItem(dbKey, JSON.stringify(initialPayload));
    }
  };

  // Elegant floating notification system
  const [toast, setToast] = useState<{ title: string; desc: string; type: "success" | "warning" | "info" } | null>(null);

  const triggerToast = (title: string, desc: string, type: "success" | "warning" | "info") => {
    setToast({ title, desc, type });
    
    // Add to notifications drawer too!
    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      title,
      message: desc,
      type: type === "warning" ? "warning" : type === "success" ? "success" : "info",
      timestamp: "Just now"
    };
    setNotifications([newNotif, ...notifications]);

    // Add to activity logs
    const newAct: RecentActivity = {
      id: `act-${Date.now()}`,
      description: `${title}: ${desc}`,
      timestamp: "Just now",
      user: "Principal Office"
    };
    setActivities([newAct, ...activities]);

    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const navItems = [
    { id: "dashboard", label: "Overview Hub", icon: LayoutDashboard },
    { id: "students", label: "Student Registry", icon: Users },
    { id: "teachers", label: "Faculty Directory", icon: Award },
    { id: "subjects", label: "Subjects Allocation", icon: BookOpen },
    { id: "classes", label: "Classes & Sections", icon: GraduationCap },
    { id: "infrastructure", label: "Wings & Rooms", icon: MapPin },
    { id: "timetable", label: "Timetable Planner", icon: Clock },
    { id: "exams", label: "Examinations Desk", icon: Calendar },
    { id: "reports", label: "Operational Reports", icon: BarChart3 },
    { id: "profile", label: "School Profile", icon: Shield },
    { id: "settings", label: "Solver Parameters", icon: Settings }
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <Dashboard
            students={students}
            teachers={teachers}
            classes={classes}
            subjects={subjects}
            rooms={rooms}
            blocks={blocks}
            exams={exams}
            notifications={notifications}
            activities={activities}
            setTab={setActiveTab}
          />
        );
      case "students":
        return (
          <StudentManager
            students={students}
            setStudents={setStudents}
            triggerNotification={triggerToast}
          />
        );
      case "teachers":
        return (
          <TeacherManager
            teachers={teachers}
            setTeachers={setTeachers}
            triggerNotification={triggerToast}
          />
        );
      case "subjects":
        return (
          <SubjectManager
            subjects={subjects}
            setSubjects={setSubjects}
            triggerNotification={triggerToast}
          />
        );
      case "classes":
        return (
          <ClassManager
            classes={classes}
            setClasses={setClasses}
            teachers={teachers}
            triggerNotification={triggerToast}
          />
        );
      case "infrastructure":
        return (
          <BlockRoomManager
            blocks={blocks}
            setBlocks={setBlocks}
            rooms={rooms}
            setRooms={setRooms}
            triggerNotification={triggerToast}
          />
        );
      case "timetable":
        return (
          <TimetableEditor
            timetable={timetable}
            setTimetable={setTimetable}
            classes={classes}
            teachers={teachers}
            subjects={subjects}
            rooms={rooms}
            schoolInfo={schoolInfo}
            triggerNotification={triggerToast}
          />
        );
      case "exams":
        return (
          <ExamScheduler
            exams={exams}
            setExams={setExams}
            students={students}
            rooms={rooms}
            teachers={teachers}
            seating={seating}
            setSeating={setSeating}
            duties={duties}
            setDuties={setDuties}
            triggerNotification={triggerToast}
          />
        );
      case "reports":
        return (
          <ReportsPanel
            teachers={teachers}
            students={students}
            timetable={timetable}
            exams={exams}
            duties={duties}
            triggerNotification={triggerToast}
          />
        );
      case "profile":
        return <SchoolInfoView schoolInfo={schoolInfo} setSchoolInfo={setSchoolInfo} />;
      case "settings":
        return (
          <SettingsPanel
            schoolInfo={schoolInfo}
            setSchoolInfo={setSchoolInfo}
            triggerNotification={triggerToast}
          />
        );
      default:
        return <div>Tab not found</div>;
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-200">
        <PremiumBackground />
        <div className="relative z-10 text-center space-y-4 max-w-sm">
          <img
            src="https://i.ibb.co/fGyH2Tck/SJ-Schedular-AI-Logo.png"
            alt="SJ Scheduler AI Logo"
            className="w-16 h-16 object-contain mx-auto rounded-xl shadow-lg shadow-indigo-600/30 animate-pulse"
            referrerPolicy="no-referrer"
          />
          <div className="space-y-1.5">
            <h2 className="text-lg font-black text-white uppercase tracking-wider">Verifying Session...</h2>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest">Please wait while we secure your connection</p>
          </div>
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mt-4"></div>
        </div>
      </div>
    );
  }

  if (isLandingActive) {
    return (
      <div className="relative min-h-screen w-full">
        <PremiumBackground />
        <LandingPage
          onEnterApp={(mode) => {
            setIsLandingActive(false);
            if (mode === "login" || mode === "register") {
              setAuthScreen(mode);
            } else {
              const registered = JSON.parse(localStorage.getItem("registered_schools") || "[]");
              if (registered.length === 0) {
                setAuthScreen("register");
              } else {
                setAuthScreen("login");
              }
            }
          }}
        />
      </div>
    );
  }

  if (!currentSchoolSession) {
    if (authScreen === "register") {
      return (
        <div className="relative min-h-screen w-full">
          <PremiumBackground />
          <RegistrationWizard
            onRegisterComplete={(regResult) => {
              setAuthScreen("login");
            }}
            onCancel={() => {
              setIsLandingActive(true);
            }}
            onSwitchToLogin={() => {
              setAuthScreen("login");
            }}
          />
        </div>
      );
    } else {
      return (
        <div className="relative min-h-screen w-full">
          <PremiumBackground />
          <Login
            onLoginSuccess={(schoolData) => {
              localStorage.setItem("active_school_session", JSON.stringify(schoolData));
              setCurrentSchoolSession(schoolData);
            }}
            onOpenRegister={() => {
              setAuthScreen("register");
            }}
            onCancel={() => {
              setIsLandingActive(true);
            }}
          />
        </div>
      );
    }
  }

  return (
    <div className="h-screen w-screen bg-slate-50 flex flex-col md:flex-row relative text-slate-900 font-sans antialiased overflow-hidden selection:bg-slate-900 selection:text-white">
      {/* Mobile Header */}
      <header className="md:hidden bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800 shrink-0 z-40">
        <div className="flex items-center gap-2">
          {schoolInfo.logo ? (
            <img
              src={schoolInfo.logo}
              alt="SJ Scheduler AI Logo"
              className="w-7 h-7 object-contain rounded-lg"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">
              {schoolInfo.name ? schoolInfo.name.charAt(0) : "S"}
            </div>
          )}
          <span className="font-semibold tracking-tight text-sm text-white">{schoolInfo.name}</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 text-slate-300 hover:text-white rounded-lg transition-all"
        >
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* Navigation Sidebar/Drawer */}
      <aside
        className={`fixed md:sticky top-0 left-0 bottom-0 z-50 w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col justify-between transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } h-full shrink-0`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Brand/Logo Header */}
          <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900 shrink-0">
            <div className="flex items-center gap-3">
              {schoolInfo.logo ? (
                <img
                  src={schoolInfo.logo}
                  alt="SJ Scheduler AI Logo"
                  className="w-8 h-8 object-contain rounded-lg shadow-md shadow-indigo-600/35"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-600/35">
                  {schoolInfo.name ? schoolInfo.name.charAt(0) : "S"}
                </div>
              )}
              <div>
                <h2 className="font-semibold text-white text-base tracking-tight leading-none truncate max-w-[130px]">
                  Scheduler AI
                </h2>
                <span className="text-[10px] text-slate-500 font-bold tracking-wider font-mono uppercase mt-1 inline-block">
                  {schoolInfo.name || "Principal Office"}
                </span>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1 text-slate-400 hover:text-white rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full px-3 py-2 rounded-md text-xs font-semibold transition-all flex items-center gap-3 cursor-pointer ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "hover:bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* AI Engine Status Indicator */}
          <div className="p-4 border-t border-slate-800 bg-slate-900/40 shrink-0 space-y-2">
            <button
              onClick={() => setIsLandingActive(true)}
              className="w-full px-3 py-2 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all flex items-center gap-3 cursor-pointer"
            >
              <Globe className="w-4 h-4 text-slate-400" />
              <span>Public Portal</span>
            </button>
            <button
              onClick={async () => {
                try {
                  await signOut(auth);
                } catch (err) {
                  console.error("Error signing out:", err);
                }
                localStorage.removeItem("active_school_session");
                setCurrentSchoolSession(null);
                setIsLandingActive(true);
              }}
              className="w-full px-3 py-2 rounded-lg text-xs font-bold bg-slate-800 hover:bg-rose-950/40 hover:text-rose-400 text-slate-300 transition-all flex items-center gap-3 cursor-pointer border border-slate-800"
            >
              <LogOut className="w-4 h-4 text-slate-400" />
              <span>Sign Out Console</span>
            </button>
            <div className="flex items-center gap-2 p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/30">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-indigo-400">AI Engine Active</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area Wrapper */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold text-slate-800 capitalize">
              {navItems.find((item) => item.id === activeTab)?.label || "Dashboard"}
            </h1>
            <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-semibold uppercase tracking-wider">
              {schoolInfo.term || "AY 2026-27"}
            </span>
          </div>

          <div className="flex items-center gap-6">
            {/* Search Input */}
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search records..."
                className="w-64 pl-9 pr-4 py-1.5 bg-slate-100 border-none rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
              />
              <svg
                className="w-4 h-4 text-slate-400 absolute left-3 top-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Profile */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-slate-900">
                  {schoolInfo.principalName || "Dr. Robert Vance"}
                </p>
                <p className="text-[10px] text-slate-500 font-medium">Administrator</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-indigo-50 border-2 border-white flex items-center justify-center font-bold text-indigo-600 text-xs shadow-sm">
                {(schoolInfo.principalName || "Robert Vance")
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-8 overflow-y-auto bg-slate-50 space-y-6">
          <div className="max-w-7xl mx-auto w-full space-y-6">
            {renderActiveComponent()}
          </div>
        </main>

        {/* Footer Info */}
        <footer className="px-8 py-3 bg-white border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-2 shrink-0">
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                System Status: Optimal
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                Cloud Backup: 2m ago
              </span>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 font-medium">
            &copy; {new Date().getFullYear()} School Scheduler AI. Powered by Google Gemini Engine.
          </div>
        </footer>
      </div>

      {/* Floating Application Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className="bg-slate-900 text-white rounded-xl p-4 shadow-2xl border border-slate-800 flex items-start gap-3 max-w-sm">
            <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
              toast.type === "success" ? "bg-emerald-500/20 text-emerald-400" : toast.type === "warning" ? "bg-amber-500/20 text-amber-400" : "bg-blue-500/20 text-blue-400"
            }`}>
              <Bell className="w-4 h-4" />
            </div>
            <div className="space-y-1 pr-6">
              <h4 className="font-bold text-xs text-white">{toast.title}</h4>
              <p className="text-[11px] text-slate-400 leading-normal">{toast.desc}</p>
            </div>
            <button onClick={() => setToast(null)} className="p-1 text-slate-500 hover:text-white absolute right-2 top-2 rounded">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
