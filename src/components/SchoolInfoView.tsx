/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { SchoolInfo } from "../types";
import { Edit2, Save, MapPin, Award, Phone, Calendar, Plus, Trash2 } from "lucide-react";

interface SchoolInfoViewProps {
  schoolInfo: SchoolInfo;
  setSchoolInfo: (info: SchoolInfo) => void;
}

export default function SchoolInfoView({ schoolInfo, setSchoolInfo }: SchoolInfoViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<SchoolInfo>({ ...schoolInfo });
  const [newHolidayName, setNewHolidayName] = useState("");
  const [newHolidayDate, setNewHolidayDate] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSchoolInfo(formData);
    setIsEditing(false);
  };

  const handleAddHoliday = () => {
    if (!newHolidayName || !newHolidayDate) return;
    const updatedHolidays = [...formData.holidays, { date: newHolidayDate, name: newHolidayName }];
    setFormData({ ...formData, holidays: updatedHolidays });
    setNewHolidayName("");
    setNewHolidayDate("");
  };

  const handleRemoveHoliday = (idx: number) => {
    const updatedHolidays = formData.holidays.filter((_, i) => i !== idx);
    setFormData({ ...formData, holidays: updatedHolidays });
  };

  const toggleWorkingDay = (day: string) => {
    const updatedDays = formData.workingDays.includes(day)
      ? formData.workingDays.filter((d) => d !== day)
      : [...formData.workingDays, day];
    setFormData({ ...formData, workingDays: updatedDays });
  };

  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-8" id="school-info-tab">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200 bg-slate-50/50 -m-6 mb-2 p-6 rounded-t-xl">
        <div>
          <h2 className="text-sm font-bold text-slate-800 tracking-tight uppercase">School Profile Configurator</h2>
          <p className="text-xs text-slate-500">View and manage basic profile settings, timings, and academic calendars</p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Profile</span>
          </button>
        )}
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Core Profile parameters */}
        <div className="space-y-6">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Institution Details</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">School Name</label>
              <input
                type="text"
                disabled={!isEditing}
                value={isEditing ? formData.name : schoolInfo.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-70 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">UDISE Board Code</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={isEditing ? formData.udiseCode : schoolInfo.udiseCode}
                  onChange={(e) => setFormData({ ...formData, udiseCode: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono font-medium bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-70 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Academic Year Block</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={isEditing ? formData.academicYear : schoolInfo.academicYear}
                  onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-70 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Postal Address</label>
              <textarea
                rows={2}
                disabled={!isEditing}
                value={isEditing ? formData.address : schoolInfo.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-70 transition-colors resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Principal Name</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={isEditing ? formData.principalName : schoolInfo.principalName}
                  onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-70 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Contact Number</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={isEditing ? formData.contactNumber : schoolInfo.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono font-medium bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-70 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Operating Hours & Days */}
        <div className="space-y-6">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Institution Timings & Days</h3>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">School Timing Start</label>
                <input
                  type="time"
                  disabled={!isEditing}
                  value={isEditing ? formData.schoolTiming.start : schoolInfo.schoolTiming.start}
                  onChange={(e) => setFormData({
                    ...formData,
                    schoolTiming: { ...formData.schoolTiming, start: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono font-medium bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-70 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">School Timing End</label>
                <input
                  type="time"
                  disabled={!isEditing}
                  value={isEditing ? formData.schoolTiming.end : schoolInfo.schoolTiming.end}
                  onChange={(e) => setFormData({
                    ...formData,
                    schoolTiming: { ...formData.schoolTiming, end: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono font-medium bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-70 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Assembly Start Time</label>
                <input
                  type="time"
                  disabled={!isEditing}
                  value={isEditing ? formData.assemblyStart : schoolInfo.assemblyStart}
                  onChange={(e) => setFormData({ ...formData, assemblyStart: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono font-medium bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-70 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Assembly Duration (mins)</label>
                <input
                  type="number"
                  disabled={!isEditing}
                  value={isEditing ? formData.assemblyDuration : schoolInfo.assemblyDuration}
                  onChange={(e) => setFormData({ ...formData, assemblyDuration: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono font-medium bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-70 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Total Periods Count</label>
                <input
                  type="number"
                  disabled={!isEditing}
                  value={isEditing ? formData.periodsCount : schoolInfo.periodsCount}
                  onChange={(e) => setFormData({ ...formData, periodsCount: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono font-medium bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-70 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Period Duration (mins)</label>
                <input
                  type="number"
                  disabled={!isEditing}
                  value={isEditing ? formData.periodDuration : schoolInfo.periodDuration}
                  onChange={(e) => setFormData({ ...formData, periodDuration: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono font-medium bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-70 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Short Recess Start</label>
                <input
                  type="time"
                  disabled={!isEditing}
                  value={isEditing ? formData.recessStart : schoolInfo.recessStart}
                  onChange={(e) => setFormData({ ...formData, recessStart: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono font-medium bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-70 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Recess Duration (mins)</label>
                <input
                  type="number"
                  disabled={!isEditing}
                  value={isEditing ? formData.recessDuration : schoolInfo.recessDuration}
                  onChange={(e) => setFormData({ ...formData, recessDuration: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono font-medium bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-70 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Lunch Timing Start</label>
                <input
                  type="time"
                  disabled={!isEditing}
                  value={isEditing ? formData.lunchTiming.start : schoolInfo.lunchTiming.start}
                  onChange={(e) => setFormData({
                    ...formData,
                    lunchTiming: { ...formData.lunchTiming, start: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono font-medium bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-70 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Last Bell Time</label>
                <input
                  type="time"
                  disabled={!isEditing}
                  value={isEditing ? formData.lastBellTime : schoolInfo.lastBellTime}
                  onChange={(e) => setFormData({ ...formData, lastBellTime: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono font-medium bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-70 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Weekly Working Days</label>
              <div className="flex flex-wrap gap-1.5">
                {weekdays.map((day) => {
                  const isSelected = isEditing
                    ? formData.workingDays.includes(day)
                    : schoolInfo.workingDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      disabled={!isEditing}
                      onClick={() => toggleWorkingDay(day)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                        isSelected
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-xs"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      } disabled:opacity-70 cursor-pointer`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Class Timing Overrides */}
      <ClassTimingOverridesSection
        isEditing={isEditing}
        formData={formData}
        setFormData={setFormData}
        schoolInfo={schoolInfo}
      />

      {/* Holidays Schedule List */}
      <div className="pt-6 border-t border-slate-200 space-y-4">
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Official Holidays Calendar</h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add holiday form */}
          {isEditing && (
            <div className="p-4 bg-slate-50 rounded-lg space-y-3 h-fit border border-slate-200">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Add Academic Holiday</h4>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Holiday Label (e.g. Diwali)"
                  value={newHolidayName}
                  onChange={(e) => setNewHolidayName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="date"
                  value={newHolidayDate}
                  onChange={(e) => setNewHolidayDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono font-medium bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleAddHoliday}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Holiday</span>
                </button>
              </div>
            </div>
          )}

          {/* Holidays list */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(isEditing ? formData.holidays : schoolInfo.holidays).map((h, idx) => (
              <div
                key={idx}
                className="p-3 bg-white border border-slate-200 hover:border-slate-300 shadow-xs rounded-lg flex justify-between items-center transition-colors"
              >
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-800">{h.name}</h4>
                  <p className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">{h.date}</p>
                </div>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => handleRemoveHoliday(idx)}
                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ClassTimingOverridesProps {
  isEditing: boolean;
  formData: SchoolInfo;
  setFormData: (info: SchoolInfo) => void;
  schoolInfo: SchoolInfo;
}

function ClassTimingOverridesSection({
  isEditing,
  formData,
  setFormData,
  schoolInfo
}: ClassTimingOverridesProps) {
  const [showAdd, setShowAdd] = useState(false);

  // New Override Draft state
  const [classRange, setClassRange] = useState("Classes 1-5");
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("15:00");
  const [assemblyStart, setAssemblyStart] = useState("09:00");
  const [assemblyDuration, setAssemblyDuration] = useState(15);
  const [periodsCount, setPeriodsCount] = useState(6);
  const [periodDuration, setPeriodDuration] = useState(40);
  const [recessStart, setRecessStart] = useState("10:45");
  const [recessDuration, setRecessDuration] = useState(15);
  const [lunchStart, setLunchStart] = useState("12:15");
  const [lunchDuration, setLunchDuration] = useState(45);
  const [lastBellTime, setLastBellTime] = useState("15:00");

  const handleAdd = () => {
    const newOverride = {
      id: "override-" + Date.now(),
      classRange,
      start,
      end,
      assemblyStart,
      assemblyDuration,
      periodsCount,
      periodDuration,
      recessStart,
      recessDuration,
      lunchStart,
      lunchDuration,
      lastBellTime
    };

    setFormData({
      ...formData,
      customClassTimings: [...(formData.customClassTimings || []), newOverride]
    });

    setShowAdd(false);
  };

  const handleRemove = (id: string) => {
    setFormData({
      ...formData,
      customClassTimings: (formData.customClassTimings || []).filter((o) => o.id !== id)
    });
  };

  const list = isEditing
    ? formData.customClassTimings || []
    : schoolInfo.customClassTimings || [];

  return (
    <div className="pt-6 border-t border-slate-200 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Custom Class Operating Schedules</h3>
        {isEditing && !showAdd && (
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer border border-indigo-200"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Class override</span>
          </button>
        )}
      </div>

      {showAdd && (
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg space-y-4 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <h4 className="font-bold text-slate-800 uppercase tracking-wide text-[10px]">Create Operating Override</h4>
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Target Class Range</label>
              <input
                type="text"
                placeholder="e.g. Classes 1-5"
                value={classRange}
                onChange={(e) => setClassRange(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Start Time</label>
              <input
                type="time"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">End Time</label>
              <input
                type="time"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Assembly Start</label>
              <input
                type="time"
                value={assemblyStart}
                onChange={(e) => setAssemblyStart(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Assembly Mins</label>
              <input
                type="number"
                value={assemblyDuration}
                onChange={(e) => setAssemblyDuration(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Periods Count</label>
              <input
                type="number"
                value={periodsCount}
                onChange={(e) => setPeriodsCount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Period Mins</label>
              <input
                type="number"
                value={periodDuration}
                onChange={(e) => setPeriodDuration(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Recess Start</label>
              <input
                type="time"
                value={recessStart}
                onChange={(e) => setRecessStart(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Recess Mins</label>
              <input
                type="number"
                value={recessDuration}
                onChange={(e) => setRecessDuration(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Lunch Start</label>
              <input
                type="time"
                value={lunchStart}
                onChange={(e) => setLunchStart(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Lunch Mins</label>
              <input
                type="number"
                value={lunchDuration}
                onChange={(e) => setLunchDuration(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAdd}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold"
            >
              Add Override
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {list.map((item) => (
          <div
            key={item.id}
            className="p-4 bg-white border border-slate-200 shadow-2xs rounded-xl flex flex-col justify-between hover:border-slate-300 transition-all duration-150 relative overflow-hidden"
          >
            <div className="absolute right-0 top-0 bg-indigo-50 border-l border-b border-indigo-150 px-2.5 py-1 rounded-bl-lg">
              <span className="text-[9px] font-extrabold text-indigo-700 uppercase tracking-wider font-mono">CLASS OVERRIDE</span>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800">{item.classRange}</h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] font-medium text-slate-500">
                <div>
                  <span className="font-mono text-slate-400">Class Hours:</span> {item.start} - {item.end}
                </div>
                <div>
                  <span className="font-mono text-slate-400">Periods:</span> {item.periodsCount} ({item.periodDuration}m)
                </div>
                <div>
                  <span className="font-mono text-slate-400">Recess:</span> {item.recessStart} ({item.recessDuration}m)
                </div>
                <div>
                  <span className="font-mono text-slate-400">Lunch:</span> {item.lunchStart} ({item.lunchDuration}m)
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleRemove(item.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        ))}

        {list.length === 0 && (
          <div className="md:col-span-2 p-6 rounded-xl border border-dashed border-slate-200 text-center text-slate-400 font-medium italic text-xs">
            No class group operating overrides configured. All classes are following the default global operating schedule.
          </div>
        )}
      </div>
    </div>
  );
}
