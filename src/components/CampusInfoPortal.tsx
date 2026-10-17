"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  GraduationCap,
  Users,
  Leaf,
  ArrowRight,
  BookOpen,
  Settings,
  Star,
  Heart,
  Trophy,
  Camera,
  Play,
  MapPin,
  Quote,
  Megaphone,
  ChevronRight,
  User,
  X,
  Send,
  ArrowLeft,
  Sparkles,
  Maximize,
  Minimize,
  Clock,
  Award,
  ShieldCheck,
  Cpu,
  Tv,
  Activity,
  CheckCircle2,
  Bus,
  FileText,
  CreditCard,
  School,
  Building2,
} from "lucide-react";

export interface CampusInfoPortalProps {
  onEnterRoleSelection: () => void;
  isFullscreen?: boolean;
  toggleFullscreen?: (e?: React.MouseEvent) => void;
  currentTime?: Date | null;
}

export default function CampusInfoPortal({
  onEnterRoleSelection,
  isFullscreen: externalIsFullscreen,
  toggleFullscreen: externalToggleFullscreen,
  currentTime: externalCurrentTime,
}: CampusInfoPortalProps) {
  const [internalTime, setInternalTime] = useState<Date | null>(null);
  const [internalIsFullscreen, setInternalIsFullscreen] = useState(false);
  const [botModalOpen, setBotModalOpen] = useState(false);
  const [botChatInput, setBotChatInput] = useState("");
  const [botChatMessages, setBotChatMessages] = useState<
    Array<{ sender: "user" | "bot"; text: string }>
  >([
    {
      sender: "bot",
      text: "Hello! Welcome to Green Valley Public School. Click anywhere or select your role to proceed to your portal.",
    },
  ]);

  useEffect(() => {
    document.title = "Campus Information Portal | Green Valley Public School";
    setInternalTime(new Date());
    const timer = setInterval(() => setInternalTime(new Date()), 1000);

    const handleFsChange = () => {
      setInternalIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);

    return () => {
      clearInterval(timer);
      document.removeEventListener("fullscreenchange", handleFsChange);
    };
  }, []);

  const currentTime = externalCurrentTime || internalTime;
  const isFullscreen = externalIsFullscreen !== undefined ? externalIsFullscreen : internalIsFullscreen;

  const toggleFullscreen = (e?: React.MouseEvent) => {
    if (externalToggleFullscreen) {
      externalToggleFullscreen(e);
      return;
    }
    if (e) e.stopPropagation();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(console.error);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleSendBotMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg = text.trim();
    setBotChatMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setBotChatInput("");

    setTimeout(() => {
      let reply =
        "Please click anywhere on the page or tap 'Enter Role Selection Portal' to view the role cards (Student, Staff, Visitor, Alumni).";
      if (userMsg.toLowerCase().includes("admission")) {
        reply =
          "Admissions for Academic Year 2026-27 are currently open for Classes Nursery to 9. Contact admissions desk at ext. 104.";
      } else if (
        userMsg.toLowerCase().includes("fee") ||
        userMsg.toLowerCase().includes("fees")
      ) {
        reply =
          "Term fee details and online payment can be accessed directly from the Student/Parent Dashboard or Visitor Portal.";
      } else if (
        userMsg.toLowerCase().includes("time") ||
        userMsg.toLowerCase().includes("hour")
      ) {
        reply =
          "School hours are 08:00 AM to 03:00 PM (Monday to Friday) and 08:00 AM to 12:30 PM on alternate Saturdays.";
      }
      setBotChatMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    }, 600);
  };

  return (
    <>
      <main className="kiosk-command-center hp-wrapper">
        <div className="kiosk-orb kiosk-orb-one" />
        <div className="kiosk-orb kiosk-orb-two" />



        <div className="hp-container">
          {/* UNIFIED COMMAND CENTER HEADER & TELEMETRY */}
          <header className="hp-unified-header">
            {/* LEFT: School Branding & Portal Identity (One Clean Brand & Portal Title) */}
            <div className="hp-header-branding">
              <div className="command-mark" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 48 48" fill="none">
                  <path d="M24 7c4 4 10 6 14 3 0 8-7 13-14 14C17 23 10 18 10 10c4 3 10 1 14-3Z" fill="#f97316" />
                  <path d="M24 24V11" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M5 36c7-4.5 13-3.5 19 1 6-4.5 12-5.5 19-1V18c-7-4.5-13-3.5-19 1-6-4.5-12-5.5-19-1v18Z" fill="#c2410c" />
                  <path d="M24 19v18" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>

              <div className="hp-header-info">
                <div className="hp-header-title-row">
                  <h1 className="hp-brand-name">Green Valley Public School</h1>
                  <span className="hp-portal-pill">
                    <Building2 size={12} />
                    Campus Information Portal
                  </span>
                </div>
                <div className="hp-header-sub">
                  <ShieldCheck size={11} />
                  <span>CBSE Affiliated Sr. Secondary (1930281)</span>
                  <i />
                  <Activity size={11} />
                  <span>Live Smart Campus Telemetry</span>
                  <i />
                  <span>Est. 1999</span>
                </div>
              </div>
            </div>

            {/* CENTER: Key School Telemetry Stats Pills */}
            <div className="hp-header-stats">
              <div className="hp-stat-pill">
                <div className="hp-stat-icon bg-emerald-600">
                  <GraduationCap size={13} />
                </div>
                <div>
                  <div className="hp-stat-num">25+ Yrs</div>
                  <div className="hp-stat-desc">Legacy</div>
                </div>
              </div>

              <div className="hp-stat-pill">
                <div className="hp-stat-icon bg-purple-600">
                  <Users size={13} />
                </div>
                <div>
                  <div className="hp-stat-num">6,200+</div>
                  <div className="hp-stat-desc">Students</div>
                </div>
              </div>

              <div className="hp-stat-pill">
                <div className="hp-stat-icon bg-amber-600">
                  <Award size={13} />
                </div>
                <div>
                  <div className="hp-stat-num">180+</div>
                  <div className="hp-stat-desc">Faculty</div>
                </div>
              </div>

              <div className="hp-stat-pill">
                <div className="hp-stat-icon bg-sky-600">
                  <Trophy size={13} />
                </div>
                <div>
                  <div className="hp-stat-num">100%</div>
                  <div className="hp-stat-desc">Board Pass</div>
                </div>
              </div>

              <div className="hp-stat-pill">
                <div className="hp-stat-icon bg-indigo-600">
                  <Cpu size={13} />
                </div>
                <div>
                  <div className="hp-stat-num">45</div>
                  <div className="hp-stat-desc">Smart Labs</div>
                </div>
              </div>
            </div>

            {/* RIGHT: Live Actions & Telemetry Clock */}
            <div className="command-actions">
              <div className="command-live-status"><span /> Campus online</div>
              <div className="command-time">
                <Calendar size={15} />
                <span>{currentTime ? formatDate(currentTime) : "Tue, 23 Sep 2025"}</span>
                <b>{currentTime ? formatTime(currentTime) : "10:24 AM"}</b>
              </div>

              <button
                className="command-fullscreen"
                onClick={toggleFullscreen}
                title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen Mode"}
              >
                {isFullscreen ? <Minimize size={15} /> : <Maximize size={15} />}
                <span>{isFullscreen ? "Exit" : "Full screen"}</span>
              </button>
            </div>
          </header>

          {/* 3. EDUCATION NEWS TICKER */}
          <div className="hp-news-bar">
            <div className="hp-news-badge">
              <Megaphone size={14} />
              <span>Education News</span>
            </div>
            <div className="hp-news-scroll-wrap">
              <div className="hp-news-scroll-content">
                <span>
                  <b>CBSE:</b> CBSE announces 2026 board exam pattern with more competency-based questions
                </span>
                <span>|</span>
                <span>
                  <b>NEP 2020:</b> Focus on AI and coding from middle school
                </span>
                <span>|</span>
                <span>
                  <b>State Govt:</b> Karnataka govt. expands free bus service for students
                </span>
                <span>|</span>
                <span>
                  <b>Education Index:</b> India ranks higher in global education index 2025
                </span>
              </div>
            </div>
            <ChevronRight size={18} className="hp-news-arrow" />
          </div>

          {/* 4. MIDDLE 4-COLUMN GRID */}
          <div className="hp-middle-grid">
            {/* CARD 1: OUR ACHIEVEMENTS */}
            <div className="hp-card">
              <div className="hp-card-title-row">
                <div className="hp-card-heading">
                  <div className="hp-card-icon-pill bg-amber-50 text-amber-600">
                    <Trophy size={15} />
                  </div>
                  <span>Our Achievements</span>
                  <span className="hp-header-badge gold">5 Recent</span>
                </div>
                <span className="hp-view-all">
                  View All <ArrowRight size={12} />
                </span>
              </div>

              <div className="hp-achievements-list">
                {/* Item 1 */}
                <div className="hp-achieve-card hp-data-card">
                  <div className="hp-achieve-databox gold">
                    <span className="hp-databox-rank">1st</span>
                    <span className="hp-databox-score">98/100</span>
                  </div>
                  <div className="hp-achieve-content">
                    <div className="hp-achieve-header">
                      <span className="hp-achieve-tag gold">District Champion</span>
                      <span className="hp-achieve-date">Aug 2025</span>
                    </div>
                    <h4 className="hp-achieve-title">Inter-School Mathematics Quiz</h4>
                    <p className="hp-achieve-desc">
                      Team of 4 • 42 Schools Competed • Final Round 100% Accuracy
                    </p>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="hp-achieve-card hp-data-card">
                  <div className="hp-achieve-databox amber">
                    <span className="hp-databox-rank">MVP</span>
                    <span className="hp-databox-score">4w & 84r</span>
                  </div>
                  <div className="hp-achieve-content">
                    <div className="hp-achieve-header">
                      <span className="hp-achieve-tag amber">Best Player Award</span>
                      <span className="hp-achieve-date">Sep 2025</span>
                    </div>
                    <h4 className="hp-achieve-title">Inter-School Cricket Tournament</h4>
                    <p className="hp-achieve-desc">
                      Under-16 Finals Winner • 84 runs off 42 balls & 3 wickets
                    </p>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="hp-achieve-card hp-data-card">
                  <div className="hp-achieve-databox slate">
                    <span className="hp-databox-rank">2nd</span>
                    <span className="hp-databox-score">96.5%</span>
                  </div>
                  <div className="hp-achieve-content">
                    <div className="hp-achieve-header">
                      <span className="hp-achieve-tag slate">2nd Place Silver</span>
                      <span className="hp-achieve-date">Aug 2025</span>
                    </div>
                    <h4 className="hp-achieve-title">State Science & Innovation Fair</h4>
                    <p className="hp-achieve-desc">
                      Eco-Smart Solar Grid Model • 68 Projects Evaluated
                    </p>
                  </div>
                </div>

                {/* Item 4 */}
                <div className="hp-achieve-card hp-data-card">
                  <div className="hp-achieve-databox purple">
                    <span className="hp-databox-rank">1st</span>
                    <span className="hp-databox-score">100/100</span>
                  </div>
                  <div className="hp-achieve-content">
                    <div className="hp-achieve-header">
                      <span className="hp-achieve-tag purple">National Olympiad</span>
                      <span className="hp-achieve-date">Sep 2025</span>
                    </div>
                    <h4 className="hp-achieve-title">All-India Cyber & Coding Olympiad</h4>
                    <p className="hp-achieve-desc">
                      Gold Medalist • All-India Rank 1 • Junior AI Innovation Award
                    </p>
                  </div>
                </div>

                {/* Item 5 */}
                <div className="hp-achieve-card hp-data-card">
                  <div className="hp-achieve-databox emerald">
                    <span className="hp-databox-rank">Win</span>
                    <span className="hp-databox-score">12 Gold</span>
                  </div>
                  <div className="hp-achieve-content">
                    <div className="hp-achieve-header">
                      <span className="hp-achieve-tag emerald">CBSE Cluster VII</span>
                      <span className="hp-achieve-date">Aug 2025</span>
                    </div>
                    <h4 className="hp-achieve-title">CBSE South Zone Athletics Meet</h4>
                    <p className="hp-achieve-desc">
                      Overall Championship Trophy • 12 Gold, 8 Silver Medals
                    </p>
                  </div>
                </div>
              </div>

              {/* Achievements Summary Footer Strip */}
              <div className="hp-achieve-footer-strip">
                <Award size={13} className="text-amber-600" />
                <span>100+ State Trophies • 100% Board Pass Rate • Grade A++</span>
              </div>
            </div>

            {/* CARD 2: UPCOMING EVENTS */}
            <div className="hp-card">
              <div className="hp-card-title-row">
                <div className="hp-card-heading">
                  <div className="hp-card-icon-pill bg-sky-50 text-sky-600">
                    <Calendar size={15} />
                  </div>
                  <span>Upcoming Events</span>
                  <span className="hp-header-badge sky">5 Upcoming</span>
                </div>
                <span className="hp-view-all">
                  Calendar <ArrowRight size={12} />
                </span>
              </div>

              <div className="hp-events-list">
                {/* Event 1 */}
                <div className="hp-event-card">
                  <div className="hp-event-date-box bg-emerald-50 text-emerald-700 border-emerald-200">
                    <span className="hp-event-day">25</span>
                    <span className="hp-event-month">Sep</span>
                  </div>
                  <div className="hp-event-details">
                    <div className="hp-event-meta-row">
                      <span className="hp-event-tag cat-emerald">Academics</span>
                      <span className="hp-event-time">
                        <Clock size={10} /> 10:00 AM – 12:00 PM
                      </span>
                    </div>
                    <h4 className="hp-event-title">Parent Teacher Meeting</h4>
                    <p className="hp-event-venue">
                      <MapPin size={10} /> Main Auditorium • All Classes
                    </p>
                  </div>
                </div>

                {/* Event 2 */}
                <div className="hp-event-card">
                  <div className="hp-event-date-box bg-amber-50 text-amber-700 border-amber-200">
                    <span className="hp-event-day">28</span>
                    <span className="hp-event-month">Sep</span>
                  </div>
                  <div className="hp-event-details">
                    <div className="hp-event-meta-row">
                      <span className="hp-event-tag cat-amber">Sports</span>
                      <span className="hp-event-time">
                        <Clock size={10} /> 04:00 PM – 06:00 PM
                      </span>
                    </div>
                    <h4 className="hp-event-title">Annual Sports Day Practice</h4>
                    <p className="hp-event-venue">
                      <MapPin size={10} /> Campus Playground • Track & Field
                    </p>
                  </div>
                </div>

                {/* Event 3 */}
                <div className="hp-event-card">
                  <div className="hp-event-date-box bg-sky-50 text-sky-700 border-sky-200">
                    <span className="hp-event-day">02</span>
                    <span className="hp-event-month">Oct</span>
                  </div>
                  <div className="hp-event-details">
                    <div className="hp-event-meta-row">
                      <span className="hp-event-tag cat-sky">Science</span>
                      <span className="hp-event-time">
                        <Clock size={10} /> 09:30 AM – 03:30 PM
                      </span>
                    </div>
                    <h4 className="hp-event-title">District Science Expo 2026</h4>
                    <p className="hp-event-venue">
                      <MapPin size={10} /> Discovery Block Labs • Open Access
                    </p>
                  </div>
                </div>

                {/* Event 4 */}
                <div className="hp-event-card">
                  <div className="hp-event-date-box bg-pink-50 text-pink-700 border-pink-200">
                    <span className="hp-event-day">10</span>
                    <span className="hp-event-month">Oct</span>
                  </div>
                  <div className="hp-event-details">
                    <div className="hp-event-meta-row">
                      <span className="hp-event-tag cat-pink">Festival</span>
                      <span className="hp-event-time">
                        <Clock size={10} /> 09:00 AM – 01:00 PM
                      </span>
                    </div>
                    <h4 className="hp-event-title">Children&apos;s Day Celebration</h4>
                    <p className="hp-event-venue">
                      <MapPin size={10} /> School Auditorium • Cultural Stage
                    </p>
                  </div>
                </div>

                {/* Event 5 */}
                <div className="hp-event-card">
                  <div className="hp-event-date-box bg-indigo-50 text-indigo-700 border-indigo-200">
                    <span className="hp-event-day">18</span>
                    <span className="hp-event-month">Oct</span>
                  </div>
                  <div className="hp-event-details">
                    <div className="hp-event-meta-row">
                      <span className="hp-event-tag cat-indigo">Cultural</span>
                      <span className="hp-event-time">
                        <Clock size={10} /> 02:00 PM – 05:00 PM
                      </span>
                    </div>
                    <h4 className="hp-event-title">Inter-House Debate & Elocution</h4>
                    <p className="hp-event-venue">
                      <MapPin size={10} /> Senior Activity Hall • Live Broadcast
                    </p>
                  </div>
                </div>
              </div>

              {/* Events Summary Footer Strip */}
              <div className="hp-event-footer-strip">
                <Calendar size={13} className="text-sky-600" />
                <span>Academic Term II Active • 14 Scheduled Campus Events</span>
              </div>
            </div>

            {/* CARD 3: RECENT HIGHLIGHTS */}
            <div className="hp-card">
              <div className="hp-card-title-row">
                <div className="hp-card-heading">
                  <div className="hp-card-icon-pill bg-teal-50 text-teal-600">
                    <Camera size={15} />
                  </div>
                  <span>Recent Highlights</span>
                  <span className="hp-header-badge teal">5 Highlights</span>
                </div>
                <span className="hp-view-all">
                  Gallery <ArrowRight size={12} />
                </span>
              </div>

              <div className="hp-highlights-list">
                {/* Highlight 1 */}
                <div className="hp-highlight-card hp-data-card">
                  <div className="hp-highlight-databox teal">
                    <span className="hp-databox-num">500+</span>
                    <span className="hp-databox-label">Audience</span>
                  </div>
                  <div className="hp-highlight-content">
                    <div className="hp-highlight-header">
                      <h4 className="hp-highlight-title">Annual Cultural Gala</h4>
                      <span className="hp-highlight-badge teal">Gala</span>
                    </div>
                    <p className="hp-highlight-desc">
                      48 Stage Performances • 6 Inter-House Dramas • Grand Symphony
                    </p>
                    <div className="hp-highlight-meta">
                      <span>Sep 2025</span>
                      <span>•</span>
                      <span>Main Auditorium</span>
                    </div>
                  </div>
                </div>

                {/* Highlight 2 */}
                <div className="hp-highlight-card hp-data-card">
                  <div className="hp-highlight-databox amber">
                    <span className="hp-databox-num">1,200</span>
                    <span className="hp-databox-label">Athletes</span>
                  </div>
                  <div className="hp-highlight-content">
                    <div className="hp-highlight-header">
                      <h4 className="hp-highlight-title">Inter-House Sports Parade</h4>
                      <span className="hp-highlight-badge amber">Athletics</span>
                    </div>
                    <p className="hp-highlight-desc">
                      32 Championship Events • 4 Houses • Ruby House Overall Trophy
                    </p>
                    <div className="hp-highlight-meta">
                      <span>Aug 2025</span>
                      <span>•</span>
                      <span>Athletic Stadium</span>
                    </div>
                  </div>
                </div>

                {/* Highlight 3 */}
                <div className="hp-highlight-card hp-data-card">
                  <div className="hp-highlight-databox sky">
                    <span className="hp-databox-num">45+</span>
                    <span className="hp-databox-label">Projects</span>
                  </div>
                  <div className="hp-highlight-content">
                    <div className="hp-highlight-header">
                      <h4 className="hp-highlight-title">Robotics & Science Expo</h4>
                      <span className="hp-highlight-badge sky">Innovation</span>
                    </div>
                    <p className="hp-highlight-desc">
                      AI, IoT & Drone Demonstrations • 1,100 Community Visitors
                    </p>
                    <div className="hp-highlight-meta">
                      <span>Aug 2025</span>
                      <span>•</span>
                      <span>STEM Labs Block</span>
                    </div>
                  </div>
                </div>

                {/* Highlight 4 */}
                <div className="hp-highlight-card hp-data-card">
                  <div className="hp-highlight-databox purple">
                    <span className="hp-databox-num">85</span>
                    <span className="hp-databox-label">Honor</span>
                  </div>
                  <div className="hp-highlight-content">
                    <div className="hp-highlight-header">
                      <h4 className="hp-highlight-title">Teachers Day Felicitation</h4>
                      <span className="hp-highlight-badge purple">Honors</span>
                    </div>
                    <p className="hp-highlight-desc">
                      12 Distinguished Teaching Citations • Full Faculty Recognition
                    </p>
                    <div className="hp-highlight-meta">
                      <span>Sep 2025</span>
                      <span>•</span>
                      <span>Staff Council</span>
                    </div>
                  </div>
                </div>

                {/* Highlight 5 */}
                <div className="hp-highlight-card hp-data-card">
                  <div className="hp-highlight-databox emerald">
                    <span className="hp-databox-num">24</span>
                    <span className="hp-databox-label">Teams</span>
                  </div>
                  <div className="hp-highlight-content">
                    <div className="hp-highlight-header">
                      <h4 className="hp-highlight-title">Inter-School Model UN Summit</h4>
                      <span className="hp-highlight-badge emerald">Diplomacy</span>
                    </div>
                    <p className="hp-highlight-desc">
                      UNEP & Security Council Debates • 6 Best Delegate Awards
                    </p>
                    <div className="hp-highlight-meta">
                      <span>Oct 2025</span>
                      <span>•</span>
                      <span>Conference Pavilion</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Summary Footer Strip */}
              <div className="hp-highlight-footer-strip">
                <Camera size={13} className="text-teal-600" />
                <span>450+ Photo Moments Captured • Digital Campus Archives</span>
              </div>
            </div>

            {/* CARD 4: SMART CAMPUS KIOSK PORTAL (FILLED WITH SCHOOL SERVICES & LIVE TELEMETRY) */}
            <div className="hp-card hp-login-card">
              <div className="hp-login-top">
                <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                  <div className="hp-login-icon-box">
                    <School size={16} />
                  </div>
                  <div>
                    <h3 className="hp-card-heading" style={{ fontSize: "0.85rem", margin: 0 }}>Smart Campus Portal</h3>
                    <p style={{ margin: "1px 0 0", fontSize: "0.58rem", color: "#64748b", fontWeight: 700 }}>Terminal #01 • Main Kiosk</p>
                  </div>
                </div>
                <span className="hp-login-chip">
                  <span className="footer-dot" style={{ width: "5px", height: "5px", display: "inline-block", background: "#16a34a" }} /> Active
                </span>
              </div>

              <div className="hp-login-center-body">
                {/* 3D CHARACTER AVATAR STAGE WITH WELCOME MESSAGE */}
                <div className="hp-student-stage">
                  <img
                    src="/student_avatar.png"
                    alt="3D Student"
                    className="hp-student-img"
                  />
                  <div className="hp-student-speech-box">
                    <span className="hp-student-speech-title">👋 Welcome to GVPS!</span>
                    <span className="hp-student-speech-desc">Tap below or use RFID card to access portal.</span>
                  </div>
                  <div className="hp-student-stage-badge">
                    3D Kiosk
                  </div>
                </div>

                {/* IMPORTANT KIOSK NOTICE BANNER */}
                <div className="hp-kiosk-note-banner">
                  <div className="hp-kiosk-note-icon">
                    <Megaphone size={14} />
                  </div>
                  <div className="hp-kiosk-note-body">
                    <div className="hp-kiosk-note-header">
                      <span className="hp-kiosk-note-badge">Campus Notice</span>
                      <span className="hp-kiosk-note-status">● Active Self-Service</span>
                    </div>
                    <p className="hp-kiosk-note-desc">
                      Tap any service tile below for instant report cards, UPI fee payments, homework notes &amp; live bus tracking.
                    </p>
                  </div>
                </div>

                {/* 4 INSTANT SCHOOL SELF-SERVICE KIOSK TILES */}
                <div className="hp-school-services-grid">
                  <div className="hp-school-serv-item">
                    <div className="hp-school-serv-top">
                      <div className="hp-school-serv-icon bg-sky-50 text-sky-600">
                        <FileText size={15} />
                      </div>
                      <span className="hp-serv-chip sky">Print Ready</span>
                    </div>
                    <div className="hp-school-serv-text">
                      <strong className="hp-school-serv-title">Exam Marks &amp; Cards</strong>
                      <span className="hp-school-serv-desc">Print Term Report Card</span>
                    </div>
                    <span className="hp-serv-action-hint">Self-Service Kiosk</span>
                  </div>

                  <div className="hp-school-serv-item">
                    <div className="hp-school-serv-top">
                      <div className="hp-school-serv-icon bg-emerald-50 text-emerald-600">
                        <CreditCard size={15} />
                      </div>
                      <span className="hp-serv-chip emerald">Instant UPI</span>
                    </div>
                    <div className="hp-school-serv-text">
                      <strong className="hp-school-serv-title">Fee &amp; Dues Payment</strong>
                      <span className="hp-school-serv-desc">Instant Receipt &amp; Dues</span>
                    </div>
                    <span className="hp-serv-action-hint">Self-Service Kiosk</span>
                  </div>

                  <div className="hp-school-serv-item">
                    <div className="hp-school-serv-top">
                      <div className="hp-school-serv-icon bg-purple-50 text-purple-600">
                        <BookOpen size={15} />
                      </div>
                      <span className="hp-serv-chip purple">Daily Notes</span>
                    </div>
                    <div className="hp-school-serv-text">
                      <strong className="hp-school-serv-title">Digital Diary &amp; HW</strong>
                      <span className="hp-school-serv-desc">Daily Teacher Circulars</span>
                    </div>
                    <span className="hp-serv-action-hint">Self-Service Kiosk</span>
                  </div>

                  <div className="hp-school-serv-item">
                    <div className="hp-school-serv-top">
                      <div className="hp-school-serv-icon bg-amber-50 text-amber-600">
                        <Bus size={15} />
                      </div>
                      <span className="hp-serv-chip amber">Live GPS</span>
                    </div>
                    <div className="hp-school-serv-text">
                      <strong className="hp-school-serv-title">School Bus Telemetry</strong>
                      <span className="hp-school-serv-desc">Live Route Stop ETA</span>
                    </div>
                    <span className="hp-serv-action-hint">Self-Service Kiosk</span>
                  </div>
                </div>

                {/* WHO CAN SIGN IN: ROLE PILLS */}
                <div className="hp-login-roles-preview">
                  <span className="hp-role-pill">🎓 Student &amp; Parent</span>
                  <span className="hp-role-pill">👨‍🏫 Faculty &amp; Staff</span>
                  <span className="hp-role-pill">🤝 GVian Alumni</span>
                  <span className="hp-role-pill">🏛️ Guest &amp; Visitor</span>
                </div>

                {/* QUICK 1-TOUCH SIGN IN BADGES */}
                <div className="hp-kiosk-quick-strip">
                  <div className="hp-kiosk-quick-badge">
                    <CheckCircle2 size={11} className="text-emerald-600" />
                    <span>Smart RFID Card Tap</span>
                  </div>
                  <div className="hp-kiosk-quick-badge">
                    <CheckCircle2 size={11} className="text-sky-600" />
                    <span>Admission ID &amp; PIN</span>
                  </div>
                  <div className="hp-kiosk-quick-badge">
                    <CheckCircle2 size={11} className="text-amber-600" />
                    <span>Mobile OTP</span>
                  </div>
                </div>
              </div>

              <div className="hp-login-action-wrap">
                <button
                  className="hp-login-btn"
                  onClick={onEnterRoleSelection}
                >
                  <span>Enter Role Selection Portal</span>
                  <ArrowRight size={16} />
                </button>
                <span className="hp-login-security-tag">
                  <ShieldCheck size={12} /> 256-Bit SSL Encrypted Kiosk Terminal
                </span>
              </div>
            </div>
          </div>

          {/* 5. BOTTOM GRID (CAMPUS FACILITIES & VISION) */}
          <div className="hp-bottom-grid">
            {/* EXPLORE OUR CAMPUS */}
            <div className="hp-campus-card">
              <div className="hp-campus-tour-bar">
                <div className="hp-campus-info">
                  <div className="hp-pin-icon">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h3 className="hp-campus-title">Campus Facilities & Infrastructure</h3>
                    <p className="hp-campus-desc">
                      World-class academic facilities, high-tech computer & science labs, digital library and sports arenas.
                    </p>
                  </div>
                </div>
                <button className="hp-virtual-btn">
                  <Play size={12} fill="#ffffff" />
                  <span>Start Virtual Tour</span>
                </button>
              </div>

              {/* 6 Structured Dashboard Cards */}
              <div className="hp-campus-facilities-grid">
                <div className="hp-facility-card hp-facility-datacard">
                  <div className="hp-fac-top-bar">
                    <div className="hp-fac-icon-pill bg-sky-50 text-sky-700">
                      <Tv size={16} />
                    </div>
                    <span className="hp-fac-status active">● Active</span>
                  </div>
                  <div className="hp-facility-body">
                    <div className="hp-fac-primary-metric">45 Rooms</div>
                    <h4 className="hp-facility-name">Smart Classrooms</h4>
                    <p className="hp-facility-spec">
                      4K Interactive Displays • Climate Controlled • Ergonomic Desks • Acoustic Sound
                    </p>
                    <div className="hp-facility-tags-row">
                      <span className="hp-facility-tag">100% Connected</span>
                      <span className="hp-facility-subtag">Smart Audio</span>
                    </div>
                  </div>
                </div>

                <div className="hp-facility-card hp-facility-datacard">
                  <div className="hp-fac-top-bar">
                    <div className="hp-fac-icon-pill bg-purple-50 text-purple-700">
                      <Cpu size={16} />
                    </div>
                    <span className="hp-fac-status active">● Active</span>
                  </div>
                  <div className="hp-facility-body">
                    <div className="hp-fac-primary-metric">60+ Stations</div>
                    <h4 className="hp-facility-name">Science & AI Labs</h4>
                    <p className="hp-facility-spec">
                      IoT Starter Kits • Wet Physics & Chemistry • Robotics Benches • Drones
                    </p>
                    <div className="hp-facility-tags-row">
                      <span className="hp-facility-tag">STEM Enabled</span>
                      <span className="hp-facility-subtag">AI Ready</span>
                    </div>
                  </div>
                </div>

                <div className="hp-facility-card hp-facility-datacard">
                  <div className="hp-fac-top-bar">
                    <div className="hp-fac-icon-pill bg-amber-50 text-amber-700">
                      <BookOpen size={16} />
                    </div>
                    <span className="hp-fac-status open">● Open</span>
                  </div>
                  <div className="hp-facility-body">
                    <div className="hp-fac-primary-metric">15,000+ Vol.</div>
                    <h4 className="hp-facility-name">Digital Library</h4>
                    <p className="hp-facility-spec">
                      RFID Self-Checkout • 50 Kindle Terminals • National E-Journals • Quiet Study
                    </p>
                    <div className="hp-facility-tags-row">
                      <span className="hp-facility-tag">RFID Automated</span>
                      <span className="hp-facility-subtag">Kindle Hub</span>
                    </div>
                  </div>
                </div>

                <div className="hp-facility-card hp-facility-datacard">
                  <div className="hp-fac-top-bar">
                    <div className="hp-fac-icon-pill bg-emerald-50 text-emerald-700">
                      <Activity size={16} />
                    </div>
                    <span className="hp-fac-status active">● Active</span>
                  </div>
                  <div className="hp-facility-body">
                    <div className="hp-fac-primary-metric">4 Turf Courts</div>
                    <h4 className="hp-facility-name">Sports Complex</h4>
                    <p className="hp-facility-spec">
                      Synthetic Athletic Track • 4 Cricket Nets • Multi Gym • Floodlit Courts
                    </p>
                    <div className="hp-facility-tags-row">
                      <span className="hp-facility-tag">Olympic Standard</span>
                      <span className="hp-facility-subtag">Floodlit</span>
                    </div>
                  </div>
                </div>

                <div className="hp-facility-card hp-facility-datacard">
                  <div className="hp-fac-top-bar">
                    <div className="hp-fac-icon-pill bg-indigo-50 text-indigo-700">
                      <Users size={16} />
                    </div>
                    <span className="hp-fac-status ready">● Ready</span>
                  </div>
                  <div className="hp-facility-body">
                    <div className="hp-fac-primary-metric">850 Seats</div>
                    <h4 className="hp-facility-name">Grand Auditorium</h4>
                    <p className="hp-facility-spec">
                      Dolby Surround Sound • 4K Laser Projection • Green Rooms • Acoustic Stage
                    </p>
                    <div className="hp-facility-tags-row">
                      <span className="hp-facility-tag">Dolby 7.1 Sound</span>
                      <span className="hp-facility-subtag">4K Laser</span>
                    </div>
                  </div>
                </div>

                <div className="hp-facility-card hp-facility-datacard">
                  <div className="hp-fac-top-bar">
                    <div className="hp-fac-icon-pill bg-teal-50 text-teal-700">
                      <Leaf size={16} />
                    </div>
                    <span className="hp-fac-status open">● Open</span>
                  </div>
                  <div className="hp-facility-body">
                    <div className="hp-fac-primary-metric">2.5 Acres</div>
                    <h4 className="hp-facility-name">Green Playgrounds</h4>
                    <p className="hp-facility-spec">
                      400m Athletic Track • Solar Floodlights • Eco Rain Harvesting • Grass Turf
                    </p>
                    <div className="hp-facility-tags-row">
                      <span className="hp-facility-tag">Eco-Campus</span>
                      <span className="hp-facility-subtag">400m Track</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CAMPUS VISION & INSPIRATIONAL MISSION CARD */}
            <div className="hp-quote-card">
              <Quote size={32} className="hp-quote-icon" />
              <div className="hp-quote-content">
                <p className="hp-quote-text">
                  &ldquo;Education is not just about books, it&apos;s about building character, inspiring curiosity, and shaping leaders of tomorrow.&rdquo;
                </p>
                <div className="hp-quote-footer-row">
                  <span className="hp-quote-author">— Green Valley Public School Mission</span>
                  <div className="hp-quote-badge">
                    CBSE Affiliation No. 1930281 • Est. 1999
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 6. COMMAND FOOTER */}
          <footer className="command-footer">
            <div><span className="footer-dot" /> Campus Information Portal • Digital Campus Kiosk Terminal</div>
            <div className="footer-links">
              <span>CBSE Affiliation 1930281</span>
              <span>NAAC Grade A++</span>
              <span>Campus: 6,200 Students</span>
              <span>Digital Campus Kiosk</span>
            </div>
            <button className="assistant-button" onClick={(e) => { e.stopPropagation(); setBotModalOpen(true); }}>
              <span className="assistant-pulse" /> Need help? <b>Ask GreenBot</b>
            </button>
          </footer>
        </div>
      </main>

      {/* AI CHAT BOT MODAL */}
      {botModalOpen && (
        <div
          className="hp-bot-modal"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(15, 23, 42, 0.45)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
          onClick={() => setBotModalOpen(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "520px",
              background: "#ffffff",
              borderRadius: "24px",
              overflow: "hidden",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              border: "1px solid #e2e8f0",
              display: "flex",
              flexDirection: "column",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                color: "#ffffff",
                padding: "1.25rem 1.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.85rem",
                }}
              >
                <img
                  src="/school_bot.jpg"
                  alt="School Bot"
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    border: "2px solid #ffffff",
                    objectFit: "cover",
                  }}
                />
                <div>
                  <h3
                    style={{
                      fontFamily: "Outfit, sans-serif",
                      fontSize: "1.15rem",
                      fontWeight: 700,
                    }}
                  >
                    Green Valley AI Assistant
                  </h3>
                  <p style={{ fontSize: "0.75rem", opacity: 0.9 }}>
                    Online • 24/7 School Kiosk Help
                  </p>
                </div>
              </div>
              <button
                onClick={() => setBotModalOpen(false)}
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  border: "none",
                  borderRadius: "50%",
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  cursor: "pointer",
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Suggestions */}
            <div
              style={{
                padding: "0.85rem 1.25rem",
                background: "#f8fafc",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                gap: "0.5rem",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() =>
                  handleSendBotMessage("How do I login to Student Portal?")
                }
                style={{
                  background: "#ffffff",
                  border: "1px solid #cbd5e1",
                  borderRadius: "9999px",
                  padding: "0.3rem 0.75rem",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "#0369a1",
                  cursor: "pointer",
                }}
              >
                Student Portal Info
              </button>
              <button
                onClick={() => handleSendBotMessage("What are the school hours?")}
                style={{
                  background: "#ffffff",
                  border: "1px solid #cbd5e1",
                  borderRadius: "9999px",
                  padding: "0.3rem 0.75rem",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "#0369a1",
                  cursor: "pointer",
                }}
              >
                School Hours
              </button>
              <button
                onClick={() =>
                  handleSendBotMessage("Admission details for 2026-27")
                }
                style={{
                  background: "#ffffff",
                  border: "1px solid #cbd5e1",
                  borderRadius: "9999px",
                  padding: "0.3rem 0.75rem",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "#0369a1",
                  cursor: "pointer",
                }}
              >
                Admissions
              </button>
            </div>

            {/* Messages Area */}
            <div
              style={{
                height: "280px",
                overflowY: "auto",
                padding: "1.25rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.85rem",
              }}
            >
              {botChatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    alignSelf:
                      msg.sender === "user" ? "flex-end" : "flex-start",
                    maxWidth: "85%",
                    background: msg.sender === "user" ? "#0284c7" : "#f1f5f9",
                    color: msg.sender === "user" ? "#ffffff" : "#1e293b",
                    padding: "0.65rem 0.95rem",
                    borderRadius:
                      msg.sender === "user"
                        ? "18px 18px 4px 18px"
                        : "18px 18px 18px 4px",
                    fontSize: "0.825rem",
                    lineHeight: 1.4,
                  }}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <div
              style={{
                padding: "0.85rem 1.25rem",
                borderTop: "1px solid #e2e8f0",
                display: "flex",
                gap: "0.65rem",
                background: "#ffffff",
              }}
            >
              <input
                type="text"
                placeholder="Ask our AI assistant anything..."
                value={botChatInput}
                onChange={(e) => setBotChatInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleSendBotMessage(botChatInput)
                }
                style={{
                  flex: 1,
                  background: "#f8fafc",
                  border: "1px solid #cbd5e1",
                  borderRadius: "9999px",
                  padding: "0.55rem 1.1rem",
                  fontSize: "0.825rem",
                  outline: "none",
                }}
              />
              <button
                onClick={() => handleSendBotMessage(botChatInput)}
                style={{
                  background: "#0284c7",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "50%",
                  width: 38,
                  height: 38,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
