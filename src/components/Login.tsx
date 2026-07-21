import React, { useState } from "react";
import {
  Mail,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  X,
  Loader2
} from "lucide-react";
import { auth, GoogleAuthProvider, signInWithPopup, sendSignInLinkToEmail } from "../firebase";

interface LoginProps {
  onLoginSuccess: (schoolData: any) => void;
  onOpenRegister: () => void;
  onCancel?: () => void;
}

export default function Login({ onLoginSuccess, onOpenRegister, onCancel }: LoginProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  // Continue with Google Sign-In
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const provider = new GoogleAuthProvider();
      // Force account selection to avoid auto-logging in with a single account without consent
      provider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(auth, provider);
      // App.tsx's onAuthStateChanged will handle checking the Firestore record and transitioning.
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      setErrorMsg(error.message || "An error occurred during Google Sign-In. Please try again.");
      setIsLoading(false);
    }
  };

  // Continue with Email Passwordless Sign-In (Email Link)
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const actionCodeSettings = {
        // Redirect URL: must be the current origin so the link brings them back here
        url: window.location.origin,
        handleCodeInApp: true,
      };

      await sendSignInLinkToEmail(auth, email.trim(), actionCodeSettings);
      
      // Store the email locally so we don't have to prompt the user again when they click the link
      localStorage.setItem("emailForSignIn", email.trim());
      
      setEmailSent(true);
    } catch (error: any) {
      console.error("Email Link Error:", error);
      setErrorMsg(error.message || "Could not send the secure sign-in link. Please check the email and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-6 text-slate-200">
      <div className="w-full max-w-md bg-slate-900/50 border border-white/10 rounded-2xl shadow-2xl p-8 space-y-6 relative overflow-hidden backdrop-blur-xl">
        
        {/* Close Button */}
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            title="Exit Login"
            className="absolute top-4 right-4 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-lg transition-all cursor-pointer z-10 disabled:opacity-50 disabled:cursor-not-allowed"
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

        {emailSent ? (
          <div className="space-y-5 py-4 text-center">
            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Sign-In Link Sent!</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                A secure sign-in link has been sent to <strong className="text-indigo-300 font-mono">{email}</strong>. Click the link in the email to authenticate and continue.
              </p>
            </div>
            <button
              onClick={() => {
                setEmailSent(false);
                setEmail("");
              }}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-bold transition-colors cursor-pointer"
            >
              Change Email Address
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Google Sign In Method */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-3 bg-white hover:bg-slate-50 text-slate-900 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border border-white/20 hover:scale-[1.01] active:scale-[0.99]"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                ) : (
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <g transform="matrix(1, 0, 0, 1, 0, 0)">
                      <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.58h3.3c1.93,-1.78 3.04,-4.4 3.04,-7.43c0,-0.66 -0.06,-1.32 -0.17,-1.95z" fill="#4285F4" />
                      <path d="M12,20.4c2.54,0 4.67,-0.84 6.23,-2.3l-3.3,-2.58c-0.91,0.61 -2.08,0.98 -2.93,0.98c-2.31,0 -4.27,-1.56 -4.97,-3.66H3.65v2.66C5.2,18.06 8.39,20.4 12,20.4z" fill="#34A853" />
                      <path d="M7.03,12.84a5.98,5.98 0 0 1 0,-1.68V8.5H3.65a9.98,9.98 0 0 0 0,7.02l3.38,-2.68z" fill="#FBBC05" />
                      <path d="M12,7.5c1.38,0 2.62,0.48 3.59,1.41l2.69,-2.69C16.66,4.72 14.54,3.6 12,3.6c-3.61,0 -6.8,2.34 -8.35,5.74l3.38,2.68c0.7,-2.1 2.66,-3.66 4.97,-3.66z" fill="#EA4335" />
                    </g>
                  </svg>
                )}
                <span>Continue with Google</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="absolute w-full border-t border-white/5"></div>
              <span className="relative px-3 bg-[#0d1527] text-[9px] font-black text-slate-500 uppercase tracking-widest">
                OR SIGN IN WITH SECURE EMAIL
              </span>
            </div>

            {/* Email Passwordless Sign In Form */}
            <form onSubmit={handleEmailSignIn} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="Enter administrator email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-950/40 text-white font-medium placeholder-slate-600 focus:border-indigo-400 disabled:opacity-50"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !email.trim()}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-lg shadow-indigo-600/15 hover:shadow-indigo-600/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <span>Send Secure Sign-In Link</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

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
