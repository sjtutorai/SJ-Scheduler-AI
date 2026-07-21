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
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Hours & Working Days</h3>

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
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Lunch Timing End</label>
                <input
                  type="time"
                  disabled={!isEditing}
                  value={isEditing ? formData.lunchTiming.end : schoolInfo.lunchTiming.end}
                  onChange={(e) => setFormData({
                    ...formData,
                    lunchTiming: { ...formData.lunchTiming, end: e.target.value }
                  })}
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
