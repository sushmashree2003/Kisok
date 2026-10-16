"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Calendar,
  Users,
  BookOpen,
  MessageSquare,
  Clock,
  CheckCircle2,
  User,
  Phone,
  Building2,
  FileText,
  Star,
  ShieldCheck,
  Bell,
  Printer,
  Info,
  GraduationCap,
  Leaf,
  Sparkles,
  Activity,
  Maximize,
  Minimize,
  Award,
  Send,
  RefreshCw,
  Compass,
  QrCode,
  Search,
  Check,
  HelpCircle,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   TYPES & SCREENS
───────────────────────────────────────────────────────────── */
export type VisitorScreen =
  | "dashboard"
  | "map"
  | "admissions"
  | "checkin"
  | "calendar"
  | "events"
  | "ask-cbs";

interface VisitorSession {
  visitorName: string;
  visitorPhone: string;
  visitTime?: string;
}

interface VisitorDashboardProps {
  onBackToKiosk: () => void;
}

/* ─────────────────────────────────────────────────────────────
   CURATED STATIC DATA (Rich, Realistic, CBSE School Context)
───────────────────────────────────────────────────────────── */
const CAMPUS_BUILDINGS = [
  {
    id: "reception",
    name: "Main Reception & Welcome Desk",
    block: "Central Gate 1",
    floor: "Ground Floor",
    desc: "Primary check-in point, visitor badge collection, campus security clearance, and information center.",
    distance: "20m from Gate 1",
    category: "Admin",
    accent: "#ea580c",
  },
  {
    id: "admissions",
    name: "Admissions Center & Enquiries",
    block: "Block A (Vivekananda Block)",
    floor: "Ground Floor, Room 104",
    desc: "Prospectus distribution, 2026-27 application processing, fee structure guidance, and parent counseling.",
    distance: "65m • Left Corridor",
    category: "Admissions",
    accent: "#0d9488",
  },
  {
    id: "principal",
    name: "Principal's Office & Directorate",
    block: "Administrative Wing",
    floor: "First Floor, Suite 201",
    desc: "Executive school leadership, academic oversight, and scheduled parent appointments (10:30 AM – 1:00 PM).",
    distance: "90m • Elevator Accessible",
    category: "Leadership",
    accent: "#7c3aed",
  },
  {
    id: "stem-labs",
    name: "Dr. APJ Abdul Kalam STEM Center",
    block: "Science & Robotics Block",
    floor: "Second Floor",
    desc: "Physics, Chemistry, Biology laboratories, 3D printing lab, AI workspace, and Atal Tinkering Lab (ATL).",
    distance: "140m • North Quad",
    category: "Academic",
    accent: "#0284c7",
  },
  {
    id: "library",
    name: "Rabindranath Tagore Central Library",
    block: "Knowledge Hub",
    floor: "Ground & Mezzanine",
    desc: "25,000+ print volumes, Kindle e-reading stations, research archives, and quiet study alcoves.",
    distance: "110m • East Courtyard",
    category: "Academic",
    accent: "#16a34a",
  },
  {
    id: "auditorium",
    name: "Kalam Grand Auditorium",
    block: "Arts & Performing Wing",
    floor: "Entrance Gate 2",
    desc: "850-seat acoustically treated theater for symposia, annual assemblies, theater, and cultural festivals.",
    distance: "160m • South Wing",
    category: "Facilities",
    accent: "#db2777",
  },
  {
    id: "sports-complex",
    name: "Major Dhyan Chand Sports Complex",
    block: "Athletics Pavilion",
    floor: "Outdoor Fields",
    desc: "400m synthetic running track, FIFA-standard turf, 2 wooden basketball courts, and indoor badminton arena.",
    distance: "220m • West Campus",
    category: "Sports",
    accent: "#d97706",
  },
  {
    id: "transport",
    name: "Transport & Safety Command Center",
    block: "Service Gate 3",
    floor: "Ground Floor",
    desc: "Fleet of 32 GPS-tracked school buses, route coordination, transport RFID pass dispatch, and parent queries.",
    distance: "180m • Service Gate",
    category: "Facilities",
    accent: "#475569",
  },
];

const ADMISSION_FEE_CHART = [
  { grade: "Pre-KG / Nursery", tuition: "₹42,000", activity: "₹6,000", termTotal: "₹48,000", admissionFee: "₹15,000" },
  { grade: "LKG & UKG", tuition: "₹46,000", activity: "₹7,000", termTotal: "₹53,000", admissionFee: "₹15,000" },
  { grade: "Class I – V", tuition: "₹52,000", activity: "₹8,500", termTotal: "₹60,500", admissionFee: "₹18,000" },
  { grade: "Class VI – VIII", tuition: "₹58,000", activity: "₹9,500", termTotal: "₹67,500", admissionFee: "₹20,000" },
  { grade: "Class IX & X", tuition: "₹64,000", activity: "₹10,500", termTotal: "₹74,500", admissionFee: "₹22,000" },
  { grade: "Class XI & XII (Science / STEM)", tuition: "₹72,000", activity: "₹12,000", termTotal: "₹84,000", admissionFee: "₹25,000" },
  { grade: "Class XI & XII (Comm / Hum)", tuition: "₹68,000", activity: "₹11,000", termTotal: "₹79,000", admissionFee: "₹25,000" },
];

const ADMISSION_ROADMAP = [
  { step: 1, title: "Prospectus & Online Form", desc: "Collect the 2026-27 brochure from Desk 104 or fill online application form." },
  { step: 2, title: "Document Verification", desc: "Submit student birth certificate, previous marksheet, Aadhaar card, and photos." },
  { step: 3, title: "Learner Readiness Check", desc: "Informal interaction for Pre-KG to Class I; basic diagnostic assessment for Classes II–XI." },
  { step: 4, title: "Parent Counseling Session", desc: "Discuss pedagogical framework, co-curricular alignment, and bus routes with leadership." },
  { step: 5, title: "Provisional Offer & Seat", desc: "Confirmation letter issued with 7-day window to complete enrolment formalities." },
  { step: 6, title: "Welcome Kit & Uniform", desc: "Collect student RFID card, almanac, curriculum calendar, and timetable pack." },
];

const HOST_DEPARTMENTS = [
  { id: "admissions", name: "Admissions Office", officer: "Mr. Suresh Pillai (Head of Enrolment)", ext: "Ext. 102" },
  { id: "principal", name: "Principal's Secretariat", officer: "Dr. Kavitha Iyer (Principal)", ext: "Ext. 103" },
  { id: "accounts", name: "Accounts & Fee Desk", officer: "Mr. Rajiv Menon (Finance Officer)", ext: "Ext. 104" },
  { id: "academic-coord", name: "Academic Coordinator", officer: "Mrs. Meenakshi Sundaram", ext: "Ext. 108" },
  { id: "transport", name: "Transport & Safety Desk", officer: "Mr. Deepak Yadav (Fleet Head)", ext: "Ext. 105" },
  { id: "sports", name: "Physical Education Dept", officer: "Coach Ranjit Singh", ext: "Ext. 107" },
];

const SCHOOL_TIMINGS_TABLE = [
  { group: "Pre-KG & Kindergarten", hours: "08:30 AM – 12:30 PM", days: "Monday to Friday" },
  { group: "Classes I – V (Primary)", hours: "08:00 AM – 02:30 PM", days: "Monday to Friday" },
  { group: "Classes VI – XII (Middle & Sr)", hours: "07:45 AM – 03:00 PM", days: "Monday to Friday, Alternate Saturdays" },
  { group: "Administrative & Cash Office", hours: "08:00 AM – 04:00 PM", days: "Monday to Saturday" },
  { group: "Campus Visitor Hours", hours: "08:30 AM – 04:30 PM", days: "All Working Days" },
  { group: "Principal Meet Appointments", hours: "10:30 AM – 01:00 PM", days: "Prior Booking at Reception" },
];

const UPCOMING_EVENTS = [
  {
    id: 1,
    title: "Annual Science & Innovation Symposium 'Avishkar 2026'",
    date: "Fri, 14 Nov 2026",
    time: "09:30 AM – 03:30 PM",
    venue: "STEM Quad & Exhibition Foyer",
    type: "Exhibition",
    desc: "140+ student working prototypes in robotics, clean energy, bio-tech, and AI solutions. Open to parents & community visitors.",
    accent: "#0d9488",
  },
  {
    id: 2,
    title: "Open House & Guided Campus Discovery Day",
    date: "Sat, 25 Oct 2026",
    time: "09:00 AM – 01:00 PM",
    venue: "Main Auditorium & Facilities Walkthrough",
    type: "Open Day",
    desc: "Interactive guided walkthrough of 40-acre campus, faculty interactions, admissions desk, and student cultural performances.",
    accent: "#ea580c",
  },
  {
    id: 3,
    title: "Inter-School Cultural Carnival 'Tarang 2026'",
    date: "Sat, 22 Nov 2026",
    time: "03:30 PM – 07:30 PM",
    venue: "Kalam Grand Auditorium",
    type: "Carnival",
    desc: "Grand celebration of music, classical Indian dance, theater, street plays, and art showcase across 28 leading schools.",
    accent: "#7c3aed",
  },
  {
    id: 4,
    title: "Annual Sports Meet & Athletic Championship",
    date: "Sat, 06 Dec 2026",
    time: "08:00 AM – 01:30 PM",
    venue: "Major Dhyan Chand Sports Complex",
    type: "Athletics",
    desc: "March past, track & field finals, gymnastics demo, inter-house relay, and championship trophy ceremony by Chief Guest.",
    accent: "#16a34a",
  },
];

const CAMPUS_GALLERY = [
  { title: "Robotics & AI Innovation Lab", tag: "STEM Education", desc: "Hands-on maker space with 3D printers & automated test benches", color: "#0284c7" },
  { title: "Olympic 400m Athletic Track", tag: "Sports Excellence", desc: "All-weather synthetic running surface with LED stadium lighting", color: "#16a34a" },
  { title: "Central Digital Library", tag: "Knowledge Hub", desc: "25,000+ volumes with Kindle reading alcoves & quiet study pods", color: "#ea580c" },
  { title: "Kalam Grand Auditorium", tag: "Performing Arts", desc: "850-capacity air-conditioned hall with surround acoustic tuning", color: "#7c3aed" },
  { title: "Smart Kindergarten Play Arena", tag: "Early Years", desc: "Sensory play zones, splash pool, and gross-motor discovery hub", color: "#db2777" },
  { title: "Eco-Campus Botanical Greenhouse", tag: "Sustainability", desc: "Solar powered micro-farm, rainwater harvest, and herbal garden", color: "#059669" },
];

const CBS_FAQS = [
  {
    q: "How do I apply for 2026-27 admission for my child?",
    a: "You can pick up a prospectus from Admissions Counter 104 in Block A or submit an online application on the kiosk. Applications are accepted for Nursery through Grade XI.",
  },
  {
    q: "What is the fee structure and payment frequency?",
    a: "Annual fees range from ₹48,000 (Pre-KG) to ₹84,000 (Senior Secondary STEM), payable in 3 term installments. Transport and canteen are optional and route-based.",
  },
  {
    q: "Is Green Valley Public School affiliated to CBSE?",
    a: "Yes! Green Valley Public School is permanently affiliated to CBSE New Delhi (Affiliation No. 1930421 • School Code: 45210), maintaining NAAC Grade A++ benchmarking.",
  },
  {
    q: "Can I meet the Principal or Admission Director today?",
    a: "Principal meetings are scheduled between 10:30 AM and 01:00 PM. Please notify Reception through Card 3 (Visitor Check-In) to request immediate queue clearance.",
  },
  {
    q: "What safety protocols and transport routes are available?",
    a: "Our campus operates 32 GPS-tracked school buses with speed governors, CCTV cameras, female attendants, and real-time parent app telemetry covering 34 routes.",
  },
  {
    q: "Are there concessions or scholarship tests for merit students?",
    a: "Yes. The Green Valley Merit Scholarship offers up to 50% tuition waiver for students scoring 90%+ in the annual scholarship assessment or state-level sports achievers.",
  },
];

/* ─────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────────── */
export default function VisitorDashboard({ onBackToKiosk }: VisitorDashboardProps) {
  const [currentScreen, setCurrentScreen] = useState<VisitorScreen>("dashboard");
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Visitor Session from localStorage
  const [visitorSession, setVisitorSession] = useState<VisitorSession>({
    visitorName: "Priya Sharma",
    visitorPhone: "9876543210",
    visitTime: new Date().toISOString(),
  });
  const [visitorPassNumber] = useState("GVPS-VP-2026-842");

  // Filter & Interactive States
  const [mapCategory, setMapCategory] = useState("All");
  const [selectedBuilding, setSelectedBuilding] = useState<string>("reception");
  const [selectedDept, setSelectedDept] = useState("admissions");
  const [hostAlertSent, setHostAlertSent] = useState(false);
  const [hostAlertTimer, setHostAlertTimer] = useState<string | null>(null);

  // Ask CBS chatbot
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "bot"; text: string }>>([
    {
      sender: "bot",
      text: "Namaste! Welcome to Green Valley Public School. I am CBS, your AI Campus Guide. Feel free to ask about admissions, campus buildings, fees, or host meetings!",
    },
  ]);
  const [chatInput, setChatInput] = useState("");

  // Load localStorage data safely
  useEffect(() => {
    try {
      const stored = localStorage.getItem("gvps_visitor_session");
      if (stored) {
        const parsed = JSON.parse(stored) as VisitorSession;
        if (parsed.visitorName) {
          setVisitorSession(parsed);
        }
      }
    } catch {}
  }, []);

  // Clock & Fullscreen synchronizer
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const handleFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFs);
    return () => {
      clearInterval(timer);
      document.removeEventListener("fullscreenchange", handleFs);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleSendChat = (queryText: string) => {
    const trimmed = queryText.trim();
    if (!trimmed) return;
    const userMsg = trimmed;
    setChatMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setChatInput("");

    setTimeout(() => {
      let reply = "Thank you for inquiring! For personalized assistance, our Reception desk is open in Central Gate 1 (Ext. 101) or you can visit Counter 104 in Block A.";
      const qLower = userMsg.toLowerCase();
      if (qLower.includes("fee") || qLower.includes("cost") || qLower.includes("charge")) {
        reply = "Annual tuition ranges from ₹48,000 for Pre-KG to ₹84,000 for Senior Secondary STEM classes. Flexible 3-term installments and merit concessions are available.";
      } else if (qLower.includes("time") || qLower.includes("hour") || qLower.includes("open")) {
        reply = "Campus visitor hours are Monday to Saturday from 08:30 AM to 04:30 PM. Administrative offices remain open until 04:00 PM.";
      } else if (qLower.includes("admission") || qLower.includes("apply") || qLower.includes("nursery") || qLower.includes("form")) {
        reply = "Admissions for 2026-27 are currently open from Nursery through Grade XI. Collect the prospectus from Counter 104 or review the full fee matrix in Module 2.";
      } else if (qLower.includes("principal") || qLower.includes("meet") || qLower.includes("appointment")) {
        reply = "Dr. Kavitha Iyer (Principal) meets visitors between 10:30 AM and 01:00 PM. Please use Card 3 (Visitor Check-In) to notify the secretariat.";
      } else if (qLower.includes("bus") || qLower.includes("transport") || qLower.includes("route")) {
        reply = "We operate 32 GPS-monitored air-conditioned buses across 34 city routes with female attendants and parent telemetry app access.";
      } else if (qLower.includes("where") || qLower.includes("map") || qLower.includes("block") || qLower.includes("lab")) {
        reply = "Use Card 1 (Campus Map & Wayfinder) for interactive floor-by-floor walking routes to STEM labs, the auditorium, and academic blocks.";
      }
      setChatMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    }, 500);
  };

  const handleNotifyHost = () => {
    setHostAlertSent(true);
    const timeStr = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
    setHostAlertTimer(timeStr);
  };

  const filteredBuildings =
    mapCategory === "All"
      ? CAMPUS_BUILDINGS
      : CAMPUS_BUILDINGS.filter((b) => b.category === mapCategory);

  /* ─────────────────────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────────────────────── */
  return (
    <div className="dashboard-page">
      {/* Ambient background orbs matching Student/Staff software theme */}
      <div className="kiosk-orb kiosk-orb-one" />
      <div className="kiosk-orb kiosk-orb-two" />

      {/* TOP COMMAND NAVBAR (Identical layout & alignment to Student/Staff) */}
      <header className="dash-navbar">
        <div className="command-brand" onClick={onBackToKiosk} style={{ cursor: "pointer" }}>
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
                  border: "1.5px solid rgba(251, 146, 60, 0.4)",
                  boxShadow: "0 2px 8px rgba(234, 88, 12, 0.08)",
                  letterSpacing: "0.02em",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                <Users size={12} style={{ color: "#ea580c" }} />
                PAGE 6 • CAMPUS VISITOR PORTAL
              </span>
            </div>
          </div>
        </div>

        {/* Profile Pill & Control Actions */}
        <div className="dash-nav-actions" style={{ flexWrap: "nowrap" }}>
          {/* Visitor Profile Pill */}
          <div
            className="dash-profile-pill cursor-pointer"
            onClick={() => setCurrentScreen("checkin")}
            title="Click to view Visitor Pass & Badge"
            style={{ cursor: "pointer" }}
          >
            <img src="/admin_avatar.png" alt={visitorSession.visitorName} className="dash-user-avatar" />
            <div className="dash-user-info">
              <span className="dash-user-name">{visitorSession.visitorName}</span>
              <span className="dash-user-role">Campus Visitor • Pass: {visitorPassNumber}</span>
            </div>
          </div>

          {/* Live Campus Telemetry Pill */}
          <div className="command-live-status">
            <span style={{ background: "#16a34a" }} />
            <span>Campus online</span>
          </div>

          {/* Clock Widget */}
          <div className="dash-clock-widget">
            <Calendar size={13} style={{ color: "#ea580c" }} />
            <span>
              {currentTime.toLocaleDateString("en-US", { weekday: "short", day: "2-digit", month: "short" })} •{" "}
              <b>{currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}</b>
            </span>
          </div>

          {/* Fullscreen Button */}
          <button className="command-fullscreen" onClick={toggleFullscreen} title="Toggle Fullscreen">
            {isFullscreen ? <Minimize size={15} /> : <Maximize size={15} />}
            <span>{isFullscreen ? "Exit" : "Full screen"}</span>
          </button>

          {/* Back to Kiosk Home */}
          <button className="dash-kiosk-back-btn" onClick={onBackToKiosk} title="Return to Kiosk Role Selector">
            <ArrowLeft size={16} />
            <span>Exit Visitor</span>
          </button>
        </div>
      </header>

      {/* LIVE BROADCAST TICKER BAR */}
      <div className="dash-ticker-bar">
        <span className="ticker-badge-live">
          <Activity size={11} /> LIVE
        </span>
        <div className="ticker-content">
          <div className="ticker-item">
            <span className="ticker-tag">CAMPUS VISITOR NOTICE:</span>
            <span>Welcome to Green Valley Public School! Please keep your digital badge visible on campus premises.</span>
          </div>
          <div className="ticker-item">
            <span className="ticker-tag" style={{ color: "#ea580c" }}>ADMISSIONS 2026-27:</span>
            <span>Applications open for Nursery to Grade XI • Collect prospectus from Counter 104 in Block A.</span>
          </div>
          <div className="ticker-item">
            <span className="ticker-tag" style={{ color: "#16a34a" }}>WAYFINDING HELP:</span>
            <span>Reception Desk (Ext. 101) & Campus Security (Ext. 104) are available 24/7 for guest assistance.</span>
          </div>
        </div>
      </div>

      {/* ========================================================
          VIEW 0: MAIN VISITOR HUB (6 COMPACT BALANCED CARDS GRID)
          ======================================================== */}
      {currentScreen === "dashboard" && (
        <main className="dash-main-hub">
          {/* HERO BANNER (Exact same structure & 3D Podium as Student/Staff) */}
          <section className="student-hub-hero">
            <div className="student-hero-title-group">
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", marginBottom: "0.25rem" }}>
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
                  GUEST HUB
                </span>
                <span style={{ fontSize: "0.76rem", fontWeight: 800, color: "#ea580c", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <Sparkles size={13} /> CAMPUS VISITOR EXPERIENCE • SMART KIOSK
                </span>
              </div>

              <h2>
                Welcome to Campus, <span>{visitorSession.visitorName}</span> 👋
              </h2>
              <p>
                Explore our 40-acre smart campus, review admissions for 2026-27, generate your digital visitor pass, and discover upcoming academic exhibitions.
              </p>

              {/* Informational Hero Chips */}
              <div className="student-hero-chips">
                <span className="student-hero-chip">
                  <MapPin size={12} /> 40-Acre Campus
                </span>
                <span className="student-hero-chip">
                  <Clock size={12} /> Visiting Hours: 08:30 AM – 04:30 PM
                </span>
                <span className="student-hero-chip">
                  <ShieldCheck size={12} /> Pass: {visitorPassNumber}
                </span>
                <span className="student-hero-chip highlight">
                  <CheckCircle2 size={12} /> Reception Desk Active
                </span>
                <span className="student-hero-chip live">
                  <Activity size={12} /> Live Wayfinding Synced
                </span>
              </div>
            </div>

            {/* UNIFIED 3D STAGE CAPSULE (Matching Student & Staff) */}
            <div className="student-hero-capsule">
              {/* 3D Character Avatar Stage */}
              <div className="hero-avatar-podium">
                <div className="hero-avatar-halo" />
                <img src="/admin_avatar.png" alt="Visitor" className="hero-avatar-3d-img" />
                <span className="hero-avatar-tag">Visitor Hub</span>
              </div>

              <div className="hero-capsule-divider" />

              {/* 3D Mini Orbital Badge */}
              <div className="hero-honor-stage">
                <div className="hero-honor-icon-bubble">
                  <ShieldCheck size={18} />
                </div>
                <div className="hero-honor-text">
                  <span className="hero-honor-title">Visitor</span>
                  <span className="hero-honor-badge">Pass Active</span>
                </div>
              </div>

              <div className="hero-capsule-divider" />

              {/* AI Space Launch Button */}
              <button
                type="button"
                onClick={() => setCurrentScreen("ask-cbs")}
                className="hero-ai-capsule-btn"
                title="Launch Visitor AI Assistant"
              >
                <div className="hero-ai-robo-wrap">
                  <img src="/ai_robot.png" alt="GreenBot" className="hero-ai-robo-img" />
                  <span className="hero-ai-pulse-dot" />
                </div>
                <div style={{ textAlign: "center" }}>
                  <div className="hero-ai-kicker">
                    <Sparkles size={9} style={{ display: "inline", verticalAlign: "middle", marginRight: 2 }} /> AI HELPDESK
                  </div>
                  <span className="hero-ai-action">Ask CBS →</span>
                </div>
              </button>
            </div>
          </section>

          {/* 6 COMPACT BALANCED MODULES (3 COLUMNS × 2 ROWS) */}
          <section className="student-hub-grid">
            {/* CONTAINER 1: 🗺️ CAMPUS MAP & DIRECTIONS */}
            <div
              className="student-hub-card"
              onClick={() => setCurrentScreen("map")}
              title="Click to open Interactive Campus Map & Wayfinder"
            >
              <div className="student-hub-card-header">
                <div className="student-card-title-group">
                  <div className="student-card-icon-box">
                    <MapPin size={19} />
                  </div>
                  <div className="student-card-headings">
                    <h3>Campus Map &amp; Wayfinder</h3>
                    <span>40-Acre Interactive Campus</span>
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
                  8 Key Locations
                </span>
              </div>

              <div className="student-hub-card-body">
                <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f8fafc", padding: "0.35rem 0.65rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <Building2 size={15} style={{ color: "#ea580c" }} />
                      <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#1e293b" }}>Main Reception Gate 1</span>
                    </div>
                    <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#16a34a" }}>You Are Here</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f8fafc", padding: "0.35rem 0.65rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <GraduationCap size={15} style={{ color: "#0d9488" }} />
                      <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#1e293b" }}>Block A: Admissions Office</span>
                    </div>
                    <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "#64748b" }}>65m • Left Wing</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f8fafc", padding: "0.35rem 0.65rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <Compass size={15} style={{ color: "#0284c7" }} />
                      <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#1e293b" }}>STEM Labs &amp; Central Library</span>
                    </div>
                    <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "#64748b" }}>110m • East Quad</span>
                  </div>
                </div>
              </div>

              <div className="student-hub-card-footer">
                <span className="student-card-view-btn">
                  <span>Open Campus Navigator</span>
                  <ArrowRight size={13} />
                </span>
              </div>
            </div>

            {/* CONTAINER 2: 🎓 ADMISSIONS 2026-27 */}
            <div
              className="student-hub-card"
              onClick={() => setCurrentScreen("admissions")}
              title="Click to view Admissions 2026-27 Prospectus & Fee Structure"
            >
              <div className="student-hub-card-header">
                <div className="student-card-title-group">
                  <div className="student-card-icon-box">
                    <GraduationCap size={19} />
                  </div>
                  <div className="student-card-headings">
                    <h3>Admissions 2026-27</h3>
                    <span>Nursery to Grade XI Enrolment</span>
                  </div>
                </div>
                <span
                  style={{
                    background: "#f0fdf4",
                    color: "#16a34a",
                    border: "1px solid rgba(187, 247, 208, 0.8)",
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    padding: "0.2rem 0.65rem",
                    borderRadius: "9999px",
                  }}
                >
                  Enrolment Open
                </span>
              </div>

              <div className="student-hub-card-body">
                <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc", padding: "0.35rem 0.65rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#475569" }}>CBSE Affiliation</span>
                    <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#0c3558" }}>No. 1930421 (NAAC A++)</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc", padding: "0.35rem 0.65rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#475569" }}>Annual Fee Range</span>
                    <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#ea580c" }}>₹48,000 – ₹84,000 / yr</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc", padding: "0.35rem 0.65rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#475569" }}>Prospectus Collection</span>
                    <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#0d9488" }}>Counter 104 • Block A</span>
                  </div>
                </div>
              </div>

              <div className="student-hub-card-footer">
                <span className="student-card-view-btn">
                  <span>View Admission Guide</span>
                  <ArrowRight size={13} />
                </span>
              </div>
            </div>

            {/* CONTAINER 3: 📋 VISITOR CHECK-IN & GATE PASS */}
            <div
              className="student-hub-card"
              onClick={() => setCurrentScreen("checkin")}
              title="Click to view Digital Visitor Pass and Notify Host"
            >
              <div className="student-hub-card-header">
                <div className="student-card-title-group">
                  <div className="student-card-icon-box">
                    <ShieldCheck size={19} />
                  </div>
                  <div className="student-card-headings">
                    <h3>Visitor Pass &amp; Clearance</h3>
                    <span>Digital Badge &amp; Host Alert</span>
                  </div>
                </div>
                <span
                  style={{
                    background: "#f0fdfa",
                    color: "#0f766e",
                    border: "1px solid rgba(204, 251, 241, 0.8)",
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    padding: "0.2rem 0.65rem",
                    borderRadius: "9999px",
                  }}
                >
                  Verified Entry
                </span>
              </div>

              <div className="student-hub-card-body">
                <div style={{ background: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)", padding: "0.5rem 0.75rem", borderRadius: "12px", border: "1.2px solid rgba(251, 146, 60, 0.4)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "0.66rem", fontWeight: 800, color: "#c2410c", textTransform: "uppercase" }}>Pass Number</div>
                    <div style={{ fontSize: "0.95rem", fontWeight: 900, color: "#9a3412", letterSpacing: "0.03em" }}>{visitorPassNumber}</div>
                  </div>
                  <QrCode size={36} style={{ color: "#ea580c" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.75rem", fontWeight: 600, color: "#64748b", marginTop: "4px" }}>
                  <span>Visitor: <strong style={{ color: "#1e293b" }}>{visitorSession.visitorName}</strong></span>
                  <span>Ph: <strong style={{ color: "#1e293b" }}>+91 {visitorSession.visitorPhone}</strong></span>
                </div>
              </div>

              <div className="student-hub-card-footer">
                <span className="student-card-view-btn">
                  <span>Manage Visitor Pass</span>
                  <ArrowRight size={13} />
                </span>
              </div>
            </div>

            {/* CONTAINER 4: 📅 SCHOOL CALENDAR & TIMINGS */}
            <div
              className="student-hub-card"
              onClick={() => setCurrentScreen("calendar")}
              title="Click to view School Calendar & Campus Timings"
            >
              <div className="student-hub-card-header">
                <div className="student-card-title-group">
                  <div className="student-card-icon-box">
                    <Calendar size={19} />
                  </div>
                  <div className="student-card-headings">
                    <h3>Calendar &amp; Timings</h3>
                    <span>Visiting Hours &amp; Schedule</span>
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
                  AY 2026-27
                </span>
              </div>

              <div className="student-hub-card-body">
                <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc", padding: "0.35rem 0.65rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#475569" }}>Daily Visitor Window</span>
                    <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#16a34a" }}>08:30 AM – 04:30 PM</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc", padding: "0.35rem 0.65rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#475569" }}>Principal Interaction</span>
                    <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#0c3558" }}>10:30 AM – 01:00 PM</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc", padding: "0.35rem 0.65rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#475569" }}>Next Parent-Teacher Meet</span>
                    <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#ea580c" }}>Saturday, 31 Oct 2026</span>
                  </div>
                </div>
              </div>

              <div className="student-hub-card-footer">
                <span className="student-card-view-btn">
                  <span>View Full Calendar</span>
                  <ArrowRight size={13} />
                </span>
              </div>
            </div>

            {/* CONTAINER 5: 🏆 EVENTS & CAMPUS GALLERY */}
            <div
              className="student-hub-card"
              onClick={() => setCurrentScreen("events")}
              title="Click to view School Events & Photo Gallery"
            >
              <div className="student-hub-card-header">
                <div className="student-card-title-group">
                  <div className="student-card-icon-box">
                    <Award size={19} />
                  </div>
                  <div className="student-card-headings">
                    <h3>Events &amp; Campus Gallery</h3>
                    <span>Exhibitions, Sports &amp; Arts</span>
                  </div>
                </div>
                <span
                  style={{
                    background: "#fef3c7",
                    color: "#b45309",
                    border: "1px solid rgba(253, 230, 138, 0.8)",
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    padding: "0.2rem 0.65rem",
                    borderRadius: "9999px",
                  }}
                >
                  4 Highlights
                </span>
              </div>

              <div className="student-hub-card-body">
                <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", background: "#f8fafc", padding: "0.35rem 0.65rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                    <Star size={14} style={{ color: "#ea580c" }} />
                    <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      Avishkar Science Expo (14 Nov)
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", background: "#f8fafc", padding: "0.35rem 0.65rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                    <Star size={14} style={{ color: "#7c3aed" }} />
                    <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      Tarang 2026 Cultural Fest (22 Nov)
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", background: "#f8fafc", padding: "0.35rem 0.65rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                    <Star size={14} style={{ color: "#16a34a" }} />
                    <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      Annual Athletic Meet (06 Dec)
                    </span>
                  </div>
                </div>
              </div>

              <div className="student-hub-card-footer">
                <span className="student-card-view-btn">
                  <span>Explore Gallery &amp; Events</span>
                  <ArrowRight size={13} />
                </span>
              </div>
            </div>

            {/* CONTAINER 6: 💬 ASK CBS — AI VISITOR HELPDESK */}
            <div
              className="student-hub-card"
              onClick={() => setCurrentScreen("ask-cbs")}
              title="Click to launch Ask CBS AI Helpdesk"
            >
              <div className="student-hub-card-header">
                <div className="student-card-title-group">
                  <div className="student-card-icon-box">
                    <Sparkles size={19} />
                  </div>
                  <div className="student-card-headings">
                    <h3>Ask CBS — AI Helpdesk</h3>
                    <span>Instant Campus Q&amp;A Assistant</span>
                  </div>
                </div>
                <span
                  style={{
                    background: "#f0fdfa",
                    color: "#0f766e",
                    border: "1px solid rgba(204, 251, 241, 0.8)",
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    padding: "0.2rem 0.65rem",
                    borderRadius: "9999px",
                  }}
                >
                  Live AI Support
                </span>
              </div>

              <div className="student-hub-card-body">
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "0.35rem" }}>
                  {["Admission Fees", "School Hours", "Host Meeting", "Bus Routes"].map((chip) => (
                    <span
                      key={chip}
                      style={{
                        background: "#fff7ed",
                        border: "1px solid rgba(251, 146, 60, 0.35)",
                        color: "#c2410c",
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        padding: "0.2rem 0.55rem",
                        borderRadius: "9999px",
                      }}
                    >
                      {chip}
                    </span>
                  ))}
                </div>
                <div style={{ background: "#f8fafc", padding: "0.4rem 0.65rem", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "0.75rem", color: "#64748b" }}>
                  💬 Ask anything about Green Valley Public School for instant automated helpdesk guidance.
                </div>
              </div>

              <div className="student-hub-card-footer">
                <span className="student-card-view-btn">
                  <span>Launch AI Assistant</span>
                  <ArrowRight size={13} />
                </span>
              </div>
            </div>
          </section>

          {/* BOTTOM QUICK-ACTION TELEMETRY BAR (Exact alignment to Student/Staff) */}
          <section
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              border: "1.2px solid rgba(254, 215, 170, 0.7)",
              borderRadius: "16px",
              padding: "0.45rem 1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 2px 10px rgba(234, 88, 12, 0.04)",
              flexShrink: 0,
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", minWidth: 0 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
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
                <Users size={18} />
              </div>
              <div>
                <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#1e293b" }}>
                  Active Visitor Session: {visitorSession.visitorName} (Pass: {visitorPassNumber})
                </span>
                <div style={{ fontSize: "0.68rem", color: "#64748b", display: "flex", gap: "0.6rem", marginTop: "1px", flexWrap: "wrap" }}>
                  <span>Mobile: <strong>+91 {visitorSession.visitorPhone}</strong></span>
                  <span>•</span>
                  <span>Main Gate 1: <strong style={{ color: "#16a34a" }}>Security Verified</strong></span>
                  <span>•</span>
                  <span>Reception Desk: <strong>Ext. 101</strong></span>
                  <span>•</span>
                  <span>Campus Telemetry: <strong style={{ color: "#ea580c" }}>Online</strong></span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", flexWrap: "wrap" }}>
              <button
                onClick={() => setCurrentScreen("map")}
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
                }}
              >
                <MapPin size={13} /> Campus Map →
              </button>
              <button
                onClick={() => setCurrentScreen("admissions")}
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
                }}
              >
                <GraduationCap size={13} /> Admissions Desk →
              </button>
              <button
                onClick={() => setCurrentScreen("checkin")}
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
                }}
              >
                <ShieldCheck size={13} /> Visitor Pass →
              </button>
              <button
                onClick={() => setCurrentScreen("ask-cbs")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  padding: "0.35rem 0.85rem",
                  borderRadius: "9999px",
                  border: "1.2px solid #ea580c",
                  background: "#ea580c",
                  color: "#ffffff",
                  fontWeight: 800,
                  fontSize: "0.74rem",
                  cursor: "pointer",
                  boxShadow: "0 2px 6px rgba(234, 88, 12, 0.25)",
                }}
              >
                <Sparkles size={13} /> Ask CBS AI →
              </button>
            </div>
          </section>
        </main>
      )}

      {/* ========================================================
          VIEW 1: DEDICATED FULL SCREEN — CAMPUS MAP & WAYFINDER
          ======================================================== */}
      {currentScreen === "map" && (
        <section className="student-fullscreen-page">
          <div className="student-screen-subnav">
            <button className="student-back-to-dash-btn" onClick={() => setCurrentScreen("dashboard")}>
              <ArrowLeft size={16} /> Back to Dashboard
            </button>

            <div className="student-screen-title-area">
              <div className="student-screen-icon-bubble" style={{ background: "#fff7ed", color: "#ea580c" }}>
                <MapPin size={20} />
              </div>
              <div>
                <h2>Campus Map &amp; Interactive Wayfinder</h2>
                <p>40-Acre Campus Building Navigator &amp; Floor Guide • Green Valley Public School</p>
              </div>
            </div>

            <div className="student-screen-nav-tools">
              <button
                className="student-back-to-dash-btn"
                onClick={() => setSelectedBuilding("reception")}
                style={{ fontSize: "0.74rem", padding: "0.35rem 0.85rem" }}
              >
                <Compass size={13} /> Reset to Gate 1
              </button>
            </div>
          </div>

          <div className="student-screen-scroll-body" style={{ padding: "1rem 1.5rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Filter Tabs */}
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: "0.76rem", fontWeight: 800, color: "#64748b" }}>Filter Zone:</span>
              {["All", "Admin", "Admissions", "Academic", "Sports", "Facilities"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setMapCategory(cat)}
                  style={{
                    padding: "0.3rem 0.85rem",
                    borderRadius: "9999px",
                    fontSize: "0.76rem",
                    fontWeight: 700,
                    border: mapCategory === cat ? "1.5px solid #ea580c" : "1px solid #cbd5e1",
                    background: mapCategory === cat ? "#ea580c" : "#ffffff",
                    color: mapCategory === cat ? "#ffffff" : "#475569",
                    cursor: "pointer",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Two-Column Layout: Map Schematic + Building Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "1.2rem", alignItems: "start" }}>
              {/* Left: Visual Schematic Grid */}
              <div style={{ background: "#ffffff", borderRadius: "18px", border: "1.5px solid rgba(254, 215, 170, 0.7)", padding: "1.25rem", boxShadow: "0 4px 18px rgba(0,0,0,0.03)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem" }}>
                  <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#1e293b", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Compass size={18} style={{ color: "#ea580c" }} />
                    <span>Campus Schematic Blueprint</span>
                  </div>
                  <span style={{ fontSize: "0.72rem", color: "#16a34a", fontWeight: 700, background: "#f0fdf4", padding: "2px 8px", borderRadius: "9999px" }}>
                    ● 40 Acres • Fully Monitored
                  </span>
                </div>

                {/* Interactive Map Grid */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "0.75rem",
                    background: "linear-gradient(135deg, #fffcf9 0%, #fff7ef 100%)",
                    border: "1.5px dashed rgba(251, 146, 60, 0.4)",
                    borderRadius: "14px",
                    padding: "1rem",
                    minHeight: "320px",
                  }}
                >
                  {CAMPUS_BUILDINGS.map((b) => {
                    const isSelected = selectedBuilding === b.id;
                    return (
                      <div
                        key={b.id}
                        onClick={() => setSelectedBuilding(b.id)}
                        style={{
                          background: isSelected ? "#ea580c" : "#ffffff",
                          color: isSelected ? "#ffffff" : "#1e293b",
                          border: isSelected ? "2px solid #c2410c" : "1.2px solid rgba(254, 215, 170, 0.8)",
                          borderRadius: "12px",
                          padding: "0.75rem",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          cursor: "pointer",
                          boxShadow: isSelected ? "0 8px 20px rgba(234, 88, 12, 0.3)" : "0 2px 6px rgba(0,0,0,0.04)",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <span style={{ fontSize: "0.62rem", fontWeight: 900, textTransform: "uppercase", opacity: isSelected ? 0.9 : 0.7 }}>
                            {b.category}
                          </span>
                          <MapPin size={14} style={{ color: isSelected ? "#ffffff" : "#ea580c" }} />
                        </div>
                        <div>
                          <div style={{ fontSize: "0.82rem", fontWeight: 800, lineHeight: 1.2 }}>{b.name}</div>
                          <div style={{ fontSize: "0.68rem", opacity: isSelected ? 0.9 : 0.6, marginTop: "2px" }}>{b.floor}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right: Selected Building Details */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {(() => {
                  const b = CAMPUS_BUILDINGS.find((item) => item.id === selectedBuilding) || CAMPUS_BUILDINGS[0];
                  return (
                    <div style={{ background: "#ffffff", borderRadius: "18px", border: "1.5px solid rgba(254, 215, 170, 0.7)", padding: "1.25rem", boxShadow: "0 4px 18px rgba(0,0,0,0.03)" }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "#fff7ed", color: "#c2410c", padding: "0.2rem 0.65rem", borderRadius: "9999px", fontSize: "0.7rem", fontWeight: 800, marginBottom: "0.5rem" }}>
                        <Building2 size={13} /> {b.block}
                      </div>
                      <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.2rem", fontWeight: 800, color: "#1e293b", margin: "0 0 0.35rem 0" }}>
                        {b.name}
                      </h3>
                      <p style={{ fontSize: "0.82rem", color: "#64748b", lineHeight: 1.5, margin: "0 0 1rem 0" }}>
                        {b.desc}
                      </p>

                      <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", background: "#f8fafc", padding: "0.75rem", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "0.78rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ color: "#64748b" }}>Floor / Room:</span>
                          <strong style={{ color: "#1e293b" }}>{b.floor}</strong>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ color: "#64748b" }}>Distance from Gate 1:</span>
                          <strong style={{ color: "#ea580c" }}>{b.distance}</strong>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ color: "#64748b" }}>Wheelchair Accessible:</span>
                          <strong style={{ color: "#16a34a" }}>Yes • Ramp &amp; Elevators</strong>
                        </div>
                      </div>

                      <button
                        onClick={() => setCurrentScreen("checkin")}
                        style={{
                          marginTop: "1rem",
                          width: "100%",
                          padding: "0.65rem 1rem",
                          background: "#ea580c",
                          color: "#ffffff",
                          border: "none",
                          borderRadius: "12px",
                          fontWeight: 800,
                          fontSize: "0.82rem",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.45rem",
                          boxShadow: "0 4px 14px rgba(234, 88, 12, 0.25)",
                        }}
                      >
                        <ShieldCheck size={16} /> Request Host Meeting Here →
                      </button>
                    </div>
                  );
                })()}

                <div style={{ background: "#f0fdf4", border: "1.2px solid rgba(187, 247, 208, 0.8)", borderRadius: "14px", padding: "0.85rem", fontSize: "0.76rem", color: "#15803d", lineHeight: 1.4 }}>
                  <strong>Visitor Wayfinding Tip:</strong> Green Valley campus follows color-coded path markings. Orange trails lead to Admissions &amp; Admin; Teal trails lead to STEM labs.
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          VIEW 2: DEDICATED FULL SCREEN — ADMISSIONS 2026-27
          ======================================================== */}
      {currentScreen === "admissions" && (
        <section className="student-fullscreen-page">
          <div className="student-screen-subnav">
            <button className="student-back-to-dash-btn" onClick={() => setCurrentScreen("dashboard")}>
              <ArrowLeft size={16} /> Back to Dashboard
            </button>

            <div className="student-screen-title-area">
              <div className="student-screen-icon-bubble" style={{ background: "#fff7ed", color: "#ea580c" }}>
                <GraduationCap size={20} />
              </div>
              <div>
                <h2>Admissions 2026-27 Information Desk</h2>
                <p>Fee Schedule, Eligibility Criteria, Enrolment Steps &amp; Prospectus • CBSE Aff. No. 1930421</p>
              </div>
            </div>

            <div className="student-screen-nav-tools">
              <button
                className="student-back-to-dash-btn"
                onClick={() => setCurrentScreen("ask-cbs")}
                style={{ fontSize: "0.74rem", padding: "0.35rem 0.85rem", background: "#ea580c", color: "#ffffff", borderColor: "#ea580c" }}
              >
                <Sparkles size={13} /> Ask Admissions Question
              </button>
            </div>
          </div>

          <div className="student-screen-scroll-body" style={{ padding: "1rem 1.5rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            {/* KPI Summary Strip */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.85rem" }}>
              <div style={{ background: "#ffffff", borderRadius: "14px", border: "1.5px solid rgba(254, 215, 170, 0.7)", padding: "0.85rem", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#64748b" }}>Offered Classes</div>
                <div style={{ fontSize: "1.15rem", fontWeight: 900, color: "#1e293b", marginTop: "2px" }}>Pre-KG to XII</div>
                <div style={{ fontSize: "0.66rem", color: "#16a34a", fontWeight: 700, marginTop: "2px" }}>Science, Comm &amp; Arts</div>
              </div>
              <div style={{ background: "#ffffff", borderRadius: "14px", border: "1.5px solid rgba(254, 215, 170, 0.7)", padding: "0.85rem", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#64748b" }}>Academic Session</div>
                <div style={{ fontSize: "1.15rem", fontWeight: 900, color: "#ea580c", marginTop: "2px" }}>2026 – 2027</div>
                <div style={{ fontSize: "0.66rem", color: "#64748b", fontWeight: 600, marginTop: "2px" }}>Term 1 starts April 2026</div>
              </div>
              <div style={{ background: "#ffffff", borderRadius: "14px", border: "1.5px solid rgba(254, 215, 170, 0.7)", padding: "0.85rem", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#64748b" }}>Student-Teacher Ratio</div>
                <div style={{ fontSize: "1.15rem", fontWeight: 900, color: "#0d9488", marginTop: "2px" }}>18 : 1</div>
                <div style={{ fontSize: "0.66rem", color: "#16a34a", fontWeight: 700, marginTop: "2px" }}>Individual attention</div>
              </div>
              <div style={{ background: "#ffffff", borderRadius: "14px", border: "1.5px solid rgba(254, 215, 170, 0.7)", padding: "0.85rem", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#64748b" }}>Merit Scholarships</div>
                <div style={{ fontSize: "1.15rem", fontWeight: 900, color: "#7c3aed", marginTop: "2px" }}>Up to 50%</div>
                <div style={{ fontSize: "0.66rem", color: "#7c3aed", fontWeight: 700, marginTop: "2px" }}>Academics &amp; Sports</div>
              </div>
            </div>

            {/* Comprehensive Fee Matrix Table */}
            <div style={{ background: "#ffffff", borderRadius: "18px", border: "1.5px solid rgba(254, 215, 170, 0.7)", padding: "1.25rem", boxShadow: "0 4px 18px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem" }}>
                <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.05rem", fontWeight: 800, color: "#1e293b", margin: 0 }}>
                  Annual Fee Matrix (Academic Year 2026-27)
                </h3>
                <span style={{ fontSize: "0.72rem", color: "#64748b" }}>Payable in 3 Term Installments</span>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
                  <thead>
                    <tr style={{ background: "#fff7ed", borderBottom: "1.5px solid rgba(254, 215, 170, 0.8)", textAlign: "left" }}>
                      <th style={{ padding: "0.65rem 0.85rem", color: "#c2410c", fontWeight: 800 }}>Class / Grade</th>
                      <th style={{ padding: "0.65rem 0.85rem", color: "#c2410c", fontWeight: 800 }}>Tuition (Annual)</th>
                      <th style={{ padding: "0.65rem 0.85rem", color: "#c2410c", fontWeight: 800 }}>Activities &amp; Labs</th>
                      <th style={{ padding: "0.65rem 0.85rem", color: "#c2410c", fontWeight: 800 }}>Total Annual Fee</th>
                      <th style={{ padding: "0.65rem 0.85rem", color: "#c2410c", fontWeight: 800 }}>One-Time Admission</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ADMISSION_FEE_CHART.map((row, idx) => (
                      <tr key={row.grade} style={{ borderBottom: "1px solid #f1f5f9", background: idx % 2 === 0 ? "#ffffff" : "#fcfcfd" }}>
                        <td style={{ padding: "0.65rem 0.85rem", fontWeight: 800, color: "#1e293b" }}>{row.grade}</td>
                        <td style={{ padding: "0.65rem 0.85rem", color: "#475569" }}>{row.tuition}</td>
                        <td style={{ padding: "0.65rem 0.85rem", color: "#475569" }}>{row.activity}</td>
                        <td style={{ padding: "0.65rem 0.85rem", fontWeight: 900, color: "#ea580c" }}>{row.termTotal}</td>
                        <td style={{ padding: "0.65rem 0.85rem", color: "#64748b" }}>{row.admissionFee}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 6-Step Admission Journey Flow */}
            <div style={{ background: "#ffffff", borderRadius: "18px", border: "1.5px solid rgba(254, 215, 170, 0.7)", padding: "1.25rem", boxShadow: "0 4px 18px rgba(0,0,0,0.03)" }}>
              <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.05rem", fontWeight: 800, color: "#1e293b", margin: "0 0 1rem 0" }}>
                6-Step Seamless Admission Journey
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.85rem" }}>
                {ADMISSION_ROADMAP.map((item) => (
                  <div key={item.step} style={{ background: "#f8fafc", padding: "0.85rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
                      <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#ea580c", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 900 }}>
                        {item.step}
                      </span>
                      <strong style={{ fontSize: "0.84rem", color: "#1e293b" }}>{item.title}</strong>
                    </div>
                    <p style={{ fontSize: "0.74rem", color: "#64748b", margin: 0, lineHeight: 1.4 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          VIEW 3: DEDICATED FULL SCREEN — VISITOR PASS & CHECK-IN
          ======================================================== */}
      {currentScreen === "checkin" && (
        <section className="student-fullscreen-page">
          <div className="student-screen-subnav">
            <button className="student-back-to-dash-btn" onClick={() => setCurrentScreen("dashboard")}>
              <ArrowLeft size={16} /> Back to Dashboard
            </button>

            <div className="student-screen-title-area">
              <div className="student-screen-icon-bubble" style={{ background: "#fff7ed", color: "#ea580c" }}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <h2>Digital Visitor Badge &amp; Gate Clearance</h2>
                <p>Real-Time Host Notification &amp; Kiosk Check-In Validation</p>
              </div>
            </div>

            <div className="student-screen-nav-tools">
              <button
                className="student-back-to-dash-btn"
                onClick={() => window.print()}
                style={{ fontSize: "0.74rem", padding: "0.35rem 0.85rem" }}
              >
                <Printer size={13} /> Print Badge
              </button>
            </div>
          </div>

          <div className="student-screen-scroll-body" style={{ padding: "1.2rem 1.5rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", alignItems: "start" }}>
              {/* Left: Official Digital Visitor Badge Card */}
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "20px",
                  border: "2px solid rgba(251, 146, 60, 0.45)",
                  boxShadow: "0 12px 32px rgba(234, 88, 12, 0.08)",
                  overflow: "hidden",
                }}
              >
                <div style={{ background: "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)", color: "#ffffff", padding: "1.25rem", textAlign: "center" }}>
                  <div style={{ fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.9 }}>
                    GREEN VALLEY PUBLIC SCHOOL • VISITOR BADGE
                  </div>
                  <div style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.3rem", fontWeight: 900, marginTop: "2px" }}>
                    OFFICIAL GUEST PASS
                  </div>
                </div>

                <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
                  <div style={{ position: "relative" }}>
                    <img
                      src="/admin_avatar.png"
                      alt={visitorSession.visitorName}
                      style={{ width: 84, height: 84, borderRadius: "50%", border: "3px solid #ea580c", objectFit: "cover" }}
                    />
                    <div style={{ position: "absolute", bottom: 0, right: 0, background: "#16a34a", color: "#ffffff", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Check size={14} />
                    </div>
                  </div>

                  <div style={{ textAlign: "center" }}>
                    <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.25rem", fontWeight: 900, color: "#1e293b", margin: 0 }}>
                      {visitorSession.visitorName}
                    </h3>
                    <div style={{ fontSize: "0.8rem", color: "#ea580c", fontWeight: 700, marginTop: "2px" }}>
                      +91 {visitorSession.visitorPhone}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "#64748b", marginTop: "2px" }}>
                      Registered: {currentTime.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}
                    </div>
                  </div>

                  <div style={{ width: "100%", background: "#f8fafc", padding: "0.85rem", borderRadius: "14px", border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#64748b" }}>Pass Number</div>
                      <div style={{ fontSize: "1.05rem", fontWeight: 900, color: "#ea580c" }}>{visitorPassNumber}</div>
                      <div style={{ fontSize: "0.68rem", color: "#16a34a", fontWeight: 700, marginTop: "2px" }}>● Authorized Kiosk Entry</div>
                    </div>
                    <QrCode size={48} style={{ color: "#1e293b" }} />
                  </div>
                </div>
              </div>

              {/* Right: Notify Host Department */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ background: "#ffffff", borderRadius: "20px", border: "1.5px solid rgba(254, 215, 170, 0.7)", padding: "1.25rem", boxShadow: "0 4px 18px rgba(0,0,0,0.03)" }}>
                  <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.1rem", fontWeight: 800, color: "#1e293b", margin: "0 0 0.5rem 0" }}>
                    Notify Host Department
                  </h3>
                  <p style={{ fontSize: "0.78rem", color: "#64748b", lineHeight: 1.4, margin: "0 0 1rem 0" }}>
                    Select the department or staff officer you wish to visit. A simulated instant arrival alert will be dispatched to their desk extension.
                  </p>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {HOST_DEPARTMENTS.map((dept) => {
                      const isSelected = selectedDept === dept.id;
                      return (
                        <div
                          key={dept.id}
                          onClick={() => {
                            setSelectedDept(dept.id);
                            setHostAlertSent(false);
                          }}
                          style={{
                            padding: "0.6rem 0.85rem",
                            borderRadius: "12px",
                            border: isSelected ? "1.5px solid #ea580c" : "1px solid #e2e8f0",
                            background: isSelected ? "#fff7ed" : "#f8fafc",
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div>
                            <div style={{ fontSize: "0.82rem", fontWeight: 800, color: isSelected ? "#ea580c" : "#1e293b" }}>{dept.name}</div>
                            <div style={{ fontSize: "0.7rem", color: "#64748b" }}>{dept.officer}</div>
                          </div>
                          <span style={{ fontSize: "0.7rem", fontWeight: 700, color: isSelected ? "#ea580c" : "#64748b" }}>{dept.ext}</span>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={handleNotifyHost}
                    style={{
                      marginTop: "1rem",
                      width: "100%",
                      padding: "0.7rem",
                      background: hostAlertSent ? "#16a34a" : "#ea580c",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "12px",
                      fontWeight: 800,
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      boxShadow: "0 4px 14px rgba(234, 88, 12, 0.2)",
                    }}
                  >
                    {hostAlertSent ? (
                      <>
                        <CheckCircle2 size={16} /> Host Notified ({hostAlertTimer})
                      </>
                    ) : (
                      <>
                        <Bell size={16} /> Send Host Arrival Alert
                      </>
                    )}
                  </button>

                  {hostAlertSent && (
                    <div style={{ marginTop: "0.75rem", padding: "0.65rem", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "10px", fontSize: "0.74rem", color: "#15803d" }}>
                      <strong>Success:</strong> {HOST_DEPARTMENTS.find((d) => d.id === selectedDept)?.officer} has been paged. Please proceed to the waiting lounge at Reception Desk.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          VIEW 4: DEDICATED FULL SCREEN — CALENDAR & TIMINGS
          ======================================================== */}
      {currentScreen === "calendar" && (
        <section className="student-fullscreen-page">
          <div className="student-screen-subnav">
            <button className="student-back-to-dash-btn" onClick={() => setCurrentScreen("dashboard")}>
              <ArrowLeft size={16} /> Back to Dashboard
            </button>

            <div className="student-screen-title-area">
              <div className="student-screen-icon-bubble" style={{ background: "#fff7ed", color: "#ea580c" }}>
                <Calendar size={20} />
              </div>
              <div>
                <h2>School Calendar &amp; Campus Timings</h2>
                <p>Academic Schedule, Bell Hours &amp; Department Visitor Windows</p>
              </div>
            </div>

            <div className="student-screen-nav-tools">
              <button
                className="student-back-to-dash-btn"
                onClick={() => setCurrentScreen("dashboard")}
                style={{ fontSize: "0.74rem", padding: "0.35rem 0.85rem" }}
              >
                Return to Overview
              </button>
            </div>
          </div>

          <div className="student-screen-scroll-body" style={{ padding: "1rem 1.5rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            <div style={{ background: "#ffffff", borderRadius: "18px", border: "1.5px solid rgba(254, 215, 170, 0.7)", padding: "1.25rem", boxShadow: "0 4px 18px rgba(0,0,0,0.03)" }}>
              <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.05rem", fontWeight: 800, color: "#1e293b", margin: "0 0 0.85rem 0" }}>
                Daily School Hours &amp; Working Timings
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.85rem" }}>
                {SCHOOL_TIMINGS_TABLE.map((row) => (
                  <div key={row.group} style={{ background: "#f8fafc", padding: "0.85rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                    <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#1e293b" }}>{row.group}</div>
                    <div style={{ fontSize: "0.95rem", fontWeight: 900, color: "#ea580c", marginTop: "3px" }}>{row.hours}</div>
                    <div style={{ fontSize: "0.7rem", color: "#64748b", marginTop: "2px" }}>{row.days}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Academic Holidays 2026-27 */}
            <div style={{ background: "#ffffff", borderRadius: "18px", border: "1.5px solid rgba(254, 215, 170, 0.7)", padding: "1.25rem", boxShadow: "0 4px 18px rgba(0,0,0,0.03)" }}>
              <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.05rem", fontWeight: 800, color: "#1e293b", margin: "0 0 0.85rem 0" }}>
                Upcoming Term Breaks &amp; Important Dates
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem" }}>
                {[
                  { name: "Diwali & Mid-Term Break", date: "29 Oct – 03 Nov 2026", type: "Gazetted Holiday" },
                  { name: "Children's Day & Sports Expo", date: "14 Nov 2026", type: "School Function" },
                  { name: "Term 1 Final Assessments", date: "08 Dec – 19 Dec 2026", type: "Examinations" },
                  { name: "Winter Vacation", date: "24 Dec 2026 – 04 Jan 2027", type: "School Closed" },
                ].map((item) => (
                  <div key={item.name} style={{ background: "#fff7ed", padding: "0.75rem", borderRadius: "12px", border: "1px solid rgba(254, 215, 170, 0.8)" }}>
                    <div style={{ fontSize: "0.66rem", fontWeight: 800, color: "#c2410c", textTransform: "uppercase" }}>{item.type}</div>
                    <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#1e293b", marginTop: "2px" }}>{item.name}</div>
                    <div style={{ fontSize: "0.74rem", fontWeight: 700, color: "#ea580c", marginTop: "3px" }}>{item.date}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          VIEW 5: DEDICATED FULL SCREEN — EVENTS & CAMPUS GALLERY
          ======================================================== */}
      {currentScreen === "events" && (
        <section className="student-fullscreen-page">
          <div className="student-screen-subnav">
            <button className="student-back-to-dash-btn" onClick={() => setCurrentScreen("dashboard")}>
              <ArrowLeft size={16} /> Back to Dashboard
            </button>

            <div className="student-screen-title-area">
              <div className="student-screen-icon-bubble" style={{ background: "#fff7ed", color: "#ea580c" }}>
                <Award size={20} />
              </div>
              <div>
                <h2>School Events &amp; Campus Facility Gallery</h2>
                <p>Academic Symposia, Sports Championships &amp; World-Class Infrastructure</p>
              </div>
            </div>

            <div className="student-screen-nav-tools">
              <button
                className="student-back-to-dash-btn"
                onClick={() => setCurrentScreen("dashboard")}
                style={{ fontSize: "0.74rem", padding: "0.35rem 0.85rem" }}
              >
                Back to Kiosk
              </button>
            </div>
          </div>

          <div className="student-screen-scroll-body" style={{ padding: "1rem 1.5rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            {/* Upcoming Events */}
            <div style={{ background: "#ffffff", borderRadius: "18px", border: "1.5px solid rgba(254, 215, 170, 0.7)", padding: "1.25rem", boxShadow: "0 4px 18px rgba(0,0,0,0.03)" }}>
              <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.05rem", fontWeight: 800, color: "#1e293b", margin: "0 0 0.85rem 0" }}>
                Upcoming Campus Events &amp; Exhibitions
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.85rem" }}>
                {UPCOMING_EVENTS.map((ev) => (
                  <div key={ev.id} style={{ background: "#f8fafc", padding: "1rem", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                      <span style={{ background: "#fff7ed", color: "#c2410c", border: "1px solid rgba(251, 146, 60, 0.4)", fontSize: "0.68rem", fontWeight: 800, padding: "0.15rem 0.55rem", borderRadius: "9999px" }}>
                        {ev.type}
                      </span>
                      <span style={{ fontSize: "0.74rem", fontWeight: 800, color: "#ea580c" }}>{ev.date}</span>
                    </div>
                    <h4 style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.95rem", fontWeight: 800, color: "#1e293b", margin: "0 0 0.25rem 0" }}>
                      {ev.title}
                    </h4>
                    <p style={{ fontSize: "0.75rem", color: "#64748b", margin: "0 0 0.5rem 0", lineHeight: 1.4 }}>{ev.desc}</p>
                    <div style={{ fontSize: "0.7rem", color: "#475569", fontWeight: 600 }}>
                      📍 {ev.venue} • 🕒 {ev.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Campus Photo Gallery */}
            <div style={{ background: "#ffffff", borderRadius: "18px", border: "1.5px solid rgba(254, 215, 170, 0.7)", padding: "1.25rem", boxShadow: "0 4px 18px rgba(0,0,0,0.03)" }}>
              <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.05rem", fontWeight: 800, color: "#1e293b", margin: "0 0 0.85rem 0" }}>
                Campus Infrastructure &amp; Learning Pavilion
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.85rem" }}>
                {CAMPUS_GALLERY.map((gal) => (
                  <div key={gal.title} style={{ background: "#f8fafc", borderRadius: "14px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
                    <div style={{ height: "70px", background: `linear-gradient(135deg, ${gal.color}22, ${gal.color}44)`, display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid #e2e8f0" }}>
                      <Building2 size={28} style={{ color: gal.color }} />
                    </div>
                    <div style={{ padding: "0.85rem" }}>
                      <span style={{ fontSize: "0.66rem", fontWeight: 800, color: gal.color, textTransform: "uppercase" }}>{gal.tag}</span>
                      <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "#1e293b", marginTop: "2px" }}>{gal.title}</div>
                      <p style={{ fontSize: "0.72rem", color: "#64748b", margin: "0.25rem 0 0 0", lineHeight: 1.35 }}>{gal.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          VIEW 6: DEDICATED FULL SCREEN — ASK CBS AI HELPDESK
          ======================================================== */}
      {currentScreen === "ask-cbs" && (
        <section className="student-fullscreen-page">
          <div className="student-screen-subnav">
            <button className="student-back-to-dash-btn" onClick={() => setCurrentScreen("dashboard")}>
              <ArrowLeft size={16} /> Back to Dashboard
            </button>

            <div className="student-screen-title-area">
              <div className="student-screen-icon-bubble" style={{ background: "#fff7ed", color: "#ea580c" }}>
                <Sparkles size={20} />
              </div>
              <div>
                <h2>Ask CBS — Campus AI Helpdesk</h2>
                <p>Instant Answers on Admissions, Fees, Campus Navigation &amp; Visiting Hours</p>
              </div>
            </div>

            <div className="student-screen-nav-tools">
              <button
                className="student-back-to-dash-btn"
                onClick={() => setChatMessages([chatMessages[0]])}
                style={{ fontSize: "0.74rem", padding: "0.35rem 0.85rem" }}
              >
                <RefreshCw size={13} /> Reset Chat
              </button>
            </div>
          </div>

          <div className="student-screen-scroll-body" style={{ padding: "1rem 1.5rem", overflowY: "auto", display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "1.2rem", alignItems: "start" }}>
            {/* Left: Quick FAQs */}
            <div style={{ background: "#ffffff", borderRadius: "18px", border: "1.5px solid rgba(254, 215, 170, 0.7)", padding: "1.25rem", boxShadow: "0 4px 18px rgba(0,0,0,0.03)" }}>
              <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.05rem", fontWeight: 800, color: "#1e293b", margin: "0 0 0.5rem 0" }}>
                Frequently Asked Visitor Queries
              </h3>
              <p style={{ fontSize: "0.75rem", color: "#64748b", margin: "0 0 1rem 0" }}>
                Click any question below to immediately ask the CBS AI assistant:
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {CBS_FAQS.map((faq) => (
                  <button
                    key={faq.q}
                    onClick={() => handleSendChat(faq.q)}
                    style={{
                      padding: "0.65rem 0.85rem",
                      borderRadius: "12px",
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      textAlign: "left",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      color: "#1e293b",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "0.5rem",
                      transition: "all 0.2s",
                    }}
                  >
                    <span>{faq.q}</span>
                    <ArrowRight size={13} style={{ color: "#ea580c", flexShrink: 0 }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Interactive Chat Console */}
            <div style={{ background: "#ffffff", borderRadius: "18px", border: "1.5px solid rgba(254, 215, 170, 0.7)", boxShadow: "0 4px 18px rgba(0,0,0,0.03)", display: "flex", flexDirection: "column", height: "520px", overflow: "hidden" }}>
              <div style={{ padding: "0.85rem 1.25rem", background: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)", borderBottom: "1px solid rgba(254, 215, 170, 0.8)", display: "flex", alignItems: "center", gap: "0.65rem" }}>
                <img src="/ai_robot.png" alt="CBS" style={{ width: 34, height: 34, objectFit: "contain" }} />
                <div>
                  <div style={{ fontSize: "0.88rem", fontWeight: 800, color: "#1e293b" }}>CBS Campus AI Assistant</div>
                  <div style={{ fontSize: "0.68rem", color: "#16a34a", fontWeight: 700 }}>● Online • Ready to answer</div>
                </div>
              </div>

              {/* Chat Messages */}
              <div style={{ flex: 1, padding: "1rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    style={{
                      alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                      maxWidth: "85%",
                      background: msg.sender === "user" ? "#ea580c" : "#f1f5f9",
                      color: msg.sender === "user" ? "#ffffff" : "#1e293b",
                      padding: "0.65rem 0.95rem",
                      borderRadius: msg.sender === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                      fontSize: "0.8rem",
                      lineHeight: 1.45,
                    }}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div style={{ padding: "0.75rem 1rem", borderTop: "1px solid #e2e8f0", background: "#ffffff", display: "flex", gap: "0.5rem" }}>
                <input
                  type="text"
                  placeholder="Ask CBS about fees, timings, admissions, or directions..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendChat(chatInput)}
                  style={{
                    flex: 1,
                    background: "#f8fafc",
                    border: "1px solid #cbd5e1",
                    borderRadius: "9999px",
                    padding: "0.5rem 1rem",
                    fontSize: "0.82rem",
                    outline: "none",
                  }}
                />
                <button
                  onClick={() => handleSendChat(chatInput)}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    background: "#ea580c",
                    color: "#ffffff",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(234, 88, 12, 0.3)",
                  }}
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
