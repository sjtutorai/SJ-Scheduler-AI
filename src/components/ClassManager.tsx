/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ClassConfig, Teacher } from "../types";
import { Search, Plus, Trash2, Edit, X, GraduationCap, MapPin, Layers } from "lucide-react";

interface ClassManagerProps {
  classes: ClassConfig[];
  setClasses: (classes: ClassConfig[]) => void;
  teachers: Teacher[];
  triggerNotification: (title: string, message: string, type: "success" | "warning" | "info") => void;
}

export default function ClassManager({
  classes,
  setClasses,
  teachers,
  triggerNotification
}: ClassManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassConfig | null>(null);

  const [formFields, setFormFields] = useState<Omit<ClassConfig, "id">>({
    className: "10",
    section: "A",
    classTeacherId: "tch-1",
    totalStudents: 30,
    roomNumber: "101",
    floor: 1,
    blockName: "A Block"
  });

  const resetForm = () => {
    setFormFields({
      className: "10",
      section: "A",
      classTeacherId: teachers[0]?.id || "",
      totalStudents: 30,
      roomNumber: "101",
      floor: 1,
      blockName: "A Block"
    });
    setEditingClass(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const handleOpenEdit = (cls: ClassConfig) => {
    setEditingClass(cls);
    setFormFields({
      className: cls.className,
      section: cls.section,
      classTeacherId: cls.classTeacherId,
      totalStudents: cls.totalStudents,
      roomNumber: cls.roomNumber,
      floor: cls.floor,
      blockName: cls.blockName
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    const deleted = classes.find((c) => c.id === id);
    const updated = classes.filter((c) => c.id !== id);
    setClasses(updated);
    if (deleted) {
      triggerNotification(
        "Class Removed",
        `Class ${deleted.className}-${deleted.section} config deleted.`,
        "warning"
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClass) {
      const updated = classes.map((c) =>
        c.id === editingClass.id ? { ...c, ...formFields } : c
      );
      setClasses(updated);
      triggerNotification(
        "Class Config Saved",
        `Class ${formFields.className}-${formFields.section} parameters updated.`,
        "success"
      );
    } else {
      const newClass: ClassConfig = {
        id: `cls-${Date.now()}`,
        ...formFields
      };
      setClasses([...classes, newClass]);
      triggerNotification(
        "Class Registered",
        `Created Class ${formFields.className}-${formFields.section} roster successfully.`,
        "success"
      );
    }
    setShowModal(false);
    resetForm();
  };

  const filteredClasses = classes.filter(
    (c) =>
      c.className.includes(searchTerm) ||
      c.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.roomNumber.includes(searchTerm)
  );

  return (
    <div className="space-y-6" id="class-management-tab">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search classes by grade, section, or room..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-xs bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer self-end sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Class Config</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider font-sans">
                <th className="py-3 px-6">Class & Section</th>
                <th className="py-3 px-6">Associated Class Teacher</th>
                <th className="py-3 px-6">Total Students Enrolled</th>
                <th className="py-3 px-6">Assigned Classroom Location</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-sans text-slate-700">
              {filteredClasses.length > 0 ? (
                filteredClasses.map((cls) => {
                  const teacher = teachers.find((t) => t.id === cls.classTeacherId);
                  return (
                    <tr key={cls.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-6 font-semibold text-slate-900 flex items-center gap-2.5">
                        <div className="p-1.5 bg-slate-50 rounded text-slate-700 border border-slate-200">
                          <GraduationCap className="w-3.5 h-3.5 text-slate-600" />
                        </div>
                        <span className="text-sm font-semibold text-slate-800">
                          Class {cls.className} - {cls.section}
                        </span>
                      </td>
                      <td className="py-3 px-6">
                        {teacher ? (
                          <div className="space-y-0.5">
                            <div className="font-semibold text-slate-800">{teacher.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono font-medium">{teacher.employeeId} • {teacher.subject}</div>
                          </div>
                        ) : (
                          <span className="text-[10px] uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded font-bold">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3 px-6 font-mono font-medium text-slate-600">
                        {cls.totalStudents} students
                      </td>
                      <td className="py-3 px-6 space-y-0.5">
                        <div className="flex items-center gap-1 text-slate-800 font-semibold">
                          <MapPin className="w-3 h-3 text-slate-450" />
                          <span>Room {cls.roomNumber}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-400 text-[10px] font-mono">
                          <Layers className="w-2.5 h-2.5" />
                          <span>
                            {cls.blockName}, Floor {cls.floor}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(cls)}
                            className="p-1 hover:bg-slate-100 text-slate-500 rounded transition-colors cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(cls.id)}
                            className="p-1 hover:bg-rose-50 text-rose-500 rounded transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 font-sans text-xs">
                    No active class configurations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Entry Form Drawer */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-150 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 text-sm tracking-tight uppercase">
                {editingClass ? "Edit Class Roster Profile" : "Register Class Roster"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-slate-400 hover:bg-slate-150 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Standard Grade</label>
                  <select
                    value={formFields.className}
                    onChange={(e) => setFormFields({ ...formFields, className: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="10">10</option>
                    <option value="9">9</option>
                    <option value="8">8</option>
                    <option value="7">7</option>
                    <option value="6">6</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Section Tag</label>
                  <select
                    value={formFields.section}
                    onChange={(e) => setFormFields({ ...formFields, section: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Class Teacher</label>
                <select
                  value={formFields.classTeacherId}
                  onChange={(e) => setFormFields({ ...formFields, classTeacherId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.subject})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total Enrolled Students</label>
                  <input
                    type="number"
                    value={formFields.totalStudents}
                    onChange={(e) => setFormFields({ ...formFields, totalStudents: parseInt(e.target.value) || 30 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono font-medium bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Assigned Room Number</label>
                  <input
                    type="text"
                    value={formFields.roomNumber}
                    onChange={(e) => setFormFields({ ...formFields, roomNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono font-medium bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. 101"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Block Location</label>
                  <select
                    value={formFields.blockName}
                    onChange={(e) => setFormFields({ ...formFields, blockName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="A Block">A Block</option>
                    <option value="B Block">B Block</option>
                    <option value="C Block">C Block</option>
                    <option value="D Block">D Block</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Floor Level</label>
                  <input
                    type="number"
                    value={formFields.floor}
                    onChange={(e) => setFormFields({ ...formFields, floor: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono font-medium bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-150 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                >
                  {editingClass ? "Save Changes" : "Create Class Config"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
