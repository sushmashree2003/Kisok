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
} from "lucide-react";

interface DashboardProps {
  onBackToKiosk: () => void;
}

export default function AlumniDashboard({ onBackToKiosk }: DashboardProps) {
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
            placeholder="Search alumni, events, chapters, jobs..."
          />
        </div>

        <div className="dash-nav-actions">
          <button className="dash-icon-btn" aria-label="Notifications">
            <Bell size={16} />
            <span className="dash-notification-badge">3</span>
          </button>

          <div className="dash-profile-pill">
            <img src={session?.img || "/alumni_avatar.png"} alt="Rohan Sharma" className="dash-user-avatar" />
            <div className="dash-user-info">
              <span className="dash-user-name">{session?.username || "Rohan Sharma"}</span>
              <span className="dash-user-role">
                {session ? `${session.Rolename} • Batch : ${session.ASMAY_Year || "2015"}` : "Alumni • Batch : 2015"}
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
        {/* Banner */}
        <section className="dash-hero-banner banner-alumni">
          <div className="dash-hero-left">
            <h2 className="dash-hero-title" style={{ fontSize: "1.4rem" }}>
              Once a GVian, Always a GVian
            </h2>
            <p className="dash-hero-desc" style={{ fontSize: "0.72rem" }}>
              Global Alumni Legacy Network • 18 International Chapters • Mentorship, Careers & Alma Mater Giving.
            </p>
            <div className="dash-hero-tags">
              <span className="dash-hero-tag">🎓 Class of 2015 (Batch XI)</span>
              <span className="dash-hero-tag">🌐 18 Global Chapters</span>
              <span className="dash-hero-tag">🤝 12,400+ Alumni Network</span>
              <span className="dash-hero-tag">💼 45 Active Mentors</span>
            </div>
          </div>
          <div className="dash-hero-right-badge data-badge" style={{ fontSize: "0.78rem" }}>
            <span style={{ fontSize: "0.62rem", opacity: 0.85 }}>Alumni Community</span>
            <b style={{ fontSize: "1.1rem", fontWeight: 800 }}>12,400+</b>
            <span style={{ fontSize: "0.6rem", opacity: 0.85 }}>Connected Globally</span>
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

      {/* COMPACT FOOTER */}
      <footer className="dash-footer">
        <div>Green Valley Public School • Learn • Grow • Excel</div>
        <div className="dash-footer-badges">
          <span className="dash-footer-badge-item">
            <ShieldCheck size={13} style={{ color: "#10b981" }} /> Safe
          </span>
          <span className="dash-footer-badge-item">
            <Lock size={13} style={{ color: "#0284c7" }} /> Secure
          </span>
          <span className="dash-footer-badge-item">
            <Cpu size={13} style={{ color: "#9333ea" }} /> Smart
          </span>
        </div>
      </footer>
    </div>
  );
}
