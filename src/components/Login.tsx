import React, { useState } from "react";
import {
  Lock,
  ArrowRight,
  AlertCircle,
  X,
  Loader2,
  School
} from "lucide-react";
import { hashPassword } from "../utils/security";

interface LoginProps {
  onLoginSuccess: (schoolData: any) => void;
  onOpenRegister: () => void;
  onCancel?: () => void;
}

export default function Login({ onLoginSuccess, onOpenRegister, onCancel }: LoginProps) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    // Short artificial delay for a premium secure administrative feel
    setTimeout(() => {
      try {
        const idTrimmed = identifier.trim();
        const passTrimmed = password.trim();

        if (!idTrimmed || !passTrimmed) {
          setErrorMsg("Please enter both School Identifier and Password.");
          setIsLoading(false);
          return;
        }

        const registered: any[] = JSON.parse(localStorage.getItem("registered_schools") || "[]");
        
        // Find by Registration Number, UDISE, or Email
        const matched = registered.find(
          (sch) =>
            sch.regNumber?.toUpperCase() === idTrimmed.toUpperCase() ||
            sch.udiseNumber === idTrimmed ||
            sch.schoolEmail?.toLowerCase() === idTrimmed.toLowerCase()
        );

        if (!matched) {
          setErrorMsg("Invalid credentials. School profile not found.");
          setIsLoading(false);
          return;
        }

        // Verify password hash
        const hashedInput = hashPassword(passTrimmed);
        if (matched.passwordHash && matched.passwordHash !== hashedInput) {
          setErrorMsg("Invalid credentials. Please verify your password.");
          setIsLoading(false);
          return;
        }

        // Successfully authenticated!
        onLoginSuccess(matched);
      } catch (err: any) {
        console.error("Login verification error:", err);
        setErrorMsg("An error occurred during authentication. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }, 750);
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-6 text-slate-200 animate-fadeIn">
      <div className="w-full max-w-md bg-slate-900/50 border border-white/10 rounded-2xl shadow-2xl p-8 space-y-6 relative overflow-hidden backdrop-blur-xl">
        
        {/* Close Button */}
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            title="Exit Login"
            className="absolute top-4 right-4 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-lg transition-all cursor-pointer z-10 disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Decorative top bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-cyan-500 to-indigo-600"></div>

        {/* Brand Header */}
        <div className="text-center space-y-3">
          <img
            src="https://i.ibb.co/fGyH2Tck/SJ-Schedular-AI-Logo.png"
            alt="SJ Scheduler AI Logo"
            className="w-14 h-14 object-contain mx-auto rounded-xl shadow-lg shadow-indigo-600/30"
            referrerPolicy="no-referrer"
          />
          <div>
            <h1 className="text-xl font-black text-white tracking-tight uppercase">SJ Scheduler AI</h1>
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mt-1">Console Administration Gateway</p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl flex items-start gap-2 text-xs animate-fadeIn">
            <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              School identifier
            </label>
            <div className="relative">
              <School className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                required
                placeholder="Registration ID, UDISE code, or Email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                disabled={isLoading}
                className="w-full pl-9 pr-3 py-2.5 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-950/40 text-white font-medium placeholder-slate-600 focus:border-indigo-400 disabled:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Administrator Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                placeholder="Enter password (default is school UDISE)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full pl-9 pr-3 py-2.5 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-950/40 text-white font-medium placeholder-slate-600 focus:border-indigo-400 disabled:opacity-50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-lg shadow-indigo-600/15 hover:shadow-indigo-600/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <>
                <span>Establish Administrative Session</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-slate-800">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider font-sans">
            Need to register a new school?
          </p>
          <button
            type="button"
            onClick={onOpenRegister}
            disabled={isLoading}
            className="mt-2 px-4 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-300 font-bold rounded-lg text-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            Register School Profile Now
          </button>
        </div>
      </div>
    </div>
  );
}
