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
  X,
  CreditCard,
} from "lucide-react";
import { SessionInfo } from "@/types/auth";
import { saveUserSession, getRememberedUser } from "@/lib/session";
import { CLIENT_API_ENDPOINTS } from "@/config/api";

export type RoleType = "student" | "staff" | "visitor" | "alumni";

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
      subtitle: "Secure academic portal for performance, schedules, and assessments.",
      defaultUser: "",
      userPlaceholder: "Admission No / Roll No / Username",
      roleBadge: "Student & Parent Portal",
      accentColor: "#ea580c",
      accentGradient: "linear-gradient(135deg, #ea580c 0%, #c2410c 50%, #f59e0b 100%)",
      haloColor: "rgba(234, 88, 12, 0.25)",
      heroTag: "STUDENT ACADEMIC & LEARNING SUITE",
      heroHeadline1: "Empowering Young Minds",
      heroHeadlineHighlight: "Gateway to Academic Excellence",
      heroSubtext:
        "Access your interactive learning dashboard, term examination schedules, morning attendance, fee ledger, timetable, notices and homework diary.",
      sloganTitle: "STUDENT CREED & MOTTO",
      sloganQuote: "“Knowledge is Power • Strive for Academic Excellence.”",
      sloganMotto: "Discipline • Integrity • Wisdom • Academic Excellence",
      features: [
        {
          icon: <BookOpen size={20} className="text-orange-600" />,
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
    visitor: {
      title: "Campus Visitor Portal",
      subtitle: "Discover Green Valley excellence, campus tours, and admissions.",
      defaultUser: "visitor@gvps.edu",
      userPlaceholder: "Visitor Pass ID / Mobile Number",
      roleBadge: "Campus Visitor",
      accentColor: "#0d9488",
      accentGradient: "linear-gradient(135deg, #0d9488 0%, #0f766e 50%, #0284c7 100%)",
      haloColor: "rgba(13, 148, 136, 0.22)",
      heroTag: "CAMPUS VISITOR PORTAL",
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
    alumni: {
      title: "Alumni & Ex-Staff Portal Login",
      subtitle: "Stay connected with fellow GVians, former colleagues, and mentors.",
      defaultUser: "rohan.sharma.2015",
      userPlaceholder: "Alumni ID / Registered Email",
      roleBadge: "Alumni & Ex-Staff Network",
      accentColor: "#ea580c",
      accentGradient: "linear-gradient(135deg, #ea580c 0%, #c2410c 50%, #059669 100%)",
      haloColor: "rgba(234, 88, 12, 0.22)",
      heroTag: "GLOBAL GVIAN ALUMNI & EX-STAFF NETWORK",
      heroHeadline1: "Once a GVian, Always a GVian",
      heroHeadlineHighlight: "Reconnect, Mentor & Shape the Future",
      heroSubtext:
        "Connect with batchmates and former staff worldwide, mentor ambitious students, register for annual reunions, and celebrate alma mater achievements.",
      sloganTitle: "GVIAN ALUMNI & EX-STAFF CREED",
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
  };

  const config = roleConfig[role] || roleConfig.student;
  const [username, setUsername] = useState(config.defaultUser);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [roleMismatch, setRoleMismatch] = useState<{ detectedRole: string; targetRole: string } | null>(null);
  const [serverUrl, setServerUrl] = useState(
    CLIENT_API_ENDPOINTS.DEFAULT_SERVER_URL
  );
  const [institutionId, setInstitutionId] = useState(
    CLIENT_API_ENDPOINTS.DEFAULT_MI_ID
  );
  const [showServerConfig, setShowServerConfig] = useState(false);

  // Guest / Visitor specific fields
  const [visitorName, setVisitorName] = useState("");
  const [visitorPhone, setVisitorPhone] = useState("");
  const [visitorNameError, setVisitorNameError] = useState("");
  const [visitorPhoneError, setVisitorPhoneError] = useState("");

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
    setRoleMismatch(null);
    setVisitorName("");
    setVisitorPhone("");
    setVisitorNameError("");
    setVisitorPhoneError("");
  }, [role]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setRoleMismatch(null);

    if (!password.trim()) {
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
        if (result.roleMismatch) {
          setRoleMismatch({
            detectedRole: result.detectedRole || (role === "staff" ? "Student" : "Staff"),
            targetRole: result.targetRole || (role === "staff" ? "student" : "staff"),
          });
        }
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

  const handleSmartCardTap = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setRoleMismatch(null);
    try {
      const cardId = role === "staff" ? "EMP-1042" : "ADM-1024";
      const response = await fetch(CLIENT_API_ENDPOINTS.SMARTCARD_PUNCH, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId, MI_ID: institutionId }),
      });
      const result = await response.json();
      if (result.success && result.session) {
        saveUserSession(result.session, rememberMe);
        setAuthSuccess(true);
        setTimeout(() => {
          setIsSubmitting(false);
          onLoginSuccess(result.session);
        }, 400);
      } else {
        setIsSubmitting(false);
        setErrorMessage(result.message || "Smart card reader did not recognize card.");
      }
    } catch (err: any) {
      console.error("Smart card tap failed:", err);
      setIsSubmitting(false);
      setErrorMessage("Smart card authentication error.");
    }
  };

  // Guest / visitor login handler — no backend call, just save to localStorage
  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    setVisitorNameError("");
    setVisitorPhoneError("");

    const trimName = visitorName.trim();
    const trimPhone = visitorPhone.trim();

    if (!trimName || trimName.length < 2) {
      setVisitorNameError("Please enter your full name (at least 2 characters).");
      valid = false;
    }
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!trimPhone || !phoneRegex.test(trimPhone)) {
      setVisitorPhoneError("Enter a valid 10-digit Indian mobile number (starts with 6-9).");
      valid = false;
    }
    if (!valid) return;

    setIsSubmitting(true);
    const visitorSession = {
      visitorName: trimName,
      visitorPhone: trimPhone,
      visitTime: new Date().toISOString(),
    };
    try {
      localStorage.setItem("gvps_visitor_session", JSON.stringify(visitorSession));
    } catch { }
    setAuthSuccess(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess(undefined);
    }, 400);
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
      className="kiosk-command-center"
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
        background: "#fffcf9",
      }}
    >
      {/* FLOATING AMBIENT ORBS (MATCHING ROLE SELECTION SCREEN) */}
      <div className="kiosk-orb kiosk-orb-one" />
      <div className="kiosk-orb kiosk-orb-two" />

      {/* TOP COMMAND NAVBAR (ROLE SELECTION COMMAND THEME) */}
      <header
        className="command-header"
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
          borderBottom: "1.5px solid rgba(254, 215, 170, 0.65)",
          boxShadow: "0 4px 18px rgba(234, 88, 12, 0.05)",
        }}
      >
        <div
          className="command-brand"
          style={{ display: "flex", alignItems: "center", gap: "14px" }}
        >
          <button className="command-back" onClick={onBackToKiosk} aria-label="Back to role selection">
            <ArrowLeft size={19} />
          </button>
          <div className="command-mark" aria-hidden="true" style={{ width: "42px", height: "42px" }}>
            <svg width="34" height="34" viewBox="0 0 48 48" fill="none">
              <path d="M24 7c4 4 10 6 14 3 0 8-7 13-14 14C17 23 10 18 10 10c4 3 10 1 14-3Z" fill="#f97316" />
              <path d="M24 24V11" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M5 36c7-4.5 13-3.5 19 1 6-4.5 12-5.5 19-1V18c-7-4.5-13-3.5-19 1-6-4.5-12-5.5-19-1v18Z" fill="#c2410c" />
              <path d="M24 19v18" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <p className="command-kicker" style={{ margin: "0 0 2px" }}>GREEN VALLEY • SMART CAMPUS</p>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
              <h1
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: "1.35rem",
                  fontWeight: 800,
                  color: "#1e293b",
                  margin: 0,
                  lineHeight: 1.15,
                  letterSpacing: "-0.025em",
                }}
              >
                Green Valley Public School
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
                  border: "1.5px solid rgba(234, 88, 12, 0.35)",
                  boxShadow: "0 2px 8px rgba(234, 88, 12, 0.1)",
                  letterSpacing: "0.02em",
                }}
              >
                <ShieldCheck size={12} style={{ color: "#ea580c" }} />
                PAGE 3 • ROLE AUTHENTICATION PORTAL
              </span>
            </div>
          </div>
        </div>

        <div
          className="command-actions"
          style={{ display: "flex", alignItems: "center", gap: "10px" }}
        >
          {/* Live Campus Status */}
          <div className="command-live-status"><span /> Campus online</div>

          {/* Live Clock & Date Badge */}
          {currentTime && (
            <div className="command-time">
              <Calendar size={15} />
              <span>{formatDate(currentTime)}</span>
              <b>{formatTime(currentTime)}</b>
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
              fontSize: "0.82rem",
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
            className="command-fullscreen"
            title="Configure School API Server & Institution ID (From App.config)"
            aria-label="Server Configuration"
            style={{
              cursor: "pointer",
              background: showServerConfig ? "#ea580c" : undefined,
              color: showServerConfig ? "#ffffff" : undefined,
            }}
          >
            <Server size={14} style={{ color: showServerConfig ? "#ffffff" : config.accentColor }} />
          </button>

          {/* Fullscreen Toggle Button */}
          <button
            onClick={toggleFullscreen}
            className="command-fullscreen"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
            <span>{isFullscreen ? "Exit" : "Full screen"}</span>
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
          {/* Active Portal Pill Tag */}
          <div className="hero-chip" style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", marginBottom: "0.2rem" }}>
            <span
              style={{
                background: "#ea580c",
                color: "#ffffff",
                padding: "2px 8px",
                borderRadius: "9999px",
                fontSize: "0.65rem",
                fontWeight: 900,
                letterSpacing: "0.04em",
              }}
            >
              PAGE 3
            </span>
            <Sparkles size={14} /> ROLE AUTHENTICATION • {config.heroTag}
          </div>

          {/* Headline with vibrant gradient highlight */}
          <h2
            className="login-hero-headline"
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "clamp(2rem, 3.4vw, 3.2rem)",
              fontWeight: 900,
              color: "#1e293b",
              lineHeight: 1.12,
              margin: 0,
              letterSpacing: "-0.03em",
            }}
          >
            {config.heroHeadline1}
            <br />
            <span
              className="login-hero-highlight"
              style={{
                background: "linear-gradient(105deg, #ea580c 0%, #f59e0b 55%, #fb923c 100%)",
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
              height: "4px",
              borderRadius: "9999px",
              margin: "2px 0",
              background: "#ea580c",
            }}
          />

          <p
            className="login-hero-subtext"
            style={{
              fontSize: "clamp(0.92rem, 1.05vw, 1.12rem)",
              color: "#64748b",
              fontWeight: 500,
              lineHeight: 1.45,
              margin: 0,
              maxWidth: "620px",
            }}
          >
            <strong style={{ color: "#c2410c" }}>{config.roleBadge}:</strong> {config.heroSubtext}
          </p>

          <div className="hero-trust" style={{ marginTop: "4px" }}>
            <ShieldCheck size={16} /><span>Secure kiosk access</span><i />
            <Activity size={16} /><span>Live session synchronization</span>
          </div>

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
                <span>Staff</span>
              </button>

              {/* Visitor Login Chip */}
              <button
                className={`login-role-chip ${role === "visitor" ? "active" : ""}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "7px 14px",
                  minHeight: "38px",
                  borderRadius: "9999px",
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  border: role === "visitor" ? "1.5px solid #0c3558" : "1.5px solid rgba(12, 53, 88, 0.18)",
                  background: role === "visitor" ? "#0c3558" : "rgba(255, 255, 255, 0.95)",
                  color: role === "visitor" ? "#ffffff" : "#0c3558",
                  cursor: "pointer",
                }}
                onClick={() => {
                  onSwitchRole("visitor");
                  setUsername(roleConfig.visitor.defaultUser);
                }}
              >
                <Users size={16} />
                <span>Visitor</span>
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
                <span>Alumni / Ex-Staff</span>
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
            background: "rgba(255, 255, 255, 0.94)",
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            border: "1.5px solid rgba(254, 215, 170, 0.75)",
            borderRadius: "26px",
            padding: "clamp(1.1rem, 1.9vh, 1.6rem) clamp(1.2rem, 1.9vw, 1.7rem)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: `0 24px 60px -12px rgba(234, 88, 12, 0.14), 0 0 0 1.5px rgba(255, 255, 255, 0.9)`,
            transition: "all 0.3s ease",
            boxSizing: "border-box",
          }}
        >
          {/* 3D Character Stage matching Role Selection Tile */}
          <div
            style={{
              width: "100%",
              height: "140px",
              borderRadius: "20px",
              background: `linear-gradient(180deg, #ffffff 0%, ${role === "student" ? "#fff7ed" : role === "staff" ? "#f0fdfa" : role === "alumni" ? "#fffbeb" : "#f5f3ff"} 100%)`,
              border: "1px solid rgba(254, 215, 170, 0.65)",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              marginBottom: "12px",
              position: "relative",
              overflow: "hidden",
              boxShadow: "inset 0 2px 6px rgba(0, 0, 0, 0.02)",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "10px",
                left: "12px",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "3px 10px",
                borderRadius: "999px",
                background: "rgba(255, 255, 255, 0.95)",
                fontSize: "0.72rem",
                fontWeight: 800,
                color: config.accentColor,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                border: "1px solid rgba(255, 255, 255, 0.9)",
              }}
            >
              {role === "student" && <GraduationCap size={13} />}
              {role === "staff" && <Users size={13} />}
              {role === "visitor" && <Users size={13} />}
              {role === "alumni" && <Star size={13} />}
              <span>{config.roleBadge}</span>
            </div>
            <img
              src={
                role === "student"
                  ? "/student_avatar.png"
                  : role === "staff"
                    ? "/staff_avatar.png"
                    : role === "alumni"
                      ? "/alumni_avatar.png"
                      : "/admin_avatar.png"
              }
              alt={config.title}
              style={{
                height: "135px",
                width: "auto",
                objectFit: "contain",
                filter: "drop-shadow(0 10px 14px rgba(0, 0, 0, 0.14))",
                transition: "all 0.35s ease",
              }}
            />
          </div>

          <h3
            className="login-card-title"
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "clamp(1.28rem, 1.65vw, 1.65rem)",
              fontWeight: 900,
              color: "#1e293b",
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

          {/* INSPIRING SLOGAN CARD */}
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

          {/* Real-time Authentication Error Alert & Role Isolation Guard */}
          {errorMessage && (
            <div
              style={{
                width: "100%",
                background: roleMismatch ? "#fef2f2" : "#fff1f2",
                border: roleMismatch ? "2px solid #ef4444" : "1.5px solid #fecaca",
                borderRadius: "12px",
                padding: "10px 14px",
                marginBottom: "10px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                color: "#991b1b",
                boxSizing: "border-box",
                boxShadow: roleMismatch ? "0 4px 14px rgba(239, 68, 68, 0.18)" : "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px", width: "100%" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", flex: 1 }}>
                  <AlertCircle size={18} style={{ color: "#ef4444", flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    {roleMismatch && (
                      <div style={{ fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: "#b91c1c", marginBottom: 2 }}>
                        🛡️ Role Isolation Security Guard
                      </div>
                    )}
                    <span style={{ fontSize: "0.82rem", fontWeight: 700, lineHeight: 1.35 }}>
                      {errorMessage}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage(null);
                    setRoleMismatch(null);
                  }}
                  style={{
                    background: "transparent",
                    color: "#991b1b",
                    border: "none",
                    padding: "4px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "4px",
                  }}
                  aria-label="Dismiss error"
                  title="Dismiss"
                >
                  <X size={16} />
                </button>
              </div>

              {roleMismatch && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", paddingTop: "4px" }}>
                  <button
                    type="button"
                    onClick={() => {
                      const target = roleMismatch.detectedRole.toLowerCase() === "student" ? "student" : "staff";
                      setRoleMismatch(null);
                      setErrorMessage(null);
                      onSwitchRole(target as RoleType);
                    }}
                    style={{
                      background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "8px",
                      padding: "6px 14px",
                      fontSize: "0.78rem",
                      fontWeight: 800,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      boxShadow: "0 2px 6px rgba(220, 38, 38, 0.3)",
                    }}
                  >
                    <span>Switch to {roleMismatch.detectedRole} Portal</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Visitor Login Form — name + phone instead of credentials */}
          {role === "visitor" ? (
            <form
              onSubmit={handleGuestSubmit}
              className="login-form visitor-login-form"
              noValidate
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "clamp(0.6rem, 1vh, 0.9rem)",
              }}
            >
              {/* Demo disclaimer */}
              <div
                style={{
                  width: "100%",
                  background: "rgba(13, 148, 136, 0.08)",
                  border: "1.5px solid rgba(13, 148, 136, 0.3)",
                  borderRadius: "12px",
                  padding: "10px 14px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "8px",
                  boxSizing: "border-box",
                }}
              >
                <ShieldCheck size={16} style={{ color: "#0d9488", flexShrink: 0, marginTop: "2px" }} />
                <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#0f766e", lineHeight: 1.4 }}>
                  <strong>Static Kiosk Demo</strong> — No real data is submitted. This is an interactive demonstration for Green Valley Public School.
                </span>
              </div>

              {/* Visitor Name */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px", width: "100%" }}>
                <label
                  htmlFor="visitor-name"
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
                  <span>Full Name <span style={{ color: "#ef4444" }}>*</span></span>
                </label>
                <input
                  id="visitor-name"
                  type="text"
                  autoComplete="name"
                  placeholder="e.g. Priya Sharma"
                  value={visitorName}
                  onChange={(e) => { setVisitorName(e.target.value); setVisitorNameError(""); }}
                  style={{
                    width: "100%",
                    height: "44px",
                    background: "#ffffff",
                    border: `1.5px solid ${visitorNameError ? "#ef4444" : "#cbd5e1"}`,
                    borderRadius: "10px",
                    padding: "0 14px",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    color: "#0f172a",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                {visitorNameError && (
                  <span style={{ fontSize: "0.74rem", color: "#ef4444", fontWeight: 600 }}>{visitorNameError}</span>
                )}
              </div>

              {/* Visitor Phone */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px", width: "100%" }}>
                <label
                  htmlFor="visitor-phone"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    color: "#334155",
                  }}
                >
                  <ShieldCheck size={15} style={{ color: config.accentColor }} />
                  <span>Mobile Number <span style={{ color: "#ef4444" }}>*</span></span>
                </label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: "12px",
                      fontSize: "0.9rem",
                      fontWeight: 700,
                      color: "#475569",
                    }}
                  >
                    +91
                  </span>
                  <input
                    id="visitor-phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    autoComplete="tel"
                    placeholder="98XXXXXXXX"
                    value={visitorPhone}
                    onChange={(e) => { setVisitorPhone(e.target.value.replace(/\D/g, "")); setVisitorPhoneError(""); }}
                    style={{
                      width: "100%",
                      height: "44px",
                      background: "#ffffff",
                      border: `1.5px solid ${visitorPhoneError ? "#ef4444" : "#cbd5e1"}`,
                      borderRadius: "10px",
                      padding: "0 14px 0 42px",
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      color: "#0f172a",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                {visitorPhoneError && (
                  <span style={{ fontSize: "0.74rem", color: "#ef4444", fontWeight: 600 }}>{visitorPhoneError}</span>
                )}
              </div>

              {/* Enter button */}
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
                      style={{
                        width: "18px",
                        height: "18px",
                        border: "2.5px solid rgba(255,255,255,0.35)",
                        borderTopColor: "#ffffff",
                        borderRadius: "50%",
                        animation: "spin 0.7s linear infinite",
                      }}
                    />
                    <span>Entering Visitor Portal...</span>
                  </>
                ) : authSuccess ? (
                  <>
                    <Check size={20} />
                    <span>Welcome! Opening Dashboard...</span>
                  </>
                ) : (
                  <>
                    <span>Enter Visitor Portal</span>
                    <ArrowRight size={20} strokeWidth={2.6} />
                  </>
                )}
              </button>

              {/* Security note */}
              <div
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
                <span>Static Demo — No data is stored or transmitted externally</span>
              </div>
            </form>
          ) : (
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
                      ? "Alumni / Ex-Staff ID / Email"
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
                  <span>Access Password / Security PIN</span>
                </label>
                <div className="login-input-group" style={{ position: "relative", width: "100%", display: "flex", alignItems: "center" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="login-input-field"
                    placeholder="Password / PIN"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    spellCheck={false}
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
                        ? "Student / Parent"
                        : role === "staff"
                          ? "Staff"
                          : "Alumni / Ex-Staff"}{" "}
                      Portal
                    </span>
                    <ArrowRight size={20} strokeWidth={2.6} />
                  </>
                )}
              </button>

              {/* ACR122U RFID Smart Card Quick Tap (Matches Legacy Kiosk ACR122U integration) */}
              <button
                type="button"
                onClick={handleSmartCardTap}
                disabled={isSubmitting}
                style={{
                  height: "38px",
                  width: "100%",
                  borderRadius: "10px",
                  background: "#f8fafc",
                  border: "1.5px dashed #cbd5e1",
                  color: "#334155",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "7px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  marginTop: "2px",
                }}
                title="Tap RFID Smart Card (ACR122U Kiosk Reader)"
              >
                <CreditCard size={15} style={{ color: config.accentColor }} />
                <span>Tap RFID Smart Card ({role === "staff" ? "EMP-1042" : "ADM-1024"})</span>
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
          )}
        </div>
      </main>

      {/* BOTTOM COMMAND FOOTER (MATCHING ROLE SELECTION SCREEN) */}
      <footer
        className="command-footer"
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 32px",
          flexShrink: 0,
          background: "rgba(255, 255, 255, 0.88)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderTop: "1.5px solid rgba(254, 215, 170, 0.65)",
        }}
      >
        <div>
          <span className="footer-dot" /> Role Authentication Portal • Enter credentials or select role to login
        </div>
        <div className="footer-links">
          <span>CBSE Affiliation 1930281</span>
          <span>NAAC Grade A++</span>
          <span>Campus: 6,200 Students</span>
          <span>Digital Campus Kiosk</span>
        </div>
        <button className="assistant-button" type="button" onClick={onBackToKiosk}>
          <span className="assistant-pulse" /> Need help? <b>Ask GreenBot</b>
        </button>
      </footer>
    </div>
  );
}
