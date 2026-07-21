/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  Users,
  Award,
  BookOpen,
  Layers,
  MapPin,
  Clock,
  Calendar,
  AlertTriangle,
  Bell,
  CheckCircle2,
  Zap,
  ArrowRight
} from "lucide-react";
import {
  Student,
  Teacher,
  ClassConfig,
  Subject,
  Room,
  Block,
  Exam,
  Notification,
  RecentActivity
} from "../types";

interface DashboardProps {
  students: Student[];
  teachers: Teacher[];
  classes: ClassConfig[];
  subjects: Subject[];
  rooms: Room[];
  blocks: Block[];
  exams: Exam[];
  notifications: Notification[];
  activities: RecentActivity[];
  setTab: (tab: string) => void;
}

export default function Dashboard({
  students,
  teachers,
  classes,
  subjects,
  rooms,
  blocks,
  exams,
  notifications,
  activities,
  setTab
}: DashboardProps) {
  // Compute Stats
  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  const totalClasses = classes.length;
  const totalSections = classes.length; // Distinct class configs represents section blocks
  const totalSubjects = subjects.length;
  const totalRooms = rooms.length;
  const totalBlocks = blocks.length;
  const totalExamHalls = rooms.filter((r) => r.capacity >= 30).length;

  const today = new Date().toISOString().split("T")[0];
  const upcomingExams = exams.filter((e) => e.date >= today).slice(0, 3);
  const activeExamsCount = exams.filter((e) => e.date === today).length;

  const quickActions = [
    { title: "Generate Timetable", desc: "Run conflict-free scheduler", tab: "timetable", color: "bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200" },
    { title: "Plan Seating", desc: "Arrange exam halls by rules", tab: "exams", color: "bg-purple-50 text-purple-600 hover:bg-purple-100 border-purple-200" },
    { title: "Manage Teachers", desc: "Update qualifications & leaves", tab: "teachers", color: "bg-amber-50 text-amber-600 hover:bg-amber-100 border-amber-200" },
    { title: "Download Reports", desc: "Export PDFs and CSV schedules", tab: "reports", color: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-emerald-200" }
  ];

  return (
    <div className="space-y-6" id="dashboard-tab">
      {/* Welcome Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-6 md:p-8 border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
        <div className="space-y-2">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">
            Academic Operations Command Center
          </h1>
          <p className="text-slate-400 max-w-xl text-xs md:text-sm leading-relaxed">
            Welcome to the AI-Powered School Timetable & Examination Management System. Generate, optimize, and audit schedules with zero conflicts.
          </p>
        </div>
        <button
          onClick={() => setTab("timetable")}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Zap className="w-3.5 h-3.5 fill-white/20" />
          <span>Launch AI Generator</span>
        </button>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { label: "Students", value: totalStudents, badge: "+4%" },
          { label: "Teachers", value: totalTeachers, badge: "Active" },
          { label: "Classrooms", value: totalRooms, badge: "Allocated" },
          { label: "Exam Halls", value: totalExamHalls, badge: "Configured" }
        ].map((stat, idx) => (
          <div
            key={idx}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-28 transition-all hover:shadow-md"
          >
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{stat.label}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 font-mono">{stat.value}</span>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">{stat.badge}</span>
            </div>
          </div>
        ))}

        {/* Highlight Card (Conflict Check) */}
        <div className="bg-indigo-600 p-5 rounded-xl shadow-md flex flex-col justify-between text-white h-28 col-span-2 sm:col-span-1">
          <p className="text-[10px] font-bold text-indigo-100 uppercase tracking-wider mb-1">Conflict Check</p>
          <div className="text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <span className="text-lg font-bold tracking-tight">Optimal</span>
          </div>
        </div>
      </div>

      {/* Secondary Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Classes & Sections", value: `${totalClasses} Groups`, icon: Layers, color: "text-amber-600 bg-amber-50 border-amber-100" },
          { label: "Active Subjects", value: `${totalSubjects} Courses`, icon: BookOpen, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
          { label: "Facility Blocks", value: `${totalBlocks} Wings`, icon: MapPin, color: "text-rose-600 bg-rose-50 border-rose-100" },
          { label: "Today's Exams", value: `${activeExamsCount} Active`, icon: Calendar, color: "text-indigo-600 bg-indigo-50 border-indigo-100" }
        ].map((stat, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between transition-all hover:shadow-md"
          >
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{stat.label}</span>
              <h4 className="text-sm font-bold text-slate-800 font-mono">{stat.value}</h4>
            </div>
            <div className={`p-2 rounded-lg ${stat.color} border shrink-0`}>
              <stat.icon className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Quick Actions & Todays Schedules */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-800 tracking-tight uppercase border-b border-slate-100 pb-2">Quick Operations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((act, idx) => (
                <button
                  key={idx}
                  onClick={() => setTab(act.tab)}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all flex flex-col justify-between h-28 cursor-pointer group text-left shadow-sm"
                >
                  <div className="space-y-1">
                    <h3 className="font-bold text-xs text-slate-800 group-hover:text-indigo-600 transition-colors">{act.title}</h3>
                    <p className="text-[10px] text-slate-500 leading-normal">{act.desc}</p>
                  </div>
                  <div className="flex items-center justify-end w-full">
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transform group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Today's Schedule Overview */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h2 className="text-sm font-bold text-slate-800 tracking-tight uppercase">Today's Academic Status</h2>
              <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-600 px-2 py-1 rounded font-semibold font-mono flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                <span>08:30 AM - 02:30 PM</span>
              </span>
            </div>
            <div className="divide-y divide-slate-100">
              {[
                { title: "Assembly & Morning Roll Call", time: "08:30 AM - 08:50 AM", status: "Completed", color: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700 border-emerald-100" },
                { title: "Morning Academic Lectures (Periods 1 - 3)", time: "08:50 AM - 12:00 PM", status: "In Progress", color: "bg-blue-500 animate-pulse", badge: "bg-blue-50 text-blue-700 border-blue-100" },
                { title: "Lunch Break Block", time: "12:00 PM - 12:40 PM", status: "Scheduled", color: "bg-slate-300", badge: "bg-slate-50 text-slate-600 border-slate-200" },
                { title: "Afternoon Practical & Laboratory Work (Periods 4 - 6)", time: "12:40 PM - 02:30 PM", status: "Scheduled", color: "bg-slate-300", badge: "bg-slate-50 text-slate-600 border-slate-200" }
              ].map((item, idx) => (
                <div key={idx} className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${item.color} shrink-0`}></div>
                    <div>
                      <h4 className="font-semibold text-xs text-slate-800">{item.title}</h4>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{item.time}</p>
                    </div>
                  </div>
                  <span className={`text-[9px] px-2 py-0.5 rounded border font-bold uppercase tracking-wider ${item.badge}`}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Notifications & Recent Activity */}
        <div className="space-y-6">
          {/* Real-time Notifications */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-800 tracking-tight uppercase flex items-center gap-2 border-b border-slate-100 pb-2">
              <Bell className="w-4 h-4 text-amber-500 fill-amber-50" />
              <span>Conflict & Alert Monitor</span>
            </h2>
            <div className="space-y-3">
              {notifications.slice(0, 4).map((notif) => {
                const colorMap = {
                  success: "bg-emerald-50/50 border-emerald-100 text-emerald-800",
                  warning: "bg-amber-50/50 border-amber-100 text-amber-800",
                  danger: "bg-rose-50/50 border-rose-100 text-rose-800",
                  info: "bg-blue-50/50 border-blue-100 text-blue-800"
                };
                return (
                  <div
                    key={notif.id}
                    className={`p-3 rounded-lg border ${colorMap[notif.type] || colorMap.info} text-[11px] space-y-1 shadow-xs`}
                  >
                    <div className="flex justify-between items-center font-bold">
                      <span>{notif.title}</span>
                      <span className="opacity-60 font-mono text-[9px]">{notif.timestamp}</span>
                    </div>
                    <p className="opacity-90 leading-relaxed font-medium">{notif.message}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Audit Logs / Activity */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-800 tracking-tight uppercase flex items-center gap-2 border-b border-slate-100 pb-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-500" />
              <span>Recent Activity Logs</span>
            </h2>
            <div className="space-y-3">
              {activities.slice(0, 5).map((act) => (
                <div key={act.id} className="text-[11px] flex gap-3 pb-3 border-b border-slate-100 last:border-none last:pb-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1 shrink-0" />
                  <div className="space-y-0.5">
                    <p className="text-slate-700 font-semibold leading-relaxed">{act.description}</p>
                    <div className="flex items-center gap-2 text-slate-400 font-mono text-[9px]">
                      <span className="font-semibold">{act.user}</span>
                      <span>•</span>
                      <span>{act.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
