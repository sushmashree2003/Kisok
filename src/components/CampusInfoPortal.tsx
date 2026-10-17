"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserSession } from "@/lib/session";
import {
  Calendar,
  GraduationCap,
  Users,
  ArrowRight,
  Trophy,
  Camera,
  MapPin,
  Megaphone,
  X,
  Maximize,
  Minimize,
  Building2,
  ChevronRight,
  Play,
  Leaf,
  ShieldCheck,
  Activity,
  FlaskConical,
  Sparkles,
  Award,
  QrCode,
  BookOpen,
  Cpu,
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
  const router = useRouter();
  const [internalTime, setInternalTime] = useState<Date | null>(null);
  const [internalIsFullscreen, setInternalIsFullscreen] = useState(false);
  const [virtualTourOpen, setVirtualTourOpen] = useState(false);
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [selectedGalleryImg, setSelectedGalleryImg] = useState<{ src: string; title: string } | null>(null);
  const [achievementsModalOpen, setAchievementsModalOpen] = useState(false);
  const [eventsModalOpen, setEventsModalOpen] = useState(false);
  const [schoolName, setSchoolName] = useState<string>("Madhuvan Vatika - MVPS");

  useEffect(() => {
    const session = getUserSession();
    if (session?.initname && session.initname !== "Green Valley Public School") {
      setSchoolName(session.initname);
      document.title = `${session.initname} • Smart Campus Kiosk`;
    } else {
      document.title = "Madhuvan Vatika - MVPS • Smart Campus Kiosk";
    }

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

  return (
    <div className="mv-kiosk-wrapper">
      {/* =========================================================================
         1. FLOATING GLASS COMMAND HEADER
         ========================================================================= */}
      <header className="mv-header-bar">
        {/* Brand Group */}
        <div className="mv-brand-group">
          <svg className="mv-brand-crest" viewBox="0 0 48 48" fill="none">
            <path
              d="M24 7C28 11 34 13 38 10C38 18 31 23 24 24C17 23 10 18 10 10C14 13 20 11 24 7Z"
              fill="#ea580c"
            />
            <path
              d="M24 24V11"
              stroke="#c2410c"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M5 36C12 31.5 18 32.5 24 37C30 32.5 36 31.5 43 36V18C36 13.5 30 14.5 24 19C18 14.5 12 13.5 5 18V36Z"
              fill="#0e2a47"
            />
            <path
              d="M24 19V37"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
          <div className="mv-brand-titles">
            <h1 className="mv-brand-name">{schoolName}</h1>
            <div className="mv-brand-sub">
              <span>Learn • Grow • Excel</span>
              <span>•</span>
              <span>CBSE Affiliated Sr. Sec. (1930281)</span>
            </div>
          </div>
        </div>

        {/* Center News Marquee Capsule */}
        <div className="mv-news-capsule">
          <div className="mv-news-badge">
            <Megaphone size={12} />
            <span>Campus Live</span>
          </div>
          <div className="mv-news-scroller">
            <div className="mv-news-track">
              <span className="mv-news-sep">|</span>
              <span>Madhuvan Vatika scholars achieve 100% first-class CBSE Board distinction</span>
              <span className="mv-news-sep">|</span>
              <span>Admissions Open for Academic Session 2026-27 • Nursery to Grade XII</span>
              <span className="mv-news-sep">|</span>
              <span>Annual Sports Day Track &amp; Field Finals scheduled for 28th September</span>
              <span className="mv-news-sep">|</span>
              <span>State STEM Robotics Expo: MVPS Innovation team wins District First Place</span>
            </div>
          </div>
        </div>

        {/* Right Status & Clock */}
        <div className="mv-header-tools">
          <div className="mv-live-pill">
            <span className="mv-pulse-dot" />
            <span>Kiosk Online</span>
          </div>

          <div className="mv-clock-pill">
            <Calendar size={13} style={{ color: "#ea580c" }} />
            <span>{currentTime ? formatDate(currentTime) : "Sat, 17 Oct 2026"} • </span>
            <b>{currentTime ? formatTime(currentTime) : "05:20 PM"}</b>
          </div>

          <button
            className="mv-fs-trigger"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
          </button>
        </div>
      </header>

      {/* =========================================================================
         2. MAIN ASYMMETRICAL BENTO GRID
         ========================================================================= */}
      <main className="mv-bento-grid">
        {/* =====================================================================
           ZONE A (LEFT): CINEMATIC SHOWCASE & DIRECT TOUCH ROLES
           ===================================================================== */}
        <div className="mv-col-left">
          {/* Card A1: Hero Cinematic Showcase */}
          <div className="mv-hero-showcase">
            <div className="mv-hero-sc-overlay" />
            <div className="mv-hero-sc-content">
              <div>
                <span className="mv-hero-cursive-kicker">Welcome to</span>
                <h2 className="mv-hero-main-title">{schoolName}</h2>
                <p className="mv-hero-desc">
                  Empowering young minds with world-class scholastic rigor, ethical leadership,
                  and futuristic STEM innovation.
                </p>
              </div>

              {/* 4 Distinction Stat Badges */}
              <div className="mv-hero-pills-row">
                <div className="mv-hero-stat-chip">
                  <div className="mv-hero-chip-icon">
                    <Trophy size={14} />
                  </div>
                  <div className="mv-hero-chip-text">
                    <b>100% Pass</b>
                    <span>CBSE Board Distinction</span>
                  </div>
                </div>

                <div className="mv-hero-stat-chip">
                  <div className="mv-hero-chip-icon">
                    <GraduationCap size={14} />
                  </div>
                  <div className="mv-hero-chip-text">
                    <b>25+ Years</b>
                    <span>Academic Excellence</span>
                  </div>
                </div>

                <div className="mv-hero-stat-chip">
                  <div className="mv-hero-chip-icon">
                    <Users size={14} />
                  </div>
                  <div className="mv-hero-chip-text">
                    <b>6,000+</b>
                    <span>Happy Scholars</span>
                  </div>
                </div>

                <div className="mv-hero-stat-chip">
                  <div className="mv-hero-chip-icon">
                    <Cpu size={14} />
                  </div>
                  <div className="mv-hero-chip-text">
                    <b>45+ Labs</b>
                    <span>Robotics &amp; AI Smart Hubs</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mv-hero-bottom-actions">
                <button
                  className="mv-tour-glow-btn"
                  onClick={() => setVirtualTourOpen(true)}
                >
                  <Play size={11} fill="#ea580c" />
                  <span>Explore 360° Campus</span>
                </button>
                <span className="mv-creed-author">— Madhuvan Vatika Legacy</span>
              </div>
            </div>
          </div>

          {/* Card A2: Touch-To-Enter Role Hub */}
          <div className="mv-role-hub-card">
            <div className="mv-hub-header">
              <h3 className="mv-hub-title">
                <ShieldCheck size={16} style={{ color: "#ea580c" }} />
                <span>Self-Service Gateway</span>
              </h3>
              <span className="mv-hub-kicker">Touch To Sign In</span>
            </div>

            <div className="mv-roles-grid">
              <div
                className="mv-role-pill-btn"
                onClick={() => router.push("/login?role=student")}
                title="Open Student & Parent Portal"
              >
                <div className="mv-role-icon student">
                  <GraduationCap size={18} />
                </div>
                <div className="mv-role-text">
                  <b>Student &amp; Parent</b>
                  <span>Reports, Fees &amp; HW</span>
                </div>
              </div>

              <div
                className="mv-role-pill-btn"
                onClick={() => router.push("/login?role=staff")}
                title="Open Staff Portal"
              >
                <div className="mv-role-icon staff">
                  <Users size={18} />
                </div>
                <div className="mv-role-text">
                  <b>Faculty &amp; Staff</b>
                  <span>Timetable &amp; Leaves</span>
                </div>
              </div>

              <div
                className="mv-role-pill-btn"
                onClick={() => router.push("/visitor")}
                title="Open Visitor Desk"
              >
                <div className="mv-role-icon visitor">
                  <QrCode size={18} />
                </div>
                <div className="mv-role-text">
                  <b>Visitor &amp; Guest</b>
                  <span>Digital Pass &amp; Maps</span>
                </div>
              </div>

              <div
                className="mv-role-pill-btn"
                onClick={() => router.push("/alumni")}
                title="Open Alumni Network"
              >
                <div className="mv-role-icon alumni">
                  <Award size={18} />
                </div>
                <div className="mv-role-text">
                  <b>Alumni Network</b>
                  <span>Reunions &amp; Mentoring</span>
                </div>
              </div>
            </div>

            <button
              className="mv-primary-login-btn"
              onClick={onEnterRoleSelection}
              title="Open Full Portal Roster"
            >
              <span>Tap to Open All Portals</span>
              <ArrowRight size={17} />
            </button>
          </div>
        </div>

        {/* =====================================================================
           ZONE B (CENTER): HONORS SPOTLIGHT & RECENT MOMENTS GALLERY
           ===================================================================== */}
        <div className="mv-col-center">
          {/* Card B1: Honors & Awards Showcase */}
          <div className="mv-achieve-spotlight-card">
            <div className="mv-section-header">
              <div className="mv-section-title-wrap">
                <Trophy size={16} style={{ color: "#ea580c" }} />
                <h3 className="mv-section-title">Hall of Fame &amp; Awards</h3>
              </div>
              <button
                className="mv-view-all-btn"
                onClick={() => setAchievementsModalOpen(true)}
              >
                <span>View All</span>
                <ArrowRight size={13} />
              </button>
            </div>

            <div className="mv-achieve-cards-row">
              {/* Achievement 1 */}
              <div className="mv-achieve-card">
                <div className="mv-achieve-img-box">
                  <img src="/achievement_math.jpg" alt="Mathematics Quiz" />
                  <div className="mv-achieve-rank-pill">
                    <span>★ 1st Rank</span>
                  </div>
                </div>
                <div className="mv-achieve-meta">
                  <h4 className="mv-achieve-title">Mathematics Quiz</h4>
                  <span className="mv-achieve-level">Inter-School Olympiad</span>
                  <span className="mv-achieve-winner">Aarav Sharma • 100/100</span>
                </div>
              </div>

              {/* Achievement 2 */}
              <div className="mv-achieve-card">
                <div className="mv-achieve-img-box">
                  <img src="/achievement_cricket.jpg" alt="Cricket Champions" />
                  <div className="mv-achieve-rank-pill">
                    <span>★ Best Player</span>
                  </div>
                </div>
                <div className="mv-achieve-meta">
                  <h4 className="mv-achieve-title">Cricket Tournament</h4>
                  <span className="mv-achieve-level">Under-16 Finals Champions</span>
                  <span className="mv-achieve-winner">Rohan Varma • 84r &amp; 4w</span>
                </div>
              </div>

              {/* Achievement 3 */}
              <div className="mv-achieve-card">
                <div className="mv-achieve-img-box">
                  <img src="/achievement_science.jpg" alt="Science Expo" />
                  <div className="mv-achieve-rank-pill" style={{ background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" }}>
                    <span>2 2nd Place</span>
                  </div>
                </div>
                <div className="mv-achieve-meta">
                  <h4 className="mv-achieve-title">Science Exhibition</h4>
                  <span className="mv-achieve-level">District STEM Fair</span>
                  <span className="mv-achieve-winner">Ananya &amp; Team • Eco-Grid</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card B2: Recent Moments 2x2 Lightbox Gallery */}
          <div className="mv-gallery-card">
            <div className="mv-section-header">
              <div className="mv-section-title-wrap">
                <Camera size={16} style={{ color: "#0d9488" }} />
                <h3 className="mv-section-title" style={{ color: "#0d9488" }}>
                  Campus Life in Motion
                </h3>
              </div>
              <button
                className="mv-view-all-btn"
                style={{ color: "#0d9488" }}
                onClick={() => setGalleryModalOpen(true)}
              >
                <span>Gallery</span>
                <ArrowRight size={13} />
              </button>
            </div>

            <div className="mv-gallery-grid">
              <div
                className="mv-gallery-item"
                onClick={() =>
                  setSelectedGalleryImg({
                    src: "/events/annual_day.jpg",
                    title: "Annual Day 2025 Gala & Dance Performance",
                  })
                }
                title="View Annual Day 2025"
              >
                <img src="/events/annual_day.jpg" alt="Annual Day" />
                <div className="mv-gallery-label-bar">Annual Day 2025</div>
              </div>

              <div
                className="mv-gallery-item"
                onClick={() =>
                  setSelectedGalleryImg({
                    src: "/events/sports_parade.jpg",
                    title: "Sports Day Athletic March-Past & Parade",
                  })
                }
                title="View Sports Parade"
              >
                <img src="/events/sports_parade.jpg" alt="Sports Parade" />
                <div className="mv-gallery-label-bar">Sports Day Parade</div>
              </div>

              <div
                className="mv-gallery-item"
                onClick={() =>
                  setSelectedGalleryImg({
                    src: "/events/science_fair.jpg",
                    title: "District Science & Innovation Fair",
                  })
                }
                title="View Science Fair"
              >
                <img src="/events/science_fair.jpg" alt="Science Fair" />
                <div className="mv-gallery-label-bar">Science Expo</div>
              </div>

              <div
                className="mv-gallery-item"
                onClick={() =>
                  setSelectedGalleryImg({
                    src: "/events/teachers_day.jpg",
                    title: "Teachers' Day Felicitation Ceremony",
                  })
                }
                title="View Teachers' Day"
              >
                <img src="/events/teachers_day.jpg" alt="Teachers Day" />
                <div className="mv-gallery-label-bar">Teachers' Day</div>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================================
           ZONE C (RIGHT): LIVE EVENTS TIMELINE & CAMPUS FACILITIES
           ===================================================================== */}
        <div className="mv-col-right">
          {/* Card C1: Upcoming Events Timeline */}
          <div className="mv-timeline-card">
            <div className="mv-section-header">
              <div className="mv-section-title-wrap">
                <Calendar size={16} style={{ color: "#ea580c" }} />
                <h3 className="mv-section-title">Upcoming Schedule</h3>
              </div>
              <button
                className="mv-view-all-btn"
                onClick={() => setEventsModalOpen(true)}
              >
                <span>Calendar</span>
                <ArrowRight size={13} />
              </button>
            </div>

            <div className="mv-timeline-list">
              <div className="mv-timeline-row">
                <div className="mv-timeline-date">
                  <span className="mv-timeline-day">25</span>
                  <span className="mv-timeline-month">SEP</span>
                </div>
                <div className="mv-timeline-info">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h4 className="mv-timeline-name">Parent Teacher Meeting</h4>
                    <span className="mv-timeline-tag academics">PTM</span>
                  </div>
                  <span className="mv-timeline-venue">10:00 AM – 12:00 PM | Main Auditorium</span>
                </div>
              </div>

              <div className="mv-timeline-row">
                <div className="mv-timeline-date">
                  <span className="mv-timeline-day">28</span>
                  <span className="mv-timeline-month">SEP</span>
                </div>
                <div className="mv-timeline-info">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h4 className="mv-timeline-name">Sports Day Finals</h4>
                    <span className="mv-timeline-tag sports">Sports</span>
                  </div>
                  <span className="mv-timeline-venue">04:00 PM – 06:00 PM | Athletic Arena</span>
                </div>
              </div>

              <div className="mv-timeline-row">
                <div className="mv-timeline-date">
                  <span className="mv-timeline-day">02</span>
                  <span className="mv-timeline-month">OCT</span>
                </div>
                <div className="mv-timeline-info">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h4 className="mv-timeline-name">Science &amp; AI Exhibition</h4>
                    <span className="mv-timeline-tag stem">STEM</span>
                  </div>
                  <span className="mv-timeline-venue">All Day | Discovery Block Labs</span>
                </div>
              </div>

              <div className="mv-timeline-row">
                <div className="mv-timeline-date">
                  <span className="mv-timeline-day">10</span>
                  <span className="mv-timeline-month">OCT</span>
                </div>
                <div className="mv-timeline-info">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h4 className="mv-timeline-name">Children's Day Gala</h4>
                    <span className="mv-timeline-tag fest">Cultural</span>
                  </div>
                  <span className="mv-timeline-venue">09:00 AM – 12:00 PM | Main Auditorium</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card C2: Campus Facilities Peek + Quote Ribbon */}
          <div className="mv-facilities-quote-card">
            <div className="mv-section-header">
              <div className="mv-section-title-wrap">
                <Building2 size={16} style={{ color: "#ea580c" }} />
                <h3 className="mv-section-title">World-Class Facilities</h3>
              </div>
              <button
                className="mv-view-all-btn"
                onClick={() => setVirtualTourOpen(true)}
              >
                <span>Tour</span>
                <ArrowRight size={13} />
              </button>
            </div>

            <div className="mv-fac-mini-grid">
              <div className="mv-fac-mini-item" onClick={() => setVirtualTourOpen(true)}>
                <img src="/facilities/classrooms.jpg" alt="Classrooms" className="mv-fac-mini-img" />
                <span className="mv-fac-mini-title">Classrooms</span>
              </div>
              <div className="mv-fac-mini-item" onClick={() => setVirtualTourOpen(true)}>
                <img src="/facilities/labs.jpg" alt="STEM Labs" className="mv-fac-mini-img" />
                <span className="mv-fac-mini-title">AI &amp; Labs</span>
              </div>
              <div className="mv-fac-mini-item" onClick={() => setVirtualTourOpen(true)}>
                <img src="/facilities/library.jpg" alt="Library" className="mv-fac-mini-img" />
                <span className="mv-fac-mini-title">Library</span>
              </div>
              <div className="mv-fac-mini-item" onClick={() => setVirtualTourOpen(true)}>
                <img src="/facilities/sports.jpg" alt="Sports Arena" className="mv-fac-mini-img" />
                <span className="mv-fac-mini-title">Sports Turf</span>
              </div>
              <div className="mv-fac-mini-item" onClick={() => setVirtualTourOpen(true)}>
                <img src="/facilities/auditorium.jpg" alt="Auditorium" className="mv-fac-mini-img" />
                <span className="mv-fac-mini-title">Auditorium</span>
              </div>
              <div className="mv-fac-mini-item" onClick={() => setVirtualTourOpen(true)}>
                <img src="/facilities/playground.jpg" alt="Playground" className="mv-fac-mini-img" />
                <span className="mv-fac-mini-title">Playground</span>
              </div>
            </div>

            <div className="mv-creed-ribbon">
              <span className="mv-creed-quote-mark">“</span>
              <p className="mv-creed-text">
                Education is not just about books, it’s about building a better tomorrow.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* =========================================================================
         3. BOTTOM STATUS RIBBON
         ========================================================================= */}
      <footer className="mv-footer-bar">
        <div className="mv-footer-tags">
          <div className="mv-footer-tag">
            <ShieldCheck size={13} style={{ color: "#059669" }} />
            <span>Safe &amp; Biometric Secured Campus</span>
          </div>
          <div className="mv-footer-tag">
            <Users size={13} style={{ color: "#ea580c" }} />
            <span>180+ Dedicated Faculty</span>
          </div>
          <div className="mv-footer-tag">
            <Leaf size={13} style={{ color: "#16a34a" }} />
            <span>Eco-Smart Green Campus</span>
          </div>
        </div>

        <div className="mv-footer-motto">
          — Together for a Brighter Tomorrow 🍃 —
        </div>

        <div className="mv-footer-links">
          <span>Academics</span> | <span>Sports</span> | <span>Arts</span> | <span>Values</span> | <span>Life Skills</span>
        </div>
      </footer>

      {/* =========================================================================
         MODAL 1: 360 VIRTUAL TOUR
         ========================================================================= */}
      {virtualTourOpen && (
        <div
          className="mp-modal-backdrop"
          onClick={() => setVirtualTourOpen(false)}
        >
          <div
            className="mp-modal-window"
            style={{ width: "850px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)",
                color: "#ffffff",
                padding: "0.85rem 1.25rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <MapPin size={18} />
                <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800 }}>
                  {schoolName} • 360° Interactive Campus Virtual Tour
                </h3>
              </div>
              <button
                onClick={() => setVirtualTourOpen(false)}
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  border: "none",
                  borderRadius: "50%",
                  width: 30,
                  height: 30,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  cursor: "pointer",
                }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: "1rem", background: "#f8fafc" }}>
              <img
                src="/campus_360.jpg"
                alt="360 Campus Tour"
                style={{
                  width: "100%",
                  height: "380px",
                  objectFit: "cover",
                  borderRadius: "12px",
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "0.75rem",
                }}
              >
                <div style={{ fontSize: "0.8rem", color: "#475569" }}>
                  📍 40-Acre Main Block, STEM Innovation Pavilions, Sports Arena &amp; Auditoriums
                </div>
                <button
                  onClick={() => setVirtualTourOpen(false)}
                  style={{
                    background: "#ea580c",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "9999px",
                    padding: "0.45rem 1.2rem",
                    fontWeight: 700,
                    fontSize: "0.8rem",
                    cursor: "pointer",
                  }}
                >
                  Close Tour
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
         MODAL 2: RECENT EVENTS GALLERY VIEWER
         ========================================================================= */}
      {(galleryModalOpen || selectedGalleryImg) && (
        <div
          className="mp-modal-backdrop"
          onClick={() => {
            setGalleryModalOpen(false);
            setSelectedGalleryImg(null);
          }}
        >
          <div
            className="mp-modal-window"
            style={{ width: "820px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)",
                color: "#ffffff",
                padding: "0.85rem 1.25rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Camera size={18} />
                <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800 }}>
                  {selectedGalleryImg ? selectedGalleryImg.title : `${schoolName} Campus Life Gallery`}
                </h3>
              </div>
              <button
                onClick={() => {
                  setGalleryModalOpen(false);
                  setSelectedGalleryImg(null);
                }}
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  border: "none",
                  borderRadius: "50%",
                  width: 30,
                  height: 30,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  cursor: "pointer",
                }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: "1rem", background: "#f8fafc" }}>
              {selectedGalleryImg ? (
                <div>
                  <img
                    src={selectedGalleryImg.src}
                    alt={selectedGalleryImg.title}
                    style={{
                      width: "100%",
                      height: "360px",
                      objectFit: "cover",
                      borderRadius: "12px",
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "0.75rem",
                    }}
                  >
                    <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1e293b" }}>
                      {selectedGalleryImg.title}
                    </span>
                    <button
                      onClick={() => setSelectedGalleryImg(null)}
                      style={{
                        background: "#0d9488",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "9999px",
                        padding: "0.4rem 1rem",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      View All Photos
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "12px",
                  }}
                >
                  <div
                    onClick={() =>
                      setSelectedGalleryImg({
                        src: "/events/annual_day.jpg",
                        title: "Annual Day 2025 Gala & Dance Performance",
                      })
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src="/events/annual_day.jpg"
                      alt="Annual Day 2025"
                      style={{ width: "100%", height: "170px", objectFit: "cover", borderRadius: "8px" }}
                    />
                    <div style={{ fontWeight: 800, fontSize: "0.82rem", marginTop: 4 }}>
                      Annual Day 2025 Celebrations
                    </div>
                  </div>

                  <div
                    onClick={() =>
                      setSelectedGalleryImg({
                        src: "/events/sports_parade.jpg",
                        title: "Sports Day Athletic March-Past & Parade",
                      })
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src="/events/sports_parade.jpg"
                      alt="Sports Parade"
                      style={{ width: "100%", height: "170px", objectFit: "cover", borderRadius: "8px" }}
                    />
                    <div style={{ fontWeight: 800, fontSize: "0.82rem", marginTop: 4 }}>
                      Sports Day Athletic March-Past &amp; Parade
                    </div>
                  </div>

                  <div
                    onClick={() =>
                      setSelectedGalleryImg({
                        src: "/events/science_fair.jpg",
                        title: "District Science & Innovation Fair",
                      })
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src="/events/science_fair.jpg"
                      alt="Science Fair"
                      style={{ width: "100%", height: "170px", objectFit: "cover", borderRadius: "8px" }}
                    />
                    <div style={{ fontWeight: 800, fontSize: "0.82rem", marginTop: 4 }}>
                      District Science &amp; Innovation Fair
                    </div>
                  </div>

                  <div
                    onClick={() =>
                      setSelectedGalleryImg({
                        src: "/events/teachers_day.jpg",
                        title: "Teachers' Day Felicitation Ceremony",
                      })
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src="/events/teachers_day.jpg"
                      alt="Teachers Day"
                      style={{ width: "100%", height: "170px", objectFit: "cover", borderRadius: "8px" }}
                    />
                    <div style={{ fontWeight: 800, fontSize: "0.82rem", marginTop: 4 }}>
                      Teachers' Day Felicitation Ceremony
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
         MODAL 3: VIEW ALL ACHIEVEMENTS
         ========================================================================= */}
      {achievementsModalOpen && (
        <div
          className="mp-modal-backdrop"
          onClick={() => setAchievementsModalOpen(false)}
        >
          <div
            className="mp-modal-window"
            style={{ width: "780px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)",
                color: "#ffffff",
                padding: "0.85rem 1.25rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Trophy size={18} />
                <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800 }}>
                  {schoolName} Hall of Fame &amp; Honors
                </h3>
              </div>
              <button
                onClick={() => setAchievementsModalOpen(false)}
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  border: "none",
                  borderRadius: "50%",
                  width: 30,
                  height: 30,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  cursor: "pointer",
                }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: "1.25rem", background: "#f8fafc", maxHeight: "450px", overflowY: "auto" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                <div style={{ background: "#ffffff", borderRadius: "10px", padding: "10px", border: "1px solid #fed7aa" }}>
                  <img src="/achievement_math.jpg" alt="Math Quiz" style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "8px" }} />
                  <span style={{ display: "inline-block", background: "#ea580c", color: "#fff", fontSize: "0.68rem", fontWeight: 800, padding: "2px 8px", borderRadius: "9999px", marginTop: "6px" }}>★ 1st Rank</span>
                  <h4 style={{ margin: "4px 0 2px", fontSize: "0.85rem", fontWeight: 800 }}>Inter-School Mathematics Quiz</h4>
                  <p style={{ margin: 0, fontSize: "0.72rem", color: "#64748b" }}>Inter School Competition • Aug 2025</p>
                </div>

                <div style={{ background: "#ffffff", borderRadius: "10px", padding: "10px", border: "1px solid #fed7aa" }}>
                  <img src="/achievement_cricket.jpg" alt="Cricket" style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "8px" }} />
                  <span style={{ display: "inline-block", background: "#ea580c", color: "#fff", fontSize: "0.68rem", fontWeight: 800, padding: "2px 8px", borderRadius: "9999px", marginTop: "6px" }}>★ Best Player</span>
                  <h4 style={{ margin: "4px 0 2px", fontSize: "0.85rem", fontWeight: 800 }}>Inter-School Cricket Tournament</h4>
                  <p style={{ margin: 0, fontSize: "0.72rem", color: "#64748b" }}>Inter School • Sep 2025</p>
                </div>

                <div style={{ background: "#ffffff", borderRadius: "10px", padding: "10px", border: "1px solid #fed7aa" }}>
                  <img src="/achievement_science.jpg" alt="Science" style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "8px" }} />
                  <span style={{ display: "inline-block", background: "#f59e0b", color: "#fff", fontSize: "0.68rem", fontWeight: 800, padding: "2px 8px", borderRadius: "9999px", marginTop: "6px" }}>2 2nd Place</span>
                  <h4 style={{ margin: "4px 0 2px", fontSize: "0.85rem", fontWeight: 800 }}>District Science Exhibition</h4>
                  <p style={{ margin: 0, fontSize: "0.72rem", color: "#64748b" }}>District Level • Aug 2025</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
         MODAL 4: VIEW ALL UPCOMING EVENTS
         ========================================================================= */}
      {eventsModalOpen && (
        <div
          className="mp-modal-backdrop"
          onClick={() => setEventsModalOpen(false)}
        >
          <div
            className="mp-modal-window"
            style={{ width: "650px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)",
                color: "#ffffff",
                padding: "0.85rem 1.25rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Calendar size={18} />
                <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800 }}>
                  {schoolName} Upcoming Schedule
                </h3>
              </div>
              <button
                onClick={() => setEventsModalOpen(false)}
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  border: "none",
                  borderRadius: "50%",
                  width: 30,
                  height: 30,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  cursor: "pointer",
                }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: "1.25rem", background: "#f8fafc", maxHeight: "420px", overflowY: "auto" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ background: "#ffffff", borderRadius: "8px", padding: "10px 14px", border: "1px solid #fed7aa", display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ background: "#fff7ed", borderRadius: "6px", width: 44, height: 44, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "1px solid #fed7aa" }}>
                    <b style={{ fontSize: "1rem", color: "#c2410c" }}>25</b>
                    <span style={{ fontSize: "0.62rem", color: "#ea580c", fontWeight: 800 }}>SEP</span>
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: "0.9rem", fontWeight: 800 }}>Parent Teacher Meeting (PTM)</h4>
                    <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "#64748b" }}>10:00 AM – 12:00 PM | School Main Auditorium</p>
                  </div>
                </div>

                <div style={{ background: "#ffffff", borderRadius: "8px", padding: "10px 14px", border: "1px solid #fed7aa", display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ background: "#fff7ed", borderRadius: "6px", width: 44, height: 44, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "1px solid #fed7aa" }}>
                    <b style={{ fontSize: "1rem", color: "#c2410c" }}>28</b>
                    <span style={{ fontSize: "0.62rem", color: "#ea580c", fontWeight: 800 }}>SEP</span>
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: "0.9rem", fontWeight: 800 }}>Sports Day Practice &amp; Athletic Heats</h4>
                    <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "#64748b" }}>04:00 PM – 06:00 PM | Campus Athletic Arena</p>
                  </div>
                </div>

                <div style={{ background: "#ffffff", borderRadius: "8px", padding: "10px 14px", border: "1px solid #fed7aa", display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ background: "#fff7ed", borderRadius: "6px", width: 44, height: 44, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "1px solid #fed7aa" }}>
                    <b style={{ fontSize: "1rem", color: "#c2410c" }}>02</b>
                    <span style={{ fontSize: "0.62rem", color: "#ea580c", fontWeight: 800 }}>OCT</span>
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: "0.9rem", fontWeight: 800 }}>District Science &amp; Innovation Exhibition</h4>
                    <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "#64748b" }}>All Day (09:00 AM – 04:30 PM) | Discovery Block</p>
                  </div>
                </div>

                <div style={{ background: "#ffffff", borderRadius: "8px", padding: "10px 14px", border: "1px solid #fed7aa", display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ background: "#fff7ed", borderRadius: "6px", width: 44, height: 44, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "1px solid #fed7aa" }}>
                    <b style={{ fontSize: "1rem", color: "#c2410c" }}>10</b>
                    <span style={{ fontSize: "0.62rem", color: "#ea580c", fontWeight: 800 }}>OCT</span>
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: "0.9rem", fontWeight: 800 }}>Children's Day Special Cultural Gala</h4>
                    <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "#64748b" }}>09:00 AM – 12:00 PM | School Auditorium</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
