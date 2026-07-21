/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Teacher, Student, TimetableCell, Exam, InvigilatorDuty } from "../types";
import { Download, Printer, Award, Clock, Users, BookOpen } from "lucide-react";

interface ReportsPanelProps {
  teachers: Teacher[];
  students: Student[];
  timetable: TimetableCell[];
  exams: Exam[];
  duties: InvigilatorDuty[];
  triggerNotification: (title: string, message: string, type: "success" | "warning" | "info") => void;
}

export default function ReportsPanel({
  teachers,
  students,
  timetable,
  exams,
  duties,
  triggerNotification
}: ReportsPanelProps) {
  const [reportType, setReportType] = useState<"workload" | "exam_stats" | "audit">("workload");

  // Calculate workloads
  const teacherWorkload = teachers.map((t) => {
    const assignedPeriods = timetable.filter((cell) => cell.teacherId === t.id).length;
    const assignedExamDuties = duties.filter((d) => d.teacherId === t.id).length;
    const loadPercentage = Math.round((assignedPeriods / (t.maxPeriodsPerDay * 6)) * 100);

    return {
      name: t.name,
      employeeId: t.employeeId,
      periods: assignedPeriods,
      maxPeriods: t.maxPeriodsPerDay * 6, // 6 days standard
      duties: assignedExamDuties,
      percentage: Math.min(loadPercentage, 100)
    };
  });

  const triggerExportExcel = () => {
    // Generate simple csv payload as spreadsheet
    const headers = "Faculty Name,Employee ID,Assigned Weekly Periods,Max Weekly Capacity,Assigned Exam Duties,Workload Load Percentage\n";
    const rows = teacherWorkload
      .map(
        (w) =>
          `"${w.name}","${w.employeeId}",${w.periods},${w.maxPeriods},${w.duties},${w.percentage}%`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Academic_Faculty_Workload_Report_${new Date().getFullYear()}.csv`;
    a.click();
    triggerNotification("Report Downloaded", "Weekly Faculty Workload sheet generated.", "success");
  };

  const triggerPrintPDF = () => {
    window.print();
    triggerNotification("Print Dialogue Triggered", "Schedules and workload reports are optimized for physical printing.", "info");
  };

  return (
    <div className="space-y-6" id="reports-panel-tab">
      {/* Report controllers */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setReportType("workload")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              reportType === "workload" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Faculty Workload Analysis
          </button>
          <button
            onClick={() => setReportType("exam_stats")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              reportType === "exam_stats" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Examination Summary
          </button>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto">
          <button
            onClick={triggerExportExcel}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer flex-1 md:flex-initial"
          >
            <Download className="w-4 h-4" />
            <span>Export Spreadsheet</span>
          </button>

          <button
            onClick={triggerPrintPDF}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer flex-1 md:flex-initial"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Main Stats / Workload visualizer */}
      {reportType === "workload" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-50">
              <h3 className="font-bold text-slate-800 font-sans text-sm">Faculty Operational Workload Stats</h3>
            </div>
            <div className="p-6 space-y-5">
              {teacherWorkload.map((w, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <div>
                      <strong className="text-slate-900">{w.name}</strong>
                      <span className="text-slate-400 font-mono text-[10px] ml-1.5">{w.employeeId}</span>
                    </div>
                    <span className="font-mono text-slate-500 font-bold">
                      {w.periods} / {w.maxPeriods} periods assigned ({w.percentage}%)
                    </span>
                  </div>

                  {/* Progress gauge */}
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        w.percentage > 85
                          ? "bg-rose-500"
                          : w.percentage > 60
                          ? "bg-amber-500"
                          : "bg-indigo-500"
                      }`}
                      style={{ width: `${w.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5 h-fit">
            <h3 className="font-bold text-slate-800 font-sans tracking-tight">Institutional Totals</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center space-y-1">
                <Users className="w-5 h-5 mx-auto text-slate-400" />
                <div className="text-[10px] text-slate-400 font-bold uppercase">Students</div>
                <div className="text-xl font-extrabold text-slate-900 font-mono">{students.length}</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center space-y-1">
                <Award className="w-5 h-5 mx-auto text-slate-400" />
                <div className="text-[10px] text-slate-400 font-bold uppercase">Teachers</div>
                <div className="text-xl font-extrabold text-slate-900 font-mono">{teachers.length}</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center space-y-1">
                <Clock className="w-5 h-5 mx-auto text-slate-400" />
                <div className="text-[10px] text-slate-400 font-bold uppercase">Slots Booked</div>
                <div className="text-xl font-extrabold text-slate-900 font-mono">{timetable.length}</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center space-y-1">
                <BookOpen className="w-5 h-5 mx-auto text-slate-400" />
                <div className="text-[10px] text-slate-400 font-bold uppercase">Exams Set</div>
                <div className="text-xl font-extrabold text-slate-900 font-mono">{exams.length}</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-50">
            <h3 className="font-bold text-slate-800 font-sans text-sm">Active Examination Datesheet Log</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                  <th className="py-4 px-6">Subject</th>
                  <th className="py-4 px-6">Exam Classification</th>
                  <th className="py-4 px-6">Date Scheduled</th>
                  <th className="py-4 px-6">Time Block</th>
                  <th className="py-4 px-6">Total Targets</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-sans text-slate-700">
                {exams.map((ex, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-4 px-6 font-bold text-slate-950">{ex.subjectId}</td>
                    <td className="py-4 px-6 font-medium text-slate-600">{ex.name}</td>
                    <td className="py-4 px-6 font-mono text-xs">{ex.date}</td>
                    <td className="py-4 px-6 font-mono text-xs">{ex.startTime} - {ex.endTime}</td>
                    <td className="py-4 px-6 font-mono font-semibold text-slate-700">
                      Class {ex.classes.join(", ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
