/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  School,
  BookOpen,
  Building2,
  Clock,
  UploadCloud,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  FileSpreadsheet,
  AlertCircle,
  Eye,
  Key,
  Download,
  Printer,
  Sparkles,
  Info
} from "lucide-react";
import { hashPassword } from "../utils/security";
import { auth, db, doc, setDoc, updateDoc, collection } from "../firebase";
import { query, where, getDocs } from "firebase/firestore";

interface RegistrationWizardProps {
  onRegisterComplete: (registeredData: any) => void;
  onCancel: () => void;
  onSwitchToLogin?: () => void;
}

export default function RegistrationWizard({ onRegisterComplete, onCancel, onSwitchToLogin }: RegistrationWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Step 1: School Information ---
  const [schoolName, setSchoolName] = useState("Springdale Academy");
  const [udiseNumber, setUdiseNumber] = useState("29140301234");
  const [schoolType, setSchoolType] = useState("Private"); // Government, Private, Aided, Other
  const [schoolAddress, setSchoolAddress] = useState("102, Palace Road");
  const [city, setCity] = useState("Bangalore");
  const [taluk, setTaluk] = useState("North Taluk");
  const [district, setDistrict] = useState("Bangalore Urban");
  const [state, setState] = useState("Karnataka");
  const [pinCode, setPinCode] = useState("560001");
  const [schoolEmail, setSchoolEmail] = useState("admin@springdale.edu");
  const [schoolPhone, setSchoolPhone] = useState("08022345678");
  const [principalName, setPrincipalName] = useState("Dr. Arthur Pendelton");

  // --- Step 2: Academic Information ---
  const [academicYear, setAcademicYear] = useState("2026-2027");
  const [workingDays, setWorkingDays] = useState<string[]>([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday"
  ]);
  const [availableClasses, setAvailableClasses] = useState<string[]>([
    "6", "7", "8", "9", "10"
  ]);
  const [availableSections, setAvailableSections] = useState<string[]>([
    "A", "B", "C"
  ]);
  const [totalStudents, setTotalStudents] = useState(1200);
  const [totalTeachers, setTotalTeachers] = useState(75);
  const [totalNonTeaching, setTotalNonTeaching] = useState(12);

  // Temporary inputs for classes & sections
  const [newClassInput, setNewClassInput] = useState("");
  const [newSectionInput, setNewSectionInput] = useState("");

  // --- Step 3: Infrastructure ---
  const [totalBlocks, setTotalBlocks] = useState(2);
  const [totalFloors, setTotalFloors] = useState(3);
  const [totalRooms, setTotalRooms] = useState(15);
  const [totalExamHalls, setTotalExamHalls] = useState(2);
  const [benchesPerRoom, setBenchesPerRoom] = useState(20);
  const [studentsPerBench, setStudentsPerBench] = useState(2);
  const [computerLabs, setComputerLabs] = useState(1);
  const [scienceLabs, setScienceLabs] = useState(2);
  const [libraryCount, setLibraryCount] = useState(1);
  const [staffRooms, setStaffRooms] = useState(2);

  // --- Step 4: School Timings ---
  const [schoolStartTime, setSchoolStartTime] = useState("08:30");
  const [schoolEndTime, setSchoolEndTime] = useState("15:30");
  const [assemblyTime, setAssemblyTime] = useState("08:30");
  const [assemblyDuration, setAssemblyDuration] = useState(15);
  const [periodDuration, setPeriodDuration] = useState(40);
  const [periodsCount, setPeriodsCount] = useState(8);
  const [recessTime, setRecessTime] = useState("10:30");
  const [recessDuration, setRecessDuration] = useState(15);
  const [lunchStartTime, setLunchStartTime] = useState("12:15");
  const [lunchDuration, setLunchDuration] = useState(45);
  const [afternoonRecessTime, setAfternoonRecessTime] = useState("14:20");
  const [afternoonRecessDuration, setAfternoonRecessDuration] = useState(10);
  const [saturdayWorking, setSaturdayWorking] = useState(false);
  const [saturdayStartTime, setSaturdayStartTime] = useState("08:30");
  const [saturdayEndTime, setSaturdayEndTime] = useState("12:30");
  const [saturdayPeriodDuration, setSaturdayPeriodDuration] = useState(35);
  const [saturdayPeriodsCount, setSaturdayPeriodsCount] = useState(4);

  // --- Step 5: Upload Data & Preview ---
  const [uploadedFiles, setUploadedFiles] = useState<{
    students: boolean;
    teachers: boolean;
    subjects: boolean;
    rooms: boolean;
  }>({
    students: false,
    teachers: false,
    subjects: false,
    rooms: false
  });
  const [previewData, setPreviewData] = useState<{
    type: string;
    headers: string[];
    rows: any[];
  } | null>(null);

  // Simulated static CSV/Excel templates parsed data
  const sampleData = {
    students: {
      headers: ["Roll No", "Admission No", "Student Name", "Class", "Section", "Gender", "Parent Mobile"],
      rows: [
        ["101", "ADM-2026-001", "Karan Sharma", "6", "A", "Male", "9876543210"],
        ["102", "ADM-2026-002", "Sneha Patil", "6", "A", "Female", "9812345670"],
        ["103", "ADM-2026-003", "Aman Verma", "6", "B", "Male", "9765432101"],
        ["104", "ADM-2026-004", "Pooja Hegde", "7", "A", "Female", "9012345678"]
      ]
    },
    teachers: {
      headers: ["Emp ID", "Teacher Name", "Primary Subject", "Department", "Max Periods/Day", "Contact"],
      rows: [
        ["T-501", "Dr. Vance", "Mathematics", "Sciences", "6", "9876500111"],
        ["T-502", "Mrs. Alisha", "English Literature", "Languages", "6", "9876500222"],
        ["T-503", "Mr. George", "Computer Science", "Technology", "5", "9876500333"],
        ["T-504", "Dr. Pendelton", "Physics", "Sciences", "4", "9876500444"]
      ]
    },
    subjects: {
      headers: ["Subject Code", "Subject Name", "Weekly Periods", "Is Theory", "Lab Required"],
      rows: [
        ["MTH-101", "Mathematics", "6", "Yes", "No"],
        ["ENG-102", "English", "5", "Yes", "No"],
        ["SCI-103", "General Science", "6", "Yes", "Yes"],
        ["COMP-104", "Computer Lab", "4", "No", "Yes"]
      ]
    },
    rooms: {
      headers: ["Room Number", "Block Name", "Floor Level", "Total Capacity", "Benches Count", "Is Smart Room"],
      rows: [
        ["R-101", "Main Block", "1", "40", "20", "Yes"],
        ["R-102", "Main Block", "1", "40", "20", "No"],
        ["R-201", "Science Wing", "2", "30", "15", "Yes"],
        ["R-202", "Science Wing", "2", "30", "15", "Yes"]
      ]
    }
  };

  // --- Step 7: Completed State ---
  const [regResult, setRegResult] = useState<{
    schoolName: string;
    regNumber: string;
    username: string;
    defaultPassword: string;
    academicYear: string;
  } | null>(null);

  const stepsList = [
    { num: 1, label: "School Info", icon: School },
    { num: 2, label: "Academic Info", icon: BookOpen },
    { num: 3, label: "Infrastructure", icon: Building2 },
    { num: 4, label: "Timings", icon: Clock },
    { num: 5, label: "Data Import", icon: UploadCloud },
    { num: 6, label: "Review & Submit", icon: CheckCircle }
  ];

  // Extraction of School Name Initials
  const extractInitials = (name: string): string => {
    const cleanName = name.replace(/\b(and|of|the|for|in|on|at|a|an|school|academy|college|institute|higher|secondary|primary)\b/gi, "");
    const words = cleanName.match(/\b(\w)/g) || [];
    let initials = words.join("").toUpperCase();
    if (initials.length < 2) {
      initials = (name.substring(0, 3) || "SCH").toUpperCase();
    }
    return initials.substring(0, 5);
  };

  const handleNext = async () => {
    setErrorMsg(null);

    if (currentStep === 1) {
      if (!schoolName.trim()) {
        setErrorMsg("School Name is required.");
        return;
      }
      if (!udiseNumber.trim()) {
        setErrorMsg("UDISE Number is required.");
        return;
      }
      
      setIsSubmitting(true);
      try {
        const schoolsRef = collection(db, "schools");
        const q = query(schoolsRef, where("udiseNumber", "==", udiseNumber.trim()));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setErrorMsg("A school with this UDISE Number is already registered.");
          setIsSubmitting(false);
          return;
        }
      } catch (err: any) {
        console.error("Error checking UDISE uniqueness:", err);
      } finally {
        setIsSubmitting(false);
      }
    }

    if (currentStep === 2) {
      if (availableClasses.length === 0) {
        setErrorMsg("Please select or add at least one Class.");
        return;
      }
      if (availableSections.length === 0) {
        setErrorMsg("Please select or add at least one Section.");
        return;
      }
    }

    if (currentStep === 4) {
      // Basic timing logic validation
      if (schoolStartTime >= schoolEndTime) {
        setErrorMsg("School Start Time must be before End Time.");
        return;
      }
    }

    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setErrorMsg(null);
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleAddClass = () => {
    if (!newClassInput.trim()) return;
    if (availableClasses.includes(newClassInput.trim())) {
      setNewClassInput("");
      return;
    }
    setAvailableClasses([...availableClasses, newClassInput.trim()].sort((a, b) => {
      const numA = parseInt(a);
      const numB = parseInt(b);
      if (isNaN(numA) || isNaN(numB)) return a.localeCompare(b);
      return numA - numB;
    }));
    setNewClassInput("");
  };

  const handleAddSection = () => {
    if (!newSectionInput.trim()) return;
    const uppercaseSec = newSectionInput.trim().toUpperCase();
    if (availableSections.includes(uppercaseSec)) {
      setNewSectionInput("");
      return;
    }
    setAvailableSections([...availableSections, uppercaseSec].sort());
    setNewSectionInput("");
  };

  const handleRemoveClass = (cls: string) => {
    setAvailableClasses(availableClasses.filter((c) => c !== cls));
  };

  const handleRemoveSection = (sec: string) => {
    setAvailableSections(availableSections.filter((s) => s !== sec));
  };

  const handleToggleDay = (day: string) => {
    if (workingDays.includes(day)) {
      setWorkingDays(workingDays.filter((d) => d !== day));
    } else {
      setWorkingDays([...workingDays, day]);
    }
  };

  const handleSimulateUpload = (type: "students" | "teachers" | "subjects" | "rooms") => {
    setUploadedFiles({ ...uploadedFiles, [type]: true });
    setPreviewData({
      type: type.toUpperCase(),
      headers: sampleData[type].headers,
      rows: sampleData[type].rows
    });
  };

  const handlePopulateAllSamples = () => {
    setUploadedFiles({
      students: true,
      teachers: true,
      subjects: true,
      rooms: true
    });
    setPreviewData({
      type: "STUDENTS (AI ASSISTED CODES)",
      headers: sampleData.students.headers,
      rows: sampleData.students.rows
    });
    setErrorMsg(null);
  };

  // Final Submission & School Registration Number generation
  const handleSubmitRegistration = async () => {
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const trimmedUdise = udiseNumber.trim();
      if (!trimmedUdise) {
        setErrorMsg("UDISE Number is required.");
        setIsSubmitting(false);
        return;
      }

      // Re-verify duplicate UDISE at submit
      const schoolsRef = collection(db, "schools");
      const q = query(schoolsRef, where("udiseNumber", "==", trimmedUdise));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setErrorMsg("A school with this UDISE Number is already registered.");
        setCurrentStep(1);
        setIsSubmitting(false);
        return;
      }

      // Generate unique Registration number based on total registered schools count
      const allSchoolsSnapshot = await getDocs(schoolsRef);
      const lastNum = allSchoolsSnapshot.size;
      const initials = extractInitials(schoolName);
      const paddedNum = String(lastNum + 1).padStart(6, "0");
      const regNum = `${initials}-${paddedNum}`;

      const user = auth.currentUser;
      if (!user) {
        setErrorMsg("You must be authenticated to register a school.");
        setIsSubmitting(false);
        return;
      }

      // Generate school ref and ID
      const schoolRef = doc(collection(db, "schools"));
      const schoolId = schoolRef.id;

      const schoolProfile = {
        schoolId,
        regNumber: regNum,
        registrationNumber: regNum,
        schoolName: schoolName.trim(),
        udiseNumber: trimmedUdise,
        schoolType,
        schoolAddress: schoolAddress.trim(),
        city: city.trim(),
        taluk: taluk.trim(),
        district: district.trim(),
        state: state.trim(),
        pinCode: pinCode.trim(),
        schoolEmail: schoolEmail.trim(),
        schoolPhone: schoolPhone.trim(),
        address: {
          schoolAddress: schoolAddress.trim(),
          city: city.trim(),
          taluk: taluk.trim(),
          district: district.trim(),
          state: state.trim(),
          pinCode: pinCode.trim(),
          schoolEmail: schoolEmail.trim(),
          schoolPhone: schoolPhone.trim()
        },
        principalName: principalName.trim(),
        timings: {
          schoolStartTime,
          schoolEndTime,
          assemblyTime,
          assemblyDuration,
          periodDuration,
          periodsCount,
          recessTime,
          recessDuration,
          lunchStartTime,
          lunchDuration,
          afternoonRecessTime,
          afternoonRecessDuration,
          saturdayWorking,
          saturdayStartTime,
          saturdayEndTime,
          saturdayPeriodDuration,
          saturdayPeriodsCount
        },
        infrastructure: {
          totalBlocks,
          totalFloors,
          totalRooms,
          totalExamHalls,
          benchesPerRoom,
          studentsPerBench,
          computerLabs,
          scienceLabs,
          libraryCount,
          staffRooms
        },
        academicYear,
        workingDays,
        classes: availableClasses,
        availableClasses,
        sections: availableSections,
        availableSections,
        totalStudents,
        totalTeachers,
        totalNonTeaching,
        createdBy: user.uid,
        createdAt: new Date().toISOString()
      };

      // Save school to Firestore
      await setDoc(schoolRef, schoolProfile);

      // Update user doc with this schoolId
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        schoolId: schoolId
      });

      // Clear session & set completed response
      setRegResult({
        schoolName: schoolName.trim(),
        regNumber: regNum,
        username: regNum,
        defaultPassword: "No password required (signed in with Google / Email Link)",
        academicYear
      });

      // Callback to register completion with school data
      onRegisterComplete(schoolProfile);

      setCurrentStep(7);
    } catch (err: any) {
      console.error("Error creating school profile:", err);
      setErrorMsg(err.message || "Could not register your school profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadReceipt = () => {
    if (!regResult) return;
    const content = `SJ SCHEDULER AI - REGISTRATION RECEIPT\n` +
      `===========================================\n` +
      `Date: ${new Date().toLocaleDateString()}\n` +
      `School Name: ${regResult.schoolName}\n` +
      `Registration Number: ${regResult.regNumber}\n` +
      `Username: ${regResult.username}\n` +
      `Default Password: ${regResult.defaultPassword}\n` +
      `Academic Year: ${regResult.academicYear}\n\n` +
      `Please log in using your credentials and change your default password immediately.`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${regResult.regNumber}_registration_receipt.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (currentStep === 7 && regResult) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center p-6 text-slate-200 selection:bg-indigo-600 selection:text-white">
        <style>{`
          .reg-glass-input {
            background-color: rgba(15, 23, 42, 0.4) !important;
            border-color: rgba(255, 255, 255, 0.08) !important;
            color: #ffffff !important;
          }
          .reg-glass-input::placeholder {
            color: #475569 !important;
          }
          .reg-glass-label {
            color: #94a3b8 !important;
          }
          .reg-glass-text-muted {
            color: #64748b !important;
          }
          .reg-glass-card {
            background-color: rgba(15, 23, 42, 0.5) !important;
            border-color: rgba(255, 255, 255, 0.1) !important;
          }
        `}</style>
        <div className="w-full max-w-xl bg-slate-900/50 border border-white/10 rounded-2xl shadow-2xl p-8 space-y-6 text-center backdrop-blur-xl">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black tracking-tight text-white">🎉 School Registered Successfully!</h1>
            <p className="text-xs text-slate-400 font-medium max-w-sm mx-auto">
              Your official credentials have been compiled. Please store this receipt securely before proceeding.
            </p>
          </div>

          {/* Receipt Card */}
          <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-6 text-left space-y-4 font-mono relative overflow-hidden">
            <div className="absolute right-0 top-0 bg-emerald-500/10 border-l border-b border-emerald-500/20 text-emerald-400 text-[8px] font-black tracking-widest px-2.5 py-1 uppercase">
              CONFIRMED
            </div>

            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between border-b border-dashed border-slate-800 pb-2">
                <span className="font-sans font-bold text-slate-500">School Name:</span>
                <span className="font-semibold text-white text-right">{regResult.schoolName}</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-slate-800 py-2">
                <span className="font-sans font-bold text-slate-500">Registration ID:</span>
                <span className="font-semibold text-indigo-400">{regResult.regNumber}</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-slate-800 py-2">
                <span className="font-sans font-bold text-slate-500">Username:</span>
                <span className="font-semibold text-white bg-slate-800 px-1.5 py-0.5 rounded text-[11px]">{regResult.username}</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-slate-800 py-2">
                <span className="font-sans font-bold text-slate-500">Default Password:</span>
                <span className="font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded text-[11px]">{regResult.defaultPassword}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="font-sans font-bold text-slate-500">Academic Session:</span>
                <span className="font-semibold text-white">{regResult.academicYear}</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-left flex gap-3">
            <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <p className="text-[10px] text-indigo-300 leading-relaxed font-medium">
              <strong>Security Protocol:</strong> Your default password is set to your UDISE Number. You will be prompted to replace this with a secure password upon your very first login attempt.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleDownloadReceipt}
              className="px-4 py-2.5 border border-slate-800 hover:bg-slate-900 text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Receipt</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 border border-slate-800 hover:bg-slate-900 text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Credentials</span>
            </button>
          </div>

          <button
            onClick={() => onRegisterComplete(regResult)}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/35 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Login Now & Change Password</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center py-12 px-6 text-slate-200 selection:bg-indigo-600 selection:text-white registration-wizard-glass">
      <style>{`
        .registration-wizard-glass label {
          color: #94a3b8 !important;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .registration-wizard-glass input, 
        .registration-wizard-glass select, 
        .registration-wizard-glass textarea {
          background-color: rgba(15, 23, 42, 0.4) !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          color: #ffffff !important;
          outline: none !important;
        }
        .registration-wizard-glass input:focus, 
        .registration-wizard-glass select:focus {
          border-color: rgba(99, 102, 241, 0.6) !important;
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2) !important;
        }
        .registration-wizard-glass h2,
        .registration-wizard-glass h3 {
          color: #ffffff !important;
        }
        .registration-wizard-glass p {
          color: #94a3b8 !important;
        }
        .registration-wizard-glass .bg-slate-50 {
          background-color: rgba(15, 23, 42, 0.2) !important;
          border-color: rgba(255, 255, 255, 0.05) !important;
        }
        .registration-wizard-glass .bg-white {
          background-color: rgba(15, 23, 42, 0.4) !important;
          border-color: rgba(255, 255, 255, 0.08) !important;
        }
        .registration-wizard-glass .text-slate-900,
        .registration-wizard-glass .text-slate-800,
        .registration-wizard-glass .text-slate-700 {
          color: #f1f5f9 !important;
        }
        .registration-wizard-glass .text-slate-500,
        .registration-wizard-glass .text-slate-400 {
          color: #94a3b8 !important;
        }
        .registration-wizard-glass .border-slate-200,
        .registration-wizard-glass .border-slate-100 {
          border-color: rgba(255, 255, 255, 0.08) !important;
        }
        .registration-wizard-glass .bg-indigo-50 {
          background-color: rgba(99, 102, 241, 0.1) !important;
          border-color: rgba(99, 102, 241, 0.2) !important;
        }
        .registration-wizard-glass .text-indigo-700 {
          color: #818cf8 !important;
        }
      `}</style>
      <div className="w-full max-w-4xl bg-slate-900/50 border border-white/10 rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden min-h-[620px] backdrop-blur-xl">
        
        {/* Left Column - Progress Tracker */}
        <div className="md:w-1/3 bg-slate-950/70 text-white p-8 flex flex-col justify-between border-r border-white/5">
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-6 border-b border-white/5">
              <img
                src="https://i.ibb.co/fGyH2Tck/SJ-Schedular-AI-Logo.png"
                alt="SJ Scheduler AI Logo"
                className="w-8 h-8 object-contain rounded-lg shadow-md shadow-indigo-600/35"
                referrerPolicy="no-referrer"
              />
              <div>
                <span className="font-extrabold text-sm text-white block">SJ Scheduler AI</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Institution Setup</span>
              </div>
            </div>

            <div className="space-y-4">
              {stepsList.map((st) => {
                const Icon = st.icon;
                const isActive = currentStep === st.num;
                const isPassed = currentStep > st.num;

                return (
                  <div key={st.num} className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-lg border flex items-center justify-center text-xs font-bold transition-all ${
                      isActive ? "bg-indigo-600 border-indigo-500 text-white" :
                      isPassed ? "bg-slate-800 border-slate-700 text-indigo-400" :
                      "bg-slate-900 border-slate-800 text-slate-500"
                    }`}>
                      {isPassed ? <CheckCircle className="w-4 h-4" /> : st.num}
                    </div>
                    <div className="text-left">
                      <p className={`text-[11px] font-bold tracking-tight uppercase ${isActive ? "text-white" : isPassed ? "text-slate-300" : "text-slate-500"}`}>
                        {st.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] text-slate-400 font-medium">Establishing local workspace environment</span>
          </div>
        </div>

        {/* Right Column - Form Steps Content */}
        <div className="flex-1 p-8 flex flex-col justify-between space-y-6 overflow-y-auto max-h-[75vh]">
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <span className="text-[9px] font-extrabold text-indigo-600 uppercase tracking-widest block">Step {currentStep} of 6</span>
                <h2 className="text-lg font-black tracking-tight text-slate-900">
                  {currentStep === 1 && "Basic School Information"}
                  {currentStep === 2 && "Academic & Student Roster Size"}
                  {currentStep === 3 && "Infrastructure Map"}
                  {currentStep === 4 && "Timing Parameters"}
                  {currentStep === 5 && "Upload Initial Database"}
                  {currentStep === 6 && "Verify & Finalize"}
                </h2>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {onSwitchToLogin && (
                  <>
                    <button
                      type="button"
                      onClick={onSwitchToLogin}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-bold cursor-pointer transition-colors"
                    >
                      Sign In instead
                    </button>
                    <span className="text-slate-700 select-none">|</span>
                  </>
                )}
                <button
                  type="button"
                  onClick={onCancel}
                  className="text-xs text-slate-400 hover:text-slate-300 font-bold cursor-pointer transition-colors"
                >
                  Exit Setup
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-100 text-rose-800 rounded-xl flex items-start gap-2 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* --- STEP 1: SCHOOL INFO --- */}
            {currentStep === 1 && (
              <div className="space-y-4 text-xs">
                {onSwitchToLogin && (
                  <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-medium text-left">
                    <span className="text-slate-300">Already registered your institution or have credentials?</span>
                    <button
                      type="button"
                      onClick={onSwitchToLogin}
                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-bold shadow-md shadow-indigo-600/10 transition-all cursor-pointer whitespace-nowrap self-start sm:self-center"
                    >
                      Sign In to Console
                    </button>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">School Name *</label>
                    <input
                      type="text"
                      required
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                      placeholder="e.g. JSS Higher Primary School"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">UDISE Number *</label>
                    <input
                      type="text"
                      required
                      maxLength={11}
                      value={udiseNumber}
                      onChange={(e) => setUdiseNumber(e.target.value.replace(/\D/g, ""))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50 font-mono"
                      placeholder="e.g. 29140301234"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">School Type</label>
                    <select
                      value={schoolType}
                      onChange={(e) => setSchoolType(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                    >
                      <option value="Government">Government</option>
                      <option value="Private">Private</option>
                      <option value="Aided">Aided</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Principal / Headmaster Name</label>
                    <input
                      type="text"
                      value={principalName}
                      onChange={(e) => setPrincipalName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                      placeholder="e.g. Dr. Arthur Pendelton"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">School Address</label>
                  <input
                    type="text"
                    value={schoolAddress}
                    onChange={(e) => setSchoolAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                    placeholder="e.g. 102, Palace Road"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Village/City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                      placeholder="e.g. Bangalore"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Taluk</label>
                    <input
                      type="text"
                      value={taluk}
                      onChange={(e) => setTaluk(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                      placeholder="e.g. North Taluk"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">District</label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                      placeholder="e.g. Bangalore Urban"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">PIN Code</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ""))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50 font-mono"
                      placeholder="e.g. 560001"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">State</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                      placeholder="Karnataka"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Official Email</label>
                    <input
                      type="email"
                      value={schoolEmail}
                      onChange={(e) => setSchoolEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50 font-mono"
                      placeholder="admin@springdale.edu"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={schoolPhone}
                      onChange={(e) => setSchoolPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50 font-mono"
                      placeholder="08022345678"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* --- STEP 2: ACADEMIC INFO --- */}
            {currentStep === 2 && (
              <div className="space-y-5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Academic Year</label>
                    <input
                      type="text"
                      value={academicYear}
                      onChange={(e) => setAcademicYear(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-mono"
                      placeholder="e.g. 2026-2027"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total Students</label>
                    <input
                      type="number"
                      value={totalStudents}
                      onChange={(e) => setTotalStudents(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total Teachers</label>
                    <input
                      type="number"
                      value={totalTeachers}
                      onChange={(e) => setTotalTeachers(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Non-Teaching Staff</label>
                    <input
                      type="number"
                      value={totalNonTeaching}
                      onChange={(e) => setTotalNonTeaching(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50"
                    />
                  </div>
                </div>

                {/* Working Days */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">School Operating Days</label>
                  <div className="flex flex-wrap gap-2">
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => {
                      const selected = workingDays.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => handleToggleDay(day)}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                            selected ? "bg-indigo-600 border-indigo-600 text-white" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Available Classes */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Classes Available</label>
                  <div className="flex flex-wrap gap-1.5 p-3 border border-slate-200 rounded-xl bg-slate-50 min-h-[48px]">
                    {availableClasses.map((cls) => (
                      <span key={cls} className="inline-flex items-center gap-1 bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-bold text-slate-700">
                        <span>Class {cls}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveClass(cls)}
                          className="p-0.5 text-slate-400 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {availableClasses.length === 0 && <span className="text-slate-400 italic">No classes selected. Add classes below.</span>}
                  </div>
                  <div className="flex gap-2 max-w-xs">
                    <input
                      type="text"
                      placeholder="e.g. 11 or XII"
                      value={newClassInput}
                      onChange={(e) => setNewClassInput(e.target.value)}
                      className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs flex-1"
                    />
                    <button
                      type="button"
                      onClick={handleAddClass}
                      className="px-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 text-xs font-bold"
                    >
                      Add Class
                    </button>
                  </div>
                </div>

                {/* Available Sections */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Sections Available</label>
                  <div className="flex flex-wrap gap-1.5 p-3 border border-slate-200 rounded-xl bg-slate-50 min-h-[48px]">
                    {availableSections.map((sec) => (
                      <span key={sec} className="inline-flex items-center gap-1 bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-bold text-slate-700">
                        <span>Section {sec}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSection(sec)}
                          className="p-0.5 text-slate-400 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {availableSections.length === 0 && <span className="text-slate-400 italic">No sections added. Add sections below.</span>}
                  </div>
                  <div className="flex gap-2 max-w-xs">
                    <input
                      type="text"
                      placeholder="e.g. D"
                      maxLength={3}
                      value={newSectionInput}
                      onChange={(e) => setNewSectionInput(e.target.value)}
                      className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs flex-1 uppercase"
                    />
                    <button
                      type="button"
                      onClick={handleAddSection}
                      className="px-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 text-xs font-bold"
                    >
                      Add Sec
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* --- STEP 3: INFRASTRUCTURE --- */}
            {currentStep === 3 && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total Blocks</label>
                    <input
                      type="number"
                      value={totalBlocks}
                      onChange={(e) => setTotalBlocks(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total Floors</label>
                    <input
                      type="number"
                      value={totalFloors}
                      onChange={(e) => setTotalFloors(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total Rooms</label>
                    <input
                      type="number"
                      value={totalRooms}
                      onChange={(e) => setTotalRooms(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total Examination Halls</label>
                    <input
                      type="number"
                      value={totalExamHalls}
                      onChange={(e) => setTotalExamHalls(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Benches Per Room</label>
                    <input
                      type="number"
                      value={benchesPerRoom}
                      onChange={(e) => setBenchesPerRoom(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Students Per Bench</label>
                    <input
                      type="number"
                      value={studentsPerBench}
                      onChange={(e) => setStudentsPerBench(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Computer Labs</label>
                    <input
                      type="number"
                      value={computerLabs}
                      onChange={(e) => setComputerLabs(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Science Labs</label>
                    <input
                      type="number"
                      value={scienceLabs}
                      onChange={(e) => setScienceLabs(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Libraries</label>
                    <input
                      type="number"
                      value={libraryCount}
                      onChange={(e) => setLibraryCount(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Staff Rooms</label>
                    <input
                      type="number"
                      value={staffRooms}
                      onChange={(e) => setStaffRooms(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* --- STEP 4: TIMINGS --- */}
            {currentStep === 4 && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">School Start Time</label>
                    <input
                      type="time"
                      value={schoolStartTime}
                      onChange={(e) => setSchoolStartTime(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">School End Time</label>
                    <input
                      type="time"
                      value={schoolEndTime}
                      onChange={(e) => setSchoolEndTime(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Assembly Start</label>
                    <input
                      type="time"
                      value={assemblyTime}
                      onChange={(e) => setAssemblyTime(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Assembly Duration (mins)</label>
                    <input
                      type="number"
                      value={assemblyDuration}
                      onChange={(e) => setAssemblyDuration(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Period Duration (mins)</label>
                    <input
                      type="number"
                      value={periodDuration}
                      onChange={(e) => setPeriodDuration(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Number of Periods</label>
                    <input
                      type="number"
                      value={periodsCount}
                      onChange={(e) => setPeriodsCount(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Morning Recess Start</label>
                    <input
                      type="time"
                      value={recessTime}
                      onChange={(e) => setRecessTime(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Recess Mins</label>
                    <input
                      type="number"
                      value={recessDuration}
                      onChange={(e) => setRecessDuration(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Lunch Start Time</label>
                    <input
                      type="time"
                      value={lunchStartTime}
                      onChange={(e) => setLunchStartTime(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Lunch Duration (mins)</label>
                    <input
                      type="number"
                      value={lunchDuration}
                      onChange={(e) => setLunchDuration(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Afternoon Recess (Optional)</label>
                    <input
                      type="time"
                      value={afternoonRecessTime}
                      onChange={(e) => setAfternoonRecessTime(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Afternoon Recess Mins</label>
                    <input
                      type="number"
                      value={afternoonRecessDuration}
                      onChange={(e) => setAfternoonRecessDuration(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50"
                    />
                  </div>
                </div>

                {/* Saturday Settings */}
                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Saturday Operational Day?</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSaturdayWorking(true);
                          if (!workingDays.includes("Saturday")) setWorkingDays([...workingDays, "Saturday"]);
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          saturdayWorking ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSaturdayWorking(false);
                          setWorkingDays(workingDays.filter((d) => d !== "Saturday"));
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          !saturdayWorking ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        No
                      </button>
                    </div>
                  </div>

                  {saturdayWorking && (
                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl grid grid-cols-1 sm:grid-cols-4 gap-4 animate-fadeIn">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Sat Start Time</label>
                        <input
                          type="time"
                          value={saturdayStartTime}
                          onChange={(e) => setSaturdayStartTime(e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Sat End Time</label>
                        <input
                          type="time"
                          value={saturdayEndTime}
                          onChange={(e) => setSaturdayEndTime(e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Sat Period Mins</label>
                        <input
                          type="number"
                          value={saturdayPeriodDuration}
                          onChange={(e) => setSaturdayPeriodDuration(Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Sat Periods Count</label>
                        <input
                          type="number"
                          value={saturdayPeriodsCount}
                          onChange={(e) => setSaturdayPeriodsCount(Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* --- STEP 5: UPLOAD DATA --- */}
            {currentStep === 5 && (
              <div className="space-y-5 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Upload Datasets or Populate AI Samples</span>
                  <button
                    type="button"
                    onClick={handlePopulateAllSamples}
                    className="px-2.5 py-1 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Generate Realistic AI Sample Databases</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Students Upload */}
                  <div className="p-4 border border-slate-200 rounded-xl space-y-3 bg-slate-50">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        <FileSpreadsheet className="w-4 h-4 text-blue-500" />
                        <span>Students Registry (.xlsx / CSV)</span>
                      </span>
                      {uploadedFiles.students && <span className="text-[10px] bg-emerald-50 border border-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md font-bold">READY</span>}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSimulateUpload("students")}
                      className="w-full py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <UploadCloud className="w-4 h-4 text-slate-400" />
                      <span>{uploadedFiles.students ? "Replace Dataset File" : "Choose / Drop Excel or CSV"}</span>
                    </button>
                  </div>

                  {/* Teachers Upload */}
                  <div className="p-4 border border-slate-200 rounded-xl space-y-3 bg-slate-50">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        <FileSpreadsheet className="w-4 h-4 text-indigo-500" />
                        <span>Faculty Rosters (.xlsx / CSV)</span>
                      </span>
                      {uploadedFiles.teachers && <span className="text-[10px] bg-emerald-50 border border-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md font-bold">READY</span>}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSimulateUpload("teachers")}
                      className="w-full py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <UploadCloud className="w-4 h-4 text-slate-400" />
                      <span>{uploadedFiles.teachers ? "Replace Dataset File" : "Choose / Drop Excel or CSV"}</span>
                    </button>
                  </div>

                  {/* Subjects Upload */}
                  <div className="p-4 border border-slate-200 rounded-xl space-y-3 bg-slate-50">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        <FileSpreadsheet className="w-4 h-4 text-amber-500" />
                        <span>Subjects Matrix (.xlsx / CSV)</span>
                      </span>
                      {uploadedFiles.subjects && <span className="text-[10px] bg-emerald-50 border border-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md font-bold">READY</span>}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSimulateUpload("subjects")}
                      className="w-full py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <UploadCloud className="w-4 h-4 text-slate-400" />
                      <span>{uploadedFiles.subjects ? "Replace Dataset File" : "Choose / Drop Excel or CSV"}</span>
                    </button>
                  </div>

                  {/* Rooms Upload */}
                  <div className="p-4 border border-slate-200 rounded-xl space-y-3 bg-slate-50">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        <FileSpreadsheet className="w-4 h-4 text-rose-500" />
                        <span>Rooms & Wings Registry (.xlsx)</span>
                      </span>
                      {uploadedFiles.rooms && <span className="text-[10px] bg-emerald-50 border border-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md font-bold">READY</span>}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSimulateUpload("rooms")}
                      className="w-full py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <UploadCloud className="w-4 h-4 text-slate-400" />
                      <span>{uploadedFiles.rooms ? "Replace Dataset File" : "Choose / Drop Excel or CSV"}</span>
                    </button>
                  </div>
                </div>

                {/* Dataset Preview */}
                {previewData && (
                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs space-y-2 bg-white">
                    <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">
                        Preview: {previewData.type}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400">Total {previewData.rows.length} rows loaded</span>
                    </div>
                    <div className="overflow-x-auto p-2">
                      <table className="w-full text-left text-[11px] border-collapse">
                        <thead>
                          <tr className="bg-slate-50 text-slate-500 border-b border-slate-100 font-bold">
                            {previewData.headers.map((h, i) => (
                              <th key={i} className="p-2 whitespace-nowrap">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {previewData.rows.map((row, idx) => (
                            <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50">
                              {row.map((val: string, i: number) => (
                                <td key={i} className="p-2 font-mono">{val}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* --- STEP 6: REVIEW --- */}
            {currentStep === 6 && (
              <div className="space-y-6 text-xs text-left">
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  Please review your school profile parameters before completing the registration setup. You can modify these details inside the system console at any time.
                </p>

                {/* Block 1: Basic Info */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-wider">1. Institution & Principal Details</span>
                    <button type="button" onClick={() => setCurrentStep(1)} className="text-indigo-600 hover:underline font-bold text-[10px]">Edit</button>
                  </div>
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                    <div><span className="text-slate-400 font-semibold">School Name:</span> <span className="text-slate-800 font-bold">{schoolName}</span></div>
                    <div><span className="text-slate-400 font-semibold">UDISE ID:</span> <span className="text-slate-800 font-bold font-mono">{udiseNumber}</span></div>
                    <div><span className="text-slate-400 font-semibold">Type:</span> <span className="text-slate-800 font-bold">{schoolType}</span></div>
                    <div><span className="text-slate-400 font-semibold">Principal:</span> <span className="text-slate-800 font-bold">{principalName}</span></div>
                    <div><span className="text-slate-400 font-semibold">Email:</span> <span className="text-slate-800 font-bold font-mono">{schoolEmail}</span></div>
                    <div><span className="text-slate-400 font-semibold">Phone:</span> <span className="text-slate-800 font-bold font-mono">{schoolPhone}</span></div>
                  </div>
                </div>

                {/* Block 2: Academic Info */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-wider">2. Academic Year & Class Roster Sizes</span>
                    <button type="button" onClick={() => setCurrentStep(2)} className="text-indigo-600 hover:underline font-bold text-[10px]">Edit</button>
                  </div>
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                    <div><span className="text-slate-400 font-semibold">Academic Year:</span> <span className="text-slate-800 font-bold font-mono">{academicYear}</span></div>
                    <div><span className="text-slate-400 font-semibold">Operating Days:</span> <span className="text-slate-800 font-bold">{workingDays.join(", ")}</span></div>
                    <div><span className="text-slate-400 font-semibold">Total Students:</span> <span className="text-slate-800 font-bold">{totalStudents}</span></div>
                    <div><span className="text-slate-400 font-semibold">Total Teachers:</span> <span className="text-slate-800 font-bold">{totalTeachers}</span></div>
                    <div className="col-span-2">
                      <span className="text-slate-400 font-semibold">Available Grades:</span> <span className="text-slate-800 font-bold">{availableClasses.map((c) => `Class ${c}`).join(", ")}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-400 font-semibold">Available Sections:</span> <span className="text-slate-800 font-bold">{availableSections.map((s) => `Section ${s}`).join(", ")}</span>
                    </div>
                  </div>
                </div>

                {/* Block 3: Infrastructure & Timings */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-wider">3. Infrastructure & Operational Hours</span>
                    <button type="button" onClick={() => setCurrentStep(4)} className="text-indigo-600 hover:underline font-bold text-[10px]">Edit</button>
                  </div>
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                    <div><span className="text-slate-400 font-semibold">Halls/Rooms:</span> <span className="text-slate-800 font-bold">{totalRooms} Rooms, {totalExamHalls} Exam Halls</span></div>
                    <div><span className="text-slate-400 font-semibold">Benches Layout:</span> <span className="text-slate-800 font-bold">{benchesPerRoom} Benches, {studentsPerBench} Pupils/Bench</span></div>
                    <div><span className="text-slate-400 font-semibold">Class Hours:</span> <span className="text-slate-800 font-bold font-mono">{schoolStartTime} - {schoolEndTime}</span></div>
                    <div><span className="text-slate-400 font-semibold">Daily Periods:</span> <span className="text-slate-800 font-bold">{periodsCount} Periods ({periodDuration}m duration)</span></div>
                    <div><span className="text-slate-400 font-semibold">Lunch Interval:</span> <span className="text-slate-800 font-bold font-mono">{lunchStartTime} ({lunchDuration} mins)</span></div>
                    <div><span className="text-slate-400 font-semibold">Saturday Working:</span> <span className="text-slate-800 font-bold">{saturdayWorking ? `Yes (${saturdayStartTime} - ${saturdayEndTime})` : "No"}</span></div>
                  </div>
                </div>

                {/* Data Import status */}
                <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-indigo-600 shrink-0" />
                  <div className="text-left">
                    <p className="font-bold text-indigo-800">Ready for Automatic Setup</p>
                    <p className="text-[10px] text-indigo-600 font-medium">
                      Datasets will be automatically compiled. We'll populate complete roster databases, workspaces, blocks, rooms, and seating matrices.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-100">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={isSubmitting}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous Step</span>
              </button>
            ) : (
              <div className="w-24"></div>
            )}

            {currentStep < 6 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={isSubmitting}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span>Checking...</span>
                ) : (
                  <>
                    <span>Continue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitRegistration}
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-black shadow-md shadow-indigo-600/15 hover:shadow-indigo-600/25 transition-all flex items-center gap-1.5 cursor-pointer ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span>Registering...</span>
                ) : (
                  <>
                    <span>Confirm & Register</span>
                    <CheckCircle className="w-4 h-4 text-indigo-200" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
