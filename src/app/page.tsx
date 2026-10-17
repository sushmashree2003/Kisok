"use client";

import { useEffect, useState } from "react";
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
  School,
  Building2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { RoleType } from "@/components/LoginScreen";
import RoleSelectionScreen from "@/components/RoleSelectionScreen";

export default function Home() {
  const router = useRouter();
  const [activePage, setActivePage] = useState<"portal" | "roles">("roles");
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
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

  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);

    return () => {
      clearInterval(timer);
      document.removeEventListener("fullscreenchange", handleFsChange);
    };
  }, []);

  const toggleFullscreen = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable fullscreen:", err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
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
        "Please click anywhere on the page or tap 'Login' to view the role selection cards (Student, Staff, Visitor, Alumni).";
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

  const handleSelectRole = (role: RoleType) => {
    router.push(`/login?role=${role}`);
  };

  return (
    <>
      {/* =========================================================================
         PAGE 1: GREEN VALLEY PUBLIC SCHOOL HOME PORTAL (MATCHES IMAGE 1 EXACTLY)
         ========================================================================= */}
      {activePage === "portal" && (
        <main className="hp-wrapper">
          <div className="hp-container">
            {/* 1. TOP HEADER */}
            <header className="hp-header">
              <div className="hp-branding">
                <div className="hp-logo-box">
                  <svg
                    width="44"
                    height="44"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M24 7C28 11 34 13 38 10C38 18 31 23 24 24C17 23 10 18 10 10C14 13 20 11 24 7Z"
                      fill="#10b981"
                    />
                    <path
                      d="M24 24V11"
                      stroke="#059669"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M5 36C12 31.5 18 32.5 24 37C30 32.5 36 31.5 43 36V18C36 13.5 30 14.5 24 19C18 14.5 12 13.5 5 18V36Z"
                      fill="#0369a1"
                    />
                    <path
                      d="M24 19V37"
                      stroke="#ffffff"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="hp-brand-name">Green Valley Public School</h1>
                  <p className="hp-brand-motto">Learn • Grow • Excel</p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                <div className="hp-header-datetime">
                  <Calendar size={18} className="text-sky-600" />
                  <span>
                    {currentTime ? formatDate(currentTime) : "Tue, 23 Sep 2025"}
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="font-extrabold text-slate-800">
                    {currentTime ? formatTime(currentTime) : "10:24 AM"}
                  </span>
                </div>

                <button
                  className="hp-fullscreen-btn"
                  onClick={toggleFullscreen}
                  title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen Mode"}
                >
                  {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
                  <span>{isFullscreen ? "Exit Fullscreen" : "Full Screen"}</span>
                </button>
              </div>
            </header>

            {/* 2. HERO BANNER - DATA DRIVEN (NO IMAGE) */}
            <div className="hp-hero-card hp-hero-card-data">
              <div className="hp-hero-content">
                <div className="hp-hero-top-badge">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span>CBSE Affiliated Sr. Secondary School • Affiliation No: 1930281 • School Code: 45210</span>
                </div>
                <h2 className="hp-hero-title">Green Valley Public School</h2>
                <p className="hp-hero-subtext">
                  Kiosk Portal • Empowering Minds, Inspiring Character & Building Leaders Since 1999
                </p>

                <div className="hp-hero-stats">
                  <div className="hp-stat-pill">
                    <div className="hp-stat-icon bg-emerald-600">
                      <GraduationCap size={15} />
                    </div>
                    <div>
                      <div className="hp-stat-num">25+ Years</div>
                      <div className="hp-stat-desc">Academic Legacy</div>
                    </div>
                  </div>

                  <div className="hp-stat-pill">
                    <div className="hp-stat-icon bg-purple-600">
                      <Users size={15} />
                    </div>
                    <div>
                      <div className="hp-stat-num">6,200+</div>
                      <div className="hp-stat-desc">Enrolled Students</div>
                    </div>
                  </div>

                  <div className="hp-stat-pill">
                    <div className="hp-stat-icon bg-amber-600">
                      <Award size={15} />
                    </div>
                    <div>
                      <div className="hp-stat-num">180+ Faculty</div>
                      <div className="hp-stat-desc">1:18 Teacher Ratio</div>
                    </div>
                  </div>

                  <div className="hp-stat-pill">
                    <div className="hp-stat-icon bg-sky-600">
                      <Trophy size={15} />
                    </div>
                    <div>
                      <div className="hp-stat-num">100% Pass</div>
                      <div className="hp-stat-desc">CBSE Board Exam</div>
                    </div>
                  </div>

                  <div className="hp-stat-pill">
                    <div className="hp-stat-icon bg-rose-600">
                      <Building2 size={15} />
                    </div>
                    <div>
                      <div className="hp-stat-num">45 Smart Labs</div>
                      <div className="hp-stat-desc">IoT & STEM Ready</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Institutional Key Metrics Box (Data-driven replacement for cursive text over photo) */}
              <div className="hp-hero-kpi-panel">
                <div className="hp-kpi-item">
                  <span className="hp-kpi-val">98.4%</span>
                  <span className="hp-kpi-lbl">Top Board Score</span>
                </div>
                <div className="hp-kpi-divider"></div>
                <div className="hp-kpi-item">
                  <span className="hp-kpi-val">Grade A++</span>
                  <span className="hp-kpi-lbl">Quality Accredited</span>
                </div>
                <div className="hp-kpi-divider"></div>
                <div className="hp-kpi-item">
                  <span className="hp-kpi-val">100+</span>
                  <span className="hp-kpi-lbl">State Trophies</span>
                </div>
              </div>
            </div>

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
                      <div className="hp-achieve-meta-row">
                        <span className="hp-achieve-pill gold">
                          <Trophy size={10} /> District Champion
                        </span>
                        <span className="hp-achieve-date">Aug 2025</span>
                      </div>
                      <h4 className="hp-achieve-name">Inter-School Mathematics Quiz</h4>
                      <p className="hp-achieve-desc">
                        Team of 4 • 42 Schools Competed • Final Round 100% Accuracy
                      </p>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="hp-achieve-card hp-data-card">
                    <div className="hp-achieve-databox amber">
                      <span className="hp-databox-rank">MVP</span>
                      <span className="hp-databox-score">84r & 3w</span>
                    </div>
                    <div className="hp-achieve-content">
                      <div className="hp-achieve-meta-row">
                        <span className="hp-achieve-pill amber">
                          <Award size={10} /> Best Player Award
                        </span>
                        <span className="hp-achieve-date">Sep 2025</span>
                      </div>
                      <h4 className="hp-achieve-name">Inter-School Cricket Tournament</h4>
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
                      <div className="hp-achieve-meta-row">
                        <span className="hp-achieve-pill slate">
                          <Star size={10} /> 2nd Place Silver
                        </span>
                        <span className="hp-achieve-date">Aug 2025</span>
                      </div>
                      <h4 className="hp-achieve-name">State Science & Innovation Fair</h4>
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
                      <div className="hp-achieve-meta-row">
                        <span className="hp-achieve-pill purple">
                          <Cpu size={10} /> National Olympiad
                        </span>
                        <span className="hp-achieve-date">Sep 2025</span>
                      </div>
                      <h4 className="hp-achieve-name">All-India Cyber & Coding Olympiad</h4>
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
                      <div className="hp-achieve-meta-row">
                        <span className="hp-achieve-pill emerald">
                          <Award size={10} /> CBSE Cluster VIII
                        </span>
                        <span className="hp-achieve-date">Aug 2025</span>
                      </div>
                      <h4 className="hp-achieve-name">CBSE South Zone Athletics Meet</h4>
                      <p className="hp-achieve-desc">
                        Overall Championship Trophy • 12 Gold, 8 Silver Medals
                      </p>
                    </div>
                  </div>

                  {/* Summary Footer Strip */}
                  <div className="hp-achieve-footer-strip">
                    <Trophy size={13} className="text-amber-600" />
                    <span>100+ State Trophies • 100% Board Pass Rate • Grade A++</span>
                  </div>
                </div>
              </div>

              {/* CARD 2: UPCOMING EVENTS */}
              <div className="hp-card">
                <div className="hp-card-title-row">
                  <div className="hp-card-heading">
                    <div className="hp-card-icon-pill bg-rose-50 text-rose-600">
                      <Calendar size={15} />
                    </div>
                    <span>Upcoming Events</span>
                    <span className="hp-header-badge rose">5 Upcoming</span>
                  </div>
                  <span className="hp-view-all">
                    Calendar <ArrowRight size={12} />
                  </span>
                </div>

                <div className="hp-events-list">
                  {/* Event 1 */}
                  <div className="hp-event-card">
                    <div className="hp-event-date-box bg-purple-50 text-purple-700 border-purple-200">
                      <span className="hp-event-day">25</span>
                      <span className="hp-event-month">Sep</span>
                    </div>
                    <div className="hp-event-details">
                      <div className="hp-event-meta-row">
                        <span className="hp-event-tag cat-purple">Academics</span>
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
                    <div className="hp-event-date-box bg-emerald-50 text-emerald-700 border-emerald-200">
                      <span className="hp-event-day">18</span>
                      <span className="hp-event-month">Oct</span>
                    </div>
                    <div className="hp-event-details">
                      <div className="hp-event-meta-row">
                        <span className="hp-event-tag cat-emerald">Cultural</span>
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

                  {/* Summary Footer Strip */}
                  <div className="hp-event-footer-strip">
                    <Calendar size={13} className="text-rose-600" />
                    <span>Academic Term II Active • 14 Scheduled Campus Events</span>
                  </div>
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

                  {/* Summary Footer Strip */}
                  <div className="hp-highlight-footer-strip">
                    <Camera size={13} className="text-teal-600" />
                    <span>450+ Photo Moments Captured • Digital Campus Archives</span>
                  </div>
                </div>
              </div>

              {/* CARD 4: ROLE LOGIN (COMPLETELY FILLED & BALANCED) */}
              <div className="hp-card hp-login-card">
                <div className="hp-login-top">
                  <div className="hp-login-icon-box">
                    <User size={22} />
                  </div>
                  <span className="hp-login-chip">Touch Kiosk Portal</span>
                </div>

                <div className="hp-login-center-body">
                  <h3 className="hp-login-heading">Smart Campus Portal</h3>
                  <p className="hp-login-subtext">
                    Sign in to access real-time academic marks, morning attendance, digital diary & fee telemetry.
                  </p>

                  <div className="hp-login-roles-preview">
                    <span className="hp-role-pill">🎓 Student / Parent</span>
                    <span className="hp-role-pill">👨‍🏫 Staff</span>
                    <span className="hp-role-pill">🏛️ Visitor</span>
                    <span className="hp-role-pill">🤝 Alumni / Ex-Staff</span>
                  </div>

                  {/* Live Portal Features List */}
                  <div className="hp-login-features-list">
                    <div className="hp-login-feat-item">
                      <CheckCircle2 size={13} className="text-sky-600" />
                      <span>Instant 1-Touch Kiosk Sign In</span>
                    </div>
                    <div className="hp-login-feat-item">
                      <CheckCircle2 size={13} className="text-emerald-600" />
                      <span>Exam Results & Report Cards</span>
                    </div>
                    <div className="hp-login-feat-item">
                      <CheckCircle2 size={13} className="text-amber-600" />
                      <span>Digital Receipts & Diary Notes</span>
                    </div>
                  </div>
                </div>

                <div className="hp-login-action-wrap">
                  <button
                    className="hp-login-btn"
                    onClick={() => setActivePage("roles")}
                  >
                    <span>Enter Role Portal</span>
                    <ArrowRight size={16} />
                  </button>
                  <span className="hp-login-security-tag">
                    <ShieldCheck size={12} /> 256-Bit SSL Encrypted Kiosk
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

                {/* 6 Structured Dashboard Cards (Completely Filled with Specifications & Tags) */}
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

            {/* 6. FOOTER STRIP */}
            <footer className="hp-footer">
              <div className="hp-footer-left">
                <div className="hp-footer-item text-emerald-700">
                  <span className="font-bold">✓</span> Safe & Secure Campus
                </div>
                <div className="hp-footer-item text-sky-700">
                  <Users size={14} /> Experienced Faculty
                </div>
                <div className="hp-footer-item text-teal-700">
                  <Leaf size={14} /> Holistic Development
                </div>
              </div>

              <div className="hp-footer-center">
                Together for a Brighter Tomorrow 🍃
              </div>

              <div className="hp-footer-right">
                <span>Academics</span>
                <span>|</span>
                <span>Sports</span>
                <span>|</span>
                <span>Arts</span>
                <span>|</span>
                <span>Values</span>
                <span>|</span>
                <span>Life Skills</span>
              </div>
            </footer>
          </div>
        </main>
      )}

      {/* =========================================================================
         PAGE 2: ROLE SELECTOR SCREEN (MODULAR COMPONENT)
         ========================================================================= */}
      {activePage === "roles" && (
        <RoleSelectionScreen
          onSelectRole={handleSelectRole}
          onBackToPortal={() => setActivePage("portal")}
          isFullscreen={isFullscreen}
          toggleFullscreen={toggleFullscreen}
          currentTime={currentTime}
          onOpenBot={() => setBotModalOpen(true)}
        />
      )}

      {/* =========================================================================
         AI CHAT BOT MODAL
         ========================================================================= */}
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
