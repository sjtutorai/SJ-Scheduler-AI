/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Exam, Student, Room, Teacher, SeatingItem, InvigilatorDuty } from "../types";
import { generateIntelligentSeating, assignInvigilators, findEmergencyReplacement } from "../utils";
import {
  Calendar,
  Plus,
  Trash2,
  Users,
  Award,
  Sparkles,
  Printer,
  QrCode,
  ShieldAlert,
  Sliders,
  X,
  AlertCircle,
  HelpCircle,
  LayoutGrid,
  CheckCircle2,
  Clock,
  MapPin
} from "lucide-react";

interface ExamSchedulerProps {
  exams: Exam[];
  setExams: (exams: Exam[]) => void;
  students: Student[];
  rooms: Room[];
  teachers: Teacher[];
  seating: SeatingItem[];
  setSeating: (seating: SeatingItem[]) => void;
  duties: InvigilatorDuty[];
  setDuties: (duties: InvigilatorDuty[]) => void;
  triggerNotification: (title: string, message: string, type: "success" | "warning" | "info") => void;
}

export default function ExamScheduler({
  exams,
  setExams,
  students,
  rooms,
  teachers,
  seating,
  setSeating,
  duties,
  setDuties,
  triggerNotification
}: ExamSchedulerProps) {
  const [activeSubTab, setActiveSubTab] = useState<"exams" | "seating" | "invigilation">("exams");
  
  // Modals / forms state
  const [showExamModal, setShowExamModal] = useState(false);
  const [showSubstituteModal, setShowSubstituteModal] = useState(false);

  // Substitute targets
  const [targetDuty, setTargetDuty] = useState<InvigilatorDuty | null>(null);
  const [availableSubstitutes, setAvailableSubstitutes] = useState<Teacher[]>([]);

  // Selected Exam for seating/invigilation reviews
  const [selectedExamId, setSelectedExamId] = useState<string>(exams[0]?.id || "");

  // Exam Form Field State
  const [examFields, setExamFields] = useState<Omit<Exam, "id">>({
    name: "Mid-Term Examination",
    startDate: "2026-07-27",
    endDate: "2026-08-01",
    subjectId: "Mathematics", // We will treat subject string literally here
    date: "2026-07-27",
    startTime: "09:30",
    endTime: "12:30",
    duration: 180,
    classes: ["9", "10"],
    sections: ["A", "B"]
  });

  const resetExamForm = () => {
    setExamFields({
      name: "Mid-Term Examination",
      startDate: "2026-07-27",
      endDate: "2026-08-01",
      subjectId: "Mathematics",
      date: "2026-07-27",
      startTime: "09:30",
      endTime: "12:30",
      duration: 180,
      classes: ["9", "10"],
      sections: ["A", "B"]
    });
  };

  // Exam CRUD handlers
  const handleOpenExamCreate = () => {
    resetExamForm();
    setShowExamModal(true);
  };

  const handleExamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEx: Exam = {
      id: `ex-${Date.now()}`,
      ...examFields
    };
    setExams([...exams, newEx]);
    setSelectedExamId(newEx.id);
    triggerNotification("Exam Created", `${examFields.name} registered successfully.`, "success");
    setShowExamModal(false);
  };

  const handleExamDelete = (id: string) => {
    setExams(exams.filter((e) => e.id !== id));
    triggerNotification("Exam Removed", "Examination slot removed.", "warning");
  };

  // Seating Generator triggers
  const handleGenerateSeating = () => {
    const currentExam = exams.find((e) => e.id === selectedExamId);
    if (!currentExam) {
      alert("Please register/select an exam first.");
      return;
    }

    const { seating: arr, warnings } = generateIntelligentSeating(
      currentExam,
      students,
      rooms,
      currentExam.subjectId
    );

    setSeating(arr);

    if (warnings.length > 0) {
      warnings.forEach((warn) => {
        triggerNotification("Optimizer Alert", warn, "warning");
      });
    } else {
      triggerNotification(
        "Seating Arranged",
        "AI Seating Arranger completed with zero class adjacencies.",
        "success"
      );
    }
  };

  // Invigilator triggers
  const handleAssignInvigilators = () => {
    const activeExams = exams.filter((e) => e.id === selectedExamId);
    if (activeExams.length === 0) {
      alert("Please select an exam.");
      return;
    }

    // Determine rooms used based on seating charts
    const roomsUsed = Array.from(new Set(seating.map((s) => s.roomNumber)));
    if (roomsUsed.length === 0) {
      // Fallback: Use Room 101 and 102
      roomsUsed.push("101", "102");
    }

    const { duties: arr, conflicts } = assignInvigilators(activeExams, roomsUsed, teachers, rooms);
    setDuties(arr);

    if (conflicts.length > 0) {
      conflicts.forEach((conf) => triggerNotification("Roster Warning", conf, "warning"));
    } else {
      triggerNotification("Roster Compiled", "Invigilator duties assigned successfully.", "success");
    }
  };

  // Emergency Substitutions Trigger
  const handleOpenSubstitute = (duty: InvigilatorDuty) => {
    setTargetDuty(duty);
    const substitutes = findEmergencyReplacement(
      duty.teacherId,
      duty.date,
      duty.subjectName,
      duty.blockName,
      teachers,
      duties
    );
    setAvailableSubstitutes(substitutes);
    setShowSubstituteModal(true);
  };

  const handleAssignSubstitute = (replacementTeacher: Teacher) => {
    if (!targetDuty) return;

    const updatedDuties = duties.map((d) =>
      d.id === targetDuty.id
        ? { ...d, teacherId: replacementTeacher.id, teacherName: replacementTeacher.name }
        : d
    );

    setDuties(updatedDuties);
    triggerNotification(
      "Emergency Substitute Assigned",
      `Assigned ${replacementTeacher.name} to Room ${targetDuty.roomNumber}.`,
      "success"
    );
    setShowSubstituteModal(false);
  };

  const selectedExam = exams.find((e) => e.id === selectedExamId) || exams[0];

  return (
    <div className="space-y-6" id="exams-tab">
      {/* Sub-Tabs Selector */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveSubTab("exams")}
            className={`px-4 py-2 rounded text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === "exams" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Schedules & Datesheet
          </button>
          <button
            onClick={() => setActiveSubTab("seating")}
            className={`px-4 py-2 rounded text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === "seating" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Intelligent Seating Arrangement
          </button>
          <button
            onClick={() => setActiveSubTab("invigilation")}
            className={`px-4 py-2 rounded text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === "invigilation" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            AI Invigilator duties
          </button>
        </div>

        {activeSubTab === "exams" && (
          <button
            onClick={handleOpenExamCreate}
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Exam Slot</span>
          </button>
        )}
      </div>

      {/* Main Section view routers */}
      {activeSubTab === "exams" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List of active exams */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Datesheet / Examination Slots</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {exams.map((ex) => (
                <div
                  key={ex.id}
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4 relative flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400 font-mono tracking-wider">
                          {ex.name}
                        </span>
                        <h4 className="font-bold text-slate-800 text-sm">{ex.subjectId}</h4>
                      </div>
                      <button
                        onClick={() => handleExamDelete(ex.id)}
                        className="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-mono">{ex.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-mono">
                          {ex.startTime} - {ex.endTime} ({ex.duration} mins)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-100">
                    {ex.classes.map((c) => (
                      <span key={c} className="bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-bold font-mono">
                        Class {c}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Core rule descriptions panel */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 h-fit">
            <h3 className="font-bold text-slate-800 text-xs tracking-tight uppercase">AI Scheduling Safeguards</h3>
            <div className="space-y-3 divide-y divide-slate-100 text-xs text-slate-600">
              <div className="pt-3 first:pt-0 space-y-1">
                <span className="font-bold text-slate-700">Subject teacher restriction</span>
                <p>Math/Science teachers cannot supervise their respective examinations (automatic filter).</p>
              </div>
              <div className="pt-3 space-y-1">
                <span className="font-bold text-slate-700">Staggered Class Layout (Rule 1-3)</span>
                <p>Ensures adjacent pupils belong to different standards and sections to mitigate copying risks.</p>
              </div>
              <div className="pt-3 space-y-1">
                <span className="font-bold text-slate-700">Clash Prevention Engine</span>
                <p>Verifies teachers are not assigned to multiple blocks or levels in identical timeframes.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === "seating" && (
        <div className="space-y-6">
          {/* Seating controls */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Target Exam Datesheet</label>
              <select
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64 cursor-pointer font-semibold"
              >
                {exams.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.subjectId} ({ex.name})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleGenerateSeating}
              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer w-full sm:w-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-pulse" />
              <span>Run Seating Optimizer</span>
            </button>
          </div>

          {/* Seating Layout Cards */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Interactive Room Seating Chart</h3>
            
            {seating.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Group by room */}
                {Array.from(new Set(seating.map((s) => s.roomNumber))).map((roomNo) => {
                  const roomSeats = seating.filter((s) => s.roomNumber === roomNo);
                  return (
                    <div key={roomNo} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <h4 className="font-bold text-sm text-slate-800">Room Hall {roomNo}</h4>
                        <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-150 px-2 py-0.5 rounded font-mono font-bold">
                          {roomSeats.length} Seats
                        </span>
                      </div>

                      {/* Seat grids (bento arrangement representation) */}
                      <div className="grid grid-cols-2 gap-2">
                        {roomSeats.map((seat) => (
                          <div
                            key={seat.id}
                            className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-center space-y-1 hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer group"
                          >
                            <div className="text-[9px] font-mono font-bold text-slate-400">Bench {seat.benchNumber} • {seat.seatPosition}</div>
                            <h5 className="font-bold text-xs text-slate-800 truncate group-hover:text-indigo-600">
                              {seat.studentName}
                            </h5>
                            <div className="flex items-center justify-center gap-1 text-[9px] font-mono font-bold">
                              <span className="text-slate-500">Roll {seat.rollNumber}</span>
                              <span className="bg-slate-200/50 text-slate-600 px-1 rounded">
                                {seat.class}-{seat.section}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Room details */}
                      <button
                        onClick={() => window.print()}
                        className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Room Slips</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 bg-white text-center rounded-xl border border-slate-200 text-slate-400 text-xs italic">
                Select an examination Datesheet above and run Seating Optimizer to populate seating grids.
              </div>
            )}
          </div>
        </div>
      )}

      {activeSubTab === "invigilation" && (
        <div className="space-y-6">
          {/* Invigilation header controls */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Target Datesheet</label>
              <select
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64 cursor-pointer font-semibold"
              >
                {exams.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.subjectId} ({ex.name})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleAssignInvigilators}
              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer w-full sm:w-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-300 fill-emerald-300 animate-pulse" />
              <span>Compile Invigilator Rosters</span>
            </button>
          </div>

          {/* Duties list */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                    <th className="py-4 px-6">Assigned invigilator</th>
                    <th className="py-4 px-6">Duty Room / Location</th>
                    <th className="py-4 px-6">Schedule Time Slot</th>
                    <th className="py-4 px-6">Academic Exam</th>
                    <th className="py-4 px-6 text-right">Emergency Substitutes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs font-sans text-slate-700">
                  {duties.length > 0 ? (
                    duties.map((duty) => (
                      <tr key={duty.id} className="hover:bg-slate-50/40 transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-bold text-slate-800 text-sm">{duty.teacherName}</div>
                          <div className="text-[10px] text-slate-400 font-mono font-medium uppercase tracking-wider mt-0.5">ID: {duty.teacherId}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-1 font-bold text-slate-800">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>Room {duty.roomNumber}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono font-semibold uppercase tracking-wider mt-0.5">
                            {duty.blockName}, Floor {duty.floor}
                          </div>
                        </td>
                        <td className="py-4 px-6 font-mono font-semibold text-slate-700">
                          <div>{duty.date}</div>
                          <div className="text-[10px] text-slate-400 font-normal mt-0.5">{duty.timeSlot}</div>
                        </td>
                        <td className="py-4 px-6 font-semibold text-slate-700">
                          {duty.examName}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleOpenSubstitute(duty)}
                            className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-semibold border border-rose-100 transition-colors cursor-pointer inline-flex items-center gap-1"
                          >
                            <ShieldAlert className="w-3.5 h-3.5" />
                            <span>Absent replacement</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400 font-sans italic">
                        Select datesheet above and compile invigilator rosters to allocate supervision tasks.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Replacement substitute drawer */}
      {showSubstituteModal && targetDuty && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-5 border-b border-slate-150 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600 animate-pulse" />
                <h3 className="font-bold text-slate-800 text-sm tracking-tight uppercase">Emergency Standby Finder</h3>
              </div>
              <button
                onClick={() => setShowSubstituteModal(false)}
                className="p-1 text-slate-400 hover:bg-slate-150 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Absentee Target</span>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                  Replacing <strong className="text-slate-800">{targetDuty.teacherName}</strong> in Room {targetDuty.roomNumber} ({targetDuty.blockName})
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Recommended Standby Candidates</span>
                
                {availableSubstitutes.length > 0 ? (
                  <div className="space-y-2">
                    {availableSubstitutes.map((sub) => (
                      <div
                        key={sub.id}
                        className="p-3 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg flex justify-between items-center transition-all"
                      >
                        <div>
                          <div className="font-bold text-xs text-slate-800">{sub.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono font-semibold uppercase tracking-wider mt-0.5">
                            Pref Block: {sub.preferredBlock} • Subject: {sub.subject}
                          </div>
                        </div>
                        <button
                          onClick={() => handleAssignSubstitute(sub)}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-bold shadow-sm transition-colors cursor-pointer"
                        >
                          Assign duty
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 border border-dashed border-slate-200 text-center text-xs text-slate-400 italic">
                    No standby teachers are currently free or qualified. Try overriding manually.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Exam Modal */}
      {showExamModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-150 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 text-sm tracking-tight uppercase">Create Datesheet Exam Slot</h3>
              <button
                onClick={() => setShowExamModal(false)}
                className="p-1 text-slate-400 hover:bg-slate-150 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleExamSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Examination Title</label>
                <input
                  type="text"
                  required
                  value={examFields.name}
                  onChange={(e) => setExamFields({ ...examFields, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. Mid-Term Examination"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Exam Subject Target</label>
                <select
                  value={examFields.subjectId}
                  onChange={(e) => setExamFields({ ...examFields, subjectId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="General Science">General Science</option>
                  <option value="English Literature">English Literature</option>
                  <option value="Social Science">Social Science</option>
                  <option value="Computer Application">Computer Application</option>
                  <option value="Kannada Language">Kannada Language</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Date scheduled</label>
                  <input
                    type="date"
                    required
                    value={examFields.date}
                    onChange={(e) => setExamFields({ ...examFields, date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono font-medium bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    value={examFields.duration}
                    onChange={(e) => setExamFields({ ...examFields, duration: parseInt(e.target.value) || 180 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono font-medium bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Start Time</label>
                  <input
                    type="time"
                    required
                    value={examFields.startTime}
                    onChange={(e) => setExamFields({ ...examFields, startTime: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono font-medium bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">End Time</label>
                  <input
                    type="time"
                    required
                    value={examFields.endTime}
                    onChange={(e) => setExamFields({ ...examFields, endTime: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono font-medium bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-150 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowExamModal(false)}
                  className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                >
                  Save Datesheet Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
