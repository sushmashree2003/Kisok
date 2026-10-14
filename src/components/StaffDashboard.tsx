"use client";

import React, { useState, useEffect } from "react";
import { getUserSession, clearUserSession } from "@/lib/session";
import { SessionInfo } from "@/types/auth";
import {
  Calendar,
  Bell,
  Search,
  BookOpen,
  ArrowRight,
  Home,
  CalendarDays,
  Clock,
  Sparkles,
  Send,
  Camera,
  ChevronRight,
  ShieldCheck,
  Lock,
  Cpu,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  FileCheck,
  Activity,
  FlaskConical,
  Users,
  Building2,
} from "lucide-react";

interface DashboardProps {
  onBackToKiosk: () => void;
}

export default function StaffDashboard({ onBackToKiosk }: DashboardProps) {
  const [chatInput, setChatInput] = useState("");
  const [chatResponse, setChatResponse] = useState<string | null>(null);
  const [session, setSession] = useState<SessionInfo | null>(null);

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
    if (query.toLowerCase().includes("timetable") || query.toLowerCase().includes("classes")) {
      setChatResponse("Today: Class 6A (08:00 AM), 7B (09:00 AM), 8A (10:45 AM), 9B (12:15 PM), 10A (02:00 PM).");
    } else if (query.toLowerCase().includes("performance")) {
      setChatResponse("Class 10A Math average is 85%. Highest score: 98% (Ananya Rao).");
    } else if (query.toLowerCase().includes("circular") || query.toLowerCase().includes("notices")) {
      setChatResponse("Circular: School closed on 26 Sep (Saturday). Staff meeting at 11:30 AM.");
    } else if (query.toLowerCase().includes("exam")) {
      setChatResponse("Next Exam: Class 6 Mathematics on 26 Sep at 08:00 AM in Hall A.");
    } else {
      setChatResponse("Staff query processed. Conference Hall reserved for 11:30 AM meeting.");
    }
  };

  return (
    <div className="dashboard-page">
      {/* TOP NAVBAR */}
      <header className="dash-navbar">
        <div className="dash-logo-link" onClick={handleLogout}>
          <div className="dash-logo-box">
            <svg width="34" height="34" viewBox="0 0 48 48" fill="none">
              <path d="M24 7C28 11 34 13 38 10C38 18 31 23 24 24C17 23 10 18 10 10C14 13 20 11 24 7Z" fill="#10b981" />
              <path d="M24 24V11" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M5 36C12 31.5 18 32.5 24 37C30 32.5 36 31.5 43 36V18C36 13.5 30 14.5 24 19C18 14.5 12 13.5 5 18V36Z" fill="#0369a1" />
              <path d="M24 19V37" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="dash-school-text">
            <h1>{session?.initname || "Green Valley Public School"}</h1>
            <p>Learn • Grow • Excel</p>
          </div>
        </div>

        <div className="dash-search-box">
          <Search size={14} className="dash-search-icon" />
          <input
            type="text"
            className="dash-search-input"
            placeholder="Search anything... (events, notices, students, classes, etc.)"
          />
        </div>

        <div className="dash-nav-actions">
          <button className="dash-icon-btn" aria-label="Notifications">
            <Bell size={16} />
            <span className="dash-notification-badge">3</span>
          </button>

          <div className="dash-profile-pill">
            <img src={session?.img || "/staff_avatar.png"} alt={session?.username || "Ramesh Kumar"} className="dash-user-avatar" />
            <div className="dash-user-info">
              <span className="dash-user-name">{session?.username || "Ramesh Kumar"}</span>
              <span className="dash-user-role">
                {session ? `${session.Rolename} • Emp ID: ${session.Empid || "5021"}` : "Staff • Teacher - Mathematics"}
              </span>
            </div>
          </div>

          <div className="dash-clock-widget">
            <Calendar size={13} style={{ color: "#0284c7" }} />
            <span>Tue, 23 Sep • 10:24 AM</span>
          </div>

          <button className="dash-kiosk-back-btn" onClick={handleLogout}>
            <Home size={13} /> Kiosk Home
          </button>
        </div>
      </header>

      {/* MAIN VIEWPORT CONTENT (STRICT NO-SCROLL) */}
      <main className="dash-main-content">
        <div className="dash-kiosk-body-split">
          {/* LEFT 75% AREA */}
          <div className="dash-kiosk-body-left">
            {/* Banner */}
            <section className="dash-hero-banner banner-staff">
              <div className="dash-hero-left">
                <h2 className="dash-hero-title">Welcome Back, {session?.username || "Ramesh Kumar"}</h2>
                <p className="dash-hero-desc">
                  Together we shape minds and inspire excellence. Today: 5 teaching periods & 2 academic committee syncs.
                </p>
                <div className="dash-hero-tags">
                  <span className="dash-hero-tag">📖 Dept. of Mathematics</span>
                  <span className="dash-hero-tag">🏫 Room 204</span>
                  <span className="dash-hero-tag">✨ Senior Faculty</span>
                  <span className="dash-hero-tag">⚡ 8 Classes Assigned</span>
                </div>
              </div>
              <div className="dash-hero-right-badge data-badge">
                <span style={{ fontSize: "0.62rem", opacity: 0.85 }}>Faculty Rating</span>
                <b style={{ fontSize: "1.1rem", fontWeight: 800 }}>★ 4.9 / 5.0</b>
                <span style={{ fontSize: "0.6rem", opacity: 0.85 }}>100% Syllabus on Track</span>
              </div>
            </section>

            {/* Row 1: Today's Classes, Today's Meetings, Upcoming Events */}
            <div className="dash-three-col-row">
              {/* Today's Classes */}
              <div className="dash-card">
                <div className="dash-card-header">
                  <div className="dash-card-title">
                    <div className="dash-card-icon" style={{ background: "#f3e8ff", color: "#9333ea" }}>
                      <BookOpen size={14} />
                    </div>
                    <span>Today&apos;s Classes</span>
                  </div>
                  <span className="dash-view-all">View All →</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.3rem" }}>
                  <span style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>8</span>
                  <span style={{ fontSize: "0.68rem", color: "#64748b", fontWeight: 600 }}>Classes Assigned Today</span>
                </div>
                <div className="timetable-list">
                  <div className="timetable-row">
                    <span>08:00 - 08:45</span>
                    <span className="class-tag tag-blue">Class 6 A</span>
                    <span>Mathematics</span>
                  </div>
                  <div className="timetable-row">
                    <span>09:00 - 09:45</span>
                    <span className="class-tag tag-pink">Class 7 B</span>
                    <span>Science</span>
                  </div>
                  <div className="timetable-row">
                    <span>10:45 - 11:30</span>
                    <span className="class-tag tag-green">Class 8 A</span>
                    <span>English</span>
                  </div>
                  <div className="timetable-row">
                    <span>12:15 - 01:00</span>
                    <span className="class-tag tag-purple">Class 9 B</span>
                    <span>Social Studies</span>
                  </div>
                  <div className="timetable-row">
                    <span>02:00 - 02:45</span>
                    <span className="class-tag tag-orange">Class 10 A</span>
                    <span>Kannada</span>
                  </div>
                </div>
              </div>

              {/* Today's Meetings */}
              <div className="dash-card">
                <div className="dash-card-header">
                  <div className="dash-card-title">
                    <div className="dash-card-icon" style={{ background: "#ffedd5", color: "#ea580c" }}>
                      <CalendarDays size={14} />
                    </div>
                    <span>Today&apos;s Meetings</span>
                  </div>
                  <span className="dash-view-all">View All →</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.3rem" }}>
                  <span style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>2</span>
                  <span style={{ fontSize: "0.68rem", color: "#64748b", fontWeight: 600 }}>Meetings Scheduled</span>
                </div>
                <div>
                  <div className="event-item-row">
                    <span style={{ fontWeight: 700, fontSize: "0.68rem", color: "#0284c7", width: 90 }}>11:30 AM</span>
                    <div className="event-text">
                      <div className="event-name">Staff Meeting</div>
                      <div className="event-meta">Conference Hall</div>
                    </div>
                    <ChevronRight size={14} style={{ color: "#94a3b8" }} />
                  </div>
                  <div className="event-item-row">
                    <span style={{ fontWeight: 700, fontSize: "0.68rem", color: "#0284c7", width: 90 }}>02:00 PM</span>
                    <div className="event-text">
                      <div className="event-name">PTM Preparation</div>
                      <div className="event-meta">Staff Room</div>
                    </div>
                    <ChevronRight size={14} style={{ color: "#94a3b8" }} />
                  </div>
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="dash-card">
                <div className="dash-card-header">
                  <div className="dash-card-title">
                    <div className="dash-card-icon" style={{ background: "#dcfce7", color: "#15803d" }}>
                      <Calendar size={14} />
                    </div>
                    <span>Upcoming Events</span>
                  </div>
                  <span className="dash-view-all">View All →</span>
                </div>
                <div>
                  <div className="event-item-row">
                    <div className="event-date-box">
                      <span className="event-day">24</span>
                      <span className="event-month">Sep</span>
                    </div>
                    <div className="event-text">
                      <div className="event-name">Staff Meeting</div>
                      <div className="event-meta">10:30 - 11:30 AM • Conf. Hall</div>
                    </div>
                    <ChevronRight size={14} style={{ color: "#94a3b8" }} />
                  </div>
                  <div className="event-item-row">
                    <div className="event-date-box">
                      <span className="event-day">26</span>
                      <span className="event-month">Sep</span>
                    </div>
                    <div className="event-text">
                      <div className="event-name">PTM Preparation Meeting</div>
                      <div className="event-meta">02:00 - 03:00 PM • Staff Room</div>
                    </div>
                    <ChevronRight size={14} style={{ color: "#94a3b8" }} />
                  </div>
                  <div className="event-item-row">
                    <div className="event-date-box">
                      <span className="event-day">28</span>
                      <span className="event-month">Sep</span>
                    </div>
                    <div className="event-text">
                      <div className="event-name">Sports Day Practice</div>
                      <div className="event-meta">04:00 - 06:00 PM • Ground</div>
                    </div>
                    <ChevronRight size={14} style={{ color: "#94a3b8" }} />
                  </div>
                  <div className="event-item-row">
                    <div className="event-date-box">
                      <span className="event-day">01</span>
                      <span className="event-month">Oct</span>
                    </div>
                    <div className="event-text">
                      <div className="event-name">Teachers&apos; Training Program</div>
                      <div className="event-meta">09:00 AM - 01:00 PM • Hall</div>
                    </div>
                    <ChevronRight size={14} style={{ color: "#94a3b8" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Notices, Students' Performance, Upcoming Exams */}
            <div className="dash-three-col-row">
              {/* Notices */}
              <div className="dash-card">
                <div className="dash-card-header">
                  <div className="dash-card-title">
                    <div className="dash-card-icon" style={{ background: "#dbeafe", color: "#1d4ed8" }}>
                      <Bell size={14} />
                    </div>
                    <span>Notices</span>
                  </div>
                  <span className="dash-view-all">View All →</span>
                </div>
                <div>
                  <div className="notice-item-row">
                    <div className="notice-dot" style={{ background: "#ef4444" }} />
                    <div className="notice-content">
                      <div className="notice-title">School closed on 26 Sep (Sat)</div>
                      <div className="notice-date">24 Sep 2025</div>
                    </div>
                  </div>
                  <div className="notice-item-row">
                    <div className="notice-dot" style={{ background: "#8b5cf6" }} />
                    <div className="notice-content">
                      <div className="notice-title">Guidelines for Annual Exam</div>
                      <div className="notice-date">22 Sep 2025</div>
                    </div>
                  </div>
                  <div className="notice-item-row">
                    <div className="notice-dot" style={{ background: "#10b981" }} />
                    <div className="notice-content">
                      <div className="notice-title">PTM Schedule for Classes 1 – 8</div>
                      <div className="notice-date">20 Sep 2025</div>
                    </div>
                  </div>
                  <div className="notice-item-row">
                    <div className="notice-dot" style={{ background: "#f59e0b" }} />
                    <div className="notice-content">
                      <div className="notice-title">Staff Meeting Reminder</div>
                      <div className="notice-date">18 Sep 2025</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Students' Performance Chart */}
              <div className="dash-card">
                <div className="dash-card-header">
                  <div className="dash-card-title">
                    <div className="dash-card-icon" style={{ background: "#dcfce7", color: "#15803d" }}>
                      <BarChart3 size={14} />
                    </div>
                    <span>Students&apos; Performance</span>
                  </div>
                  <span className="dash-view-all">View All →</span>
                </div>
                <div>
                  <div className="perf-bar-chart">
                    <div className="perf-bar-col">
                      <span className="perf-bar-val">85%</span>
                      <div className="perf-bar-fill" style={{ height: "85%", background: "#38bdf8" }} />
                      <span className="perf-bar-label">Maths</span>
                    </div>
                    <div className="perf-bar-col">
                      <span className="perf-bar-val">78%</span>
                      <div className="perf-bar-fill" style={{ height: "78%", background: "#f87171" }} />
                      <span className="perf-bar-label">Sci</span>
                    </div>
                    <div className="perf-bar-col">
                      <span className="perf-bar-val">82%</span>
                      <div className="perf-bar-fill" style={{ height: "82%", background: "#06b6d4" }} />
                      <span className="perf-bar-label">Eng</span>
                    </div>
                    <div className="perf-bar-col">
                      <span className="perf-bar-val">76%</span>
                      <div className="perf-bar-fill" style={{ height: "76%", background: "#fbbf24" }} />
                      <span className="perf-bar-label">Soc</span>
                    </div>
                    <div className="perf-bar-col">
                      <span className="perf-bar-val">88%</span>
                      <div className="perf-bar-fill" style={{ height: "88%", background: "#a855f7" }} />
                      <span className="perf-bar-label">Kan</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.4rem", fontSize: "0.68rem" }}>
                    <span style={{ color: "#0284c7", fontWeight: 700 }}>Top: Class 10 (85%)</span>
                    <span style={{ color: "#16a34a", fontWeight: 700 }}>Avg: 81.8%</span>
                  </div>
                </div>
              </div>

              {/* Upcoming Exams */}
              <div className="dash-card">
                <div className="dash-card-header">
                  <div className="dash-card-title">
                    <div className="dash-card-icon" style={{ background: "#ede9fe", color: "#7c3aed" }}>
                      <Clock size={14} />
                    </div>
                    <span>Upcoming Exams</span>
                  </div>
                  <span className="dash-view-all">View All →</span>
                </div>
                <div>
                  <div className="event-item-row">
                    <div className="event-date-box" style={{ background: "#f0fdf4", color: "#16a34a" }}>
                      <span className="event-day">26</span>
                      <span className="event-month">Sep</span>
                    </div>
                    <div className="event-text">
                      <div className="event-name">Mathematics (Class 6)</div>
                      <div className="event-meta">08:00 - 10:00 AM • Hall A</div>
                    </div>
                    <ChevronRight size={14} style={{ color: "#94a3b8" }} />
                  </div>
                  <div className="event-item-row">
                    <div className="event-date-box" style={{ background: "#eff6ff", color: "#2563eb" }}>
                      <span className="event-day">30</span>
                      <span className="event-month">Sep</span>
                    </div>
                    <div className="event-text">
                      <div className="event-name">Science (Class 7)</div>
                      <div className="event-meta">08:00 - 10:00 AM • Hall B</div>
                    </div>
                    <ChevronRight size={14} style={{ color: "#94a3b8" }} />
                  </div>
                  <div className="event-item-row">
                    <div className="event-date-box" style={{ background: "#f5f3ff", color: "#7c3aed" }}>
                      <span className="event-day">03</span>
                      <span className="event-month">Oct</span>
                    </div>
                    <div className="event-text">
                      <div className="event-name">English (Class 8)</div>
                      <div className="event-meta">08:00 - 10:00 AM • Hall A</div>
                    </div>
                    <ChevronRight size={14} style={{ color: "#94a3b8" }} />
                  </div>
                  <div className="event-item-row">
                    <div className="event-date-box" style={{ background: "#fff7ed", color: "#ea580c" }}>
                      <span className="event-day">07</span>
                      <span className="event-month">Oct</span>
                    </div>
                    <div className="event-text">
                      <div className="event-name">Social Studies (Class 9)</div>
                      <div className="event-meta">08:00 - 10:00 AM • Hall B</div>
                    </div>
                    <ChevronRight size={14} style={{ color: "#94a3b8" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT 25% AREA */}
          <div className="dash-kiosk-body-right">
            {/* AI Assistant */}
            <div className="ai-assistant-card" style={{ height: "180px" }}>
              <div className="ai-header-group">
                <div className="ai-header-text">
                  <h3>
                    <Sparkles size={15} /> AI Assistant
                  </h3>
                  <p>Ask anything about classes or academic duties.</p>
                </div>
                <div className="ai-bot-circle" style={{ width: 28, height: 28, background: "#0d9488", color: "#ffffff", display: "grid", placeItems: "center", borderRadius: "50%" }}>
                  <Sparkles size={14} />
                </div>
              </div>

              <div className="ai-prompt-pills">
                <button className="ai-pill-btn" onClick={() => handleAsk("What is my today's timetable?")}>
                  My timetable?
                </button>
                <button className="ai-pill-btn" onClick={() => handleAsk("Show student performance")}>
                  Performance?
                </button>
                <button className="ai-pill-btn" onClick={() => handleAsk("Any circulars for staff?")}>
                  Staff circulars?
                </button>
                <button className="ai-pill-btn" onClick={() => handleAsk("When is the next exam?")}>
                  Next exam?
                </button>
              </div>

              <div className="ai-input-wrap">
                <input
                  type="text"
                  placeholder={chatResponse ? chatResponse : "Type your question..."}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAsk(chatInput)}
                />
                <button className="ai-send-btn" onClick={() => handleAsk(chatInput)}>
                  <Send size={12} />
                </button>
              </div>
            </div>

            {/* Academic Moderation & Task Pipeline (Replaces Photo Gallery) */}
            <div className="dash-card">
              <div className="dash-card-header">
                <div className="dash-card-title">
                  <div className="dash-card-icon" style={{ background: "#ccfbf1", color: "#0f766e" }}>
                    <ClipboardList size={14} />
                  </div>
                  <span>Academic Task Pipeline</span>
                </div>
                <span className="dash-view-all">Manage →</span>
              </div>
              <div className="dash-telemetry-list">
                <div className="dash-telemetry-item">
                  <div className="dash-telemetry-left">
                    <div className="dash-telemetry-icon" style={{ background: "#fee2e2", color: "#b91c1c" }}>
                      <FileCheck size={12} />
                    </div>
                    <div>
                      <div className="dash-telemetry-title">FA-II Marks Entry</div>
                      <div className="dash-telemetry-sub">Classes 7B & 8A • Due 04 PM</div>
                    </div>
                  </div>
                  <span className="dash-telemetry-status" style={{ background: "#fef2f2", color: "#dc2626" }}>● Urgent</span>
                </div>

                <div className="dash-telemetry-item">
                  <div className="dash-telemetry-left">
                    <div className="dash-telemetry-icon" style={{ background: "#dcfce7", color: "#15803d" }}>
                      <CheckCircle2 size={12} />
                    </div>
                    <div>
                      <div className="dash-telemetry-title">Mid-Term Paper Moderation</div>
                      <div className="dash-telemetry-sub">4/4 Sets Signed Off</div>
                    </div>
                  </div>
                  <span className="dash-telemetry-status status-active">● Verified</span>
                </div>

                <div className="dash-telemetry-item">
                  <div className="dash-telemetry-left">
                    <div className="dash-telemetry-icon" style={{ background: "#e0f2fe", color: "#0369a1" }}>
                      <Activity size={12} />
                    </div>
                    <div>
                      <div className="dash-telemetry-title">Math Olympiad Roster</div>
                      <div className="dash-telemetry-sub">18 Candidates Shortlisted</div>
                    </div>
                  </div>
                  <span className="dash-telemetry-status status-open">● Ready</span>
                </div>
              </div>
            </div>

            {/* Campus Facilities & Room Bookings (Replaces Virtual Tour) */}
            <div className="dash-card">
              <div className="dash-card-header">
                <div className="dash-card-title">
                  <div className="dash-card-icon" style={{ background: "#ede9fe", color: "#7c3aed" }}>
                    <Building2 size={14} />
                  </div>
                  <span>Facilities & Bookings</span>
                </div>
                <span className="dash-view-all">Schedule</span>
              </div>
              <div className="dash-telemetry-list">
                <div className="dash-telemetry-item">
                  <div className="dash-telemetry-left">
                    <div className="dash-telemetry-icon" style={{ background: "#e0f2fe", color: "#0284c7" }}>
                      <FlaskConical size={12} />
                    </div>
                    <div>
                      <div className="dash-telemetry-title">Science Lab 2</div>
                      <div className="dash-telemetry-sub">Booked 10:45 AM (Class 8A)</div>
                    </div>
                  </div>
                  <span className="dash-telemetry-status status-active">● Reserved</span>
                </div>

                <div className="dash-telemetry-item">
                  <div className="dash-telemetry-left">
                    <div className="dash-telemetry-icon" style={{ background: "#ffedd5", color: "#ea580c" }}>
                      <Users size={12} />
                    </div>
                    <div>
                      <div className="dash-telemetry-title">Conference Hall A</div>
                      <div className="dash-telemetry-sub">Staff Sync at 11:30 AM</div>
                    </div>
                  </div>
                  <span className="dash-telemetry-status status-ready">● 11:30 AM</span>
                </div>

                <div className="dash-telemetry-item">
                  <div className="dash-telemetry-left">
                    <div className="dash-telemetry-icon" style={{ background: "#dcfce7", color: "#15803d" }}>
                      <Cpu size={12} />
                    </div>
                    <div>
                      <div className="dash-telemetry-title">Smart Board Room 204</div>
                      <div className="dash-telemetry-sub">Hardware & Projector OK</div>
                    </div>
                  </div>
                  <span className="dash-telemetry-status status-active">● Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* COMPACT FOOTER */}
      <footer className="dash-footer">
        <div>Green Valley Public School • Staff Portal • Learn • Grow • Excel</div>
        <div className="dash-footer-badges">
          <span className="dash-footer-badge-item">
            <ShieldCheck size={13} style={{ color: "#10b981" }} /> Safe
          </span>
          <span className="dash-footer-badge-item">
            <Lock size={13} style={{ color: "#0284c7" }} /> Secure
          </span>
          <span className="dash-footer-badge-item">
            <Cpu size={13} style={{ color: "#9333ea" }} /> Smart Faculty
          </span>
        </div>
      </footer>
    </div>
  );
}
