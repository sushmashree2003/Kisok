"use client";

import React, { useState, useEffect } from "react";
import { getUserSession, clearUserSession } from "@/lib/session";
import { SessionInfo } from "@/types/auth";
import {
  Calendar,
  Bell,
  Search,
  ArrowRight,
  Home,
  Activity,
  CalendarDays,
  Sparkles,
  Send,
  Camera,
  ChevronRight,
  ShieldCheck,
  Lock,
  Cpu,
  Briefcase,
  Share2,
  Heart,
  Bot,
  Newspaper,
  Image as ImageIcon,
  UserCheck,
  Clock,
  MapPin,
  Mic,
  ChevronLeft,
  Users,
  Award,
  GraduationCap,
  TrendingUp,
  BookOpen,
  CheckCircle2,
} from "lucide-react";

interface DashboardProps {
  onBackToKiosk: () => void;
}

export default function AlumniDashboard({ onBackToKiosk }: DashboardProps) {
  const [chatInput, setChatInput] = useState("");
  const [chatResponse, setChatResponse] = useState<string | null>(null);
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const activeSession = getUserSession();
    if (activeSession) {
      setSession(activeSession);
    }
  }, []);

  const handleLogout = () => {
    clearUserSession();
    onBackToKiosk();
  };

  const handleAsk = (query: string) => {
    setChatInput(query);
    if (query.toLowerCase().includes("meet") || query.toLowerCase().includes("reunion")) {
      setChatResponse("Annual Alumni Meet 2025: 25 Sep 2025, 10:00 AM - 01:00 PM at School Auditorium. 240+ registered!");
    } else if (query.toLowerCase().includes("job") || query.toLowerCase().includes("career")) {
      setChatResponse("4 new job openings posted by alumni companies in Bengaluru & Hyderabad.");
    } else if (query.toLowerCase().includes("batch") || query.toLowerCase().includes("2015")) {
      setChatResponse("Batch of 2015 has 112 verified alumni registered in the portal.");
    } else {
      setChatResponse("Welcome back, Rohan! You can submit a Guest Lecture proposal or donate to the Scholarship Fund.");
    }
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
              <path d="M24 7c4 4 10 6 14 3 0 8-7 13-14 14C17 23 10 18 10 10c4 3 10 1 14-3Z" fill="#d97706" />
              <path d="M24 24V11" stroke="#b45309" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M5 36c7-4.5 13-3.5 19 1 6-4.5 12-5.5 19-1V18c-7-4.5-13-3.5-19 1-6-4.5-12-5.5-19-1v18Z" fill="#92400e" />
              <path d="M24 19v18" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <p className="command-kicker">GREEN VALLEY • SMART CAMPUS</p>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
              <h1 style={{ margin: 0, fontFamily: "Outfit, sans-serif", fontSize: "1.15rem", fontWeight: 800, color: "#1e293b" }}>
                {session?.initname || "Green Valley Public School"}
              </h1>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
                  color: "#b45309",
                  fontSize: "0.74rem",
                  fontWeight: 800,
                  padding: "0.22rem 0.75rem",
                  borderRadius: "9999px",
                  border: "1.5px solid rgba(217, 119, 6, 0.35)",
                  boxShadow: "0 2px 8px rgba(217, 119, 6, 0.1)",
                  letterSpacing: "0.02em",
                }}
              >
                <Award size={12} style={{ color: "#d97706" }} />
                PAGE 7 • ALUMNI NETWORK PORTAL
              </span>
            </div>
          </div>
        </div>

        <div className="dash-nav-actions">
          {/* Alumni Profile Pill */}
          <div className="dash-profile-pill">
            <img src={session?.img || "/alumni_avatar.png"} alt="Rohan Sharma" className="dash-user-avatar" />
            <div className="dash-user-info">
              <span className="dash-user-name">{session?.username || "Rohan Sharma"}</span>
              <span className="dash-user-role">
                {session ? `${session.Rolename} • Batch : ${session.ASMAY_Year || "2015"}` : "Alumni • Batch : 2015"}
              </span>
            </div>
          </div>

          {/* Live Campus Telemetry Pill */}
          <div className="command-live-status">
            <span style={{ background: "#d97706" }} />
            <span>Campus online</span>
          </div>

          {/* Command Time Pill (Real-time live clock) */}
          <div className="dash-clock-widget">
            <Calendar size={13} style={{ color: "#d97706" }} />
            <span>
              {currentTime.toLocaleDateString("en-US", { weekday: "short", day: "2-digit", month: "short" })} •{" "}
              <b>{currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}</b>
            </span>
          </div>

          {/* Back to Kiosk Home */}
          <button className="dash-kiosk-back-btn" onClick={handleLogout} title="Return to Role Selection Home">
            <Home size={14} /> Back to Kiosk
          </button>
        </div>
      </header>

      {/* MAIN VIEWPORT CONTENT (STRICT NO-SCROLL) */}
      <main className="dash-main-content">
        {/* HERO BANNER (ROLE SELECTION COMMAND THEME) */}
        <section className="student-hub-hero" style={{ marginBottom: "0.85rem" }}>
          <div className="student-hero-title-group">
            <div className="hero-chip" style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", marginBottom: "0.35rem" }}>
              <span
                style={{
                  background: "#d97706",
                  color: "#ffffff",
                  padding: "2px 8px",
                  borderRadius: "9999px",
                  fontSize: "0.65rem",
                  fontWeight: 900,
                  letterSpacing: "0.04em",
                }}
              >
                PAGE 7
              </span>
              <Sparkles size={14} /> ALUMNI NETWORK PORTAL • STAY CONNECTED. GIVE BACK.
            </div>
            <h2>
              Once a GVian, <span>Always a GVian</span>
            </h2>
            <p>Global Alumni Legacy Network • 18 International Chapters • Mentorship, Careers &amp; Alma Mater Giving.</p>
            <div className="student-hero-chips">
              <span className="student-hero-chip" style={{ background: "#fffbeb", color: "#b45309", borderColor: "rgba(217, 119, 6, 0.3)" }}>
                <GraduationCap size={12} /> Class of 2015 (Batch XI)
              </span>
              <span className="student-hero-chip" style={{ background: "#fffbeb", color: "#b45309", borderColor: "rgba(217, 119, 6, 0.3)" }}>
                <Users size={12} /> 12,400+ Alumni Network
              </span>
              <span className="student-hero-chip" style={{ background: "#fffbeb", color: "#b45309", borderColor: "rgba(217, 119, 6, 0.3)" }}>
                <Award size={12} /> 18 Global Chapters
              </span>
              <span className="student-hero-chip" style={{ background: "#fffbeb", color: "#b45309", borderColor: "rgba(217, 119, 6, 0.3)" }}>
                <Briefcase size={12} /> 45 Active Mentors
              </span>
            </div>
            <div className="hero-trust" style={{ marginTop: "0.55rem", fontSize: "11px" }}>
              <ShieldCheck size={14} style={{ color: "#d97706" }} /><span>12,400+ Verified Global Alumni</span><i />
              <Activity size={14} style={{ color: "#d97706" }} /><span>Alumni Endowment &amp; Mentorship Active</span>
            </div>
          </div>
          <div className="student-hero-right-meta" style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            {/* 3D ORBITAL RINGS & FLOATING 3D GLASS CARDS (MATCHING ROLE SELECTION SCREENSHOT) */}
            <div className="hero-visual" aria-hidden="true" style={{ position: "relative", width: "230px", height: "180px", minHeight: "180px", display: "grid", placeItems: "center" }}>
              <div className="hero-visual-ring ring-one" style={{ width: "200px", height: "200px", borderRightColor: "rgba(217, 119, 6, 0.7)" }} />
              <div className="hero-visual-ring ring-two" style={{ width: "150px", height: "150px", borderLeftColor: "rgba(245, 158, 11, 0.6)" }} />
              <div className="hero-visual-card" style={{ width: "115px", height: "115px", borderRadius: "28px", color: "#d97706" }}>
                <Award size={26} style={{ color: "#d97706" }} />
                <strong style={{ fontSize: "18px" }}>Alumni</strong>
                <span style={{ fontSize: "9px", color: "#d97706" }}>GV Legacy</span>
              </div>
              <div className="hero-floating-note note-one" style={{ top: "0px", left: "-15px", padding: "6px 11px", fontSize: "10px" }}>
                <CheckCircle2 size={13} style={{ color: "#d97706" }} /> 12,400+ Network
              </div>
              <div className="hero-floating-note note-two" style={{ bottom: "0px", right: "-15px", padding: "6px 11px", fontSize: "10px" }}>
                <Award size={13} style={{ color: "#d97706" }} /> 18 Global Chapters
              </div>
            </div>

            <div className="dash-hero-right-badge data-badge" style={{ fontSize: "0.78rem" }}>
              <span style={{ fontSize: "0.62rem", opacity: 0.85 }}>Alumni Community</span>
              <b style={{ fontSize: "1.1rem", fontWeight: 800 }}>12,400+</b>
              <span style={{ fontSize: "0.6rem", opacity: 0.85 }}>Connected Globally</span>
            </div>
          </div>
        </section>

        {/* 8 Action Cards (Single Row - High Fidelity) */}
        <div className="alumni-action-grid">
          {/* 1. Update Your Profile */}
          <div className="alumni-action-card">
            <div>
              <div className="alumni-tile-icon-box" style={{ background: "#f3e8ff", color: "#9333ea" }}>
                <UserCheck size={16} />
              </div>
              <div className="alumni-tile-title">Update Your Profile</div>
              <div className="alumni-tile-sub">Keep your details up to date</div>
            </div>
            <div className="alumni-tile-arrow-circle" style={{ background: "#f3e8ff", color: "#9333ea" }}>
              <ChevronRight size={10} />
            </div>
          </div>

          {/* 2. Job Opportunities */}
          <div className="alumni-action-card">
            <div>
              <div className="alumni-tile-icon-box" style={{ background: "#dcfce7", color: "#16a34a" }}>
                <Briefcase size={16} />
              </div>
              <div className="alumni-tile-title">Job Opportunities</div>
              <div className="alumni-tile-sub">Explore career opportunities</div>
            </div>
            <div className="alumni-tile-arrow-circle" style={{ background: "#dcfce7", color: "#16a34a" }}>
              <ChevronRight size={10} />
            </div>
          </div>

          {/* 3. Alumni Network */}
          <div className="alumni-action-card">
            <div>
              <div className="alumni-tile-icon-box" style={{ background: "#e0f2fe", color: "#0284c7" }}>
                <Share2 size={16} />
              </div>
              <div className="alumni-tile-title">Alumni Network</div>
              <div className="alumni-tile-sub">Connect with fellow alumni</div>
            </div>
            <div className="alumni-tile-arrow-circle" style={{ background: "#e0f2fe", color: "#0284c7" }}>
              <ChevronRight size={10} />
            </div>
          </div>

          {/* 4. Events */}
          <div className="alumni-action-card">
            <div>
              <div className="alumni-tile-icon-box" style={{ background: "#ffedd5", color: "#ea580c" }}>
                <Calendar size={16} />
              </div>
              <div className="alumni-tile-title">Events</div>
              <div className="alumni-tile-sub">Join reunions & networking</div>
            </div>
            <div className="alumni-tile-arrow-circle" style={{ background: "#ffedd5", color: "#ea580c" }}>
              <ChevronRight size={10} />
            </div>
          </div>

          {/* 5. Give Back */}
          <div className="alumni-action-card">
            <div>
              <div className="alumni-tile-icon-box" style={{ background: "#ffe4e6", color: "#e11d48" }}>
                <Heart size={16} />
              </div>
              <div className="alumni-tile-title">Give Back</div>
              <div className="alumni-tile-sub">Support your alma mater</div>
            </div>
            <div className="alumni-tile-arrow-circle" style={{ background: "#ffe4e6", color: "#e11d48" }}>
              <ChevronRight size={10} />
            </div>
          </div>

          {/* 6. AI Assistant */}
          <div className="alumni-action-card">
            <div>
              <div className="alumni-tile-icon-box" style={{ background: "#ccfbf1", color: "#0d9488" }}>
                <Bot size={16} />
              </div>
              <div className="alumni-tile-title">AI Assistant</div>
              <div className="alumni-tile-sub">Get instant guidance</div>
            </div>
            <div className="alumni-tile-arrow-circle" style={{ background: "#ccfbf1", color: "#0d9488" }}>
              <ChevronRight size={10} />
            </div>
          </div>

          {/* 7. Current Affairs */}
          <div className="alumni-action-card">
            <div>
              <div className="alumni-tile-icon-box" style={{ background: "#e0e7ff", color: "#4338ca" }}>
                <Newspaper size={16} />
              </div>
              <div className="alumni-tile-title">Current Affairs</div>
              <div className="alumni-tile-sub">Stay informed with updates</div>
            </div>
            <div className="alumni-tile-arrow-circle" style={{ background: "#e0e7ff", color: "#4338ca" }}>
              <ChevronRight size={10} />
            </div>
          </div>

          {/* 8. Photo Gallery */}
          <div className="alumni-action-card">
            <div>
              <div className="alumni-tile-icon-box" style={{ background: "#fce7f3", color: "#db2777" }}>
                <ImageIcon size={16} />
              </div>
              <div className="alumni-tile-title">Photo Gallery</div>
              <div className="alumni-tile-sub">Relive memories & moments</div>
            </div>
            <div className="alumni-tile-arrow-circle" style={{ background: "#fce7f3", color: "#db2777" }}>
              <ChevronRight size={10} />
            </div>
          </div>
        </div>

        {/* 2-Column Split: Left (Upcoming Events + Updates) + Right (AI, News, Gallery) */}
        <div className="alumni-body-grid">
          {/* Left Grid: Upcoming Events (50%) + Latest Updates (50%) */}
          <div className="alumni-left-grid">
            {/* Upcoming Events Card */}
            <div className="dash-card">
              <div className="dash-card-header">
                <div className="dash-card-title">
                  <div className="dash-card-icon" style={{ background: "#e0f2fe", color: "#0284c7" }}>
                    <CalendarDays size={14} />
                  </div>
                  <span>Upcoming Events</span>
                </div>
                <span className="dash-view-all">View All →</span>
              </div>

              {/* Evenly Distributed Events List */}
              <div className="dash-card-body">
                {/* Event 1 */}
                <div className="alumni-event-item">
                  <div className="alumni-event-date-box">
                    <span className="alumni-event-day">25</span>
                    <span className="alumni-event-month">Sep</span>
                  </div>
                  <div className="alumni-event-icon-circle">
                    <Users size={16} />
                  </div>
                  <div className="alumni-event-details">
                    <div className="alumni-event-title">Alumni Meet 2025</div>
                    <div className="alumni-event-meta">
                      <span>🕒 10:00 AM - 01:00 PM</span>
                      <span> | </span>
                      <span>📍 School Auditorium</span>
                    </div>
                  </div>
                  <div className="alumni-event-arrow-circle">
                    <ChevronRight size={13} />
                  </div>
                </div>

                {/* Event 2 */}
                <div className="alumni-event-item">
                  <div className="alumni-event-date-box">
                    <span className="alumni-event-day">10</span>
                    <span className="alumni-event-month">Oct</span>
                  </div>
                  <div className="alumni-event-icon-circle">
                    <Mic size={16} />
                  </div>
                  <div className="alumni-event-details">
                    <div className="alumni-event-title">Guest Lecture Series</div>
                    <div className="alumni-event-meta">
                      <span>🕒 04:00 PM - 05:30 PM</span>
                      <span> | </span>
                      <span>🌐 Virtual / Online</span>
                    </div>
                  </div>
                  <div className="alumni-event-arrow-circle">
                    <ChevronRight size={13} />
                  </div>
                </div>

                {/* Event 3 */}
                <div className="alumni-event-item">
                  <div className="alumni-event-date-box">
                    <span className="alumni-event-day">18</span>
                    <span className="alumni-event-month">Oct</span>
                  </div>
                  <div className="alumni-event-icon-circle">
                    <Share2 size={16} />
                  </div>
                  <div className="alumni-event-details">
                    <div className="alumni-event-title">Career Guidance Session</div>
                    <div className="alumni-event-meta">
                      <span>🕒 11:00 AM - 12:30 PM</span>
                      <span> | </span>
                      <span>📍 School Campus</span>
                    </div>
                  </div>
                  <div className="alumni-event-arrow-circle">
                    <ChevronRight size={13} />
                  </div>
                </div>

                {/* Event 4 */}
                <div className="alumni-event-item">
                  <div className="alumni-event-date-box">
                    <span className="alumni-event-day">05</span>
                    <span className="alumni-event-month">Nov</span>
                  </div>
                  <div className="alumni-event-icon-circle">
                    <Sparkles size={16} />
                  </div>
                  <div className="alumni-event-details">
                    <div className="alumni-event-title">Alumni Reunion 2025</div>
                    <div className="alumni-event-meta">
                      <span>🕒 06:00 PM - 09:00 PM</span>
                      <span> | </span>
                      <span>📍 School Auditorium</span>
                    </div>
                  </div>
                  <div className="alumni-event-arrow-circle">
                    <ChevronRight size={13} />
                  </div>
                </div>
              </div>
            </div>

            {/* Latest Updates Card */}
            <div className="dash-card">
              <div className="dash-card-header">
                <div className="dash-card-title">
                  <div className="dash-card-icon" style={{ background: "#ede9fe", color: "#7c3aed" }}>
                    <Sparkles size={14} />
                  </div>
                  <span>Latest Updates</span>
                </div>
                <span className="dash-view-all">View All →</span>
              </div>

              {/* Evenly Distributed Updates List */}
              <div className="dash-card-body">
                {/* Story 1 */}
                <div className="alumni-update-card">
                  <div className="alumni-update-icon-tile" style={{ background: "#f3e8ff", color: "#7c3aed" }}>
                    <Award size={18} />
                  </div>
                  <div className="alumni-update-info">
                    <div className="alumni-update-title">Alumni Spotlight: Priya Nair ('15)</div>
                    <div className="alumni-update-desc">
                      VP at Global FinTech, named in 40-Under-40 Leadership Leaders.
                    </div>
                    <div className="alumni-update-meta-row">
                      <span className="alumni-update-date">📅 15 Sep 2025</span>
                      <span className="alumni-update-tag" style={{ background: "#e0f2fe", color: "#0369a1" }}>
                        Leadership
                      </span>
                    </div>
                  </div>
                </div>

                {/* Story 2 */}
                <div className="alumni-update-card">
                  <div className="alumni-update-icon-tile" style={{ background: "#ecfdf5", color: "#059669" }}>
                    <Briefcase size={18} />
                  </div>
                  <div className="alumni-update-info">
                    <div className="alumni-update-title">Global Hiring: 14 Open Positions</div>
                    <div className="alumni-update-desc">
                      Google, Microsoft & TCS priority referral slots open for GVians.
                    </div>
                    <div className="alumni-update-meta-row">
                      <span className="alumni-update-date">📅 12 Sep 2025</span>
                      <span className="alumni-update-tag" style={{ background: "#dcfce7", color: "#15803d" }}>
                        Careers
                      </span>
                    </div>
                  </div>
                </div>

                {/* Story 3 */}
                <div className="alumni-update-card">
                  <div className="alumni-update-icon-tile" style={{ background: "#fef3c7", color: "#d97706" }}>
                    <CalendarDays size={18} />
                  </div>
                  <div className="alumni-update-info">
                    <div className="alumni-update-title">Decennial Reunion 2025</div>
                    <div className="alumni-update-desc">
                      Grand Homecoming Gala Dinner scheduled at Campus Auditorium.
                    </div>
                    <div className="alumni-update-meta-row">
                      <span className="alumni-update-date">📅 08 Sep 2025</span>
                      <span className="alumni-update-tag" style={{ background: "#ffedd5", color: "#c2410c" }}>
                        Event
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (AI Assistant + Current Affairs + Mentorship Board) */}
          <div className="alumni-right-col">
            {/* AI Assistant */}
            <div className="ai-assistant-card" style={{ background: "linear-gradient(135deg, #0b2f56 0%, #1d4ed8 100%)", padding: "0.55rem 0.75rem", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
                <div className="ai-bot-circle" style={{ width: 32, height: 32, flexShrink: 0, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", borderRadius: "50%" }}>
                  <Sparkles size={16} />
                </div>
                <div className="ai-header-text">
                  <h3 style={{ fontSize: "0.88rem", margin: 0, display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    AI Assistant <Sparkles size={13} style={{ color: "#facc15" }} />
                  </h3>
                  <p style={{ fontSize: "0.6rem", margin: "2px 0 0 0", opacity: 0.88, lineHeight: 1.2 }}>
                    Ask anything about your alma mater, events, alumni network and more.
                  </p>
                </div>
              </div>

              <div className="ai-input-wrap" style={{ marginTop: "0.3rem" }}>
                <Mic size={14} style={{ color: "#94a3b8", marginRight: "0.35rem", flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder={chatResponse ? chatResponse : "Type your question..."}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAsk(chatInput)}
                />
                <button className="ai-send-btn" onClick={() => handleAsk(chatInput)}>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* Current Affairs */}
            <div className="dash-card">
              <div className="dash-card-header">
                <div className="dash-card-title">
                  <div className="dash-card-icon" style={{ background: "#dbeafe", color: "#1d4ed8" }}>
                    <Newspaper size={14} />
                  </div>
                  <span>Current Affairs</span>
                </div>
                <span className="dash-view-all">View All →</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1, minHeight: 0, overflowY: "auto" }}>
                <div className="alumni-news-row">
                  <div className="alumni-news-icon-tile" style={{ background: "#e0f2fe", color: "#0369a1" }}>
                    <GraduationCap size={15} />
                  </div>
                  <div className="alumni-news-info">
                    <div className="alumni-news-title">Education Reforms: NEP 2025 Rollout</div>
                    <div className="alumni-news-date">23 Sep 2025 • Policy</div>
                  </div>
                  <ChevronRight size={13} style={{ color: "#94a3b8" }} />
                </div>

                <div className="alumni-news-row">
                  <div className="alumni-news-icon-tile" style={{ background: "#fef3c7", color: "#d97706" }}>
                    <TrendingUp size={15} />
                  </div>
                  <div className="alumni-news-info">
                    <div className="alumni-news-title">4 GV Alum Startups Receive Pre-Seed Funding</div>
                    <div className="alumni-news-date">21 Sep 2025 • Innovation</div>
                  </div>
                  <ChevronRight size={13} style={{ color: "#94a3b8" }} />
                </div>

                <div className="alumni-news-row">
                  <div className="alumni-news-icon-tile" style={{ background: "#ecfdf5", color: "#059669" }}>
                    <Award size={15} />
                  </div>
                  <div className="alumni-news-info">
                    <div className="alumni-news-title">India Wins 5 Medals at International Olympiad</div>
                    <div className="alumni-news-date">18 Sep 2025 • Academics</div>
                  </div>
                  <ChevronRight size={13} style={{ color: "#94a3b8" }} />
                </div>
              </div>
            </div>

            {/* Alumni Mentorship & Masterclasses */}
            <div className="dash-card">
              <div className="dash-card-header">
                <div className="dash-card-title">
                  <div className="dash-card-icon" style={{ background: "#fdf4ff", color: "#c026d3" }}>
                    <Users size={14} />
                  </div>
                  <span>Mentorship & Masterclasses</span>
                </div>
                <span className="dash-view-all">Register →</span>
              </div>
              <div className="dash-telemetry-list">
                <div className="dash-telemetry-item">
                  <div className="dash-telemetry-icon" style={{ background: "#ede9fe", color: "#7c3aed" }}>
                    <BookOpen size={13} />
                  </div>
                  <div className="dash-telemetry-info">
                    <span className="dash-telemetry-name">AI & Data Science AMA</span>
                    <span className="dash-telemetry-meta">Ankit Verma (Google) • 28 Sep</span>
                  </div>
                  <span className="status-badge status-active">RSVP Open</span>
                </div>
                <div className="dash-telemetry-item">
                  <div className="dash-telemetry-icon" style={{ background: "#ecfdf5", color: "#059669" }}>
                    <Award size={13} />
                  </div>
                  <div className="dash-telemetry-info">
                    <span className="dash-telemetry-name">Civil Services Prep 101</span>
                    <span className="dash-telemetry-meta">Meera Sen, IAS • 02 Oct</span>
                  </div>
                  <span className="status-badge status-ready">Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* COMPACT COMMAND FOOTER */}
      <footer className="command-footer" style={{ marginTop: "auto", borderTop: "1px solid rgba(254, 215, 170, 0.5)", background: "rgba(255, 255, 255, 0.88)" }}>
        <div><span className="footer-dot" style={{ background: "#d97706" }} /> Official GVian Global Alumni Command Portal</div>
        <div className="footer-links">
          <span>CBSE Affiliation 1930281</span>
          <span>NAAC Grade A++</span>
          <span>12,400+ Alumni Worldwide</span>
          <span>18 Global Chapters Active</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.74rem", fontWeight: 700, color: "#d97706" }}>
          <ShieldCheck size={14} /> Safe &amp; Encrypted Kiosk
        </div>
      </footer>
    </div>
  );
}
