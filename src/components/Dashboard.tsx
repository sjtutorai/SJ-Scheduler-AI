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
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold font-sans tracking-tight">
            Academic Operations Command Center
          </h1>
          <p className="text-slate-400 font-sans max-w-xl text-sm md:text-base leading-relaxed">
            Welcome to the AI-Powered School Timetable & Examination Management System. Generate, optimize, and audit schedules with zero conflicts.
          </p>
        </div>
        <button
          onClick={() => setTab("timetable")}
          className="px-5 py-3 bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-medium text-sm transition-all shadow-sm flex items-center gap-2 cursor-pointer"
        >
          <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>Launch AI Generator</span>
        </button>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Students", value: totalStudents, icon: Users, color: "text-blue-500 bg-blue-50 border-blue-100" },
          { label: "Teaching Faculty", value: totalTeachers, icon: Award, color: "text-purple-500 bg-purple-50 border-purple-100" },
          { label: "Classes & Sections", value: `${totalClasses} Groups`, icon: Layers, color: "text-amber-500 bg-amber-50 border-amber-100" },
          { label: "Active Subjects", value: totalSubjects, icon: BookOpen, color: "text-emerald-500 bg-emerald-50 border-emerald-100" },
          { label: "Infrastructure Rooms", value: totalRooms, icon: MapPin, color: "text-rose-500 bg-rose-50 border-rose-100" },
          { label: "Facility Blocks", value: totalBlocks, icon: Layers, color: "text-cyan-500 bg-cyan-50 border-cyan-100" },
          { label: "Exam Halls Available", value: totalExamHalls, icon: Calendar, color: "text-indigo-500 bg-indigo-50 border-indigo-100" },
          { label: "Today's Exams Scheduled", value: activeExamsCount, icon: AlertTriangle, color: "text-orange-500 bg-orange-50 border-orange-100" }
        ].map((stat, idx) => (
          <div
            key={idx}
            className={`p-4 md:p-6 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-between transition-all hover:shadow-md`}
          >
            <div className="space-y-1">
              <span className="text-xs md:text-sm text-slate-500 font-medium font-sans">{stat.label}</span>
              <h3 className="text-lg md:text-2xl font-bold text-slate-800 font-mono tracking-tight">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${stat.color} border`}>
              <stat.icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Quick Actions & Todays Schedules */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-800 font-sans tracking-tight">Quick Operations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((act, idx) => (
                <button
                  key={idx}
                  onClick={() => setTab(act.tab)}
                  className={`p-4 rounded-xl border text-left transition-all ${act.color} flex flex-col justify-between h-28 cursor-pointer group`}
                >
                  <div className="space-y-1">
                    <h3 className="font-semibold text-sm sm:text-base">{act.title}</h3>
                    <p className="text-xs opacity-80">{act.desc}</p>
                  </div>
                  <div className="flex items-center justify-end w-full">
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Today's Schedule Overview */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800 font-sans tracking-tight">Today's Academic Status</h2>
              <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg font-medium font-mono flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>08:30 AM - 02:30 PM</span>
              </span>
            </div>
            <div className="divide-y divide-slate-100">
              <div className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                  <div>
                    <h4 className="font-medium text-sm text-slate-800">Assembly & Morning Roll Call</h4>
                    <p className="text-xs text-slate-400 font-mono">08:30 AM - 08:50 AM</p>
                  </div>
                </div>
                <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-medium">Completed</span>
              </div>

              <div className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                  <div>
                    <h4 className="font-medium text-sm text-slate-800">Morning Academic Lectures (Periods 1 - 3)</h4>
                    <p className="text-xs text-slate-400 font-mono">08:50 AM - 12:00 PM</p>
                  </div>
                </div>
                <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">In Progress</span>
              </div>

              <div className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                  <div>
                    <h4 className="font-medium text-sm text-slate-800">Lunch Break Block</h4>
                    <p className="text-xs text-slate-400 font-mono">12:00 PM - 12:40 PM</p>
                  </div>
                </div>
                <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">Scheduled</span>
              </div>

              <div className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                  <div>
                    <h4 className="font-medium text-sm text-slate-800">Afternoon Practical & Laboratory Work (Periods 4 - 6)</h4>
                    <p className="text-xs text-slate-400 font-mono">12:40 PM - 02:30 PM</p>
                  </div>
                </div>
                <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">Scheduled</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Notifications & Recent Activity */}
        <div className="space-y-6">
          {/* Real-time Notifications */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-800 font-sans tracking-tight flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-500 fill-amber-100" />
              <span>Conflict & Alert Monitor</span>
            </h2>
            <div className="space-y-3">
              {notifications.map((notif) => {
                const colorMap = {
                  success: "bg-emerald-50 border-emerald-100 text-emerald-800",
                  warning: "bg-amber-50 border-amber-100 text-amber-800",
                  danger: "bg-rose-50 border-rose-100 text-rose-800",
                  info: "bg-blue-50 border-blue-100 text-blue-800"
                };
                return (
                  <div
                    key={notif.id}
                    className={`p-3 rounded-xl border ${colorMap[notif.type] || colorMap.info} text-xs space-y-1`}
                  >
                    <div className="flex justify-between items-center font-semibold">
                      <span>{notif.title}</span>
                      <span className="opacity-60 font-mono">{notif.timestamp}</span>
                    </div>
                    <p className="opacity-90 leading-relaxed">{notif.message}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Audit Logs / Activity */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-800 font-sans tracking-tight flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-500" />
              <span>Recent Activity Logs</span>
            </h2>
            <div className="space-y-3">
              {activities.map((act) => (
                <div key={act.id} className="text-xs flex gap-3 pb-3 border-b border-slate-100 last:border-none">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                  <div className="space-y-0.5">
                    <p className="text-slate-700 font-medium leading-relaxed">{act.description}</p>
                    <div className="flex items-center gap-2 text-slate-400 font-mono">
                      <span>{act.user}</span>
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
