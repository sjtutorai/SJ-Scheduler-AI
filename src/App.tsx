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
  Menu
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

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row relative text-slate-800 font-sans antialiased selection:bg-slate-900 selection:text-white">
      {/* Mobile Header */}
      <header className="md:hidden bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-indigo-400 fill-indigo-400/20" />
          <span className="font-bold tracking-tight text-sm font-sans">{schoolInfo.name}</span>
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
        className={`fixed md:sticky top-0 left-0 bottom-0 z-50 w-72 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col justify-between transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } h-screen shrink-0`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Brand/Logo Header */}
          <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-600/35">
                <GraduationCap className="w-6 h-6 fill-indigo-200/20" />
              </div>
              <div>
                <h2 className="font-extrabold text-white text-sm tracking-tight leading-none truncate max-w-[150px]">
                  {schoolInfo.name}
                </h2>
                <span className="text-[10px] text-slate-500 font-bold tracking-wider font-mono uppercase mt-1 inline-block">
                  Academic Admin v2.0
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
          <nav className="p-4 space-y-1 flex-1">
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
                  className={`w-full px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                      : "hover:bg-slate-800/60 hover:text-white"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User context footer */}
        <div className="p-5 border-t border-slate-800 bg-slate-950/40 text-center font-mono text-[10px] text-slate-500">
          <div>Term: {schoolInfo.term}</div>
          <div>UDISE Board Code: {schoolInfo.udiseCode}</div>
        </div>
      </aside>

      {/* Main Panel Content container */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full space-y-6">
        {renderActiveComponent()}
      </main>

      {/* Floating Application Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce duration-1000">
          <div className="bg-slate-950 text-white rounded-2xl p-4 shadow-2xl border border-slate-800 flex items-start gap-3 max-w-sm">
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
