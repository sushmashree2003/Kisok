"use client";

import React, { useState, useEffect } from "react";
import { getUserSession, clearUserSession } from "@/lib/session";
import { SessionInfo } from "@/types/auth";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  Award,
  Building2,
  Activity,
  Sparkles,
  User,
  Users,
  ShieldCheck,
  X,
  Play,
  Bell,
  Quote,
  RefreshCw,
  GraduationCap,
  BarChart3,
  FileCheck,
  ClipboardList,
  FlaskConical,
  Maximize,
  Minimize,
  Home,
  Megaphone,
  Send,
  Layers,
  Film,
  TrendingUp,
} from "lucide-react";

interface DashboardProps {
  onBackToKiosk: () => void;
}

type ActiveScreen = "dashboard" | "timetable" | "meetings" | "evaluation" | "profile" | "aispace";

// Official Inspiring Slogans & Wisdom for Educators
const TEACHER_SLOGANS = [
  {
    quote: "Teaching is the greatest act of optimism — shaping generations one mind at a time.",
    author: "Colleen Wilcox",
    badge: "Educator Creed",
  },
  {
    quote: "Education is the most powerful weapon which you can use to change the world.",
    author: "Nelson Mandela",
    badge: "Global Wisdom",
  },
  {
    quote: "To teach is to touch a life forever. Excellence is not a destination, it is a continuous journey.",
    author: "Dr. A. P. J. Abdul Kalam",
    badge: "Inspiration",
  },
  {
    quote: "The art of teaching is the art of assisting discovery and sparking curiosity.",
    author: "Mark Van Doren",
    badge: "Pedagogy",
  },
  {
    quote: "Tell me and I forget. Teach me and I remember. Involve me and I learn.",
    author: "Benjamin Franklin",
    badge: "Experiential Learning",
  },
];

// Official Staff Circulars & Notices
const STAFF_NOTICES = [
  {
    id: 1,
    tag: "URGENT",
    tagColor: "#dc2626",
    tagBg: "#fee2e2",
    title: "CBSE Competency-Based Assessment Rubrics (Term-2)",
    time: "1h ago",
    date: "14 Oct 2026",
    authority: "Academic Steering Committee",
    details: "All department heads and subject faculty must align Class 9 and 10 internal marks evaluation with the newly released CBSE 2026-27 competency benchmarks. Rubrics sheets are available in the staff resource drive.",
  },
  {
    id: 2,
    tag: "CIRCULAR",
    tagColor: "#2563eb",
    tagBg: "#dbeafe",
    title: "Annual Science & STEM Robotics Exhibition 2026 — Faculty Mentors",
    time: "Today",
    date: "14 Oct 2026",
    authority: "Dean of Academic Affairs",
    details: "Faculty mentors for the upcoming inter-school science and robotics exhibition are requested to submit project rosters by Friday, 24th Oct. Mentorship hours will count towards academic service credits.",
  },
  {
    id: 3,
    tag: "NOTICE",
    tagColor: "#16a34a",
    tagBg: "#dcfce7",
    title: "Faculty Sync & Curriculum Review — Conference Hall A",
    time: "Yesterday",
    date: "13 Oct 2026",
    authority: "Office of the Principal",
    details: "The monthly whole-school faculty meeting is scheduled for today at 11:30 AM in Conference Hall A. Agenda covers mid-term syllabus progress, parent feedback summary, and sports day duties.",
  },
  {
    id: 4,
    tag: "SCHEDULE",
    tagColor: "#d97706",
    tagBg: "#fef3c7",
    title: "Winter Campus Timings & Duty Roster Notice",
    time: "2d ago",
    date: "12 Oct 2026",
    authority: "Campus Operations Office",
    details: "Winter school timings (08:30 AM to 03:30 PM) take effect from November 1st. Morning assembly gate duty and corridor moderation schedules have been updated in the staff room notice board.",
  },
];

// Teaching Timetable Data
const TEACHING_SCHEDULE = [
  { day: "Monday", period: "1", time: "08:00 - 08:45 AM", class: "Class 6 A", subject: "Mathematics", room: "Rm 204", topic: "Fractions & Decimals Practice" },
  { day: "Monday", period: "2", time: "09:00 - 09:45 AM", class: "Class 7 B", subject: "Mathematics", room: "Rm 206", topic: "Algebraic Expressions & Identities" },
  { day: "Monday", period: "3", time: "10:45 - 11:30 AM", class: "Class 8 A", subject: "Mathematics", room: "Rm 208", topic: "Linear Equations in One Variable" },
  { day: "Monday", period: "4", time: "12:15 - 01:00 PM", class: "Class 9 B", subject: "Mathematics", room: "Rm 301", topic: "Coordinate Geometry Theorems" },
  { day: "Monday", period: "5", time: "02:00 - 02:45 PM", class: "Class 10 A", subject: "Mathematics", room: "Rm 304", topic: "Quadratic Equations Board Prep" },

  { day: "Tuesday", period: "1", time: "08:00 - 08:45 AM", class: "Class 7 B", subject: "Mathematics", room: "Rm 206", topic: "Problem Solving Lab" },
  { day: "Tuesday", period: "2", time: "09:00 - 09:45 AM", class: "Class 6 A", subject: "Mathematics", room: "Rm 204", topic: "Geometry Workshop" },
  { day: "Tuesday", period: "3", time: "10:45 - 11:30 AM", class: "Class 10 A", subject: "Mathematics", room: "Rm 304", topic: "Trigonometry Basics & Identities" },
  { day: "Tuesday", period: "4", time: "12:15 - 01:00 PM", class: "Class 8 A", subject: "Mathematics", room: "Rm 208", topic: "Square Roots & Cube Roots" },
  { day: "Tuesday", period: "5", time: "02:00 - 02:45 PM", class: "Class 9 B", subject: "Mathematics", room: "Rm 301", topic: "Polynomial Factorization" },

  { day: "Wednesday", period: "1", time: "08:00 - 08:45 AM", class: "Class 8 A", subject: "Mathematics", room: "Rm 208", topic: "Data Handling & Probability" },
  { day: "Wednesday", period: "2", time: "09:00 - 09:45 AM", class: "Class 10 A", subject: "Mathematics", room: "Rm 304", topic: "Arithmetic Progressions" },
  { day: "Wednesday", period: "3", time: "10:45 - 11:30 AM", class: "Class 6 A", subject: "Mathematics", room: "Rm 204", topic: "Basic Geometrical Ideas" },
  { day: "Wednesday", period: "4", time: "12:15 - 01:00 PM", class: "Class 7 B", subject: "Mathematics", room: "Rm 206", topic: "Comparing Quantities" },
  { day: "Wednesday", period: "5", time: "02:00 - 02:45 PM", class: "Class 9 B", subject: "Mathematics", room: "Rm 301", topic: "Lines and Angles Proofs" },

  { day: "Thursday", period: "1", time: "08:00 - 08:45 AM", class: "Class 9 B", subject: "Mathematics", room: "Rm 301", topic: "Triangles Congruence Criteria" },
  { day: "Thursday", period: "2", time: "09:00 - 09:45 AM", class: "Class 6 A", subject: "Mathematics", room: "Rm 204", topic: "Number Systems Quiz" },
  { day: "Thursday", period: "3", time: "10:45 - 11:30 AM", class: "Class 7 B", subject: "Mathematics", room: "Rm 206", topic: "Perimeter and Area Formulas" },
  { day: "Thursday", period: "4", time: "12:15 - 01:00 PM", class: "Class 10 A", subject: "Mathematics", room: "Rm 304", topic: "Circles Tangent Theorems" },
  { day: "Thursday", period: "5", time: "02:00 - 02:45 PM", class: "Class 8 A", subject: "Mathematics", room: "Rm 208", topic: "Direct and Inverse Proportions" },

  { day: "Friday", period: "1", time: "08:00 - 08:45 AM", class: "Class 10 A", subject: "Mathematics", room: "Rm 304", topic: "Weekly Mock Board Examination" },
  { day: "Friday", period: "2", time: "09:00 - 09:45 AM", class: "Class 9 B", subject: "Mathematics", room: "Rm 301", topic: "Quadrilaterals Theorems" },
  { day: "Friday", period: "3", time: "10:45 - 11:30 AM", class: "Class 8 A", subject: "Mathematics", room: "Rm 208", topic: "Introduction to Graphs" },
  { day: "Friday", period: "4", time: "12:15 - 01:00 PM", class: "Class 7 B", subject: "Mathematics", room: "Rm 206", topic: "Visualising Solid Shapes" },
  { day: "Friday", period: "5", time: "02:00 - 02:45 PM", class: "Class 6 A", subject: "Mathematics", room: "Rm 204", topic: "Practical Geometry & Symmetry" },
];

// Academic Meetings Data
const MEETINGS_DATA = [
  {
    id: 1,
    time: "11:30 AM - 12:30 PM",
    title: "Whole-School Faculty Sync",
    venue: "Conference Hall A",
    category: "Administrative",
    agenda: "Review of Term-2 curriculum pacing, winter assessment schedule, and inter-house sports preparations.",
    attendees: "All Academic Faculty & Principal",
    status: "Upcoming Today",
    badgeColor: "#ea580c",
    badgeBg: "#fff7ed",
  },
  {
    id: 2,
    time: "02:00 PM - 03:00 PM",
    title: "Parent-Teacher Meeting (PTM) Prep",
    venue: "Staff Room 2",
    category: "Parent Engagement",
    agenda: "Collation of student progress cards and special feedback dossiers for Class 9 and 10 students.",
    attendees: "Maths & Science Dept. Teachers",
    status: "Upcoming Today",
    badgeColor: "#0d9488",
    badgeBg: "#f0fdfa",
  },
  {
    id: 3,
    time: "Tomorrow • 10:30 AM",
    title: "Math Olympiad Committee Sync",
    venue: "STEM Board Room",
    category: "Academic Excellence",
    agenda: "Shortlisting 18 student finalists from Class 8, 9, and 10 for National Science and Math Olympiad.",
    attendees: "Olympiad Mentors Committee",
    status: "Scheduled",
    badgeColor: "#7c3aed",
    badgeBg: "#f5f3ff",
  },
  {
    id: 4,
    time: "Friday • 03:15 PM",
    title: "Department Curriculum Moderation",
    venue: "Maths Resource Lab",
    category: "Quality Assurance",
    agenda: "Question paper moderation for Class 10 Pre-Board Assessment and rubric standardization.",
    attendees: "Senior Secondary Mathematics Faculty",
    status: "Scheduled",
    badgeColor: "#2563eb",
    badgeBg: "#eff6ff",
  },
];

// Student Performance & Evaluation Marksheet (Class 10A Mathematics)
const EVALUATION_ROSTER = [
  { roll: "101", name: "Ananya Rao", class: "Class 10 A", max: 100, obtained: 98, grade: "A+", remarks: "Outstanding conceptual mastery", status: "Verified" },
  { roll: "102", name: "Rohan V. Sharma", class: "Class 10 A", max: 100, obtained: 94, grade: "A+", remarks: "Excellent algebra & geometry", status: "Verified" },
  { roll: "103", name: "Priya Nair", class: "Class 10 A", max: 100, obtained: 91, grade: "A+", remarks: "Commendable problem solving", status: "Verified" },
  { roll: "104", name: "Aditya Hegde", class: "Class 10 A", max: 100, obtained: 88, grade: "A", remarks: "Consistent analytical accuracy", status: "Verified" },
  { roll: "105", name: "Kavya Menon", class: "Class 10 A", max: 100, obtained: 85, grade: "A", remarks: "Strong theorem proofs", status: "Verified" },
  { roll: "106", name: "Varun Patil", class: "Class 10 A", max: 100, obtained: 82, grade: "A", remarks: "Very good calculation speed", status: "Verified" },
  { roll: "107", name: "Sneha Kulkarni", class: "Class 10 A", max: 100, obtained: 79, grade: "B+", remarks: "Good, needs revision in circle proofs", status: "Verified" },
  { roll: "108", name: "Tanmay Deshmukh", class: "Class 10 A", max: 100, obtained: 76, grade: "B+", remarks: "Satisfactory, focus on quadratic formulas", status: "Verified" },
  { roll: "109", name: "Meera Iyer", class: "Class 10 A", max: 100, obtained: 93, grade: "A+", remarks: "Superior clarity in trigonometry", status: "Verified" },
  { roll: "110", name: "Chirag Singhania", class: "Class 10 A", max: 100, obtained: 86, grade: "A", remarks: "Well-structured graph analysis", status: "Verified" },
];

export default function StaffDashboard({ onBackToKiosk }: DashboardProps) {
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [currentScreen, setCurrentScreen] = useState<ActiveScreen>("dashboard");
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Filter states
  const [selectedDay, setSelectedDay] = useState<string>("ALL");
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>("ALL");

  // Interactive Widgets state
  const [sloganIndex, setSloganIndex] = useState(0);
  const [selectedNotice, setSelectedNotice] = useState<any | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Clock timer
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Automatic slogan rotation
  useEffect(() => {
    const sloganTimer = setInterval(() => {
      setSloganIndex((prev) => (prev + 1) % TEACHER_SLOGANS.length);
    }, 8000);
    return () => clearInterval(sloganTimer);
  }, []);

  // Sync fullscreen state
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  // Load session
  useEffect(() => {
    const activeSession = getUserSession();
    if (activeSession) {
      setSession(activeSession);
    }
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Fullscreen error:", err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleLogout = () => {
    clearUserSession();
    onBackToKiosk();
  };

  const staffName = session?.username;
  const schoolName = session?.initname;
  const staffRole = session?.Rolename;
  const staffDept = "Department of Mathematics";
  const staffRoom = "Room 204 • Faculty Block B";
  const empId = session?.Empid;

  // Filtered schedule
  const filteredSchedule = TEACHING_SCHEDULE.filter((item) => {
    const matchesDay = selectedDay === "ALL" || item.day.toUpperCase() === selectedDay.toUpperCase();
    const matchesClass = selectedClassFilter === "ALL" || item.class.toLowerCase().includes(selectedClassFilter.toLowerCase());
    return matchesDay && matchesClass;
  });

  // AI Space & Chatbot State
  const [chatMessages, setChatMessages] = useState<
    Array<{
      id: string;
      sender: "bot" | "user";
      text: string;
      time: string;
      suggestions?: string[];
    }>
  >([
    {
      id: "msg-welcome-staff",
      sender: "bot",
      text: "Welcome to Faculty AI Space! 👋 I'm GreenBot, your academic teaching assistant. I can help summarize your class schedule, check student evaluation rosters, draft lesson plan concepts, or prepare meeting agendas. How may I assist you today?",
      time: "Just now",
      suggestions: [
        "What are my classes today?",
        "Show student grading status",
        "Upcoming staff meetings?",
        "Lesson plan for Quadratic Equations",
        "CBSE Term-2 assessment guidelines",
      ],
    },
  ]);
  const [chatInputText, setChatInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatMessagesEndRef = React.useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (currentScreen === "aispace") {
      scrollToBottom();
    }
  }, [chatMessages, currentScreen, isTyping]);

  const handleSendChatMessage = (customQuery?: string) => {
    const query = (customQuery || chatInputText).trim();
    if (!query) return;

    const userMessageId = `msg-user-${Date.now()}`;
    const userTime = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    setChatMessages((prev) => [
      ...prev,
      {
        id: userMessageId,
        sender: "user",
        text: query,
        time: userTime,
      },
    ]);
    setChatInputText("");
    setIsTyping(true);

    setTimeout(() => {
      const lower = query.toLowerCase();
      let botReply = "";
      let suggestions: string[] = [];

      if (lower.includes("class") || lower.includes("period") || lower.includes("timetable") || lower.includes("schedule")) {
        botReply = `📖 Today's Teaching Schedule for ${staffName}:\n\n• Period 1 (08:00 AM): Class 6A — Fractions & Decimals (Rm 204)\n• Period 2 (09:00 AM): Class 7B — Algebraic Expressions (Rm 206)\n• Period 3 (10:45 AM): Class 8A — Linear Equations (Rm 208)\n• Period 4 (12:15 PM): Class 9B — Coordinate Geometry (Rm 301)\n• Period 5 (02:00 PM): Class 10A — Quadratic Equations (Rm 304)\n\nTotal Teaching Load: 5 Periods • 185 Students.`;
        suggestions = ["Show student grading status", "Upcoming staff meetings?", "Lesson plan for Quadratic Equations"];
      } else if (lower.includes("meeting") || lower.includes("sync") || lower.includes("ptm") || lower.includes("committee")) {
        botReply = `🗓️ Scheduled Academic Meetings for Today:\n\n1. Whole-School Faculty Sync at 11:30 AM in Conference Hall A (Curriculum pacing & Sports Day duties).\n2. Parent-Teacher Meeting (PTM) Prep at 02:00 PM in Staff Room 2.\n3. Tomorrow: Math Olympiad Committee Sync at 10:30 AM (STEM Board Rm).`;
        suggestions = ["What are my classes today?", "Show student grading status", "CBSE Term-2 assessment guidelines"];
      } else if (lower.includes("grade") || lower.includes("evaluation") || lower.includes("mark") || lower.includes("score")) {
        botReply = `📊 Assessment & Gradebook Summary (Class 10 A Math):\n\n• Class Average: 85.2%\n• Top Scorer: Ananya Rao (98 / 100 • A+)\n• Total Papers Evaluated: 42 / 42 (100% Verified)\n• Distinction Rate: 64% of learners scored Grade A+\n• Next Due: Class 9 B Mathematics marks submission by Friday 04:00 PM.`;
        suggestions = ["What are my classes today?", "Upcoming staff meetings?", "Lesson plan for Quadratic Equations"];
      } else if (lower.includes("lesson") || lower.includes("quadratic") || lower.includes("plan") || lower.includes("teach")) {
        botReply = `📐 45-Minute Lesson Plan: Quadratic Equations (Class 10 A):\n\n1. Concept Hook (7 mins): Real-world trajectory of basketball shots and parabolic bridges.\n2. Core Theory (18 mins): Standard form ax² + bx + c = 0, discriminant D = b² - 4ac, and the quadratic formula.\n3. Guided Practice (12 mins): Solve 2x² - 7x + 3 = 0 using factorization and formula method.\n4. Quick Check & Exit Ticket (8 mins): What happens to the roots when D < 0?`;
        suggestions = ["Give me a homework worksheet", "What are my classes today?", "Show student grading status"];
      } else {
        botReply = `🤖 Query noted, Mr. ${staffName}: "${query}".\n\nI can assist with period timings, attendance registers, student gradebooks, pedagogical lesson plans, or school policy circulars. What would you like to prepare next?`;
        suggestions = ["What are my classes today?", "Show student grading status", "Upcoming staff meetings?"];
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: `msg-bot-${Date.now()}`,
          sender: "bot",
          text: botReply,
          time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          suggestions,
        },
      ]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="dashboard-page">
      {/* FLOATING AMBIENT ORBS (MATCHING ROLE SELECTION SCREEN) */}
      <div className="kiosk-orb kiosk-orb-one" />
      <div className="kiosk-orb kiosk-orb-two" />

      {/* TOP COMMAND NAVBAR (ROLE SELECTION COMMAND THEME) */}
      <header className="dash-navbar">
        <div className="command-brand" onClick={handleLogout} style={{ cursor: "pointer" }}>
          <div className="command-mark" aria-hidden="true">
            <svg width="34" height="34" viewBox="0 0 48 48" fill="none">
              <path d="M24 7c4 4 10 6 14 3 0 8-7 13-14 14C17 23 10 18 10 10c4 3 10 1 14-3Z" fill="#ea580c" />
              <path d="M24 24V11" stroke="#c2410c" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M5 36c7-4.5 13-3.5 19 1 6-4.5 12-5.5 19-1V18c-7-4.5-13-3.5-19 1-6-4.5-12-5.5-19-1v18Z" fill="#9a3412" />
              <path d="M24 19v18" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <p className="command-kicker">GREEN VALLEY • SMART CAMPUS</p>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "nowrap" }}>
              <h1 style={{ margin: 0, fontFamily: "Outfit, sans-serif", fontSize: "1.15rem", fontWeight: 800, color: "#1e293b", whiteSpace: "nowrap" }}>
                {schoolName}
              </h1>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  background: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)",
                  color: "#c2410c",
                  fontSize: "0.74rem",
                  fontWeight: 800,
                  padding: "0.22rem 0.75rem",
                  borderRadius: "9999px",
                  border: "1.5px solid rgba(251, 146, 60, 0.4)",
                  boxShadow: "0 2px 8px rgba(234, 88, 12, 0.08)",
                  letterSpacing: "0.02em",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                <Users size={12} style={{ color: "#ea580c" }} />
                PAGE 5 • FACULTY &amp; STAFF PORTAL
              </span>
            </div>
          </div>
        </div>

        {/* Profile Pill & Control Actions */}
        <div className="dash-nav-actions" style={{ flexWrap: "nowrap" }}>
          {/* Staff Profile Pill */}
          <div
            className="dash-profile-pill"
            onClick={() => setCurrentScreen("profile")}
            title="Click to view Faculty Profile"
            style={{ cursor: "pointer" }}
          >
            <img src={session?.img || "/staff_avatar.png"} alt={staffName} className="dash-user-avatar" />
            <div className="dash-user-info">
              <span className="dash-user-name">{staffName}</span>
              <span className="dash-user-role">{staffRole} • Emp ID: {empId}</span>
            </div>
          </div>

          {/* Live Campus Telemetry Pill */}
          <div className="command-live-status">
            <span style={{ background: "#16a34a" }} />
            <span>Campus online</span>
          </div>

          {/* Command Time Pill */}
          <div className="dash-clock-widget">
            <Calendar size={13} style={{ color: "#ea580c" }} />
            <span>
              {currentTime.toLocaleDateString("en-US", { weekday: "short", day: "2-digit", month: "short" })} •{" "}
              <b>{currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}</b>
            </span>
          </div>

          {/* Fullscreen Button */}
          <button className="command-fullscreen" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize size={15} /> : <Maximize size={15} />}
            <span>{isFullscreen ? "Exit" : "Full screen"}</span>
          </button>

          {/* Back to Kiosk Home */}
          <button className="dash-kiosk-back-btn" onClick={handleLogout} title="Return to Role Selection Home">
            <Home size={14} /> Back to Kiosk
          </button>
        </div>
      </header>

      {/* ========================================================
          VIEW 1: MAIN STAFF HUB (6 BALANCED CONTAINERS GRID)
          ======================================================== */}
      {currentScreen === "dashboard" && (
        <main className="dash-main-hub">
          {/* HERO BANNER (ROLE SELECTION COMMAND THEME) */}
          <section className="student-hub-hero">
            <div className="student-hero-title-group">
              <h2>
                Welcome Back, <span>{staffName}</span>
              </h2>
              <p>Together we shape young minds and inspire academic brilliance across campus.</p>
              <div className="student-hero-chips">
                <span className="student-hero-chip">
                  <BookOpen size={12} /> {staffDept}
                </span>
                <span className="student-hero-chip">
                  <Building2 size={12} /> {staffRoom}
                </span>
                <span className="student-hero-chip">
                  <Clock size={12} /> 5 Teaching Periods Today
                </span>
                <span className="student-hero-chip">
                  <Award size={12} /> Senior Faculty • Rating ★ 4.9/5.0
                </span>
                <span className="student-hero-chip highlight">
                  <ShieldCheck size={12} /> Faculty Grade A+ Verified
                </span>
                <span className="student-hero-chip live">
                  <Activity size={12} /> Class Registers Live Synced
                </span>
              </div>
            </div>

            {/* UNIFIED 3D STAGE CAPSULE */}
            <div className="student-hero-capsule">
              {/* 3D Staff Character Avatar Stage */}
              <div className="hero-avatar-podium">
                <div className="hero-avatar-halo" />
                <img
                  src="/staff_avatar.png"
                  alt="Faculty"
                  className="hero-avatar-3d-img"
                />
                <span className="hero-avatar-tag">Faculty Lead</span>
              </div>

              <div className="hero-capsule-divider" />

              {/* 3D Mini Orbital Badge */}
              <div className="hero-honor-stage">
                <div className="hero-honor-icon-bubble">
                  <Users size={18} />
                </div>
                <div className="hero-honor-text">
                  <span className="hero-honor-title">Faculty</span>
                  <span className="hero-honor-badge">Grade A+ Lead</span>
                </div>
              </div>

              <div className="hero-capsule-divider" />

              {/* AI Space Launch Button */}
              <button
                type="button"
                onClick={() => setCurrentScreen("aispace")}
                className="hero-ai-capsule-btn"
                title="Launch Faculty AI Teaching Assistant"
              >
                <div className="hero-ai-robo-wrap">
                  <img src="/ai_robot.png" alt="GreenBot" className="hero-ai-robo-img" />
                  <span className="hero-ai-pulse-dot" />
                </div>
                <div style={{ textAlign: "center" }}>
                  <div className="hero-ai-kicker">
                    <Sparkles size={9} style={{ display: "inline", verticalAlign: "middle", marginRight: 2 }} /> AI SPACE
                  </div>
                  <span className="hero-ai-action">Ask GreenBot →</span>
                </div>
              </button>
            </div>
          </section>

          {/* 6 COMPACT BALANCED CONTAINERS (3 COLUMNS × 2 ROWS) */}
          <section className="student-hub-grid">
            {/* CONTAINER 1: 📖 TODAY'S TEACHING SCHEDULE & CLASSES */}
            <div
              className="student-hub-card"
              onClick={() => setCurrentScreen("timetable")}
              title="Click to open Full Teaching Timetable"
            >
              <div className="student-hub-card-header">
                <div className="student-card-title-group">
                  <div className="student-card-icon-box">
                    <BookOpen size={19} />
                  </div>
                  <div className="student-card-headings">
                    <h3>Teaching Schedule</h3>
                    <span>Today&apos;s Active Classes</span>
                  </div>
                </div>
                <span
                  style={{
                    background: "#fff7ed",
                    color: "#ea580c",
                    border: "1px solid rgba(254, 215, 170, 0.8)",
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    padding: "0.2rem 0.65rem",
                    borderRadius: "9999px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ea580c" }} />
                  5 Periods
                </span>
              </div>

              <div className="student-hub-card-body">
                <div className="student-metric-hero">
                  <span className="student-metric-val">5 Classes</span>
                  <span className="student-metric-label">Assigned for Today</span>
                </div>

                <div className="student-timetable-preview-list">
                  <div className="student-period-item">
                    <span className="period-time-badge">08:00 AM</span>
                    <span className="period-subject-name">Class 6A • Fractions</span>
                    <span className="period-room-tag">Rm 204</span>
                  </div>
                  <div className="student-period-item">
                    <span className="period-time-badge">09:00 AM</span>
                    <span className="period-subject-name">Class 7B • Algebra</span>
                    <span className="period-room-tag">Rm 206</span>
                  </div>
                  <div className="student-period-item">
                    <span className="period-time-badge">10:45 AM</span>
                    <span className="period-subject-name">Class 8A • Linear Eq.</span>
                    <span className="period-room-tag">Rm 208</span>
                  </div>
                </div>

                <div className="student-sub-status-strip">
                  <Clock size={12} />
                  <span>Today&apos;s Load: 5 Periods • 1 Lab Session Scheduled</span>
                </div>
              </div>

              <div className="student-hub-card-footer">
                <button
                  className="student-open-screen-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentScreen("timetable");
                  }}
                >
                  <Clock size={13} /> View Full Teaching Timetable <ArrowRight size={13} />
                </button>
              </div>
            </div>

            {/* CONTAINER 2: 🗓️ MEETINGS & COMMITTEE SYNCS */}
            <div
              className="student-hub-card"
              onClick={() => setCurrentScreen("meetings")}
              title="Click to open Meetings Calendar"
            >
              <div className="student-hub-card-header">
                <div className="student-card-title-group">
                  <div className="student-card-icon-box">
                    <CalendarDays size={19} />
                  </div>
                  <div className="student-card-headings">
                    <h3>Meetings &amp; Syncs</h3>
                    <span>Committees &amp; Agendas</span>
                  </div>
                </div>
                <span
                  style={{
                    background: "#fff7ed",
                    color: "#ea580c",
                    border: "1px solid rgba(254, 215, 170, 0.8)",
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    padding: "0.2rem 0.65rem",
                    borderRadius: "9999px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#16a34a" }} />
                  2 Today
                </span>
              </div>

              <div className="student-hub-card-body">
                <div className="student-metric-hero">
                  <span className="student-metric-val">2 Syncs</span>
                  <span className="student-metric-label">Next at 11:30 AM</span>
                </div>

                {/* 4-Tile Duo Grid Widget */}
                <div className="student-kpi-duo-grid">
                  <div className="student-kpi-mini-card highlight">
                    <div className="student-kpi-mini-icon highlight">
                      <Users size={14} />
                    </div>
                    <div className="student-kpi-mini-meta">
                      <span className="student-kpi-mini-label">Faculty Sync</span>
                      <strong className="student-kpi-mini-val highlight">11:30 AM Conf A</strong>
                    </div>
                  </div>
                  <div className="student-kpi-mini-card">
                    <div className="student-kpi-mini-icon">
                      <ClipboardList size={14} />
                    </div>
                    <div className="student-kpi-mini-meta">
                      <span className="student-kpi-mini-label">PTM Prep</span>
                      <strong className="student-kpi-mini-val">02:00 PM Room 2</strong>
                    </div>
                  </div>
                  <div className="student-kpi-mini-card">
                    <div className="student-kpi-mini-icon">
                      <FlaskConical size={14} />
                    </div>
                    <div className="student-kpi-mini-meta">
                      <span className="student-kpi-mini-label">Olympiad Prep</span>
                      <strong className="student-kpi-mini-val">Tomorrow STEM</strong>
                    </div>
                  </div>
                  <div className="student-kpi-mini-card">
                    <div className="student-kpi-mini-icon">
                      <ShieldCheck size={14} />
                    </div>
                    <div className="student-kpi-mini-meta">
                      <span className="student-kpi-mini-label">CBSE Inspection</span>
                      <strong className="student-kpi-mini-val highlight">Review Ready</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="student-hub-card-footer">
                <button
                  className="student-open-screen-btn btn-warm-tint"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentScreen("meetings");
                  }}
                >
                  <CalendarDays size={13} /> Open Meetings &amp; Events Calendar <ArrowRight size={13} />
                </button>
              </div>
            </div>

            {/* CONTAINER 3: 📊 STUDENT MARKS & EVALUATION */}
            <div
              className="student-hub-card"
              onClick={() => setCurrentScreen("evaluation")}
              title="Click to open Evaluation & Gradebook"
            >
              <div className="student-hub-card-header">
                <div className="student-card-title-group">
                  <div className="student-card-icon-box">
                    <BarChart3 size={19} />
                  </div>
                  <div className="student-card-headings">
                    <h3>Student Evaluation</h3>
                    <span>Gradebook &amp; Performance</span>
                  </div>
                </div>
                <span
                  style={{
                    background: "#fff7ed",
                    color: "#ea580c",
                    border: "1px solid rgba(254, 215, 170, 0.8)",
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    padding: "0.2rem 0.65rem",
                    borderRadius: "9999px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ea580c" }} />
                  Class 10A Math
                </span>
              </div>

              <div className="student-hub-card-body">
                <div className="student-metric-hero">
                  <span className="student-metric-val">85.2%</span>
                  <span className="student-metric-label">Class 10A Average</span>
                </div>

                {/* 3D Progress Bar */}
                <div style={{ height: "7px", width: "100%", background: "#ffedd5", borderRadius: "9999px", overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: "85.2%",
                      background: "linear-gradient(90deg, #ea580c 0%, #f59e0b 100%)",
                      borderRadius: "9999px",
                      boxShadow: "0 2px 6px rgba(234, 88, 12, 0.35)",
                    }}
                  />
                </div>

                {/* 4-Tile Duo Grid Widget */}
                <div className="student-kpi-duo-grid">
                  <div className="student-kpi-mini-card highlight">
                    <div className="student-kpi-mini-icon highlight">
                      <Award size={14} />
                    </div>
                    <div className="student-kpi-mini-meta">
                      <span className="student-kpi-mini-label">Top Score</span>
                      <strong className="student-kpi-mini-val highlight">98% (Ananya)</strong>
                    </div>
                  </div>
                  <div className="student-kpi-mini-card">
                    <div className="student-kpi-mini-icon">
                      <FileCheck size={14} />
                    </div>
                    <div className="student-kpi-mini-meta">
                      <span className="student-kpi-mini-label">Papers Checked</span>
                      <strong className="student-kpi-mini-val">42 Verified</strong>
                    </div>
                  </div>
                  <div className="student-kpi-mini-card">
                    <div className="student-kpi-mini-icon">
                      <CheckCircle2 size={14} />
                    </div>
                    <div className="student-kpi-mini-meta">
                      <span className="student-kpi-mini-label">Pass Percentage</span>
                      <strong className="student-kpi-mini-val">100% Passed</strong>
                    </div>
                  </div>
                  <div className="student-kpi-mini-card">
                    <div className="student-kpi-mini-icon">
                      <Clock size={14} />
                    </div>
                    <div className="student-kpi-mini-meta">
                      <span className="student-kpi-mini-label">Next Queue</span>
                      <strong className="student-kpi-mini-val highlight">Class 9B Due Fri</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="student-hub-card-footer">
                <button
                  className="student-open-screen-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentScreen("evaluation");
                  }}
                >
                  <BarChart3 size={13} /> Open Evaluation &amp; Gradebook <ArrowRight size={13} />
                </button>
              </div>
            </div>

            {/* CONTAINER 4: 🎥 FACULTY CAMPUS TOUR & LAB SHOWCASE */}
            <div
              className="student-hub-card"
              onClick={() => setIsVideoModalOpen(true)}
              title="Click to play campus lab tour"
            >
              <div className="student-hub-card-header">
                <div className="student-card-title-group">
                  <div className="student-card-icon-box">
                    <Film size={19} />
                  </div>
                  <div className="student-card-headings">
                    <h3>Campus Facilities Tour</h3>
                    <span>Smart Labs &amp; Resources</span>
                  </div>
                </div>
                <span
                  style={{
                    background: "#fff7ed",
                    color: "#ea580c",
                    border: "1px solid rgba(254, 215, 170, 0.8)",
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    padding: "0.2rem 0.65rem",
                    borderRadius: "9999px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <Play size={10} fill="#ea580c" /> Watch HD
                </span>
              </div>

              <div className="student-hub-card-body" style={{ padding: "0.35rem 0.65rem" }}>
                <div className="student-video-box">
                  <img
                    src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=700&q=80"
                    alt="Campus Facilities Showcase"
                    className="student-video-poster"
                  />
                  <div className="student-video-overlay">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span
                        style={{
                          background: "rgba(0, 0, 0, 0.65)",
                          color: "#ffffff",
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          padding: "2px 7px",
                          borderRadius: 6,
                          backdropFilter: "blur(4px)",
                        }}
                      >
                        ⏱ 03:45
                      </span>
                      <span
                        style={{
                          background: "#ea580c",
                          color: "#ffffff",
                          fontSize: "0.62rem",
                          fontWeight: 800,
                          padding: "2px 6px",
                          borderRadius: 6,
                        }}
                      >
                        HD VIDEO
                      </span>
                    </div>

                    <div className="student-video-play-btn">
                      <Play size={18} fill="#ffffff" style={{ marginLeft: "2px" }} />
                    </div>

                    <div style={{ color: "#ffffff" }}>
                      <div style={{ fontSize: "0.82rem", fontWeight: 800, textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}>
                        Campus STEM Labs &amp; Smart Studios
                      </div>
                      <div style={{ fontSize: "0.68rem", color: "#fbd5b5", textShadow: "0 1px 2px rgba(0,0,0,0.8)" }}>
                        Walkthrough of physics lab, robotics hub &amp; digital library
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="student-hub-card-footer">
                <button
                  className="student-open-screen-btn btn-warm-tint"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsVideoModalOpen(true);
                  }}
                >
                  <Play size={13} fill="#ea580c" /> Play Campus Facilities Video
                </button>
              </div>
            </div>

            {/* CONTAINER 5: 🔔 OFFICIAL CIRCULARS & NOTICES */}
            <div
              className="student-hub-card"
            >
              <div className="student-hub-card-header">
                <div className="student-card-title-group">
                  <div className="student-card-icon-box">
                    <Bell size={19} />
                  </div>
                  <div className="student-card-headings">
                    <h3>Staff Circulars</h3>
                    <span>Official Notices &amp; Directives</span>
                  </div>
                </div>
                <span
                  style={{
                    background: "#fff7ed",
                    color: "#ea580c",
                    border: "1px solid rgba(254, 215, 170, 0.8)",
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    padding: "0.2rem 0.65rem",
                    borderRadius: "9999px",
                  }}
                >
                  {STAFF_NOTICES.length} Circulars
                </span>
              </div>

              <div className="student-hub-card-body" style={{ padding: "0.35rem 0.85rem" }}>
                <div className="student-notices-list">
                  {STAFF_NOTICES.map((notice) => (
                    <div
                      key={notice.id}
                      className="student-notice-item"
                      onClick={() => setSelectedNotice(notice)}
                      title="Click to read full circular"
                    >
                      <span
                        style={{
                          fontSize: "0.6rem",
                          fontWeight: 800,
                          padding: "2px 6px",
                          borderRadius: 6,
                          background: "#fff7ed",
                          color: "#ea580c",
                          border: "1px solid rgba(254, 215, 170, 0.8)",
                          flexShrink: 0,
                        }}
                      >
                        {notice.tag}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: "0.74rem",
                            fontWeight: 700,
                            color: "#0f172a",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {notice.title}
                        </div>
                        <span style={{ fontSize: "0.64rem", color: "#64748b" }}>{notice.authority}</span>
                      </div>
                      <span style={{ fontSize: "0.64rem", color: "#94a3b8", flexShrink: 0 }}>{notice.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="student-hub-card-footer">
                <button
                  className="student-open-screen-btn btn-warm-tint"
                  onClick={() => setSelectedNotice(STAFF_NOTICES[0])}
                >
                  <Megaphone size={13} /> View All Faculty Notices
                </button>
              </div>
            </div>

            {/* CONTAINER 6: ✨ EDUCATOR WISDOM & TEACHING CREED */}
            <div
              className="student-hub-card"
            >
              <div className="student-hub-card-header">
                <div className="student-card-title-group">
                  <div className="student-card-icon-box">
                    <Sparkles size={19} />
                  </div>
                  <div className="student-card-headings">
                    <h3>Teaching Creed &amp; Wisdom</h3>
                    <span>Inspirational Thoughts for Educators</span>
                  </div>
                </div>
                <span
                  style={{
                    background: "#fff7ed",
                    color: "#ea580c",
                    border: "1px solid rgba(254, 215, 170, 0.8)",
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    padding: "0.2rem 0.65rem",
                    borderRadius: "9999px",
                  }}
                >
                  Educator Motto
                </span>
              </div>

              <div className="student-hub-card-body" style={{ padding: "0.35rem 0.85rem" }}>
                <div className="student-slogan-wrap">
                  <Quote
                    size={48}
                    style={{
                      position: "absolute",
                      right: -5,
                      bottom: -8,
                      color: "rgba(234, 88, 12, 0.12)",
                      pointerEvents: "none",
                    }}
                  />
                  <p className="student-slogan-quote">
                    &ldquo;{TEACHER_SLOGANS[sloganIndex].quote}&rdquo;
                  </p>
                  <div className="student-slogan-author">
                    <span>— {TEACHER_SLOGANS[sloganIndex].author}</span>
                    <span
                      style={{
                        background: "#fff7ed",
                        color: "#ea580c",
                        border: "1px solid rgba(254, 215, 170, 0.7)",
                        padding: "2px 8px",
                        borderRadius: "9999px",
                        fontSize: "0.66rem",
                        fontWeight: 800,
                      }}
                    >
                      {TEACHER_SLOGANS[sloganIndex].badge}
                    </span>
                  </div>
                  <div className="student-slogan-values-strip">
                    <span className="student-slogan-value-pill">Inspiration</span>
                    <span className="student-slogan-value-pill">Dedication</span>
                    <span className="student-slogan-value-pill">Empathy</span>
                    <span className="student-slogan-value-pill">Excellence</span>
                  </div>
                </div>
              </div>

              <div className="student-hub-card-footer">
                <button
                  className="student-open-screen-btn btn-warm-tint"
                  onClick={() => setSloganIndex((prev) => (prev + 1) % TEACHER_SLOGANS.length)}
                  title="Click to view next inspirational quote"
                >
                  <RefreshCw size={13} /> Next Teaching Thought ↻
                </button>
              </div>
            </div>
          </section>

          {/* COMPACT BOTTOM STRIP: FACULTY PROFILE LINK */}
          <section
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              borderRadius: "14px",
              padding: "0.45rem 1.15rem",
              border: "1.2px solid rgba(251, 146, 60, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 2px 10px rgba(234, 88, 12, 0.04)",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "#fff7ed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ea580c",
                  flexShrink: 0,
                  border: "1px solid rgba(251, 146, 60, 0.35)",
                }}
              >
                <GraduationCap size={16} />
              </div>
              <div>
                <span style={{ fontSize: "0.76rem", fontWeight: 800, color: "#1e293b" }}>
                  Official Faculty Record: {staffName} ({empId})
                </span>
                <div style={{ fontSize: "0.68rem", color: "#64748b", display: "flex", gap: "0.6rem", marginTop: "1px" }}>
                  <span>Department: <strong>Mathematics</strong></span>
                  <span>•</span>
                  <span>Base: <strong>Room 204</strong></span>
                  <span>•</span>
                  <span>Classes: <strong>6A, 7B, 8A, 9B, 10A</strong></span>
                  <span>•</span>
                  <span>Status: <strong style={{ color: "#16a34a" }}>Active On Premise</strong></span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setCurrentScreen("profile")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                padding: "0.35rem 0.85rem",
                borderRadius: "9999px",
                border: "1.2px solid rgba(251, 146, 60, 0.4)",
                background: "#fff7ed",
                color: "#c2410c",
                fontWeight: 800,
                fontSize: "0.74rem",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <User size={13} /> View Complete Faculty Profile Screen →
            </button>
          </section>
        </main>
      )}

      {/* ========================================================
          VIEW 2: DEDICATED FULL SCREEN — TEACHING TIMETABLE
          ======================================================== */}
      {currentScreen === "timetable" && (
        <section className="student-fullscreen-page">
          <div className="kiosk-orb kiosk-orb-one" />
          <div className="kiosk-orb kiosk-orb-two" />

          <div className="student-screen-subnav">
            <button className="student-back-to-dash-btn" onClick={() => setCurrentScreen("dashboard")}>
              <ArrowLeft size={16} /> Back to Dashboard
            </button>

            <div className="student-screen-title-area">
              <div className="student-screen-icon-bubble" style={{ background: "#f0fdfa", color: "#0d9488" }}>
                <Clock size={20} />
              </div>
              <div>
                <h2>Teaching Schedule & Class Roster</h2>
                <p>Weekly Master Schedule • {staffName} ({staffDept})</p>
              </div>
            </div>

            <div className="student-screen-nav-tools">
              <button
                className="student-refresh-btn"
                onClick={() => setSelectedDay("ALL")}
                style={{ borderColor: "#0d9488", color: "#0d9488" }}
              >
                Reset Day Filter
              </button>
            </div>
          </div>

          <div className="student-screen-scroll-body">
            {/* KPI STATS STRIP */}
            <div className="student-kpi-strip">
              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Today&apos;s Periods</span>
                  <h4>5 Periods</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#f0fdfa", color: "#0d9488" }}>
                  <Clock size={20} />
                </div>
              </div>

              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Students Taught</span>
                  <h4>185 Learners</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#eff6ff", color: "#2563eb" }}>
                  <Users size={20} />
                </div>
              </div>

              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Weekly Load</span>
                  <h4>25 Periods</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#f5f3ff", color: "#7c3aed" }}>
                  <BookOpen size={20} />
                </div>
              </div>

              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Faculty Base</span>
                  <h4>Room 204</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#fff7ed", color: "#ea580c" }}>
                  <Building2 size={20} />
                </div>
              </div>
            </div>

            {/* DAY SELECTOR TABS */}
            <div className="student-day-tabs-bar">
              {["ALL", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
                <button
                  key={day}
                  className={`student-day-tab-btn ${selectedDay === day ? "active" : ""}`}
                  style={selectedDay === day ? { background: "#0d9488", color: "#ffffff" } : {}}
                  onClick={() => setSelectedDay(day)}
                >
                  <Calendar size={13} /> {day}
                </button>
              ))}
            </div>

            {/* PERIOD TILES GRID */}
            <div className="student-periods-grid">
              {filteredSchedule.map((item, idx) => (
                <div key={idx} className="student-period-tile" style={{ borderLeft: "4px solid #0d9488" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                      <span
                        style={{
                          fontSize: "0.68rem",
                          fontWeight: 800,
                          padding: "2px 7px",
                          borderRadius: 6,
                          background: "#f0fdfa",
                          color: "#0d9488",
                        }}
                      >
                        Period {item.period} • {item.day}
                      </span>
                      <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#ea580c" }}>{item.room}</span>
                    </div>

                    <h4 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.05rem", fontWeight: 800, color: "#1e293b", margin: "0 0 0.15rem 0" }}>
                      {item.class}
                    </h4>
                    <div style={{ fontSize: "0.74rem", fontWeight: 700, color: "#0d9488" }}>
                      {item.subject}
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "#64748b", marginTop: "0.2rem" }}>
                      Lesson: {item.topic}
                    </div>
                  </div>

                  <div style={{ fontSize: "0.7rem", color: "#475569", fontWeight: 600, borderTop: "1px solid #f1f5f9", paddingTop: "0.4rem", display: "flex", justifyContent: "space-between" }}>
                    <span>⏱ {item.time}</span>
                    <span style={{ color: "#16a34a", fontWeight: 700 }}>● Scheduled</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          VIEW 3: DEDICATED FULL SCREEN — MEETINGS & EVENTS
          ======================================================== */}
      {currentScreen === "meetings" && (
        <section className="student-fullscreen-page">
          <div className="kiosk-orb kiosk-orb-one" />
          <div className="kiosk-orb kiosk-orb-two" />

          <div className="student-screen-subnav">
            <button className="student-back-to-dash-btn" onClick={() => setCurrentScreen("dashboard")}>
              <ArrowLeft size={16} /> Back to Dashboard
            </button>

            <div className="student-screen-title-area">
              <div className="student-screen-icon-bubble" style={{ background: "#fff7ed", color: "#ea580c" }}>
                <CalendarDays size={20} />
              </div>
              <div>
                <h2>Academic Meetings & Committee Syncs</h2>
                <p>Institutional Calendar & Sync Schedules • {staffName}</p>
              </div>
            </div>

            <div className="student-screen-nav-tools">
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#ea580c" }}>
                Conference Room A Booked
              </div>
            </div>
          </div>

          <div className="student-screen-scroll-body">
            {/* KPI STRIP */}
            <div className="student-kpi-strip">
              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Meetings Today</span>
                  <h4>2 Sessions</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#fff7ed", color: "#ea580c" }}>
                  <CalendarDays size={20} />
                </div>
              </div>

              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Upcoming This Week</span>
                  <h4>4 Syncs</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#f0fdfa", color: "#0d9488" }}>
                  <Clock size={20} />
                </div>
              </div>

              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Attendance Quorum</span>
                  <h4>100% Present</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#eff6ff", color: "#2563eb" }}>
                  <CheckCircle2 size={20} />
                </div>
              </div>

              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Next Location</span>
                  <h4>Conf. Hall A</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#f5f3ff", color: "#7c3aed" }}>
                  <Building2 size={20} />
                </div>
              </div>
            </div>

            {/* MEETINGS LIST CARDS */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {MEETINGS_DATA.map((meeting) => (
                <div
                  key={meeting.id}
                  className="student-screen-card"
                  style={{ padding: "1.1rem 1.35rem" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.25rem" }}>
                        <span
                          style={{
                            padding: "3px 8px",
                            borderRadius: 6,
                            fontSize: "0.68rem",
                            fontWeight: 800,
                            background: meeting.badgeBg,
                            color: meeting.badgeColor,
                          }}
                        >
                          {meeting.status}
                        </span>
                        <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 600 }}>
                          Category: {meeting.category}
                        </span>
                      </div>
                      <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.15rem", fontWeight: 800, color: "#1e293b", margin: 0 }}>
                        {meeting.title}
                      </h3>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "#ea580c" }}>{meeting.time}</div>
                      <div style={{ fontSize: "0.72rem", color: "#64748b" }}>Venue: {meeting.venue}</div>
                    </div>
                  </div>

                  <p style={{ fontSize: "0.8rem", color: "#334155", lineHeight: 1.5, margin: "0 0 0.6rem 0" }}>
                    <strong>Agenda:</strong> {meeting.agenda}
                  </p>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f1f5f9", paddingTop: "0.5rem", fontSize: "0.72rem", color: "#64748b" }}>
                    <span>Attendees: <strong>{meeting.attendees}</strong></span>
                    <span style={{ color: "#16a34a", fontWeight: 700 }}>● Room Verified</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          VIEW 4: DEDICATED FULL SCREEN — MARKS EVALUATION & GRADEBOOK
          ======================================================== */}
      {currentScreen === "evaluation" && (
        <section className="student-fullscreen-page">
          <div className="kiosk-orb kiosk-orb-one" />
          <div className="kiosk-orb kiosk-orb-two" />

          <div className="student-screen-subnav">
            <button className="student-back-to-dash-btn" onClick={() => setCurrentScreen("dashboard")}>
              <ArrowLeft size={16} /> Back to Dashboard
            </button>

            <div className="student-screen-title-area">
              <div className="student-screen-icon-bubble" style={{ background: "#f5f3ff", color: "#7c3aed" }}>
                <BarChart3 size={20} />
              </div>
              <div>
                <h2>Student Assessment Gradebook</h2>
                <p>Class 10 A • Mathematics Marks & Evaluation Ledger</p>
              </div>
            </div>

            <div className="student-screen-nav-tools">
              <span
                style={{
                  background: "#f0fdf4",
                  color: "#16a34a",
                  border: "1px solid rgba(22, 163, 74, 0.3)",
                  padding: "0.3rem 0.75rem",
                  borderRadius: 9999,
                  fontSize: "0.72rem",
                  fontWeight: 800,
                }}
              >
                ● 100% Papers Evaluated
              </span>
            </div>
          </div>

          <div className="student-screen-scroll-body">
            {/* KPI STATS STRIP */}
            <div className="student-kpi-strip">
              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Class Average</span>
                  <h4>85.2%</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#f5f3ff", color: "#7c3aed" }}>
                  <BarChart3 size={20} />
                </div>
              </div>

              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Top Scorer</span>
                  <h4>98 / 100</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#f0fdf4", color: "#16a34a" }}>
                  <Award size={20} />
                </div>
              </div>

              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>A+ Distinction</span>
                  <h4>64% Learners</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#eff6ff", color: "#2563eb" }}>
                  <CheckCircle2 size={20} />
                </div>
              </div>

              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Total Enrolled</span>
                  <h4>42 Students</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#fff7ed", color: "#ea580c" }}>
                  <Users size={20} />
                </div>
              </div>
            </div>

            {/* MARKSHEET TABLE CARD */}
            <div className="student-screen-card">
              <div className="student-screen-card-header">
                <h4>
                  <FileCheck size={18} style={{ color: "#7c3aed" }} />
                  Class 10 A — Mathematics Periodic Assessment Marksheet
                </h4>
                <span style={{ fontSize: "0.72rem", color: "#64748b" }}>Academic Session 2026-27</span>
              </div>

              <table className="student-screen-table">
                <thead>
                  <tr>
                    <th>Roll No</th>
                    <th>Student Name</th>
                    <th>Class</th>
                    <th>Max Marks</th>
                    <th>Marks Obtained</th>
                    <th>Grade</th>
                    <th>Teacher Remarks</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {EVALUATION_ROSTER.map((student) => (
                    <tr key={student.roll}>
                      <td style={{ fontWeight: 800, color: "#64748b" }}>#{student.roll}</td>
                      <td style={{ fontWeight: 700, color: "#1e293b" }}>{student.name}</td>
                      <td>{student.class}</td>
                      <td>{student.max}</td>
                      <td>
                        <b style={{ color: student.obtained >= 90 ? "#16a34a" : "#0284c7", fontSize: "0.9rem" }}>
                          {student.obtained}
                        </b>
                      </td>
                      <td>
                        <span
                          style={{
                            padding: "2px 8px",
                            borderRadius: 4,
                            fontSize: "0.72rem",
                            fontWeight: 800,
                            background: student.obtained >= 90 ? "#dcfce7" : "#e0f2fe",
                            color: student.obtained >= 90 ? "#15803d" : "#0369a1",
                          }}
                        >
                          {student.grade}
                        </span>
                      </td>
                      <td style={{ color: "#475569" }}>{student.remarks}</td>
                      <td>
                        <span style={{ color: "#16a34a", fontWeight: 700, fontSize: "0.72rem" }}>
                          ● {student.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          VIEW 5: DEDICATED FULL SCREEN — FACULTY PROFILE
          ======================================================== */}
      {currentScreen === "profile" && (
        <section className="student-fullscreen-page">
          <div className="kiosk-orb kiosk-orb-one" />
          <div className="kiosk-orb kiosk-orb-two" />

          <div className="student-screen-subnav">
            <button className="student-back-to-dash-btn" onClick={() => setCurrentScreen("dashboard")}>
              <ArrowLeft size={16} /> Back to Dashboard
            </button>

            <div className="student-screen-title-area">
              <div className="student-screen-icon-bubble" style={{ background: "#f0fdfa", color: "#0d9488" }}>
                <User size={20} />
              </div>
              <div>
                <h2>Faculty Service Record & Profile</h2>
                <p>Institutional Credential Registry • {staffName}</p>
              </div>
            </div>

            <div className="student-screen-nav-tools">
              <button className="student-back-to-dash-btn" onClick={handleLogout} style={{ color: "#dc2626", borderColor: "#fca5a5" }}>
                Sign Out
              </button>
            </div>
          </div>

          <div className="student-screen-scroll-body">
            <div
              className="student-screen-card"
              style={{ padding: "1.5rem", display: "flex", gap: "2rem", alignItems: "center" }}
            >
              <img
                src={session?.img || "/staff_avatar.png"}
                alt={staffName}
                style={{ width: 100, height: 100, borderRadius: "50%", border: "4px solid #0d9488", objectFit: "cover" }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
                  <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.45rem", fontWeight: 800, color: "#1e293b", margin: 0 }}>
                    {staffName}
                  </h2>
                  <span style={{ background: "#f0fdfa", color: "#0d9488", padding: "2px 8px", borderRadius: 6, fontSize: "0.72rem", fontWeight: 800 }}>
                    Senior Faculty Member
                  </span>
                </div>
                <div style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "0.75rem" }}>
                  {staffDept} • Green Valley Public School
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
                  <div style={{ background: "#f8fafc", padding: "0.5rem 0.75rem", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                    <span style={{ fontSize: "0.68rem", color: "#64748b" }}>Employee ID</span>
                    <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#1e293b" }}>{empId}</div>
                  </div>
                  <div style={{ background: "#f8fafc", padding: "0.5rem 0.75rem", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                    <span style={{ fontSize: "0.68rem", color: "#64748b" }}>Qualification</span>
                    <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#1e293b" }}>M.Sc., B.Ed. (Mathematics)</div>
                  </div>
                  <div style={{ background: "#f8fafc", padding: "0.5rem 0.75rem", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                    <span style={{ fontSize: "0.68rem", color: "#64748b" }}>Campus Base</span>
                    <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#1e293b" }}>Room 204 • Faculty Block</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="student-screen-card" style={{ padding: "1.25rem" }}>
              <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.05rem", fontWeight: 800, color: "#1e293b", margin: "0 0 0.85rem 0" }}>
                Teaching Assignments & Responsibilities
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
                <div style={{ background: "#fffcf9", padding: "0.85rem", borderRadius: 10, border: "1px solid rgba(254, 215, 170, 0.6)" }}>
                  <h4 style={{ margin: "0 0 0.35rem 0", fontSize: "0.85rem", color: "#ea580c" }}>Active Classes Handled</h4>
                  <p style={{ margin: 0, fontSize: "0.78rem", color: "#475569", lineHeight: 1.5 }}>
                    Class 6 A, Class 7 B, Class 8 A, Class 9 B, Class 10 A (Secondary & Senior Secondary Mathematics).
                  </p>
                </div>

                <div style={{ background: "#f0fdfa", padding: "0.85rem", borderRadius: 10, border: "1px solid rgba(13, 148, 136, 0.3)" }}>
                  <h4 style={{ margin: "0 0 0.35rem 0", fontSize: "0.85rem", color: "#0d9488" }}>Special Portfolios</h4>
                  <p style={{ margin: 0, fontSize: "0.78rem", color: "#475569", lineHeight: 1.5 }}>
                    Lead Mentor for Inter-School Math Olympiad, Member of Curriculum Moderation Board, Assistant Housemaster (Aravali House).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          VIEW 6: DEDICATED FULL SCREEN — FACULTY AI SPACE
          ======================================================== */}
      {currentScreen === "aispace" && (
        <section className="student-fullscreen-page">
          <div className="kiosk-orb kiosk-orb-one" />
          <div className="kiosk-orb kiosk-orb-two" />

          {/* SCREEN HEADER WITH PROMINENT BACK BUTTON */}
          <div className="student-screen-subnav">
            <button className="student-back-to-dash-btn" onClick={() => setCurrentScreen("dashboard")}>
              <ArrowLeft size={16} /> Back to Dashboard
            </button>

            <div className="student-screen-title-area">
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "2px solid #0d9488",
                  boxShadow: "0 4px 14px rgba(13, 148, 136, 0.25)",
                  flexShrink: 0,
                  background: "#fff",
                }}
              >
                <img src="/ai_robot.png" alt="GreenBot" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div>
                <h2>Faculty AI Assistant & Academic Workspace</h2>
                <p>Interactive Teaching Assistant • {staffName} ({staffDept})</p>
              </div>
            </div>

            <div className="student-screen-nav-tools">
              <button
                className="student-refresh-btn"
                onClick={() =>
                  setChatMessages([
                    {
                      id: "welcome-staff-reset",
                      sender: "bot",
                      text: "Faculty assistant refreshed! How can GreenBot assist with your lesson plans, student grading, or meetings?",
                      time: "Just now",
                      suggestions: ["What are my classes today?", "Show student grading status", "Upcoming staff meetings?"],
                    },
                  ])
                }
                title="Clear conversation"
              >
                <RefreshCw size={13} /> Reset Chat
              </button>
              <span
                style={{
                  background: "#f0fdfa",
                  color: "#0d9488",
                  padding: "0.32rem 0.75rem",
                  borderRadius: 9999,
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  border: "1px solid rgba(13, 148, 136, 0.3)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#0d9488" }} />
                Faculty AI Active
              </span>
            </div>
          </div>

          {/* SCREEN MAIN BODY (SPLIT 2 COLUMNS) */}
          <div className="student-screen-scroll-body" style={{ overflow: "hidden" }}>
            <div className="ai-space-screen-layout">
              {/* LEFT SIDEBAR: ROBOT SHOWCASE & QUICK TOPICS */}
              <aside className="ai-space-persona-card">
                <div className="ai-robot-hero-box">
                  <div className="ai-robot-showcase-frame">
                    <img src="/ai_robot.png" alt="GreenBot" className="ai-robot-showcase-img" />
                  </div>
                  <h3>GreenBot Faculty AI</h3>
                  <p>Pedagogical Teaching Partner</p>
                </div>

                <div className="ai-speech-bubble-intro">
                  &ldquo;Greetings Mr. {staffName}! I can help summarize your 5 daily teaching periods, compile student assessment rosters, draft lesson plan concepts, or prepare meeting agendas.&rdquo;
                </div>

                <div className="ai-quick-topics-list">
                  <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.15rem" }}>
                    Common Faculty Prompts
                  </div>
                  <button className="ai-topic-chip-btn" onClick={() => handleSendChatMessage("What are my classes today?")}>
                    <BookOpen size={13} style={{ color: "#0d9488" }} /> Today&apos;s Class Schedule
                  </button>
                  <button className="ai-topic-chip-btn" onClick={() => handleSendChatMessage("Show student grading status")}>
                    <BarChart3 size={13} style={{ color: "#7c3aed" }} /> Class 10A Grading Status
                  </button>
                  <button className="ai-topic-chip-btn" onClick={() => handleSendChatMessage("Upcoming staff meetings?")}>
                    <CalendarDays size={13} style={{ color: "#ea580c" }} /> Faculty Sync & PTM Schedule
                  </button>
                  <button className="ai-topic-chip-btn" onClick={() => handleSendChatMessage("Lesson plan for Quadratic Equations")}>
                    <Sparkles size={13} style={{ color: "#0284c7" }} /> Lesson Plan: Quadratics
                  </button>
                  <button className="ai-topic-chip-btn" onClick={() => handleSendChatMessage("CBSE Term-2 assessment guidelines")}>
                    <FileCheck size={13} style={{ color: "#16a34a" }} /> CBSE Assessment Rubrics
                  </button>
                </div>

                {/* Faculty Context Card */}
                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "10px",
                    padding: "0.55rem 0.75rem",
                    fontSize: "0.68rem",
                    color: "#64748b",
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                  }}
                >
                  <div style={{ fontWeight: 800, color: "#1e293b" }}>{staffName} ({empId})</div>
                  <div>{staffDept} • {staffRoom}</div>
                  <div>Classes: 6A, 7B, 8A, 9B, 10A</div>
                </div>
              </aside>

              {/* RIGHT MAIN CHAT AREA */}
              <div className="ai-space-chat-card">
                {/* Mini Header */}
                <div className="ai-chat-header">
                  <div className="ai-chat-header-left">
                    <Sparkles size={16} style={{ color: "#0d9488" }} />
                    <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "#1e293b" }}>
                      Academic Assistant & Lesson Planner
                    </span>
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "#64748b" }}>
                    Active Context: <strong style={{ color: "#0d9488" }}>Senior Faculty</strong>
                  </div>
                </div>

                {/* Messages Stream */}
                <div className="ai-chat-messages-stream">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`ai-msg-row ${msg.sender === "bot" ? "ai-msg-row-bot" : "ai-msg-row-user"}`}
                    >
                      {msg.sender === "bot" ? (
                        <img src="/ai_robot.png" alt="GreenBot" className="ai-msg-avatar" style={{ border: "2px solid #0d9488" }} />
                      ) : (
                        <img src={session?.img || "/staff_avatar.png"} alt={staffName} className="ai-msg-avatar" style={{ border: "2px solid #0d9488" }} />
                      )}

                      <div className="ai-msg-content-wrap">
                        <div className="ai-msg-sender-meta">
                          <span>{msg.sender === "bot" ? "GreenBot" : staffName}</span>
                          {msg.sender === "bot" && (
                            <span
                              style={{
                                background: "#f0fdfa",
                                color: "#0d9488",
                                fontSize: "0.6rem",
                                padding: "1px 5px",
                                borderRadius: 4,
                                fontWeight: 800,
                              }}
                            >
                              Faculty AI
                            </span>
                          )}
                          <span>• {msg.time}</span>
                        </div>

                        <div className={`ai-bubble ${msg.sender === "bot" ? "ai-bubble-bot" : "ai-bubble-user"}`}>
                          <div style={{ whiteSpace: "pre-wrap" }}>{msg.text}</div>

                          {msg.suggestions && msg.suggestions.length > 0 && (
                            <div className="ai-msg-suggestions-bar">
                              {msg.suggestions.map((sug, sIdx) => (
                                <button
                                  key={sIdx}
                                  className="ai-msg-suggestion-chip"
                                  onClick={() => handleSendChatMessage(sug)}
                                >
                                  {sug}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="ai-msg-row ai-msg-row-bot">
                      <img src="/ai_robot.png" alt="GreenBot" className="ai-msg-avatar" style={{ border: "2px solid #0d9488" }} />
                      <div className="ai-typing-indicator">
                        <span className="ai-typing-dot" />
                        <span className="ai-typing-dot" />
                        <span className="ai-typing-dot" />
                      </div>
                    </div>
                  )}

                  <div ref={chatMessagesEndRef} />
                </div>

                {/* Quick Prompts Bar */}
                <div className="ai-quick-prompts-bar">
                  <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#94a3b8", flexShrink: 0 }}>
                    Quick Prompts:
                  </span>
                  <button className="ai-quick-prompt-btn" onClick={() => handleSendChatMessage("What are my classes today?")}>
                    📖 Today&apos;s Classes
                  </button>
                  <button className="ai-quick-prompt-btn" onClick={() => handleSendChatMessage("Show student grading status")}>
                    📊 Grading Status
                  </button>
                  <button className="ai-quick-prompt-btn" onClick={() => handleSendChatMessage("Upcoming staff meetings?")}>
                    🗓️ Staff Meetings
                  </button>
                  <button className="ai-quick-prompt-btn" onClick={() => handleSendChatMessage("Lesson plan for Quadratic Equations")}>
                    📐 Lesson Plan
                  </button>
                </div>

                {/* Chat Input Bar */}
                <div className="ai-chat-input-bar">
                  <input
                    type="text"
                    className="ai-chat-text-input"
                    placeholder="Ask GreenBot about your classes, lesson plans, or grading rosters..."
                    value={chatInputText}
                    onChange={(e) => setChatInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSendChatMessage();
                      }
                    }}
                  />
                  <button
                    className="ai-chat-send-btn"
                    style={{ background: "#0d9488" }}
                    onClick={() => handleSendChatMessage()}
                    title="Send message to GreenBot"
                  >
                    <Send size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* COMPACT COMMAND FOOTER */}
      <footer className="command-footer" style={{ marginTop: "auto", borderTop: "1px solid rgba(254, 215, 170, 0.5)", background: "rgba(255, 255, 255, 0.88)" }}>
        <div><span className="footer-dot" /> Official Faculty Academic Command Portal</div>
        <div className="footer-links">
          <span>CBSE Affiliation 1930421</span>
          <span>NAAC Grade A++</span>
          <span>Faculty Roster Online</span>
          <span>VAPS Cloud Connected</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.74rem", fontWeight: 700, color: "#16a34a" }}>
          <ShieldCheck size={14} /> Safe &amp; Encrypted Kiosk
        </div>
      </footer>

      {/* ========================================================
          VIDEO TOUR MODAL PLAYER
          ======================================================== */}
      {isVideoModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.85)",
            backdropFilter: "blur(8px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
          onClick={() => setIsVideoModalOpen(false)}
        >
          <div
            style={{
              background: "#0f172a",
              borderRadius: "16px",
              maxWidth: "800px",
              width: "100%",
              overflow: "hidden",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
              border: "1px solid rgba(254, 215, 170, 0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.75rem 1.25rem",
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Play size={16} fill="#0d9488" color="#0d9488" />
                <span style={{ color: "#ffffff", fontWeight: 700, fontSize: "0.85rem" }}>
                  Green Valley Campus & Facilities Showcase Tour
                </span>
              </div>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                style={{
                  border: "none",
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "50%",
                  width: 30,
                  height: 30,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#ffffff",
                }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, background: "#000000" }}>
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1"
                title="Green Valley Campus Facilities Tour"
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div
              style={{
                padding: "0.75rem 1.25rem",
                background: "#0f172a",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color: "#94a3b8",
                fontSize: "0.75rem",
              }}
            >
              <span>Physics & Chemistry Labs • STEM Studio • Central Library • Seminar Auditoriums</span>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                style={{
                  padding: "0.35rem 0.85rem",
                  background: "#0d9488",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: 6,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: "0.75rem",
                }}
              >
                Close Player
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          OFFICIAL NOTICE DETAILS MODAL
          ======================================================== */}
      {selectedNotice && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(5px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
          onClick={() => setSelectedNotice(null)}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              maxWidth: "540px",
              width: "100%",
              overflow: "hidden",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
              border: "1px solid rgba(254, 215, 170, 0.7)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.9rem 1.25rem",
                borderBottom: "1px solid #f1f5f9",
                background: "linear-gradient(180deg, #ffffff 0%, #f0fdfa 100%)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span
                  style={{
                    padding: "2px 8px",
                    borderRadius: 6,
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    background: selectedNotice.tagBg,
                    color: selectedNotice.tagColor,
                  }}
                >
                  {selectedNotice.tag}
                </span>
                <span style={{ fontSize: "0.72rem", color: "#64748b" }}>{selectedNotice.time}</span>
              </div>
              <button
                onClick={() => setSelectedNotice(null)}
                style={{
                  border: "none",
                  background: "#e2e8f0",
                  borderRadius: "50%",
                  width: 28,
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#475569",
                }}
              >
                <X size={15} />
              </button>
            </div>

            <div style={{ padding: "1.25rem" }}>
              <h3
                style={{
                  margin: "0 0 0.4rem 0",
                  fontSize: "1.05rem",
                  fontWeight: 800,
                  color: "#1e293b",
                  fontFamily: "Outfit, sans-serif",
                }}
              >
                {selectedNotice.title}
              </h3>
              <div style={{ fontSize: "0.72rem", color: "#0d9488", fontWeight: 700, marginBottom: "0.85rem" }}>
                Issued by: {selectedNotice.authority} • Date: {selectedNotice.date}
              </div>
              <div
                style={{
                  background: "#fffcf9",
                  padding: "0.9rem",
                  borderRadius: 10,
                  border: "1px solid rgba(254, 215, 170, 0.5)",
                  fontSize: "0.8rem",
                  color: "#334155",
                  lineHeight: 1.6,
                }}
              >
                {selectedNotice.details}
              </div>
            </div>

            <div
              style={{
                padding: "0.75rem 1.25rem",
                borderTop: "1px solid #f1f5f9",
                background: "#f8fafc",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setSelectedNotice(null)}
                style={{
                  padding: "0.38rem 1.15rem",
                  borderRadius: 8,
                  border: "1px solid rgba(13, 148, 136, 0.3)",
                  background: "#0d9488",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  color: "#ffffff",
                }}
              >
                Close Circular
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
