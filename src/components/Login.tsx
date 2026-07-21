/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  KeyRound,
  RefreshCw,
  X
} from "lucide-react";
import { hashPassword } from "../utils/security";

interface LoginProps {
  onLoginSuccess: (schoolData: any) => void;
  onOpenRegister: () => void;
  onCancel?: () => void;
}

export default function Login({ onLoginSuccess, onOpenRegister, onCancel }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Password reset flow
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetUsername, setResetUsername] = useState("");
  const [resetUdise, setResetUdise] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [resetPinCode, setResetPinCode] = useState("");
  const [newResetPassword, setNewResetPassword] = useState("");
  const [isResetConfirmed, setIsResetConfirmed] = useState(false);

  // Forced password change flow (first login)
  const [forceChangeUser, setForceChangeUser] = useState<any | null>(null);
  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!username.trim() || !password.trim()) {
      setErrorMsg("Please fill in both fields.");
      return;
    }

    const registered: any[] = JSON.parse(localStorage.getItem("registered_schools") || "[]");
    
    // Find matching school by Registration Number (Username)
    const school = registered.find((sch) => sch.regNumber.toUpperCase() === username.trim().toUpperCase());

    if (!school) {
      setErrorMsg("Invalid username (School Registration ID) or password.");
      return;
    }

    // Verify hashed password
    const hashedInp = hashPassword(password);
    if (school.passwordHash !== hashedInp) {
      setErrorMsg("Invalid username (School Registration ID) or password.");
      return;
    }

    // Check if password change is forced (still using UDISE as password or has flag isPasswordChanged = false)
    if (!school.isPasswordChanged && password === school.udiseNumber) {
      // Force change password
      setForceChangeUser(school);
      return;
    }

    // Success! Log them in
    onLoginSuccess(school);
  };

  const handleForcePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (newPassword1.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }
    if (newPassword1 !== newPassword2) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    if (newPassword1 === forceChangeUser.udiseNumber) {
      setErrorMsg("New password cannot be the same as the default UDISE number.");
      return;
    }

    // Update password in database
    const registered: any[] = JSON.parse(localStorage.getItem("registered_schools") || "[]");
    const updated = registered.map((sch) => {
      if (sch.regNumber === forceChangeUser.regNumber) {
        return {
          ...sch,
          passwordHash: hashPassword(newPassword1),
          isPasswordChanged: true
        };
      }
      return sch;
    });

    localStorage.setItem("registered_schools", JSON.stringify(updated));

    // Log in immediately
    const loggedInUser = updated.find((sch) => sch.regNumber === forceChangeUser.regNumber);
    setSuccessMsg("Password updated successfully! Welcome to your console.");
    setTimeout(() => {
      onLoginSuccess(loggedInUser);
    }, 1500);
  };

  const handleAdminResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!resetUsername || !resetUdise || !resetEmail || !resetPinCode || !newResetPassword) {
      setErrorMsg("All administrator credentials are required to authorize a password reset.");
      return;
    }

    const registered: any[] = JSON.parse(localStorage.getItem("registered_schools") || "[]");
    const idx = registered.findIndex(
      (sch) =>
        sch.regNumber.toUpperCase() === resetUsername.trim().toUpperCase() &&
        sch.udiseNumber === resetUdise.trim() &&
        sch.schoolEmail.toLowerCase() === resetEmail.trim().toLowerCase() &&
        sch.pinCode === resetPinCode.trim()
    );

    if (idx === -1) {
      setErrorMsg("Verification failed. The UDISE, Email, or PIN Code does not match our registration logs.");
      return;
    }

    if (newResetPassword.length < 6) {
      setErrorMsg("New password must be at least 6 characters.");
      return;
    }

    // Update password
    registered[idx].passwordHash = hashPassword(newResetPassword);
    registered[idx].isPasswordChanged = true;
    localStorage.setItem("registered_schools", JSON.stringify(registered));

    setIsResetConfirmed(true);
    setSuccessMsg("Administrator password reset completed successfully.");
    setTimeout(() => {
      setIsResetMode(false);
      setIsResetConfirmed(false);
      setSuccessMsg(null);
      setUsername(resetUsername);
      setPassword("");
    }, 2000);
  };

  // Render Forced Password Change screen (Step 7 login transition)
  if (forceChangeUser) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center p-6 text-slate-200">
        <div className="w-full max-w-md bg-slate-900/50 border border-white/10 rounded-2xl shadow-2xl p-8 space-y-6 backdrop-blur-xl">
          <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 mx-auto">
            <KeyRound className="w-6 h-6 animate-pulse" />
          </div>

          <div className="text-center space-y-1">
            <h1 className="text-xl font-black text-white tracking-tight">Security Action Required</h1>
            <p className="text-xs text-slate-400 font-medium">
              This is your first login. For security purposes, please replace your default UDISE password now.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl flex items-start gap-2 text-xs">
              <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-xl flex items-start gap-2 text-xs">
              <CheckCircle2 className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleForcePasswordChange} className="space-y-4 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">New Password *</label>
              <input
                type="password"
                required
                value={newPassword1}
                onChange={(e) => setNewPassword1(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-950/40 text-white placeholder-slate-600 font-mono focus:outline-none"
                placeholder="Minimum 6 characters"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Confirm New Password *</label>
              <input
                type="password"
                required
                value={newPassword2}
                onChange={(e) => setNewPassword2(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-950/40 text-white placeholder-slate-600 font-mono focus:outline-none"
                placeholder="Retype password"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-lg shadow-indigo-600/15 hover:shadow-indigo-600/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Save Password & Launch Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Render Forgot Password/Admin Reset mode
  if (isResetMode) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center p-6 text-slate-200">
        <div className="w-full max-w-md bg-slate-900/50 border border-white/10 rounded-2xl shadow-2xl p-8 space-y-6 backdrop-blur-xl">
          <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 mx-auto">
            <ShieldAlert className="w-6 h-6 text-indigo-400" />
          </div>

          <div className="text-center space-y-1">
            <h1 className="text-xl font-black text-white tracking-tight">Admin Password Recovery</h1>
            <p className="text-xs text-slate-400 font-medium">
              Validate registered administrative parameters to authorize password overwrite.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl flex items-start gap-2 text-xs">
              <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-xl flex items-start gap-2 text-xs">
              <CheckCircle2 className="w-4.5 h-4.5 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleAdminResetSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">School Registration ID (Username)</label>
              <input
                type="text"
                required
                placeholder="e.g. JSS-000001"
                value={resetUsername}
                onChange={(e) => setResetUsername(e.target.value)}
                className="w-full px-3 py-2 border border-slate-800 rounded-lg bg-slate-950/40 text-white placeholder-slate-600 font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Registered UDISE ID</label>
              <input
                type="text"
                required
                placeholder="e.g. 29140301234"
                value={resetUdise}
                onChange={(e) => setResetUdise(e.target.value)}
                className="w-full px-3 py-2 border border-slate-800 rounded-lg bg-slate-950/40 text-white placeholder-slate-600 font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Registered Email</label>
                <input
                  type="email"
                  required
                  placeholder="admin@school.edu"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-800 rounded-lg bg-slate-950/40 text-white placeholder-slate-600 font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Registered PIN Code</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="560001"
                  value={resetPinCode}
                  onChange={(e) => setResetPinCode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-800 rounded-lg bg-slate-950/40 text-white placeholder-slate-600 font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <label className="block text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1.5">New Secure Password</label>
              <input
                type="password"
                required
                placeholder="Minimum 6 characters"
                value={newResetPassword}
                onChange={(e) => setNewResetPassword(e.target.value)}
                className="w-full px-3 py-2 border border-indigo-900/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 rounded-lg bg-slate-950/40 text-white placeholder-slate-600 font-mono focus:outline-none"
              />
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsResetMode(false)}
                className="flex-1 py-2.5 border border-slate-800 hover:bg-slate-900 text-slate-300 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                Back to Login
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Password</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-6 text-slate-200">
      <div className="w-full max-w-md bg-slate-900/50 border border-white/10 rounded-2xl shadow-2xl p-8 space-y-6 relative overflow-hidden backdrop-blur-xl">
        
        {/* Close Button */}
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            title="Exit Login"
            className="absolute top-4 right-4 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-lg transition-all cursor-pointer z-10"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Decorative elements */}
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

        {successMsg && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-xl flex items-start gap-2 text-xs">
            <CheckCircle2 className="w-4.5 h-4.5 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">School Registration ID</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                required
                placeholder="e.g. JSS-000001"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-950/40 text-white font-mono font-bold focus:border-indigo-400"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Access Password</label>
              <button
                type="button"
                onClick={() => setIsResetMode(true)}
                className="text-[10px] font-bold text-indigo-400 hover:underline hover:text-indigo-300"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-10 py-2 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-950/40 text-white font-mono focus:border-indigo-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-lg shadow-indigo-600/15 hover:shadow-indigo-600/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Authenticate Securely</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="text-center pt-4 border-t border-slate-800">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider font-sans">First time using SJ Scheduler?</p>
          <button
            type="button"
            onClick={onOpenRegister}
            className="mt-2 px-4 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-300 font-bold rounded-lg text-xs transition-colors cursor-pointer"
          >
            Register School Profile Now
          </button>
        </div>
      </div>
    </div>
  );
}
