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
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <div className="space-y-1 pb-3 border-b border-slate-50">
            <h3 className="font-bold text-slate-800 font-sans text-sm">Academic Constraint Config</h3>
            <p className="text-xs text-slate-400">Specify operational guardrails for timetable solvers.</p>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Academic Calendar Year</label>
                <input
                  type="text"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Current Academic Term</label>
                <input
                  type="text"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Teaching Periods Per Day</label>
                <input
                  type="number"
                  value={periodsPerDay}
                  onChange={(e) => setPeriodsPerDay(parseInt(e.target.value) || 6)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Min Standby Invigilators Required</label>
                <input
                  type="number"
                  value={minStandbyTeachers}
                  onChange={(e) => setMinStandbyTeachers(parseInt(e.target.value) || 3)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                {saving ? "Saving Changes..." : "Save Parameters"}
              </button>
            </div>
          </form>
        </div>

        {/* Database backup / restore card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 h-fit">
          <h3 className="font-bold text-slate-800 font-sans text-sm pb-2 border-b border-slate-50">
            Database Backup & Portability
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Export or import your entire school registry configurations, roster timetables, and teacher lists to a portable schema file.
          </p>

          <div className="space-y-2 pt-2">
            <button
              onClick={handleExportBackup}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Full JSON Backup</span>
            </button>

            <button
              onClick={() => triggerNotification("Manual Import", "Drag backup JSON into files to restore state.", "info")}
              className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border border-emerald-100 transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Restore Database from File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
