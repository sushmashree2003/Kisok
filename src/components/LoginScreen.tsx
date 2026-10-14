"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  GraduationCap,
  BookOpen,
  Leaf,
  Star,
  Users,
  Calendar,
  Clock,
  Sparkles,
  Award,
  Maximize,
  Minimize,
  Check,
  Building2,
  Activity,
  Quote,
  AlertCircle,
  Settings,
  Server,
  RefreshCw,
} from "lucide-react";
import { SessionInfo } from "@/types/auth";
import { saveUserSession, getRememberedUser } from "@/lib/session";
import { CLIENT_API_ENDPOINTS } from "@/config/api";

export type RoleType = "student" | "staff" | "admin" | "alumni" | "guest";

export interface LoginScreenProps {
  role: RoleType;
  onLoginSuccess: (session?: SessionInfo) => void;
  onBackToKiosk: () => void;
  onSwitchRole: (newRole: RoleType) => void;
}

interface RoleFeature {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

interface RoleConfigDetail {
  title: string;
  subtitle: string;
  defaultUser: string;
  userPlaceholder: string;
  roleBadge: string;
  accentColor: string;
  accentGradient: string;
  haloColor: string;
  heroTag: string;
  heroHeadline1: string;
  heroHeadlineHighlight: string;
  heroSubtext: string;
  sloganTitle: string;
  sloganQuote: string;
  sloganMotto: string;
  features: RoleFeature[];
}

export default function LoginScreen({
  role,
  onLoginSuccess,
  onBackToKiosk,
  onSwitchRole,
}: LoginScreenProps) {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Real-time clock & fullscreen sync
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

  const toggleFullscreen = () => {
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

  const roleConfig: Record<RoleType, RoleConfigDetail> = {
    student: {
      title: "Student & Parent Login",
      subtitle: "Secure portal for academic records, schedules, and assessments.",
      defaultUser: "GVPS-1023",
      userPlaceholder: "Admission No / Roll No (e.g. GVPS-1023)",
      roleBadge: "Student & Parent Portal",
      accentColor: "#0284c7",
      accentGradient: "linear-gradient(135deg, #0284c7 0%, #0369a1 50%, #059669 100%)",
      haloColor: "rgba(2, 132, 199, 0.22)",
      heroTag: "STUDENT & PARENT ACADEMIC PORTAL",
      heroHeadline1: "Empowering Young Minds",
      heroHeadlineHighlight: "Gateway to Academic Excellence",
      heroSubtext:
        "Welcome to Green Valley Public School. Access your interactive learning dashboard, term test schedules, live morning attendance, homework diary, and academic marksheets.",
      sloganTitle: "STUDENT CREED & MOTTO",
      sloganQuote: "“Dare to Dream, Learn with Passion, and Lead with Character.”",
      sloganMotto: "Curiosity • Integrity • Compassion • Academic Excellence",
      features: [
        {
          icon: <BookOpen size={20} className="text-sky-600" />,
          title: "Tests & Assessments",
          desc: "Periodic tests, term exam timetables & instant scorecards",
        },
        {
          icon: <Activity size={20} className="text-emerald-600" />,
          title: "Live Academic Progress",
          desc: "Subject marksheets, report cards & teacher evaluations",
        },
        {
          icon: <Calendar size={20} className="text-blue-600" />,
          title: "Daily Attendance & Routine",
          desc: "Morning check-in logs & interactive period schedules",
        },
        {
          icon: <Award size={20} className="text-amber-600" />,
          title: "Merit Board & Circulars",
          desc: "Official school circulars, Olympiads & club activities",
        },
      ],
    },
    staff: {
      title: "Faculty & Staff Login",
      subtitle: "Authorized faculty access for academic and class management.",
      defaultUser: "ramesh.kumar@gvps.edu",
      userPlaceholder: "Staff Email / Teacher ID",
      roleBadge: "Faculty & Academic Staff",
      accentColor: "#059669",
      accentGradient: "linear-gradient(135deg, #059669 0%, #047857 50%, #0284c7 100%)",
      haloColor: "rgba(5, 150, 105, 0.22)",
      heroTag: "FACULTY & TEACHING STAFF SUITE",
      heroHeadline1: "Guiding Every Learner",
      heroHeadlineHighlight: "Academic Excellence & Class Management",
      heroSubtext:
        "Manage class registers, submit marks rubrics, assign digital homework, view exam invigilation schedules, and coordinate with parents seamlessly.",
      sloganTitle: "FACULTY PEDAGOGY PLEDGE",
      sloganQuote: "“To Teach is to Touch a Life Forever — Nurturing Tomorrow's Leaders.”",
      sloganMotto: "Dedication • Knowledge • Empathy • Educational Leadership",
      features: [
        {
          icon: <BookOpen size={20} className="text-emerald-600" />,
          title: "Class Records & Marks",
          desc: "Rubric scoring, report cards & question papers",
        },
        {
          icon: <Calendar size={20} className="text-sky-600" />,
          title: "Timetable & Substitution",
          desc: "Daily periods, room allocations & exam duty",
        },
        {
          icon: <Users size={20} className="text-blue-600" />,
          title: "Student Roster",
          desc: "Class attendance, performance trends & remarks",
        },
        {
          icon: <Award size={20} className="text-amber-600" />,
          title: "Staff Circulars",
          desc: "Departmental notices, leave applications & meetings",
        },
      ],
    },
    admin: {
      title: "School Administrator Login",
      subtitle: "Central management suite for campus administrators and directors.",
      defaultUser: "admin.director@gvps.edu",
      userPlaceholder: "Admin Key / Management ID",
      roleBadge: "Campus Administration",
      accentColor: "#7c3aed",
      accentGradient: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #0284c7 100%)",
      haloColor: "rgba(124, 58, 237, 0.22)",
      heroTag: "CAMPUS MANAGEMENT & DIRECTORS SUITE",
      heroHeadline1: "Institutional Leadership",
      heroHeadlineHighlight: "Smart Campus Governance & Telemetry",
      heroSubtext:
        "Oversee campus admissions, staff rosters, safety monitoring, transport GPS tracking, financial audits, and school institutional policies.",
      sloganTitle: "INSTITUTIONAL GOVERNANCE",
      sloganQuote: "“Leading with Honor, Building with Purpose, Governing with Integrity.”",
      sloganMotto: "Visionary Leadership • Transparency • Student-First Campus",
      features: [
        {
          icon: <ShieldCheck size={20} className="text-purple-600" />,
          title: "Campus Governance",
          desc: "Enrollment pipelines, compliance & security",
        },
        {
          icon: <Activity size={20} className="text-sky-600" />,
          title: "Operations Telemetry",
          desc: "Live campus attendance, finances & fees",
        },
        {
          icon: <Building2 size={20} className="text-emerald-600" />,
          title: "Fleet & Transport",
          desc: "GPS bus tracking, route alerts & safety",
        },
        {
          icon: <Award size={20} className="text-amber-600" />,
          title: "Access Controls",
          desc: "System policies, audit logs & administrative roles",
        },
      ],
    },
    alumni: {
      title: "GVian Alumni Portal Login",
      subtitle: "Stay connected with fellow GVians, mentors, and global chapters.",
      defaultUser: "rohan.sharma.2015",
      userPlaceholder: "Alumni ID / Registered Email",
      roleBadge: "GVian Alumni Network",
      accentColor: "#ea580c",
      accentGradient: "linear-gradient(135deg, #ea580c 0%, #c2410c 50%, #059669 100%)",
      haloColor: "rgba(234, 88, 12, 0.22)",
      heroTag: "GLOBAL GVIAN ALUMNI NETWORK",
      heroHeadline1: "Once a GVian, Always a GVian",
      heroHeadlineHighlight: "Reconnect, Mentor & Shape the Future",
      heroSubtext:
        "Connect with batchmates worldwide, mentor ambitious students, register for annual reunions, and celebrate alma mater achievements.",
      sloganTitle: "GVIAN ALUMNI LEGACY & CREED",
      sloganQuote: "“Once a GVian, Always a GVian — Carrying forward a legacy of honor, excellence, and shared memories.”",
      sloganMotto: "Honor the Past • Shape the Present • Inspire the Future",
      features: [
        {
          icon: <Users size={20} className="text-orange-600" />,
          title: "Global Chapters",
          desc: "Connect across 40+ countries & city clubs worldwide",
        },
        {
          icon: <Star size={20} className="text-amber-600" />,
          title: "Mentorship Network",
          desc: "Guide current GVians into top global universities & careers",
        },
        {
          icon: <Calendar size={20} className="text-sky-600" />,
          title: "Reunions & Meets",
          desc: "Annual homecoming galas, chapter webinars & sports leagues",
        },
        {
          icon: <Award size={20} className="text-emerald-600" />,
          title: "Hall of Fame & Endowment",
          desc: "Alumni achievements, distinguished awards & scholarship funds",
        },
      ],
    },
    guest: {
      title: "Guest & Visitor Portal",
      subtitle: "Discover Green Valley excellence, campus tours, and admissions.",
      defaultUser: "guest.visitor@gvps.edu",
      userPlaceholder: "Visitor Pass ID / Mobile Number",
      roleBadge: "Campus Guest & Visitor",
      accentColor: "#0d9488",
      accentGradient: "linear-gradient(135deg, #0d9488 0%, #0f766e 50%, #0284c7 100%)",
      haloColor: "rgba(13, 148, 136, 0.22)",
      heroTag: "CAMPUS VISITOR & GUEST PORTAL",
      heroHeadline1: "Welcome to Our Campus",
      heroHeadlineHighlight: "Where Values Meet Global Vision",
      heroSubtext:
        "Step inside a premier center of holistic education. Explore state-of-the-art STEM labs, athletic arenas, arts pavilions, and transparent admissions guidance.",
      sloganTitle: "GREEN VALLEY WELCOME CREED",
      sloganQuote: "“Enter as Guests, Leave as Family — Every Great Journey Begins with Wonder.”",
      sloganMotto: "Excellence • Empathy • Innovation • Integrity",
      features: [
        {
          icon: <Building2 size={20} className="text-teal-600" />,
          title: "Campus Guided Tour",
          desc: "Explore 40-acre smart campus, robotic labs & digital libraries",
        },
        {
          icon: <Sparkles size={20} className="text-amber-600" />,
          title: "Admissions Desk 2026-27",
          desc: "Online prospectus, eligibility criteria & fee structure",
        },
        {
          icon: <ShieldCheck size={20} className="text-blue-600" />,
          title: "Digital Visitor Pass",
          desc: "Touch kiosk self-check-in & gate pass validation",
        },
        {
          icon: <Calendar size={20} className="text-emerald-600" />,
          title: "Open Day & Exhibitions",
          desc: "Annual science symposia, sports meets & art galas",
        },
      ],
    },
  };

  const config = roleConfig[role] || roleConfig.alumni;
  const [username, setUsername] = useState(config.defaultUser);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [serverUrl, setServerUrl] = useState(
    CLIENT_API_ENDPOINTS.DEFAULT_SERVER_URL
  );
  const [institutionId, setInstitutionId] = useState(
    CLIENT_API_ENDPOINTS.DEFAULT_MI_ID
  );
  const [showServerConfig, setShowServerConfig] = useState(false);

  // Sync default user when role changes externally or check remembered user
  useEffect(() => {
    const remembered = getRememberedUser();
    if (remembered && remembered.username) {
      setUsername(remembered.username);
    } else if (roleConfig[role]) {
      setUsername(roleConfig[role].defaultUser);
    }
    setPassword("");
    setErrorMessage(null);
  }, [role]);

  const handleSubmit = async (e?: React.FormEvent, forceDemo: boolean = false) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    // If password is blank and user is trying default demo user, suggest credentials or offer demo
    if (!password.trim() && !forceDemo) {
      setIsSubmitting(false);
      setErrorMessage("Please enter your password to authenticate.");
      return;
    }

    try {
      const response = await fetch(CLIENT_API_ENDPOINTS.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password,
          mI_ID: institutionId,
          loginUrl: serverUrl,
          role: role,
          isDemo: forceDemo,
        }),
      });

      const result = await response.json();

      if (result.success && result.session) {
        // Save user data to sessionStorage and individual keys (matching C# sessionInfo)
        saveUserSession(result.session, rememberMe);
        setAuthSuccess(true);
        setTimeout(() => {
          setIsSubmitting(false);
          onLoginSuccess(result.session);
        }, 400);
      } else {
        setIsSubmitting(false);
        if (result.firstTimeLogin) {
          setErrorMessage("First time login or password expired. Please update password.");
        } else {
          setErrorMessage(
            result.message || "Invalid credentials. Please verify your login details."
          );
        }
      }
    } catch (err: any) {
      console.error("Login request failed:", err);
      setIsSubmitting(false);
      setErrorMessage(
        "Network connection failed. Unable to reach the school login server."
      );
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
    <div
      className="login-page-container"
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        height: "100dvh",
        maxHeight: "100dvh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
        userSelect: "none",
        boxSizing: "border-box",
        background: "#f8fafc",
      }}
    >
      {/* BACKGROUND IMAGE & FROSTED OVERLAY */}
      <div
        className="login-bg-layer"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url('/login_bg.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center bottom",
          opacity: 0.22,
          zIndex: 1,
        }}
      />
      <div
        className="login-gradient-overlay"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 15% 20%, rgba(240, 249, 255, 0.96) 0%, rgba(248, 250, 252, 0.93) 50%, rgba(236, 253, 245, 0.95) 100%)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      {/* TOP HEADER */}
      <header
        className="login-top-navbar"
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 32px",
          flexShrink: 0,
          background: "rgba(255, 255, 255, 0.88)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1.5px solid rgba(226, 232, 240, 0.85)",
          boxShadow: "0 1px 6px rgba(0, 0, 0, 0.02)",
        }}
      >
        <div
          className="login-school-logo"
          onClick={onBackToKiosk}
          role="button"
          tabIndex={0}
          style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}
        >
          <div
            className="login-logo-mark"
            style={{
              width: "42px",
              height: "42px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              filter: "drop-shadow(0 2px 6px rgba(0, 0, 0, 0.08))",
            }}
          >
            <svg width="42" height="42" viewBox="0 0 48 48" fill="none">
              <path
                d="M24 7C28 11 34 13 38 10C38 18 31 23 24 24C17 23 10 18 10 10C14 13 20 11 24 7Z"
                fill="#10b981"
              />
              <path
                d="M24 24V11"
                stroke="#059669"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              <path
                d="M5 36C12 31.5 18 32.5 24 37C30 32.5 36 31.5 43 36V18C36 13.5 30 14.5 24 19C18 14.5 12 13.5 5 18V36Z"
                fill="#0369a1"
              />
              <path
                d="M24 19V37"
                stroke="#ffffff"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="login-school-names">
            <h1
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "1.35rem",
                fontWeight: 800,
                color: "#0c3558",
                margin: 0,
                lineHeight: 1.15,
                letterSpacing: "-0.01em",
              }}
            >
              Green Valley Public School
            </h1>
            <p
              style={{
                fontSize: "0.82rem",
                fontWeight: 700,
                color: "#059669",
                letterSpacing: "0.03em",
                margin: "2px 0 0 0",
              }}
            >
              Learn • Grow • Excel • Smart Kiosk Portal
            </p>
          </div>
        </div>

        <div
          className="login-nav-right"
          style={{ display: "flex", alignItems: "center", gap: "12px" }}
        >
          {/* Live Clock & Date Badge */}
          {currentTime && (
            <div
              className="login-clock-widget"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
                background: "rgba(255, 255, 255, 0.95)",
                border: "1px solid rgba(203, 213, 225, 0.85)",
                padding: "6px 14px",
                borderRadius: "9999px",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.03)",
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "#1e293b",
              }}
            >
              <Calendar size={15} style={{ color: config.accentColor }} />
              <span className="login-clock-date">{formatDate(currentTime)}</span>
              <span className="login-clock-divider" style={{ color: "#cbd5e1" }}>•</span>
              <Clock size={15} style={{ color: "#059669" }} />
              <span className="login-clock-time" style={{ color: "#0c3558" }}>{formatTime(currentTime)}</span>
            </div>
          )}

          {/* Role Status Tag */}
          <div
            className="login-role-status-badge"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              borderRadius: "9999px",
              border: `1.5px solid ${config.accentColor}55`,
              background: `${config.accentColor}12`,
              color: config.accentColor,
              fontSize: "0.84rem",
              fontWeight: 800,
              letterSpacing: "0.02em",
            }}
          >
            <span
              className="login-status-dot"
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: config.accentColor,
              }}
            />
            <span>{config.roleBadge}</span>
          </div>

          {/* Server API & MI_ID Config Toggle */}
          <button
            type="button"
            onClick={() => setShowServerConfig(!showServerConfig)}
            className="login-icon-pill-btn"
            title="Configure School API Server & Institution ID (From App.config)"
            aria-label="Server Configuration"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "0 12px",
              height: "38px",
              borderRadius: "9999px",
              background: showServerConfig ? "#0c3558" : "rgba(255, 255, 255, 0.95)",
              border: "1px solid rgba(203, 213, 225, 0.85)",
              color: showServerConfig ? "#ffffff" : "#475569",
              fontSize: "0.82rem",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.02)",
            }}
          >
            <Server size={15} style={{ color: showServerConfig ? "#38bdf8" : config.accentColor }} />
            <span>API: MI-{institutionId}</span>
          </button>

          {/* Fullscreen Toggle Button */}
          <button
            onClick={toggleFullscreen}
            className="login-icon-pill-btn"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            aria-label="Toggle Fullscreen"
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.95)",
              border: "1px solid rgba(203, 213, 225, 0.85)",
              color: "#475569",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>

          {/* Back to Kiosk Button */}
          <button
            className="login-back-kiosk-pill"
            onClick={onBackToKiosk}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              background: "#0c3558",
              color: "#ffffff",
              border: "1px solid #0c3558",
              borderRadius: "9999px",
              padding: "7px 16px",
              minHeight: "40px",
              fontSize: "0.88rem",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 3px 10px rgba(12, 53, 88, 0.18)",
            }}
          >
            <ArrowLeft size={16} strokeWidth={2.4} />
            <span>Back to Kiosk</span>
          </button>
        </div>
      </header>

      {/* MAIN CENTER SPLIT LAYOUT */}
      <main
        className="login-center-content"
        style={{
          position: "relative",
          zIndex: 10,
          flex: 1,
          minHeight: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "clamp(1.5rem, 3.5vw, 4rem)",
          padding: "clamp(0.5rem, 1.2vh, 1rem) clamp(1.5rem, 3.5vw, 4.5rem)",
          maxWidth: "1450px",
          margin: "0 auto",
          width: "100%",
          boxSizing: "border-box",
          overflowY: "auto",
        }}
      >
        {/* LEFT HERO COLUMN */}
        <div
          className="login-left-hero"
          style={{
            flex: 1.15,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "clamp(0.45rem, 0.9vh, 0.75rem)",
          }}
        >
          {/* Active Portal Pill Tag */}
          <div
            className="login-portal-tag-pill"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              padding: "6px 14px",
              borderRadius: "9999px",
              border: `1.5px solid ${config.accentColor}40`,
              background: `${config.accentColor}15`,
              color: config.accentColor,
              fontSize: "0.85rem",
              fontWeight: 800,
              letterSpacing: "0.08em",
              width: "fit-content",
            }}
          >
            <Sparkles size={16} />
            <span>{config.heroTag}</span>
          </div>

          {/* Headline with vibrant gradient highlight */}
          <h2
            className="login-hero-headline"
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "clamp(2rem, 3.4vw, 3.2rem)",
              fontWeight: 900,
              color: "#0c3558",
              lineHeight: 1.15,
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            {config.heroHeadline1}
            <br />
            <span
              className="login-hero-highlight"
              style={{
                backgroundImage: config.accentGradient,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: "inline-block",
              }}
            >
              {config.heroHeadlineHighlight}
            </span>
          </h2>

          <div
            className="login-hero-line"
            style={{
              width: "56px",
              height: "4.5px",
              borderRadius: "9999px",
              margin: "2px 0",
              background: config.accentColor,
            }}
          />

          <p
            className="login-hero-subtext"
            style={{
              fontSize: "clamp(0.92rem, 1.05vw, 1.15rem)",
              color: "#334155",
              fontWeight: 500,
              lineHeight: 1.45,
              margin: 0,
              maxWidth: "620px",
            }}
          >
            {config.heroSubtext}
          </p>

          {/* Dynamic Institutional Slogan Strip */}
          <div
            className="login-hero-slogan-strip"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px 16px",
              borderRadius: "14px",
              border: `1.5px solid ${config.accentColor}35`,
              background: `linear-gradient(90deg, ${config.accentColor}14 0%, rgba(255, 255, 255, 0.95) 100%)`,
              margin: "4px 0",
              maxWidth: "650px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.02)",
            }}
          >
            <div
              className="login-hero-slogan-icon"
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                background: config.accentColor,
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Quote size={16} />
            </div>
            <div className="login-hero-slogan-content" style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
              <p
                className="login-hero-slogan-text"
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: "clamp(0.85rem, 0.94vw, 1.02rem)",
                  fontWeight: 700,
                  color: "#0c3558",
                  fontStyle: "italic",
                  margin: 0,
                  lineHeight: 1.3,
                }}
              >
                {config.sloganQuote}
              </p>
              <span
                className="login-hero-slogan-author"
                style={{
                  fontSize: "0.76rem",
                  fontWeight: 700,
                  color: "#059669",
                  marginTop: "2px",
                }}
              >
                — Green Valley Creed: {config.sloganMotto}
              </span>
            </div>
          </div>

          {/* 4 Feature Highlights Micro-Cards */}
          <div
            className="login-features-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "clamp(0.45rem, 0.75vw, 0.85rem)",
              margin: "4px 0",
              maxWidth: "650px",
            }}
          >
            {config.features.map((feat, idx) => (
              <div
                key={idx}
                className="login-feature-item"
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  background: "rgba(255, 255, 255, 0.94)",
                  border: "1.5px solid rgba(226, 232, 240, 0.95)",
                  borderRadius: "12px",
                  padding: "9px 12px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.02)",
                }}
              >
                <div
                  className="login-feature-icon-box"
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "10px",
                    border: `1.5px solid ${config.accentColor}35`,
                    background: `${config.accentColor}12`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {feat.icon}
                </div>
                <div className="login-feature-text" style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                  <h4
                    className="login-feature-title"
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: "clamp(0.88rem, 0.98vw, 1.05rem)",
                      fontWeight: 800,
                      color: "#0f172a",
                      margin: 0,
                      lineHeight: 1.2,
                    }}
                  >
                    {feat.title}
                  </h4>
                  <p
                    className="login-feature-desc"
                    style={{
                      fontSize: "clamp(0.76rem, 0.84vw, 0.88rem)",
                      color: "#64748b",
                      margin: "2px 0 0 0",
                      lineHeight: 1.25,
                    }}
                  >
                    {feat.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Role Switcher Chips Bar (Management Removed, Guest Added!) */}
          <div
            className="login-role-switch-container"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              marginTop: "4px",
            }}
          >
            <span
              className="login-role-switch-label"
              style={{
                fontSize: "0.74rem",
                fontWeight: 800,
                color: "#64748b",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Select Portal View:
            </span>
            <div
              className="login-role-chips"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >
              <button
                className={`login-role-chip ${role === "student" ? "active" : ""}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "7px 14px",
                  minHeight: "38px",
                  borderRadius: "9999px",
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  border: role === "student" ? "1.5px solid #0c3558" : "1.5px solid rgba(12, 53, 88, 0.18)",
                  background: role === "student" ? "#0c3558" : "rgba(255, 255, 255, 0.95)",
                  color: role === "student" ? "#ffffff" : "#0c3558",
                  cursor: "pointer",
                }}
                onClick={() => {
                  onSwitchRole("student");
                  setUsername(roleConfig.student.defaultUser);
                }}
              >
                <GraduationCap size={16} />
                <span>Student / Parent</span>
              </button>

              <button
                className={`login-role-chip ${role === "staff" ? "active" : ""}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "7px 14px",
                  minHeight: "38px",
                  borderRadius: "9999px",
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  border: role === "staff" ? "1.5px solid #0c3558" : "1.5px solid rgba(12, 53, 88, 0.18)",
                  background: role === "staff" ? "#0c3558" : "rgba(255, 255, 255, 0.95)",
                  color: role === "staff" ? "#ffffff" : "#0c3558",
                  cursor: "pointer",
                }}
                onClick={() => {
                  onSwitchRole("staff");
                  setUsername(roleConfig.staff.defaultUser);
                }}
              >
                <BookOpen size={16} />
                <span>Faculty & Staff</span>
              </button>

              {/* Guest Login Chip (Replaces Management) */}
              <button
                className={`login-role-chip ${role === "guest" ? "active" : ""}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "7px 14px",
                  minHeight: "38px",
                  borderRadius: "9999px",
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  border: role === "guest" ? "1.5px solid #0c3558" : "1.5px solid rgba(12, 53, 88, 0.18)",
                  background: role === "guest" ? "#0c3558" : "rgba(255, 255, 255, 0.95)",
                  color: role === "guest" ? "#ffffff" : "#0c3558",
                  cursor: "pointer",
                }}
                onClick={() => {
                  onSwitchRole("guest");
                  setUsername(roleConfig.guest.defaultUser);
                }}
              >
                <Users size={16} />
                <span>Guest Login</span>
              </button>

              <button
                className={`login-role-chip ${role === "alumni" ? "active" : ""}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "7px 14px",
                  minHeight: "38px",
                  borderRadius: "9999px",
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  border: role === "alumni" ? "1.5px solid #0c3558" : "1.5px solid rgba(12, 53, 88, 0.18)",
                  background: role === "alumni" ? "#0c3558" : "rgba(255, 255, 255, 0.95)",
                  color: role === "alumni" ? "#ffffff" : "#0c3558",
                  cursor: "pointer",
                }}
                onClick={() => {
                  onSwitchRole("alumni");
                  setUsername(roleConfig.alumni.defaultUser);
                }}
              >
                <Star size={16} />
                <span>Alumni</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT GLASSMORPHIC LOGIN CARD */}
        <div
          className="login-glass-card"
          style={{
            flex: 0.85,
            width: "clamp(360px, 31vw, 450px)",
            maxWidth: "460px",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            border: "2px solid rgba(255, 255, 255, 0.95)",
            borderRadius: "22px",
            padding: "clamp(1.1rem, 1.9vh, 1.6rem) clamp(1.2rem, 1.9vw, 1.7rem)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: `0 24px 60px -12px ${config.haloColor}, 0 0 0 1.5px rgba(255, 255, 255, 0.9)`,
            transition: "all 0.3s ease",
            boxSizing: "border-box",
          }}
        >
          {/* Card Crest Emblem */}
          <div
            className="login-card-crest"
            style={{
              width: "54px",
              height: "54px",
              borderRadius: "50%",
              background: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "8px",
              border: `2px solid ${config.accentColor}44`,
              boxShadow: `0 8px 24px ${config.haloColor}`,
              flexShrink: 0,
            }}
          >
            {role === "student" && <GraduationCap size={30} style={{ color: config.accentColor }} />}
            {role === "staff" && <BookOpen size={30} style={{ color: config.accentColor }} />}
            {role === "admin" && <ShieldCheck size={30} style={{ color: config.accentColor }} />}
            {role === "guest" && <Users size={30} style={{ color: config.accentColor }} />}
            {role === "alumni" && <Star size={30} style={{ color: config.accentColor }} />}
          </div>

          <h3
            className="login-card-title"
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "clamp(1.28rem, 1.65vw, 1.65rem)",
              fontWeight: 900,
              color: "#0c3558",
              margin: 0,
              textAlign: "center",
              lineHeight: 1.2,
            }}
          >
            {config.title}
          </h3>

          <p
            className="login-card-sub"
            style={{
              fontSize: "clamp(0.78rem, 0.86vw, 0.92rem)",
              color: "#64748b",
              margin: "3px 0 10px 0",
              textAlign: "center",
              lineHeight: 1.35,
            }}
          >
            {config.subtitle}
          </p>

          {/* INSPIRING SLOGAN CARD (Replaces One-Tap Demo Fill!) */}
          <div
            className="login-slogan-card"
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              borderRadius: "14px",
              border: `1.5px solid ${config.accentColor}35`,
              background: `linear-gradient(135deg, ${config.accentColor}0C 0%, rgba(255, 255, 255, 0.95) 100%)`,
              padding: "10px 14px",
              marginBottom: "12px",
              boxSizing: "border-box",
              boxShadow: "0 3px 12px rgba(0, 0, 0, 0.03)",
            }}
          >
            <div className="login-slogan-badge-wrap" style={{ display: "flex", alignItems: "center" }}>
              <span
                className="login-slogan-badge"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "3px 9px",
                  borderRadius: "9999px",
                  border: `1px solid ${config.accentColor}40`,
                  background: `${config.accentColor}18`,
                  color: config.accentColor,
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                <Sparkles size={12} />
                <span>{config.sloganTitle}</span>
              </span>
            </div>

            <blockquote
              className="login-slogan-quote"
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontStyle: "italic",
                fontSize: "clamp(0.84rem, 0.93vw, 1.02rem)",
                fontWeight: 600,
                color: "#1e293b",
                lineHeight: 1.35,
                margin: "2px 0",
                letterSpacing: "-0.01em",
              }}
            >
              {config.sloganQuote}
            </blockquote>

            <div
              className="login-slogan-motto-row"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "0.78rem",
                fontWeight: 700,
                flexWrap: "wrap",
              }}
            >
              <span className="login-slogan-motto-tag" style={{ color: "#64748b", textTransform: "uppercase", fontSize: "0.68rem" }}>
                Motto:
              </span>
              <span className="login-slogan-motto-text" style={{ color: config.accentColor, fontWeight: 800 }}>
                {config.sloganMotto}
              </span>
            </div>
          </div>

          {/* Server Config Collapsible (App.config / VAPS Kiosk endpoint) */}
          {showServerConfig && (
            <div
              style={{
                width: "100%",
                background: "#f0fdf4",
                border: "1.5px solid #bbf7d0",
                borderRadius: "12px",
                padding: "10px 12px",
                marginBottom: "10px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                boxSizing: "border-box",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#166534", display: "flex", alignItems: "center", gap: "5px" }}>
                  <Server size={14} /> VAPS Server Configuration (App.config)
                </span>
                <button
                  type="button"
                  onClick={() => setShowServerConfig(false)}
                  style={{ background: "none", border: "none", fontSize: "0.72rem", color: "#15803d", fontWeight: 700, cursor: "pointer" }}
                >
                  Close
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <label style={{ fontSize: "0.7rem", fontWeight: 700, color: "#374151" }}>LOGIN_URL:</label>
                <input
                  type="text"
                  value={serverUrl}
                  onChange={(e) => setServerUrl(e.target.value)}
                  style={{
                    fontSize: "0.78rem",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                    background: "#ffffff",
                    color: "#0f172a",
                    fontWeight: 600,
                  }}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <label style={{ fontSize: "0.7rem", fontWeight: 700, color: "#374151" }}>MI_Id:</label>
                <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                  {["31", "4", "6", "22"].map((id) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setInstitutionId(id)}
                      style={{
                        padding: "3px 8px",
                        borderRadius: "6px",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        border: institutionId === id ? "1.5px solid #0c3558" : "1px solid #cbd5e1",
                        background: institutionId === id ? "#0c3558" : "#ffffff",
                        color: institutionId === id ? "#ffffff" : "#334155",
                        cursor: "pointer",
                      }}
                    >
                      {id === "31" ? "31 (MVPS)" : id === "4" ? "4 (Demo)" : id === "6" ? "6 (BBHS)" : `${id}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Real-time Authentication Error Alert */}
          {errorMessage && (
            <div
              style={{
                width: "100%",
                background: "#fef2f2",
                border: "1.5px solid #fecaca",
                borderRadius: "12px",
                padding: "10px 12px",
                marginBottom: "10px",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                color: "#991b1b",
                boxSizing: "border-box",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                <AlertCircle size={18} style={{ color: "#ef4444", flexShrink: 0, marginTop: "2px" }} />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: "0.82rem", fontWeight: 700, lineHeight: 1.35, display: "block" }}>
                    {errorMessage}
                  </span>

                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                <button
                  type="button"
                  onClick={() => handleSubmit(undefined, true)}
                  style={{
                    background: "#0c3558",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "5px 10px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <Sparkles size={12} />
                  <span>One-Tap Demo Bypass</span>
                </button>
                <button
                  type="button"
                  onClick={() => setErrorMessage(null)}
                  style={{
                    background: "transparent",
                    color: "#64748b",
                    border: "1px solid #cbd5e1",
                    borderRadius: "6px",
                    padding: "5px 10px",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="login-form"
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "clamp(0.55rem, 0.9vh, 0.8rem)",
            }}
          >
            {/* Username / ID Input */}
            <div className="login-field-wrap" style={{ display: "flex", flexDirection: "column", gap: "4px", width: "100%" }}>
              <label
                className="login-field-label"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  color: "#334155",
                }}
              >
                <User size={15} style={{ color: config.accentColor }} />
                <span>
                  {role === "alumni"
                    ? "Alumni ID / Registered Email"
                    : role === "guest"
                      ? "Visitor Pass ID / Mobile Number"
                      : role === "staff"
                        ? "Staff Email / Faculty ID"
                        : "Admission Number / Student ID"}
                </span>
              </label>
              <div className="login-input-group" style={{ position: "relative", width: "100%", display: "flex", alignItems: "center" }}>
                <input
                  type="text"
                  className="login-input-field"
                  placeholder={config.userPlaceholder}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    height: "44px",
                    background: "#ffffff",
                    border: "1.5px solid #cbd5e1",
                    borderRadius: "10px",
                    padding: "0 14px",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    color: "#0f172a",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            {/* Password / PIN Input */}
            <div className="login-field-wrap" style={{ display: "flex", flexDirection: "column", gap: "4px", width: "100%" }}>
              <label
                className="login-field-label"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  color: "#334155",
                }}
              >
                <Lock size={15} style={{ color: config.accentColor }} />
                <span>
                  {role === "guest"
                    ? "Access PIN / Visitor OTP"
                    : "Access Password / Security PIN"}
                </span>
              </label>
              <div className="login-input-group" style={{ position: "relative", width: "100%", display: "flex", alignItems: "center" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  className="login-input-field"
                  placeholder="Password / PIN"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    height: "44px",
                    background: "#ffffff",
                    border: "1.5px solid #cbd5e1",
                    borderRadius: "10px",
                    padding: "0 40px 0 14px",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    color: "#0f172a",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                <button
                  type="button"
                  className="login-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                  style={{
                    position: "absolute",
                    right: "10px",
                    background: "none",
                    border: "none",
                    color: "#64748b",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "4px",
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Help Row */}
            <div
              className="login-remember-row"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: "0.82rem",
                color: "#475569",
                padding: "2px 2px",
              }}
            >
              <label
                className="login-remember-label"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ width: "16px", height: "16px", accentColor: config.accentColor, cursor: "pointer" }}
                />
                <span>Remember on this kiosk</span>
              </label>
              <a
                href="#forgot"
                className="login-forgot-link"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Please contact the Kiosk Helpdesk at Ext. 104 or visit the administrative reception.");
                }}
                style={{ color: config.accentColor, textDecoration: "none", fontWeight: 700 }}
              >
                Forgot ID / Help?
              </a>
            </div>

            {/* Primary High-Visibility Sign In Button */}
            <button
              type="submit"
              className="login-submit-btn"
              disabled={isSubmitting}
              style={{
                height: "48px",
                minHeight: "48px",
                width: "100%",
                borderRadius: "9999px",
                color: "#ffffff",
                border: "none",
                fontFamily: "'Outfit', sans-serif",
                fontSize: "1.05rem",
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "9px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                backgroundImage: config.accentGradient,
                boxShadow: `0 8px 24px ${config.haloColor}`,
                marginTop: "4px",
              }}
            >
              {isSubmitting ? (
                <>
                  <div
                    className="login-spinner"
                    style={{
                      width: "18px",
                      height: "18px",
                      border: "2.5px solid rgba(255, 255, 255, 0.35)",
                      borderTopColor: "#ffffff",
                      borderRadius: "50%",
                    }}
                  />
                  <span>Verifying Credentials...</span>
                </>
              ) : authSuccess ? (
                <>
                  <Check size={20} />
                  <span>Access Granted! Loading...</span>
                </>
              ) : (
                <>
                  <span>
                    Sign In to{" "}
                    {role === "student"
                      ? "Student"
                      : role === "staff"
                        ? "Staff"
                        : role === "guest"
                          ? "Guest"
                          : role === "admin"
                            ? "Admin"
                            : "Alumni"}{" "}
                    Portal
                  </span>
                  <ArrowRight size={20} strokeWidth={2.6} />
                </>
              )}
            </button>

            {/* Touch Kiosk Security Footnote */}
            <div
              className="login-security-badge"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                fontSize: "0.74rem",
                fontWeight: 700,
                color: "#059669",
                textAlign: "center",
                marginTop: "4px",
              }}
            >
              <ShieldCheck size={15} style={{ color: "#059669" }} />
              <span>256-Bit SSL Encrypted Session • Authorized GVPS Network</span>
            </div>
          </form>
        </div>
      </main>

      {/* BOTTOM DOCK VALUES & FOOTER */}
      <footer
        className="login-bottom-dock"
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 32px 10px 32px",
          flexShrink: 0,
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderTop: "1.5px solid rgba(226, 232, 240, 0.8)",
        }}
      >
        <div
          className="login-dock-pill"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "16px",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            padding: "5px 20px",
            borderRadius: "9999px",
            border: "1px solid rgba(255, 255, 255, 0.95)",
            boxShadow: "0 3px 12px rgba(0, 0, 0, 0.03)",
          }}
        >
          <div className="login-dock-item" style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            <div
              className="login-dock-icon"
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: "#e0f2fe",
                color: "#0284c7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <BookOpen size={16} />
            </div>
            <div className="login-dock-text" style={{ display: "flex", flexDirection: "column" }}>
              <span className="login-dock-bold" style={{ fontSize: "0.85rem", fontWeight: 800, color: "#0c3558", lineHeight: 1.1 }}>Learn</span>
              <span className="login-dock-sub" style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 600 }}>New Skills & Innovation</span>
            </div>
          </div>

          <div className="login-dock-separator" style={{ width: "1px", height: "22px", background: "rgba(203, 213, 225, 0.85)" }} />

          <div className="login-dock-item" style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            <div
              className="login-dock-icon"
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: "#dcfce7",
                color: "#16a34a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Leaf size={16} />
            </div>
            <div className="login-dock-text" style={{ display: "flex", flexDirection: "column" }}>
              <span className="login-dock-bold" style={{ fontSize: "0.85rem", fontWeight: 800, color: "#0c3558", lineHeight: 1.1 }}>Grow</span>
              <span className="login-dock-sub" style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 600 }}>With Character & Confidence</span>
            </div>
          </div>

          <div className="login-dock-separator" style={{ width: "1px", height: "22px", background: "rgba(203, 213, 225, 0.85)" }} />

          <div className="login-dock-item" style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            <div
              className="login-dock-icon"
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: "#fef3c7",
                color: "#d97706",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Star size={16} />
            </div>
            <div className="login-dock-text" style={{ display: "flex", flexDirection: "column" }}>
              <span className="login-dock-bold" style={{ fontSize: "0.85rem", fontWeight: 800, color: "#0c3558", lineHeight: 1.1 }}>Excel</span>
              <span className="login-dock-sub" style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 600 }}>In Academics & Life</span>
            </div>
          </div>

          <div className="login-dock-separator" style={{ width: "1px", height: "22px", background: "rgba(203, 213, 225, 0.85)" }} />

          <div className="login-dock-item" style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            <div
              className="login-dock-icon"
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: "#fce7f3",
                color: "#db2777",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Users size={16} />
            </div>
            <div className="login-dock-text" style={{ display: "flex", flexDirection: "column" }}>
              <span className="login-dock-bold" style={{ fontSize: "0.85rem", fontWeight: 800, color: "#0c3558", lineHeight: 1.1 }}>Collaborate</span>
              <span className="login-dock-sub" style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 600 }}>For a Better Future</span>
            </div>
          </div>
        </div>

        <div className="login-bottom-meta" style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "1px" }}>
          <span
            className="login-bottom-motto"
            style={{ fontSize: "0.82rem", fontWeight: 700, color: "#065f46", letterSpacing: "0.02em" }}
          >
            — Green Valley Public School Smart Campus • CBSE Affiliation No. 1930421 —
          </span>
          <span
            className="login-bottom-support"
            style={{ fontSize: "0.74rem", fontWeight: 600, color: "#64748b" }}
          >
            Kiosk Support Desk: Ext. 104 • helpdesk@gvps.edu
          </span>
        </div>
      </footer>
    </div>
  );
}
