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
    <div className="h-screen w-screen bg-slate-50 flex flex-col md:flex-row relative text-slate-900 font-sans antialiased overflow-hidden selection:bg-slate-900 selection:text-white">
      {/* Mobile Header */}
      <header className="md:hidden bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800 shrink-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">
            {schoolInfo.name ? schoolInfo.name.charAt(0) : "S"}
          </div>
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
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-600/35">
                {schoolInfo.name ? schoolInfo.name.charAt(0) : "S"}
              </div>
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
          <div className="p-4 border-t border-slate-800 bg-slate-900/40 shrink-0">
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
