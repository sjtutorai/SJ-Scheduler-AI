/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Sparkles,
  Zap,
  CheckCircle2,
  Users,
  Award,
  BookOpen,
  MapPin,
  Clock,
  Calendar,
  BarChart3,
  Shield,
  HelpCircle,
  Mail,
  ArrowRight,
  Play,
  ArrowRightLeft,
  ChevronDown,
  Lock,
  ThumbsUp,
  Cpu,
  X
} from "lucide-react";

interface LandingPageProps {
  onEnterApp: (mode?: "login" | "register") => void;
}

export default function LandingPage({ onEnterApp }: LandingPageProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({ name: "", email: "", msg: "" });
  const [submitted, setSubmitted] = useState(false);

  const stats = [
    { label: "Students Managed", value: "1,200+", desc: "Real-time records tracked" },
    { label: "Faculty Directory", value: "75+", desc: "Optimal workload balancing" },
    { label: "Timetables Generated", value: "480+", desc: "100% Conflict-free matrices" },
    { label: "Examinations Planned", value: "32+", desc: "Term-wise scheduling logs" },
    { label: "Seating Optimized", value: "12,000+", desc: "Spaced candidate bench charts" }
  ];

  const features = [
    {
      title: "AI Timetable Generator",
      desc: "Generates optimal class & teacher grids automatically, adhering to strict multi-period restraints.",
      icon: Clock,
      color: "text-blue-600 bg-blue-50 border-blue-100"
    },
    {
      title: "Student Management",
      desc: "Comprehensive registry supporting bulk CSV imports, houses, and blood groups.",
      icon: Users,
      color: "text-indigo-600 bg-indigo-50 border-indigo-100"
    },
    {
      title: "Teacher Workload Planner",
      desc: "Maintains faculty rosters, qualifications, availability schedules, and max period ceilings.",
      icon: Award,
      color: "text-amber-600 bg-amber-50 border-amber-100"
    },
    {
      title: "Examination Scheduler",
      desc: "Sets calendar blocks, dates, start/end parameters, duration timers, and sections.",
      icon: Calendar,
      color: "text-rose-600 bg-rose-50 border-rose-100"
    },
    {
      title: "AI Seating arrangement",
      desc: "Arranges multi-class candidates in halls. Separates classmates to uphold test integrity.",
      icon: Sparkles,
      color: "text-purple-600 bg-purple-50 border-purple-100"
    },
    {
      title: "Invigilator Allocation",
      desc: "Auto-assigns teachers to duties, preventing subject teachers from monitoring their own papers.",
      icon: Shield,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100"
    },
    {
      title: "Interactive Analytics",
      desc: "Durable overview dashboards detailing daily schedules, alerts, and system health checks.",
      icon: BarChart3,
      color: "text-cyan-600 bg-cyan-50 border-cyan-100"
    },
    {
      title: "Wings & Rooms Registry",
      desc: "Maps blocks, floors, benches, and hall capacities to enable precise space allocations.",
      icon: MapPin,
      color: "text-violet-600 bg-violet-50 border-violet-100"
    }
  ];

  const faqs = [
    {
      q: "How does the AI solve timetable conflicts?",
      a: "The scheduling matrix runs a localized heuristic check coupled with a server-side Gemini auditor that tests for teacher double-booking, room overcrowding, and grade-level overlaps. It validates millions of combinations in seconds."
    },
    {
      q: "Can I import existing records from Excel or CSV?",
      a: "Yes! SJ Scheduler AI provides a comprehensive bulk import system for Students, Teachers, and Rooms. Simply drag and drop your standard spreadsheet files."
    },
    {
      q: "Is it possible to assign custom school hours for different classes?",
      a: "Absolutely. You can define global institution timings or establish specific operating hours, lunch blocks, and recesses for distinct class groups (e.g., lower vs. high school classes)."
    },
    {
      q: "Does the seating generator separate students of the same class?",
      a: "Yes, that is a core rule! The AI seating optimizer checks candidate rosters and structures bench assignments in a zig-zag pattern, separating same-class pupils to ensure maximum examination integrity."
    }
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setContactForm({ name: "", email: "", msg: "" });
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-200 flex flex-col font-sans selection:bg-indigo-600 selection:text-white landing-page-glass">
      <style>{`
        .landing-page-glass {
          background-color: transparent !important;
          color: #f1f5f9 !important;
        }
        .landing-page-glass nav {
          background-color: rgba(9, 11, 20, 0.45) !important;
          border-bottom-color: rgba(255, 255, 255, 0.08) !important;
        }
        .landing-page-glass nav span,
        .landing-page-glass nav a {
          color: #f8fafc !important;
        }
        .landing-page-glass nav a {
          color: #94a3b8 !important;
        }
        .landing-page-glass nav a:hover {
          color: #ffffff !important;
        }
        .landing-page-glass h1, 
        .landing-page-glass h2, 
        .landing-page-glass h3, 
        .landing-page-glass h4, 
        .landing-page-glass h5 {
          color: #ffffff !important;
        }
        .landing-page-glass p,
        .landing-page-glass span.text-slate-500,
        .landing-page-glass div.text-slate-500 {
          color: #94a3b8 !important;
        }
        .landing-page-glass .bg-white {
          background-color: rgba(15, 23, 42, 0.4) !important;
          border-color: rgba(255, 255, 255, 0.08) !important;
          backdrop-filter: blur(8px) !important;
        }
        .landing-page-glass .border-slate-200,
        .landing-page-glass .border-slate-100 {
          border-color: rgba(255, 255, 255, 0.08) !important;
        }
        .landing-page-glass .bg-slate-50,
        .landing-page-glass .bg-slate-100 {
          background-color: rgba(15, 23, 42, 0.25) !important;
          border-color: rgba(255, 255, 255, 0.05) !important;
        }
        .landing-page-glass section {
          background-color: transparent !important;
        }
        .landing-page-glass input,
        .landing-page-glass textarea {
          background-color: rgba(3, 7, 18, 0.4) !important;
          border-color: rgba(255, 255, 255, 0.08) !important;
          color: #ffffff !important;
        }
        .landing-page-glass input:focus,
        .landing-page-glass textarea:focus {
          border-color: rgba(99, 102, 241, 0.5) !important;
        }
        .landing-page-glass .bg-indigo-50 {
          background-color: rgba(99, 102, 241, 0.1) !important;
          border-color: rgba(99, 102, 241, 0.2) !important;
        }
        .landing-page-glass .text-indigo-700,
        .landing-page-glass .text-indigo-600 {
          color: #a5b4fc !important;
        }
        .landing-page-glass .divide-slate-800 > * + * {
          border-color: rgba(255, 255, 255, 0.08) !important;
        }
        /* Custom styled buttons in landing */
        .landing-page-glass a.bg-slate-50 {
          background-color: rgba(255, 255, 255, 0.05) !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
          color: #ffffff !important;
        }
        .landing-page-glass a.bg-slate-50:hover {
          background-color: rgba(255, 255, 255, 0.1) !important;
        }
      `}</style>
      {/* Navbar */}
      <nav className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-200 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://i.ibb.co/fGyH2Tck/SJ-Schedular-AI-Logo.png"
              alt="SJ Scheduler AI Logo"
              className="w-10 h-10 object-contain rounded-xl shadow-lg shadow-indigo-600/20"
              referrerPolicy="no-referrer"
            />
            <div>
              <span className="font-extrabold text-slate-900 tracking-tight text-base">SJ Scheduler AI</span>
              <span className="text-[9px] bg-indigo-50 border border-indigo-100 text-indigo-700 px-1.5 py-0.2 rounded font-black tracking-wider uppercase ml-2 inline-block">
                v2.0
              </span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            {["Home", "Features", "Screenshots", "FAQ", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onEnterApp("login")}
              className="px-3.5 py-1.5 border border-slate-700 hover:bg-slate-800 hover:text-white text-slate-300 rounded-lg text-xs font-bold transition-all cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => onEnterApp("register")}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-md shadow-indigo-600/15 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Register School</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-20 pb-16 px-6 relative overflow-hidden bg-white">
        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 text-[10px] font-extrabold uppercase tracking-widest animate-pulse">
            <Sparkles className="w-3 h-3 fill-indigo-100" />
            <span>Next-Generation Multi-Constraint Solver</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Supercharge Academic Scheduling with <span className="text-indigo-600">SJ Scheduler AI</span>
          </h1>

          <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Generate complex school timetables, organize custom operating sessions, optimize examination halls,
            and assign invigilators. 100% conflict-free. Engineered with Gemini intelligence.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onEnterApp()}
              className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Cpu className="w-4 h-4 text-indigo-200" />
              <span>Get Started & Generate</span>
            </button>
            <a
              href="#features"
              className="w-full sm:w-auto px-6 py-3 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 text-slate-400" />
              <span>Explore Features</span>
            </a>
          </div>
        </div>

        {/* Dashboard Mockup Preview */}
        <div className="max-w-6xl mx-auto mt-16 p-4 bg-slate-100 border border-slate-200 rounded-2xl shadow-xl relative group">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            {/* Window bar */}
            <div className="h-10 bg-slate-50 border-b border-slate-200 px-4 flex items-center justify-between">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
              </div>
              <div className="px-3 py-1 bg-slate-200/50 text-slate-500 font-mono text-[10px] rounded-md font-medium tracking-wide">
                app.sjscheduler.ai/dashboard
              </div>
              <div className="w-12"></div>
            </div>

            {/* Dashboard Screenshot Preview mockup using CSS */}
            <div className="p-6 bg-slate-50 grid grid-cols-1 md:grid-cols-4 gap-6 select-none opacity-90">
              {/* Sidebar Mock */}
              <div className="hidden md:block bg-slate-900 text-slate-400 p-4 rounded-xl space-y-4 text-[11px] font-bold">
                <div className="flex items-center gap-2 text-white pb-3 border-b border-slate-800">
                  <div className="w-6 h-6 bg-indigo-500 rounded text-white flex items-center justify-center font-black">S</div>
                  <span>Scheduler Admin</span>
                </div>
                <div className="space-y-1.5">
                  <div className="px-3 py-1.5 bg-indigo-600 text-white rounded flex items-center gap-2"><Clock className="w-3.5 h-3.5"/><span>Timetables</span></div>
                  <div className="px-3 py-1.5 hover:bg-slate-800 rounded flex items-center gap-2"><Users className="w-3.5 h-3.5"/><span>Students</span></div>
                  <div className="px-3 py-1.5 hover:bg-slate-800 rounded flex items-center gap-2"><Award className="w-3.5 h-3.5"/><span>Teachers</span></div>
                  <div className="px-3 py-1.5 hover:bg-slate-800 rounded flex items-center gap-2"><Calendar className="w-3.5 h-3.5"/><span>Exams Planner</span></div>
                </div>
              </div>

              {/* Main Content Mock */}
              <div className="md:col-span-3 space-y-5">
                <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">Springdale Academy Overview</h3>
                    <p className="text-[10px] text-slate-400">AY 2026-2027 • Standard Timing Configured</p>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-100 rounded">
                    AI Active
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Students</span>
                    <div className="text-sm font-black text-slate-800">1,200+</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Teachers</span>
                    <div className="text-sm font-black text-slate-800">75+</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Success Rate</span>
                    <div className="text-sm font-black text-indigo-600">100%</div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase block">Weekly Class Matrix Overview</span>
                  <div className="grid grid-cols-6 gap-1">
                    {Array.from({ length: 18 }).map((_, i) => (
                      <div key={i} className={`p-1.5 rounded text-[8px] font-bold text-center border ${
                        i % 3 === 0 ? "bg-blue-50 border-blue-100 text-blue-700" :
                        i % 3 === 1 ? "bg-amber-50 border-amber-100 text-amber-700" :
                        "bg-emerald-50 border-emerald-100 text-emerald-700"
                      }`}>
                        Per {i % 4 + 1}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 bg-slate-900 text-white border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center divide-x divide-slate-800">
            {stats.map((item, idx) => (
              <div key={idx} className="space-y-1 p-2">
                <p className="text-2xl md:text-3xl font-black tracking-tight text-white font-mono">{item.value}</p>
                <p className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest">{item.label}</p>
                <p className="text-[10px] text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-950 tracking-tight">
              A Complete Operational Architecture
            </h2>
            <p className="text-xs md:text-sm text-slate-500 leading-relaxed">
              Every tool and view is mathematically optimized to remove visual noise and deliver extreme scheduling reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all space-y-4"
              >
                <div className={`p-2 w-10 h-10 rounded-lg ${feat.color} border flex items-center justify-center`}>
                  <feat.icon className="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-bold text-sm text-slate-900">{feat.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why SJ Scheduler AI (Comparison Cards) */}
      <section className="py-16 bg-slate-100 border-y border-slate-200 px-6">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl font-extrabold text-slate-950 tracking-tight">Why Choose SJ Scheduler AI?</h2>
            <p className="text-xs text-slate-500 mt-2">Traditional manual timetable rosters compared with AI generation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Traditional */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4 shadow-2xs">
              <h3 className="font-bold text-sm text-rose-600 flex items-center gap-2">
                <X className="w-4 h-4" />
                <span>The Traditional Ledger Way</span>
              </h3>
              <ul className="space-y-3 text-xs text-slate-500">
                <li className="flex gap-2 font-medium">
                  <span className="text-rose-400">•</span>
                  <span>Days of drafting grids on paper charts, prone to double-booking error.</span>
                </li>
                <li className="flex gap-2 font-medium">
                  <span className="text-rose-400">•</span>
                  <span>Impossible to fairly distribute classroom floor levels and teacher loads.</span>
                </li>
                <li className="flex gap-2 font-medium">
                  <span className="text-rose-400">•</span>
                  <span>Ineffective seating slips, requiring manual checking of class sections.</span>
                </li>
                <li className="flex gap-2 font-medium">
                  <span className="text-rose-400">•</span>
                  <span>No system alerts when a teacher goes on sudden leave or changes timings.</span>
                </li>
              </ul>
            </div>

            {/* SJ Scheduler */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4 text-white shadow-md relative overflow-hidden">
              <div className="absolute right-0 top-0 bg-indigo-600 text-[8px] font-black tracking-widest px-2.5 py-1 uppercase rounded-bl">
                OPTIMAL
              </div>
              <h3 className="font-bold text-sm text-indigo-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                <span>The SJ Scheduler AI Method</span>
              </h3>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex gap-2 font-medium">
                  <span className="text-indigo-400">•</span>
                  <span>AI constraint solvers compile the grid instantly and flag any rule exceptions.</span>
                </li>
                <li className="flex gap-2 font-medium">
                  <span className="text-indigo-400">•</span>
                  <span>Continuous live workload analysis guards faculty against physical exhaustion.</span>
                </li>
                <li className="flex gap-2 font-medium">
                  <span className="text-indigo-400">•</span>
                  <span>Spaced candidate arrangements generate bench locations automatically.</span>
                </li>
                <li className="flex gap-2 font-medium">
                  <span className="text-indigo-400">•</span>
                  <span>Immediate standby teacher recommendations in case of active sick-leaves.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="faq" className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-extrabold text-slate-950 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-xs text-slate-500">Everything you need to know about the operations engine.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl overflow-hidden transition-all duration-150"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-4 text-left font-bold text-xs md:text-sm text-slate-800 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${activeFaq === idx ? "rotate-180" : ""}`} />
                </button>
                {activeFaq === idx && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-500 leading-relaxed font-medium bg-slate-50/50 border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-slate-50 border-t border-slate-200 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-xl font-bold uppercase tracking-widest text-slate-400 text-xs">Principal Reviews</h2>
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <p className="text-sm md:text-base text-slate-600 italic font-medium leading-relaxed">
              "Designing exam timetables and assigning invigilator duties used to exhaust our clerical staff every quarter. With SJ Scheduler AI, we generated our entire terminal examination calendar and bench seating charts in less than ten minutes. The separate class arrangement has dramatically improved examination integrity."
            </p>
            <div>
              <p className="font-extrabold text-slate-950 text-xs uppercase tracking-wider">Dr. Arthur Pendelton</p>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-1">Principal, Springdale Academy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white px-6 border-t border-slate-200">
        <div className="max-w-xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-950 tracking-tight">Need Support or Custom Rules?</h2>
            <p className="text-xs text-slate-500">Send our administrative support desk a message.</p>
          </div>

          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Your Full Name</label>
              <input
                type="text"
                required
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50"
                placeholder="e.g. Dr. Vance"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Official Email Address</label>
              <input
                type="email"
                required
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50"
                placeholder="e.g. vance@springdale.edu"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Inquiry / Constraint details</label>
              <textarea
                rows={3}
                value={contactForm.msg}
                onChange={(e) => setContactForm({ ...contactForm, msg: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50"
                placeholder="Details of your school's unique rules..."
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {submitted ? (
                <>
                  <ThumbsUp className="w-4 h-4 text-emerald-400" />
                  <span>Inquiry Transmitted Successfully</span>
                </>
              ) : (
                <>
                  <Mail className="w-3.5 h-3.5" />
                  <span>Transmit Support Ticket</span>
                </>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-extrabold text-sm">
              S
            </div>
            <div>
              <span className="font-extrabold text-white text-sm tracking-tight">SJ Scheduler AI</span>
              <p className="text-[10px] text-slate-500 mt-1">Advanced Academic Multi-Constraint Scheduler</p>
            </div>
          </div>

          <p className="text-[10px] text-slate-500">
            &copy; {new Date().getFullYear()} SJ Scheduler AI. All rights reserved. Google Gemini SDK Integrator.
          </p>
        </div>
      </footer>
    </div>
  );
}
