/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Student } from "../types";
import {
  Search,
  Filter,
  Plus,
  Trash2,
  Edit,
  Download,
  Upload,
  UserPlus,
  RefreshCw,
  X,
  Sparkles
} from "lucide-react";

interface StudentManagerProps {
  students: Student[];
  setStudents: (students: Student[]) => void;
  triggerNotification: (title: string, message: string, type: "success" | "warning" | "info") => void;
}

export default function StudentManager({
  students,
  setStudents,
  triggerNotification
}: StudentManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("All");
  const [sectionFilter, setSectionFilter] = useState("All");

  // Manual Input modal/drawer state
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Form Field State
  const [formFields, setFormFields] = useState<Omit<Student, "id">>({
    name: "",
    admissionNumber: "",
    rollNumber: 1,
    class: "10",
    section: "A",
    gender: "Male",
    dob: "21-07-2012",
    parentName: "",
    parentMobile: "",
    house: "Red Jaguar",
    bloodGroup: "B+"
  });

  // Simulated spreadsheet parsing state
  const [isUploading, setIsUploading] = useState(false);

  // Reset form helper
  const resetForm = () => {
    setFormFields({
      name: "",
      admissionNumber: "",
      rollNumber: 1,
      class: "10",
      section: "A",
      gender: "Male",
      dob: "2012-07-21",
      parentName: "",
      parentMobile: "",
      house: "Red Jaguar",
      bloodGroup: "B+"
    });
    setEditingStudent(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setFormFields({
      name: student.name,
      admissionNumber: student.admissionNumber,
      rollNumber: student.rollNumber,
      class: student.class,
      section: student.section,
      gender: student.gender,
      dob: student.dob,
      parentName: student.parentName,
      parentMobile: student.parentMobile,
      house: student.house,
      bloodGroup: student.bloodGroup || "B+"
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    const deleted = students.find((s) => s.id === id);
    const updated = students.filter((s) => s.id !== id);
    setStudents(updated);
    if (deleted) {
      triggerNotification(
        "Student Removed",
        `Details of ${deleted.name} have been archived.`,
        "warning"
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFields.name || !formFields.admissionNumber) {
      alert("Name and Admission Number are required!");
      return;
    }

    if (editingStudent) {
      // Update
      const updated = students.map((s) =>
        s.id === editingStudent.id ? { ...s, ...formFields } : s
      );
      setStudents(updated);
      triggerNotification(
        "Student Updated",
        `Details for ${formFields.name} saved successfully.`,
        "success"
      );
    } else {
      // Create new
      const newStd: Student = {
        id: `std-${Date.now()}`,
        ...formFields
      };
      setStudents([...students, newStd]);
      triggerNotification(
        "Student Registered",
        `${formFields.name} has been enrolled in Class ${formFields.class}-${formFields.section}.`,
        "success"
      );
    }
    setShowModal(false);
    resetForm();
  };

  // Simulate Excel/CSV File Parsing
  const handleBulkSimulate = () => {
    setIsUploading(true);
    setTimeout(() => {
      // Stagger some new student data
      const currentCount = students.length;
      const parsedStudents: Student[] = [
        {
          id: `std-bulk-1`,
          name: "Rohan Kulkarni",
          admissionNumber: `ADM-2026-B1`,
          rollNumber: 41,
          class: "10",
          section: "A",
          gender: "Male",
          dob: "2012-08-11",
          parentName: "Mr. Suresh Kulkarni",
          parentMobile: "9887766551",
          house: "Yellow Cheetah",
          bloodGroup: "O+"
        },
        {
          id: `std-bulk-2`,
          name: "Swetha Shastry",
          admissionNumber: `ADM-2026-B2`,
          rollNumber: 42,
          class: "10",
          section: "A",
          gender: "Female",
          dob: "2012-04-19",
          parentName: "Mrs. Shridevi Shastry",
          parentMobile: "9887766552",
          house: "Green Emerald",
          bloodGroup: "AB+"
        },
        {
          id: `std-bulk-3`,
          name: "Nithin Hegde",
          admissionNumber: `ADM-2026-B3`,
          rollNumber: 43,
          class: "9",
          section: "B",
          gender: "Male",
          dob: "2013-02-05",
          parentName: "Mr. Ananth Hegde",
          parentMobile: "9887766553",
          house: "Blue Falcon",
          bloodGroup: "A+"
        }
      ];

      setStudents([...students, ...parsedStudents]);
      setIsUploading(false);
      triggerNotification(
        "Bulk Upload Completed",
        "Successfully compiled and updated 3 spreadsheet rows.",
        "success"
      );
    }, 800);
  };

  // Export to CSV spreadsheet
  const handleCSVExport = () => {
    const headers = "Name,AdmissionNumber,Roll,Class,Section,Gender,DOB,ParentName,ParentMobile,House\n";
    const rows = students
      .map(
        (s) =>
          `"${s.name}","${s.admissionNumber}",${s.rollNumber},"${s.class}","${s.section}","${s.gender}","${s.dob}","${s.parentName}","${s.parentMobile}","${s.house}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Student_Database_Export_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    triggerNotification("Database Exported", "Student CSV file download triggered.", "info");
  };

  // Filter & Search Logic
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.parentName && s.parentName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesClass = classFilter === "All" || s.class === classFilter;
    const matchesSection = sectionFilter === "All" || s.section === sectionFilter;

    return matchesSearch && matchesClass && matchesSection;
  });

  return (
    <div className="space-y-6" id="student-management-tab">
      {/* Search and Filters Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by student name, parent, or ADM code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-xs bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Class Filter */}
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-xs bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer font-medium"
          >
            <option value="All">All Classes</option>
            <option value="10">Class 10</option>
            <option value="9">Class 9</option>
            <option value="8">Class 8</option>
          </select>

          {/* Section Filter */}
          <select
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-xs bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer font-medium"
          >
            <option value="All">All Sections</option>
            <option value="A">Section A</option>
            <option value="B">Section B</option>
          </select>
        </div>

        {/* Database actions */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <button
            onClick={handleCSVExport}
            className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Export database"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleBulkSimulate}
            disabled={isUploading}
            className="px-3 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Import Excel spreadsheet"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{isUploading ? "Uploading..." : "Bulk Excel"}</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Database Listing Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider font-sans">
                <th className="py-3 px-6">Roll & ADM</th>
                <th className="py-3 px-6">Student Name</th>
                <th className="py-3 px-6">Class/Sec</th>
                <th className="py-3 px-6">Parent Info</th>
                <th className="py-3 px-6">House & Blood Group</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-sans text-slate-700">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((std) => (
                  <tr key={std.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-mono text-xs">
                      <div className="font-bold text-slate-900">#{std.rollNumber}</div>
                      <div className="text-slate-400 font-mono text-[10px]">{std.admissionNumber}</div>
                    </td>
                    <td className="py-3 px-6 font-semibold text-slate-800">
                      <div>{std.name}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{std.gender}</div>
                    </td>
                    <td className="py-3 px-6">
                      <span className="bg-slate-50 text-slate-700 px-2 py-0.5 rounded border border-slate-200 text-[10px] font-bold uppercase tracking-wider">
                        {std.class}-{std.section}
                      </span>
                    </td>
                    <td className="py-3 px-6">
                      <div className="font-medium text-slate-800">{std.parentName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{std.parentMobile}</div>
                    </td>
                    <td className="py-3 px-6">
                      <div className="text-xs text-slate-600 font-semibold">{std.house}</div>
                      {std.bloodGroup && (
                        <span className="text-[9px] bg-rose-50 border border-rose-100 text-rose-600 px-1.5 py-0.5 rounded font-mono font-bold mt-1 inline-block">
                          {std.bloodGroup}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(std)}
                          className="p-1 hover:bg-slate-100 text-slate-500 rounded transition-colors cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(std.id)}
                          className="p-1 hover:bg-rose-50 text-rose-500 rounded transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-sans text-xs">
                    No student directories matched your search filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Entry Form Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-5 border-b border-slate-150 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 text-sm tracking-tight uppercase">
                {editingStudent ? "Modify Student Details" : "Register New Student"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-slate-400 hover:bg-slate-150 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Full Student Name</label>
                  <input
                    type="text"
                    required
                    value={formFields.name}
                    onChange={(e) => setFormFields({ ...formFields, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. Anand Sharma"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Admission Code</label>
                  <input
                    type="text"
                    required
                    value={formFields.admissionNumber}
                    onChange={(e) => setFormFields({ ...formFields, admissionNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono font-medium bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. ADM-2026-401"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Class</label>
                  <select
                    value={formFields.class}
                    onChange={(e) => setFormFields({ ...formFields, class: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="10">10</option>
                    <option value="9">9</option>
                    <option value="8">8</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Section</label>
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

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Roll Number</label>
                  <input
                    type="number"
                    value={formFields.rollNumber}
                    onChange={(e) => setFormFields({ ...formFields, rollNumber: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono font-medium bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Gender</label>
                  <select
                    value={formFields.gender}
                    onChange={(e) => setFormFields({ ...formFields, gender: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={formFields.dob}
                    onChange={(e) => setFormFields({ ...formFields, dob: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono font-medium bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Parent Name</label>
                  <input
                    type="text"
                    value={formFields.parentName}
                    onChange={(e) => setFormFields({ ...formFields, parentName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Father/Mother/Guardian"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Parent Mobile</label>
                  <input
                    type="tel"
                    value={formFields.parentMobile}
                    onChange={(e) => setFormFields({ ...formFields, parentMobile: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono font-medium bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="+91 10-digit number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">House Allocation</label>
                  <select
                    value={formFields.house}
                    onChange={(e) => setFormFields({ ...formFields, house: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="Red Jaguar">Red Jaguar</option>
                    <option value="Blue Falcon">Blue Falcon</option>
                    <option value="Green Emerald">Green Emerald</option>
                    <option value="Yellow Cheetah">Yellow Cheetah</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Blood Group (Optional)</label>
                  <input
                    type="text"
                    value={formFields.bloodGroup}
                    onChange={(e) => setFormFields({ ...formFields, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono font-medium bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. O+"
                  />
                </div>
              </div>

              {/* Action buttons */}
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
                  {editingStudent ? "Save Changes" : "Register Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
