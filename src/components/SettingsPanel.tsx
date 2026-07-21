/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Download, Upload, ShieldAlert, Sparkles, Sliders, Check } from "lucide-react";

interface SettingsPanelProps {
  schoolInfo: any;
  setSchoolInfo: (info: any) => void;
  triggerNotification: (title: string, message: string, type: "success" | "warning" | "info") => void;
}

export default function SettingsPanel({
  schoolInfo,
  setSchoolInfo,
  triggerNotification
}: SettingsPanelProps) {
  // Simple form properties
  const [academicYear, setAcademicYear] = useState("2026-2027");
  const [term, setTerm] = useState("First Semester");
  const [periodsPerDay, setPeriodsPerDay] = useState(6);
  const [minStandbyTeachers, setMinStandbyTeachers] = useState(3);

  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSchoolInfo({
        ...schoolInfo,
        academicYear,
        term,
        periodsPerDay,
        minStandbyTeachers
      });
      setSaving(false);
      triggerNotification("Settings Configured", "Academic term parameters successfully saved.", "success");
    }, 400);
  };

  const handleExportBackup = () => {
    const backupData = {
      schoolInfo,
      backupDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `School_Scheduler_AI_Backup_${new Date().getFullYear()}.json`;
    a.click();
    triggerNotification("Backup Saved", "Institutional JSON config file downloaded.", "info");
  };

  return (
    <div className="space-y-6" id="settings-panel-tab">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rules and Term Configurations */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-1 pb-3 border-b border-slate-150">
            <h3 className="font-bold text-slate-800 text-sm tracking-tight uppercase">Academic Constraint Config</h3>
            <p className="text-xs text-slate-500">Specify operational guardrails for timetable solvers.</p>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Academic Calendar Year</label>
                <input
                  type="text"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Current Academic Term</label>
                <input
                  type="text"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Teaching Periods Per Day</label>
                <input
                  type="number"
                  value={periodsPerDay}
                  onChange={(e) => setPeriodsPerDay(parseInt(e.target.value) || 6)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono font-medium bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Min Standby Invigilators Required</label>
                <input
                  type="number"
                  value={minStandbyTeachers}
                  onChange={(e) => setMinStandbyTeachers(parseInt(e.target.value) || 3)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono font-medium bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
              >
                {saving ? "Saving Changes..." : "Save Parameters"}
              </button>
            </div>
          </form>
        </div>

        {/* Database backup / restore card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 h-fit">
          <h3 className="font-bold text-slate-800 text-sm tracking-tight pb-2 border-b border-slate-150 uppercase">
            Database Backup & Portability
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Export or import your entire school registry configurations, roster timetables, and teacher lists to a portable schema file.
          </p>

          <div className="space-y-2 pt-2">
            <button
              onClick={handleExportBackup}
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Full JSON Backup</span>
            </button>

            <button
              onClick={() => triggerNotification("Manual Import", "Drag backup JSON into files to restore state.", "info")}
              className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold border border-indigo-150 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Restore Database from File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
