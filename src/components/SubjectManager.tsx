/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Subject } from "../types";
import { Search, Plus, Trash2, Edit, X, BookOpen, Check, HelpCircle } from "lucide-react";

interface SubjectManagerProps {
  subjects: Subject[];
  setSubjects: (subjects: Subject[]) => void;
  triggerNotification: (title: string, message: string, type: "success" | "warning" | "info") => void;
}

export default function SubjectManager({
  subjects,
  setSubjects,
  triggerNotification
}: SubjectManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const [formFields, setFormFields] = useState<Omit<Subject, "id">>({
    name: "",
    code: "",
    weeklyPeriods: 5,
    isTheory: true,
    isPractical: false,
    labRequired: false
  });

  const resetForm = () => {
    setFormFields({
      name: "",
      code: "",
      weeklyPeriods: 5,
      isTheory: true,
      isPractical: false,
      labRequired: false
    });
    setEditingSubject(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const handleOpenEdit = (sub: Subject) => {
    setEditingSubject(sub);
    setFormFields({
      name: sub.name,
      code: sub.code,
      weeklyPeriods: sub.weeklyPeriods,
      isTheory: sub.isTheory,
      isPractical: sub.isPractical,
      labRequired: sub.labRequired
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    const deleted = subjects.find((s) => s.id === id);
    const updated = subjects.filter((s) => s.id !== id);
    setSubjects(updated);
    if (deleted) {
      triggerNotification(
        "Subject Removed",
        `${deleted.name} (${deleted.code}) removed from academic list.`,
        "warning"
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFields.name || !formFields.code) {
      alert("Name and Subject Code are required.");
      return;
    }

    if (editingSubject) {
      const updated = subjects.map((s) =>
        s.id === editingSubject.id ? { ...s, ...formFields } : s
      );
      setSubjects(updated);
      triggerNotification(
        "Subject Updated",
        `${formFields.name} parameters have been updated.`,
        "success"
      );
    } else {
      const newSub: Subject = {
        id: `sub-${Date.now()}`,
        ...formFields
      };
      setSubjects([...subjects, newSub]);
      triggerNotification(
        "Subject Registered",
        `${formFields.name} added as an active course of study.`,
        "success"
      );
    }
    setShowModal(false);
    resetForm();
  };

  const filteredSubjects = subjects.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6" id="subject-management-tab">
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search subjects by name or subject code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
          />
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-all flex items-center gap-2 cursor-pointer self-end sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Subject</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                <th className="py-4 px-6">Subject Code</th>
                <th className="py-4 px-6">Subject Name</th>
                <th className="py-4 px-6">Weekly Period Allocation</th>
                <th className="py-4 px-6">Credits Classification</th>
                <th className="py-4 px-6">Special Lab Required</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-sans text-slate-700">
              {filteredSubjects.length > 0 ? (
                filteredSubjects.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-mono text-xs font-bold text-slate-500">
                      {sub.code}
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-900 flex items-center gap-3">
                      <div className="p-2 bg-slate-50 rounded-lg text-slate-700 border border-slate-100">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <span>{sub.name}</span>
                    </td>
                    <td className="py-4 px-6 font-mono font-medium text-slate-900">
                      {sub.weeklyPeriods} periods / week
                    </td>
                    <td className="py-4 px-6 space-y-1">
                      {sub.isTheory && (
                        <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded text-[11px] font-bold border border-emerald-100 mr-1 inline-block">
                          Theory
                        </span>
                      )}
                      {sub.isPractical && (
                        <span className="bg-cyan-50 text-cyan-700 px-2.5 py-0.5 rounded text-[11px] font-bold border border-cyan-100 inline-block">
                          Practical
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {sub.labRequired ? (
                        <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-bold font-mono">
                          YES (Science/Computer Lab)
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">Standard Classroom</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(sub)}
                          className="p-1.5 hover:bg-slate-100 text-slate-500 rounded-lg transition-all cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(sub.id)}
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
                    No active subject allocations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Subject Entry Form Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl max-w-md w-full overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 font-sans">
                {editingSubject ? "Edit Subject Rules" : "Register New Subject"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Subject Title Name</label>
                <input
                  type="text"
                  required
                  value={formFields.name}
                  onChange={(e) => setFormFields({ ...formFields, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="e.g. Mathematics"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Subject Code</label>
                  <input
                    type="text"
                    required
                    value={formFields.code}
                    onChange={(e) => setFormFields({ ...formFields, code: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                    placeholder="e.g. MTH-101"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Weekly Period Load</label>
                  <input
                    type="number"
                    value={formFields.weeklyPeriods}
                    onChange={(e) => setFormFields({ ...formFields, weeklyPeriods: parseInt(e.target.value) || 5 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="block text-xs font-semibold text-slate-500">Credits Classification</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formFields.isTheory}
                      onChange={(e) => setFormFields({ ...formFields, isTheory: e.target.checked })}
                      className="rounded border-slate-300 focus:ring-slate-900"
                    />
                    <span>Theory Credit</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formFields.isPractical}
                      onChange={(e) => setFormFields({ ...formFields, isPractical: e.target.checked })}
                      className="rounded border-slate-300 focus:ring-slate-900"
                    />
                    <span>Practical Credit</span>
                  </label>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formFields.labRequired}
                    onChange={(e) => setFormFields({ ...formFields, labRequired: e.target.checked })}
                    className="rounded border-slate-300 focus:ring-slate-900"
                  />
                  <span>Specialized Lab/Computer Facility Required</span>
                </label>
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
                  {editingSubject ? "Save Changes" : "Register Subject"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
