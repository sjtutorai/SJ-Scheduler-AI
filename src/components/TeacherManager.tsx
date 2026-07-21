/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Teacher } from "../types";
import {
  Search,
  Plus,
  Trash2,
  Edit,
  Download,
  Upload,
  X,
  Award,
  Calendar,
  AlertCircle
} from "lucide-react";

interface TeacherManagerProps {
  teachers: Teacher[];
  setTeachers: (teachers: Teacher[]) => void;
  triggerNotification: (title: string, message: string, type: "success" | "warning" | "info") => void;
}

export default function TeacherManager({
  teachers,
  setTeachers,
  triggerNotification
}: TeacherManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");

  // Manual input state
  const [showModal, setShowModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  const [formFields, setFormFields] = useState<Omit<Teacher, "id">>({
    name: "",
    employeeId: "",
    subject: "Mathematics",
    department: "Science & Math",
    qualification: "",
    experience: 5,
    phone: "",
    email: "",
    classesTeaching: ["9", "10"],
    sections: ["A", "B"],
    maxPeriodsPerDay: 5,
    maxDutiesPerDay: 1,
    preferredBlock: "A Block",
    unavailableDays: [],
    leaveDetails: ""
  });

  const resetForm = () => {
    setFormFields({
      name: "",
      employeeId: "",
      subject: "Mathematics",
      department: "Science & Math",
      qualification: "",
      experience: 5,
      phone: "",
      email: "",
      classesTeaching: ["9", "10"],
      sections: ["A", "B"],
      maxPeriodsPerDay: 5,
      maxDutiesPerDay: 1,
      preferredBlock: "A Block",
      unavailableDays: [],
      leaveDetails: ""
    });
    setEditingTeacher(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const handleOpenEdit = (t: Teacher) => {
    setEditingTeacher(t);
    setFormFields({
      name: t.name,
      employeeId: t.employeeId,
      subject: t.subject,
      department: t.department,
      qualification: t.qualification,
      experience: t.experience,
      phone: t.phone,
      email: t.email,
      classesTeaching: t.classesTeaching,
      sections: t.sections,
      maxPeriodsPerDay: t.maxPeriodsPerDay,
      maxDutiesPerDay: t.maxDutiesPerDay,
      preferredBlock: t.preferredBlock,
      unavailableDays: t.unavailableDays,
      leaveDetails: t.leaveDetails || ""
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    const deleted = teachers.find((t) => t.id === id);
    const updated = teachers.filter((t) => t.id !== id);
    setTeachers(updated);
    if (deleted) {
      triggerNotification(
        "Faculty Deleted",
        `${deleted.name} has been removed from active staff records.`,
        "warning"
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFields.name || !formFields.employeeId) {
      alert("Name and Employee ID are required.");
      return;
    }

    if (editingTeacher) {
      const updated = teachers.map((t) =>
        t.id === editingTeacher.id ? { ...t, ...formFields } : t
      );
      setTeachers(updated);
      triggerNotification(
        "Faculty Saved",
        `Details for ${formFields.name} updated successfully.`,
        "success"
      );
    } else {
      const newTch: Teacher = {
        id: `tch-${Date.now()}`,
        ...formFields
      };
      setTeachers([...teachers, newTch]);
      triggerNotification(
        "Faculty Registered",
        `${formFields.name} added to ${formFields.department} department.`,
        "success"
      );
    }
    setShowModal(false);
    resetForm();
  };

  // Toggle Unavailable days
  const toggleUnavailableDay = (day: string) => {
    const current = [...formFields.unavailableDays];
    const idx = current.indexOf(day);
    if (idx > -1) {
      current.splice(idx, 1);
    } else {
      current.push(day);
    }
    setFormFields({ ...formFields, unavailableDays: current });
  };

  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // Filter Logic
  const filteredTeachers = teachers.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = subjectFilter === "All" || t.subject === subjectFilter;

    return matchesSearch && matchesSubject;
  });

  const subjectsList = Array.from(new Set(teachers.map((t) => t.subject)));

  return (
    <div className="space-y-6" id="teacher-management-tab">
      {/* Search and Filters */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by faculty name, subject or Employee ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
            />
          </div>

          {/* Subject Filter */}
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
          >
            <option value="All">All Subjects</option>
            {subjectsList.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

        {/* Action Button */}
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-all flex items-center gap-2 cursor-pointer self-end md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Faculty</span>
        </button>
      </div>

      {/* Teachers Bento Grid / Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                <th className="py-4 px-6">ID & Profile</th>
                <th className="py-4 px-6">Primary Subject</th>
                <th className="py-4 px-6">Department & Qualification</th>
                <th className="py-4 px-6">Workload Limits</th>
                <th className="py-4 px-6">Availability Constraints</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-sans text-slate-700">
              {filteredTeachers.length > 0 ? (
                filteredTeachers.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-mono text-xs text-slate-400 font-semibold">{t.employeeId}</div>
                      <div className="font-bold text-slate-900">{t.name}</div>
                      <div className="text-xs text-slate-500">{t.email}</div>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-900">
                      <span className="bg-blue-50 border border-blue-100 text-blue-700 px-2.5 py-1 rounded-lg text-xs font-semibold">
                        {t.subject}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-slate-800">{t.department}</div>
                      <div className="text-xs text-slate-400 leading-tight">{t.qualification}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">{t.experience} Years Experience</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-xs">
                        Max periods: <span className="font-mono font-bold text-slate-900">{t.maxPeriodsPerDay}/day</span>
                      </div>
                      <div className="text-xs mt-0.5">
                        Max duties: <span className="font-mono font-bold text-slate-900">{t.maxDutiesPerDay}/day</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-1">Block: {t.preferredBlock}</div>
                    </td>
                    <td className="py-4 px-6">
                      {t.unavailableDays.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {t.unavailableDays.map((d) => (
                            <span key={d} className="bg-rose-50 border border-rose-100 text-rose-600 px-1.5 py-0.5 rounded text-[10px] font-semibold">
                              Unavail: {d}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-emerald-600 font-medium">Fully Available</span>
                      )}
                      {t.leaveDetails && (
                        <div className="text-[10px] text-amber-600 font-mono mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          <span className="truncate max-w-xs">{t.leaveDetails}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(t)}
                          className="p-1.5 hover:bg-slate-100 text-slate-500 rounded-lg transition-all cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="p-1.5 hover:bg-rose-50 text-rose-500 rounded-lg transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-sans">
                    No faculty directories matched your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Modal Drawer */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 font-sans">
                {editingTeacher ? "Edit Faculty Credentials" : "Register New Faculty"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Faculty Full Name</label>
                  <input
                    type="text"
                    required
                    value={formFields.name}
                    onChange={(e) => setFormFields({ ...formFields, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                    placeholder="e.g. Ramesh Kumar"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Employee ID Code</label>
                  <input
                    type="text"
                    required
                    value={formFields.employeeId}
                    onChange={(e) => setFormFields({ ...formFields, employeeId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                    placeholder="e.g. EMP-202601"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Primary Subject Name</label>
                  <select
                    value={formFields.subject}
                    onChange={(e) => setFormFields({ ...formFields, subject: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none cursor-pointer"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="General Science">General Science</option>
                    <option value="English Literature">English Literature</option>
                    <option value="Social Science">Social Science</option>
                    <option value="Computer Application">Computer Application</option>
                    <option value="Kannada Language">Kannada Language</option>
                    <option value="Physical Education">Physical Education</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Academic Department</label>
                  <input
                    type="text"
                    required
                    value={formFields.department}
                    onChange={(e) => setFormFields({ ...formFields, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none"
                    placeholder="e.g. Science & Math"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Highest Qualification</label>
                  <input
                    type="text"
                    required
                    value={formFields.qualification}
                    onChange={(e) => setFormFields({ ...formFields, qualification: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none"
                    placeholder="e.g. M.Sc., B.Ed."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Teaching Experience (Years)</label>
                  <input
                    type="number"
                    value={formFields.experience}
                    onChange={(e) => setFormFields({ ...formFields, experience: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={formFields.phone}
                    onChange={(e) => setFormFields({ ...formFields, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formFields.email}
                    onChange={(e) => setFormFields({ ...formFields, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Max Periods / Day</label>
                  <input
                    type="number"
                    value={formFields.maxPeriodsPerDay}
                    onChange={(e) => setFormFields({ ...formFields, maxPeriodsPerDay: parseInt(e.target.value) || 5 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Max Duties / Day</label>
                  <input
                    type="number"
                    value={formFields.maxDutiesPerDay}
                    onChange={(e) => setFormFields({ ...formFields, maxDutiesPerDay: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Preferred Block</label>
                  <select
                    value={formFields.preferredBlock}
                    onChange={(e) => setFormFields({ ...formFields, preferredBlock: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none cursor-pointer"
                  >
                    <option value="A Block">A Block</option>
                    <option value="B Block">B Block</option>
                    <option value="C Block">C Block</option>
                    <option value="D Block">D Block</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Unavailable Teaching Days</label>
                <div className="flex flex-wrap gap-2">
                  {weekdays.map((day) => {
                    const isSelected = formFields.unavailableDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleUnavailableDay(day)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          isSelected
                            ? "bg-rose-600 border-rose-600 text-white"
                            : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                        } cursor-pointer`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Planned Leave Details (dates/reasons)</label>
                <textarea
                  rows={2}
                  value={formFields.leaveDetails}
                  onChange={(e) => setFormFields({ ...formFields, leaveDetails: e.target.value })}
                  placeholder="e.g. Leave planned on July 25th for family event"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none resize-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-medium transition-all cursor-pointer"
                >
                  {editingTeacher ? "Save Changes" : "Register Faculty"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
