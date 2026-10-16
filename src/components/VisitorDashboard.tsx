"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Calendar,
  Users,
  BookOpen,
  Camera,
  MessageSquare,
  Navigation,
  Clock,
  CheckCircle,
  User,
  Phone,
  Building2,
  FileText,
  Star,
  ChevronRight,
  X,
  Home,
  Shield,
  Bell,
  Printer,
  Info,
  GraduationCap,
  Leaf,
} from "lucide-react";

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
interface VisitorInfo {
  visitorName: string;
  visitorPhone: string;
  visitTime: string;
}

type ActiveCard =
  | null
  | "plan"
  | "checkin"
  | "admissions"
  | "map"
  | "events"
  | "ask";

/* ─────────────────────────────────────────────
   SAMPLE DATA
───────────────────────────────────────────── */
const VISIT_PURPOSES = [
  { id: "admission", label: "Admission Enquiry", icon: "🎓", dept: "Admissions Office – Block A, Ground Floor", time: "9:00 AM – 3:00 PM" },
  { id: "meetstaff", label: "Meet a Teacher / Staff", icon: "👩‍🏫", dept: "Staff Room – Block B, First Floor", time: "10:00 AM – 12:00 PM" },
  { id: "principal", label: "Principal's Office", icon: "🏛️", dept: "Principal's Office – Admin Block", time: "10:30 AM – 1:00 PM (by appointment)" },
  { id: "event", label: "Attend School Event", icon: "🎪", dept: "Auditorium / Sports Ground", time: "As per event schedule" },
  { id: "collect", label: "Collect Documents / TC", icon: "📄", dept: "Examination Cell – Block A, Room 102", time: "9:00 AM – 2:00 PM" },
  { id: "other", label: "General Enquiry", icon: "ℹ️", dept: "Reception – Main Entrance", time: "8:00 AM – 4:00 PM" },
];

const DEPARTMENTS = [
  { id: "reception", name: "Reception / Front Office", person: "Mrs. Anita Verma", ext: "101" },
  { id: "admission", name: "Admissions Office", person: "Mr. Suresh Pillai", ext: "102" },
  { id: "principal", name: "Principal's Office", person: "Dr. Kavitha Iyer", ext: "103" },
  { id: "accounts", name: "Accounts & Finance", person: "Mr. Rajiv Menon", ext: "104" },
  { id: "transport", name: "Transport Department", person: "Mr. Deepak Yadav", ext: "105" },
  { id: "library", name: "School Library", person: "Ms. Sunita Nair", ext: "106" },
  { id: "sports", name: "Sports Department", person: "Mr. Ranjit Singh", ext: "107" },
];

const ADMISSION_STEPS = [
  { step: 1, title: "Pick Up Prospectus", desc: "Collect the school prospectus and fee structure from the Admissions Office (Block A, Ground Floor). Prospectus price: Rs. 250.", icon: "📋" },
  { step: 2, title: "Fill Application Form", desc: "Complete the online / offline application form with student and parent details. Forms available at Reception or on the school website.", icon: "📝" },
  { step: 3, title: "Submit Documents", desc: "Attach self-attested copies of: Birth Certificate, Aadhaar Card, Transfer Certificate (if applicable), Passport-size photographs (4 nos.), and Previous report card.", icon: "📂" },
  { step: 4, title: "Entrance Assessment", desc: "Classes IV and above require a written assessment in English, Mathematics, and General Awareness. Assessment dates will be communicated on application.", icon: "✏️" },
  { step: 5, title: "Interview & Confirmation", desc: "Parent and student interaction with the Principal or Vice-Principal. Confirmation of seat and intimation of fee payment due date.", icon: "🤝" },
  { step: 6, title: "Fee Payment & Enrolment", desc: "Pay the first term fee via cash / DD / online transfer. Collect the school ID card, almanac, and uniform list from the school store.", icon: "✅" },
];

const REQUIRED_DOCS = [
  "Original Birth Certificate + 1 Self-attested copy",
  "Aadhaar Card (student) + Parent Aadhaar copy",
  "Transfer Certificate (TC) from previous school (if applicable)",
  "Report Card / Marksheet of the last class attended",
  "4 Passport-size photographs (white background)",
  "Residential Proof (Electricity bill / Rent agreement)",
  "Caste / Category Certificate (if applicable for concession)",
];

const ELIGIBILITY = [
  { cls: "Nursery (Pre-KG)", age: "3 years as on 31st March of academic year" },
  { cls: "LKG", age: "4 years as on 31st March of academic year" },
  { cls: "UKG", age: "5 years as on 31st March of academic year" },
  { cls: "Class I", age: "6 years as on 31st March of academic year" },
  { cls: "Class II – V", age: "Age appropriate + Assessment test" },
  { cls: "Class VI – X", age: "Age appropriate + Assessment + Interview" },
];

const CAMPUS_LOCATIONS = [
  { id: "reception", name: "Main Reception", desc: "Main entrance gate, visitor registration, info desk", color: "#0284c7", icon: "🏢", x: 20, y: 15 },
  { id: "admissions", name: "Admissions Office", desc: "Block A, Ground Floor – Applications & enquiries", color: "#16a34a", icon: "🎓", x: 35, y: 30 },
  { id: "principal", name: "Principal's Office", desc: "Admin Block, First Floor – By appointment", color: "#7c3aed", icon: "🏛️", x: 55, y: 20 },
  { id: "classrooms", name: "Academic Block (A & B)", desc: "Classes Nursery to XII – Three floors", color: "#0d9488", icon: "📚", x: 45, y: 50 },
  { id: "library", name: "Central Library", desc: "15,000+ books, digital reading zone, e-resources", color: "#ea580c", icon: "📖", x: 70, y: 35 },
  { id: "auditorium", name: "Auditorium", desc: "700-seat capacity – Events, competitions, assemblies", color: "#db2777", icon: "🎭", x: 75, y: 60 },
  { id: "sports", name: "Sports Ground", desc: "Cricket pitch, football field, basketball & volleyball courts", color: "#65a30d", icon: "⚽", x: 30, y: 75 },
  { id: "labs", name: "Science & Computer Labs", desc: "Modern STEM labs, robotics zone, 3D printing lab", color: "#d97706", icon: "🔬", x: 60, y: 72 },
];

const EVENTS = [
  {
    id: 1,
    title: "Open House & Campus Tour",
    date: "Saturday, 25 October 2026",
    time: "9:00 AM – 1:00 PM",
    venue: "Main Auditorium & All Blocks",
    type: "Open Day",
    tag: "Upcoming",
    desc: "Explore classrooms, labs, library, and sports facilities. Meet teachers and senior students. Admissions desk open.",
    color: "#0284c7",
  },
  {
    id: 2,
    title: "Annual Science Exhibition 2026",
    date: "Friday, 14 November 2026",
    time: "10:00 AM – 4:00 PM",
    venue: "Science Block & School Foyer",
    type: "Exhibition",
    tag: "Upcoming",
    desc: "150+ student projects in Physics, Chemistry, Biology, and Technology. Open to parents and community visitors.",
    color: "#16a34a",
  },
  {
    id: 3,
    title: "Green Valley Cultural Fest 'Tarang 2026'",
    date: "Saturday, 22 November 2026",
    time: "4:00 PM – 8:00 PM",
    venue: "School Auditorium",
    type: "Cultural Fest",
    tag: "Upcoming",
    desc: "Dance, drama, music, poetry, and fine arts by students. Showcase of inter-house competition winners.",
    color: "#7c3aed",
  },
  {
    id: 4,
    title: "Sports Day & Annual Athletic Meet",
    date: "Saturday, 06 December 2026",
    time: "8:00 AM – 1:00 PM",
    venue: "School Sports Ground",
    type: "Sports",
    tag: "Upcoming",
    desc: "Track & field events, team sports final, prize distribution by Chief Guest. Parents are warmly invited.",
    color: "#ea580c",
  },
  {
    id: 5,
    title: "Grandparents Day Celebration",
    date: "Saturday, 27 September 2026",
    time: "10:00 AM – 12:30 PM",
    venue: "School Auditorium & Garden",
    type: "Special Event",
    tag: "Past",
    desc: "Special performances and activities dedicated to grandparents. Tea and refreshments provided.",
    color: "#d97706",
  },
];

const GALLERY_ITEMS = [
  { id: 1, title: "Science Lab Session", desc: "Students conducting chemistry experiments in the modern STEM lab", emoji: "🔬", bg: "#dbeafe" },
  { id: 2, title: "Annual Sports Day", desc: "Relay race finals — Senior Boys Category, 2025-26", emoji: "🏅", bg: "#dcfce7" },
  { id: 3, title: "Library Reading Hour", desc: "Students exploring the digital reading zone in Central Library", emoji: "📚", bg: "#fef3c7" },
  { id: 4, title: "Cultural Programme", desc: "Classical dance performance at Tarang 2025 Annual Fest", emoji: "🎭", bg: "#fce7f3" },
  { id: 5, title: "Robotics Workshop", desc: "Students building autonomous bots at the Robotics Club", emoji: "🤖", bg: "#ede9fe" },
  { id: 6, title: "Tree Plantation Drive", desc: "Eco-club members planting saplings on Earth Day 2026", emoji: "🌱", bg: "#d1fae5" },
];

const CBS_FAQS = [
  {
    id: "fee",
    question: "What is the fee structure for 2026-27?",
    answer: "The annual fee for Green Valley Public School ranges from Rs. 45,000 (Nursery) to Rs. 78,000 (Classes IX-XII). This includes tuition, exam, library, and activity fees. Transport fee is charged separately based on route. Please collect the detailed prospectus from the Admissions Office for a complete breakdown.",
  },
  {
    id: "timing",
    question: "What are the school timings?",
    answer: "School timings are Monday to Friday: 7:45 AM – 2:30 PM. Saturday (alternate): 7:45 AM – 12:30 PM. Office hours: 8:00 AM – 4:00 PM (Monday to Saturday). The school remains closed on all gazetted public holidays.",
  },
  {
    id: "affiliation",
    question: "Is the school CBSE affiliated?",
    answer: "Yes. Green Valley Public School is affiliated to the Central Board of Secondary Education (CBSE), New Delhi. Affiliation No. 1930421. The school offers classes from Nursery to Class XII with Science, Commerce, and Humanities streams available from Class XI.",
  },
  {
    id: "transport",
    question: "Does the school provide transport?",
    answer: "Yes. The school operates a fleet of GPS-tracked buses covering 28 routes across the city and surrounding areas. The transport fee ranges from Rs. 8,000 to Rs. 14,000 per annum depending on the route. Contact the Transport Department at Ext. 105 for the complete route list.",
  },
  {
    id: "hostel",
    question: "Is hostel / boarding facility available?",
    answer: "Currently, the school does not have a residential hostel facility. However, we can help families connect with trusted nearby PG accommodations for outstation students. Please speak to the Reception for referral contacts.",
  },
  {
    id: "admission_date",
    question: "When do admissions open for 2026-27?",
    answer: "Admissions for the academic year 2026-27 are currently open for limited seats in Classes Nursery to VIII. Classes IX-XII admissions are subject to vacancy based on board result performance. Please visit the Admissions Office or call Ext. 102 for current seat availability.",
  },
];

/* ─────────────────────────────────────────────
   FEATURE CARDS CONFIG
───────────────────────────────────────────── */
const FEATURE_CARDS = [
  {
    id: "plan" as ActiveCard,
    title: "Plan My Visit",
    desc: "Select your visit purpose and get step-by-step campus directions",
    icon: <Navigation size={26} />,
    iconBg: "#dbeafe",
    iconColor: "#0284c7",
    accent: "#0284c7",
    tag: "Directions",
    tagBg: "#eff6ff",
    tagColor: "#1d4ed8",
  },
  {
    id: "checkin" as ActiveCard,
    title: "Visitor Check-In",
    desc: "Register your visit, get a sample pass, and view mock host notification",
    icon: <Shield size={26} />,
    iconBg: "#ccfbf1",
    iconColor: "#0d9488",
    accent: "#0d9488",
    tag: "Kiosk Self Check-In",
    tagBg: "#f0fdfa",
    tagColor: "#0f766e",
  },
  {
    id: "admissions" as ActiveCard,
    title: "Admissions",
    desc: "Explore 2026-27 admission steps, documents, eligibility and sample enquiry",
    icon: <GraduationCap size={26} />,
    iconBg: "#dcfce7",
    iconColor: "#16a34a",
    accent: "#16a34a",
    tag: "2026-27 Open",
    tagBg: "#f0fdf4",
    tagColor: "#15803d",
  },
  {
    id: "map" as ActiveCard,
    title: "Campus Map",
    desc: "Interactive campus layout with all key locations and departments",
    icon: <MapPin size={26} />,
    iconBg: "#ede9fe",
    iconColor: "#7c3aed",
    accent: "#7c3aed",
    tag: "40 Acres",
    tagBg: "#faf5ff",
    tagColor: "#6d28d9",
  },
  {
    id: "events" as ActiveCard,
    title: "Events & Gallery",
    desc: "Upcoming open houses, school events and campus photo gallery",
    icon: <Calendar size={26} />,
    iconBg: "#ffedd5",
    iconColor: "#ea580c",
    accent: "#ea580c",
    tag: "Open House: Oct 25",
    tagBg: "#fff7ed",
    tagColor: "#c2410c",
  },
  {
    id: "ask" as ActiveCard,
    title: "Ask CBS",
    desc: "Get instant answers to common visitor & admission questions",
    icon: <MessageSquare size={26} />,
    iconBg: "#fce7f3",
    iconColor: "#db2777",
    accent: "#db2777",
    tag: "Helpdesk",
    tagBg: "#fdf2f8",
    tagColor: "#9d174d",
  },
];

/* ─────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────── */
function FeatureCard({ card, onClick }: { card: typeof FEATURE_CARDS[0]; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#ffffff",
        borderRadius: "16px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        cursor: "pointer",
        transition: "all 0.22s ease",
        textAlign: "left",
        outline: "none",
        position: "relative",
        overflow: "hidden",
        border: hovered ? `2px solid ${card.accent}` : "2px solid #e2e8f0",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered ? `0 12px 32px ${card.accent}22` : "0 2px 8px rgba(0,0,0,0.04)",
      }}
      aria-label={card.title}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ width: "50px", height: "50px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", background: card.iconBg, color: card.iconColor }}>
          {card.icon}
        </div>
        <div style={{ fontSize: "0.68rem", fontWeight: 800, padding: "3px 10px", borderRadius: "9999px", background: card.tagBg, color: card.tagColor, letterSpacing: "0.04em" }}>
          {card.tag}
        </div>
      </div>
      <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.05rem", fontWeight: 900, margin: 0, lineHeight: 1.2, color: card.accent }}>{card.title}</h2>
      <p style={{ fontSize: "0.78rem", color: "#64748b", lineHeight: 1.45, margin: 0, flex: 1 }}>{card.desc}</p>
      <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px", color: card.accent }}>
        <span style={{ fontSize: "0.8rem", fontWeight: 700 }}>Explore</span>
        <ChevronRight size={16} />
      </div>
    </button>
  );
}

function DetailView({
  title,
  onBack,
  icon,
  accentColor,
  children,
}: {
  title: string;
  onBack: () => void;
  icon: React.ReactNode;
  accentColor: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", flex: 1, minHeight: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
        <button
          onClick={onBack}
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            background: "#f1f5f9", border: "1.5px solid #e2e8f0", borderRadius: "9999px",
            padding: "7px 14px", fontSize: "0.84rem", fontWeight: 700, color: "#334155", cursor: "pointer",
          }}
          aria-label="Back to dashboard"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "42px", height: "42px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", border: `2px solid ${accentColor}40`, color: accentColor }}>
            {icon}
          </div>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.25rem", fontWeight: 900, margin: 0, color: accentColor }}>{title}</h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.72rem", fontWeight: 700, color: "#64748b", background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: "9999px", padding: "4px 10px", marginLeft: "auto" }}>
          <Shield size={11} />
          <span>Static Demo</span>
        </div>
      </div>
      <div style={{
        background: "#ffffff", borderRadius: "16px", border: "1.5px solid #e2e8f0",
        padding: "20px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column",
        gap: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
      }}>
        {children}
      </div>
    </div>
  );
}

function FormField({ label, id, required, error, icon, children }: {
  label: string; id: string; required?: boolean; error?: string; icon?: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <label htmlFor={id} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "0.82rem", fontWeight: 700, color: "#334155" }}>
        {icon}{label}{required && <span style={{ color: "#ef4444" }}>*</span>}
      </label>
      {children}
      {error && <span style={{ fontSize: "0.74rem", color: "#ef4444", fontWeight: 600 }}>{error}</span>}
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function VisitorDashboard({ onBackToKiosk }: { onBackToKiosk: () => void }) {
  const [visitorInfo, setVisitorInfo] = useState<VisitorInfo | null>(null);
  const [activeCard, setActiveCard] = useState<ActiveCard>(null);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  // Plan My Visit state
  const [selectedPurpose, setSelectedPurpose] = useState<string | null>(null);

  // Check-In state
  const [ciName, setCiName] = useState("");
  const [ciPhone, setCiPhone] = useState("");
  const [ciAddress, setCiAddress] = useState("");
  const [ciDept, setCiDept] = useState("");
  const [ciPassGenerated, setCiPassGenerated] = useState(false);
  const [ciErrors, setCiErrors] = useState<Record<string, string>>({});
  const [visitorPassNumber] = useState(
    `GVPS-VP-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000)).padStart(4, "0")}`
  );

  // Ask CBS state
  const [askSelected, setAskSelected] = useState<string | null>(null);
  const [askCustom, setAskCustom] = useState("");
  const [askResponse, setAskResponse] = useState<string | null>(null);

  // Campus map tooltip
  const [mapHover, setMapHover] = useState<string | null>(null);

  // Admissions tab
  const [admTab, setAdmTab] = useState<"steps" | "docs" | "eligibility" | "enquiry">("steps");

  useEffect(() => {
    setCurrentTime(new Date());
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("gvps_visitor_session");
      if (raw) {
        const parsed = JSON.parse(raw) as VisitorInfo;
        setVisitorInfo(parsed);
        setCiName(parsed.visitorName || "");
        setCiPhone(parsed.visitorPhone || "");
      }
    } catch {}
  }, []);

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-IN", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });

  const handleCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!ciName.trim() || ciName.trim().length < 2) errs.name = "Enter your full name.";
    if (!/^[6-9]\d{9}$/.test(ciPhone.trim())) errs.phone = "Enter a valid 10-digit mobile number.";
    if (!ciAddress.trim()) errs.address = "Enter your address.";
    if (!ciDept) errs.dept = "Select the department or person to meet.";
    setCiErrors(errs);
    if (Object.keys(errs).length === 0) setCiPassGenerated(true);
  };

  const handleAskSubmit = () => {
    if (askSelected) {
      const faq = CBS_FAQS.find((f) => f.id === askSelected);
      setAskResponse(faq?.answer || "");
    } else if (askCustom.trim().length >= 5) {
      setAskResponse(
        "Thank you for your enquiry! Our Admissions Counsellor will provide a detailed answer during your visit. Please approach the Admissions Office (Block A, Ground Floor) or call us at +91-80-4567-8901 (Ext. 102). We are available Monday to Saturday, 9:00 AM – 3:00 PM."
      );
    } else {
      setAskResponse(null);
    }
  };

  const goBack = () => {
    setActiveCard(null);
    setSelectedPurpose(null);
    setCiPassGenerated(false);
    setCiErrors({});
    setAskSelected(null);
    setAskCustom("");
    setAskResponse(null);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", height: "42px", background: "#ffffff", border: "1.5px solid #cbd5e1",
    borderRadius: "9px", padding: "0 14px", fontSize: "0.9rem", fontWeight: 600,
    color: "#0f172a", outline: "none", boxSizing: "border-box", fontFamily: "inherit",
  };

  const primaryBtnStyle: React.CSSProperties = {
    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
    height: "46px", borderRadius: "9999px", border: "none", color: "#ffffff",
    fontFamily: "'Outfit', sans-serif", fontSize: "0.95rem", fontWeight: 800,
    cursor: "pointer", transition: "all 0.2s", width: "100%",
  };

  const demoBadgeStyle: React.CSSProperties = {
    display: "flex", alignItems: "center", gap: "4px", fontSize: "0.72rem",
    fontWeight: 700, color: "#64748b", background: "#f1f5f9",
    border: "1px solid #e2e8f0", borderRadius: "9999px", padding: "4px 10px",
  };

  const noteStyle: React.CSSProperties = {
    display: "flex", alignItems: "flex-start", gap: "6px", fontSize: "0.76rem",
    color: "#64748b", lineHeight: 1.4, background: "#f8fafc",
    border: "1px solid #e2e8f0", borderRadius: "8px", padding: "8px 10px",
  };

  return (
    <div style={{ position: "relative", width: "100%", minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif", background: "#f7f8fa", overflow: "hidden" }}>
      {/* Dotted pattern overlay */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, #1e293b12 1px, transparent 1px)", backgroundSize: "24px 24px", pointerEvents: "none", zIndex: 0 }} aria-hidden="true" />

      {/* ── NAVBAR ── */}
      <nav style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 28px", background: "rgba(255,255,255,0.96)", backdropFilter: "blur(16px)", borderBottom: "1.5px solid #e2e8f0", boxShadow: "0 1px 8px rgba(0,0,0,0.04)", flexShrink: 0, gap: "12px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0fdf4", borderRadius: "10px", border: "1.5px solid #d1fae5" }}>
            <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
              <path d="M24 7C28 11 34 13 38 10C38 18 31 23 24 24C17 23 10 18 10 10C14 13 20 11 24 7Z" fill="#10b981" />
              <path d="M24 24V11" stroke="#059669" strokeWidth="2.8" strokeLinecap="round" />
              <path d="M5 36C12 31.5 18 32.5 24 37C30 32.5 36 31.5 43 36V18C36 13.5 30 14.5 24 19C18 14.5 12 13.5 5 18V36Z" fill="#0369a1" />
              <path d="M24 19V37" stroke="#ffffff" strokeWidth="2.8" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.1rem", fontWeight: 800, color: "#0c3558", lineHeight: 1.1 }}>Green Valley Public School</div>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#059669", letterSpacing: "0.04em", marginTop: "1px" }}>Visitor Dashboard • Interactive Kiosk Demo</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "9999px", padding: "5px 14px", flexWrap: "wrap" }}>
          {currentTime && (
            <>
              <Clock size={14} style={{ color: "#059669" }} />
              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#1e293b" }}>{formatTime(currentTime)}</span>
              <span style={{ color: "#cbd5e1" }}>•</span>
              <Calendar size={14} style={{ color: "#0284c7" }} />
              <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#475569" }}>{formatDate(currentTime)}</span>
            </>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          {visitorInfo && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#f0fdf4", border: "1.5px solid #d1fae5", borderRadius: "9999px", padding: "5px 14px 5px 5px" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg, #0d9488, #059669)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <User size={15} color="#ffffff" />
              </div>
              <div>
                <div style={{ fontSize: "0.8rem", fontWeight: 800, color: "#0c3558", lineHeight: 1.1 }}>{visitorInfo.visitorName}</div>
                <div style={{ fontSize: "0.68rem", color: "#64748b", fontWeight: 600 }}>Guest Visitor</div>
              </div>
            </div>
          )}
          <div style={demoBadgeStyle}><Shield size={12} /><span>Static Demo</span></div>
          <button
            onClick={onBackToKiosk}
            style={{ display: "flex", alignItems: "center", gap: "6px", background: "#0c3558", color: "#ffffff", border: "none", borderRadius: "9999px", padding: "7px 16px", fontSize: "0.84rem", fontWeight: 700, cursor: "pointer", boxShadow: "0 3px 10px rgba(12,53,88,0.18)" }}
            aria-label="Back to Kiosk Home"
          >
            <Home size={15} /><span>Back to Kiosk</span>
          </button>
        </div>
      </nav>

      {/* ── MAIN CONTENT ── */}
      <main style={{ position: "relative", zIndex: 5, flex: 1, padding: "20px 28px", display: "flex", flexDirection: "column", gap: "20px", overflowY: "auto", minHeight: 0 }}>
        {activeCard === null && (
          <>
            {/* Welcome Banner */}
            <div style={{ display: "flex", alignItems: "stretch", justifyContent: "space-between", gap: "16px", background: "linear-gradient(135deg, #0c3558 0%, #0369a1 60%, #059669 100%)", borderRadius: "18px", padding: "22px 28px", color: "#ffffff", flexWrap: "wrap" }}>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px", minWidth: "260px" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: "9999px", padding: "4px 12px", fontSize: "0.75rem", fontWeight: 700, color: "#d1fae5", width: "fit-content" }}>
                  <Leaf size={14} /><span>Welcome to Green Valley Public School</span>
                </div>
                <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 900, color: "#ffffff", margin: 0, lineHeight: 1.2 }}>
                  Hello, <span style={{ color: "#6ee7b7" }}>{visitorInfo?.visitorName || "Valued Visitor"}</span>! 👋
                </h1>
                <p style={{ fontSize: "0.84rem", color: "rgba(255,255,255,0.82)", lineHeight: 1.5, margin: 0, maxWidth: "500px" }}>
                  Explore our campus, check in, enquire about admissions, and discover events — all from this interactive kiosk.
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {[{ label: "Established", value: "1992" }, { label: "Campus Area", value: "40 Acres" }, { label: "Students", value: "3,200+" }, { label: "Faculty", value: "180+" }].map((s) => (
                    <div key={s.label} style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "12px", padding: "10px 16px", textAlign: "center", minWidth: "70px" }}>
                      <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.15rem", fontWeight: 900, color: "#fbbf24", lineHeight: 1 }}>{s.value}</div>
                      <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.75)", fontWeight: 700, marginTop: "3px" }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Feature Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
              {FEATURE_CARDS.map((card) => (
                <FeatureCard key={String(card.id)} card={card} onClick={() => setActiveCard(card.id)} />
              ))}
            </div>
          </>
        )}

        {/* ─── PLAN MY VISIT ─── */}
        {activeCard === "plan" && (
          <DetailView title="Plan My Visit" onBack={goBack} icon={<Navigation size={22} color="#0284c7" />} accentColor="#0284c7">
            <p style={{ fontSize: "0.86rem", color: "#475569", lineHeight: 1.5, margin: 0, paddingBottom: "4px", borderBottom: "1px solid #f1f5f9" }}>
              Select the purpose of your visit and get directions to the right department.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {VISIT_PURPOSES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPurpose(p.id)}
                  style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "12px", cursor: "pointer", textAlign: "left", width: "100%", transition: "all 0.15s", border: selectedPurpose === p.id ? "2px solid #0284c7" : "1.5px solid #e2e8f0", background: selectedPurpose === p.id ? "#eff6ff" : "#ffffff", fontFamily: "inherit" }}
                  aria-pressed={selectedPurpose === p.id}
                >
                  <span style={{ fontSize: "1.6rem" }}>{p.icon}</span>
                  <div style={{ flex: 1, textAlign: "left" }}>
                    <div style={{ fontWeight: 800, fontSize: "0.9rem", color: "#0f172a" }}>{p.label}</div>
                    <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "2px" }}>📍 {p.dept}</div>
                  </div>
                  {selectedPurpose === p.id && <CheckCircle size={18} color="#0284c7" />}
                </button>
              ))}
            </div>

            {selectedPurpose && (() => {
              const p = VISIT_PURPOSES.find((x) => x.id === selectedPurpose)!;
              return (
                <div style={{ background: "#eff6ff", border: "1.5px solid #bfdbfe", borderRadius: "14px", padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <Navigation size={18} color="#0284c7" />
                    <strong style={{ color: "#0c3558" }}>Visit Directions – {p.label}</strong>
                  </div>
                  {[
                    `Report to Main Reception at the school's main gate. Collect a visitor badge and register your name.`,
                    `Proceed to: ${p.dept}`,
                    `Available: ${p.time}`,
                    `Carry a valid Photo ID (Aadhaar / PAN / Passport) for entry.`,
                  ].map((step, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "0.83rem", color: "#334155", lineHeight: 1.45 }}>
                      <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#0284c7", color: "#ffffff", fontSize: "0.7rem", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
                      <span dangerouslySetInnerHTML={{ __html: step.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
                    </div>
                  ))}
                  <div style={noteStyle}>
                    <Info size={14} color="#0284c7" />
                    <span>This is a static kiosk demonstration. No appointment has been booked.</span>
                  </div>
                </div>
              );
            })()}
          </DetailView>
        )}

        {/* ─── VISITOR CHECK-IN ─── */}
        {activeCard === "checkin" && (
          <DetailView title="Visitor Check-In" onBack={goBack} icon={<Shield size={22} color="#0d9488" />} accentColor="#0d9488">
            {!ciPassGenerated ? (
              <form onSubmit={handleCheckIn} noValidate style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <p style={{ fontSize: "0.86rem", color: "#475569", lineHeight: 1.5, margin: 0, paddingBottom: "4px", borderBottom: "1px solid #f1f5f9" }}>
                  Fill in your details to generate a sample visitor pass and view a mock host notification.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px" }}>
                  <FormField label="Full Name" id="ci-name" required error={ciErrors.name} icon={<User size={15} color="#0d9488" />}>
                    <input id="ci-name" type="text" value={ciName} onChange={(e) => { setCiName(e.target.value); setCiErrors((p) => ({ ...p, name: "" })); }} placeholder="e.g. Rohit Sharma" style={{ ...inputStyle, borderColor: ciErrors.name ? "#ef4444" : "#cbd5e1" }} />
                  </FormField>
                  <FormField label="Mobile Number" id="ci-phone" required error={ciErrors.phone} icon={<Phone size={15} color="#0d9488" />}>
                    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                      <span style={{ position: "absolute", left: "12px", fontWeight: 700, color: "#64748b", fontSize: "0.88rem" }}>+91</span>
                      <input id="ci-phone" type="tel" inputMode="numeric" maxLength={10} value={ciPhone} onChange={(e) => { setCiPhone(e.target.value.replace(/\D/g, "")); setCiErrors((p) => ({ ...p, phone: "" })); }} placeholder="98XXXXXXXX" style={{ ...inputStyle, paddingLeft: "42px", borderColor: ciErrors.phone ? "#ef4444" : "#cbd5e1" }} />
                    </div>
                  </FormField>
                  <FormField label="Address" id="ci-address" required error={ciErrors.address} icon={<MapPin size={15} color="#0d9488" />}>
                    <input id="ci-address" type="text" value={ciAddress} onChange={(e) => { setCiAddress(e.target.value); setCiErrors((p) => ({ ...p, address: "" })); }} placeholder="e.g. 12, MG Road, Bengaluru 560001" style={{ ...inputStyle, borderColor: ciErrors.address ? "#ef4444" : "#cbd5e1" }} />
                  </FormField>
                  <FormField label="Department / Person to Meet" id="ci-dept" required error={ciErrors.dept} icon={<Building2 size={15} color="#0d9488" />}>
                    <select id="ci-dept" value={ciDept} onChange={(e) => { setCiDept(e.target.value); setCiErrors((p) => ({ ...p, dept: "" })); }} style={{ ...inputStyle, borderColor: ciErrors.dept ? "#ef4444" : "#cbd5e1", cursor: "pointer" }}>
                      <option value="">— Select department —</option>
                      {DEPARTMENTS.map((d) => <option key={d.id} value={d.id}>{d.name} ({d.person})</option>)}
                    </select>
                  </FormField>
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", background: "#f0fdfa", border: "1.5px solid #99f6e4", borderRadius: "10px", padding: "10px 14px" }}>
                  <CheckCircle size={16} color="#0d9488" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <span style={{ fontSize: "0.78rem", color: "#0f766e", fontWeight: 600, lineHeight: 1.4 }}>
                    I confirm that I am visiting Green Valley Public School with a legitimate purpose and I agree to follow the school's visitor guidelines and security protocols.
                  </span>
                </div>
                <div style={noteStyle}><Info size={13} color="#0d9488" /><span style={{ fontSize: "0.74rem", color: "#0f766e" }}>Static kiosk demo — No real check-in is submitted to the school system.</span></div>
                <button type="submit" style={{ ...primaryBtnStyle, background: "linear-gradient(135deg, #0d9488, #0f766e)" }}>
                  <Shield size={18} />Generate Sample Visitor Pass
                </button>
              </form>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* Visitor Pass */}
                <div style={{ border: "2px dashed #0d9488", borderRadius: "16px", overflow: "hidden", background: "#f0fdfa" }}>
                  <div style={{ background: "linear-gradient(135deg, #0c3558, #0d9488)", padding: "12px 16px", display: "flex", alignItems: "center", gap: "10px", color: "#ffffff" }}>
                    <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
                      <path d="M24 7C28 11 34 13 38 10C38 18 31 23 24 24C17 23 10 18 10 10C14 13 20 11 24 7Z" fill="#10b981" />
                      <path d="M5 36C12 31.5 18 32.5 24 37C30 32.5 36 31.5 43 36V18C36 13.5 30 14.5 24 19C18 14.5 12 13.5 5 18V36Z" fill="#6ee7b7" />
                    </svg>
                    <div>
                      <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "#6ee7b7", letterSpacing: "0.08em" }}>GREEN VALLEY PUBLIC SCHOOL</div>
                      <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>CBSE Aff. No. 1930421 • Visitor Pass (Demo)</div>
                    </div>
                    <div style={{ marginLeft: "auto", background: "#fbbf24", color: "#92400e", fontSize: "0.7rem", fontWeight: 900, padding: "3px 10px", borderRadius: "9999px", letterSpacing: "0.06em" }}>VISITOR</div>
                  </div>
                  <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: "7px" }}>
                    {[
                      ["Pass No.", visitorPassNumber],
                      ["Name", ciName],
                      ["Mobile", `+91 ${ciPhone}`],
                      ["Address", ciAddress],
                      ["To Meet", DEPARTMENTS.find((d) => d.id === ciDept)?.name || ciDept],
                      ["Date & Time", currentTime ? `${formatDate(currentTime)} • ${formatTime(currentTime)}` : "—"],
                      ["Valid Till", "5:00 PM today"],
                    ].map(([k, v]) => (
                      <div key={k} style={{ display: "flex", gap: "10px", alignItems: "flex-start", borderBottom: "1px solid #e2e8f0", paddingBottom: "6px" }}>
                        <span style={{ fontSize: "0.74rem", fontWeight: 800, color: "#64748b", minWidth: "80px", textTransform: "uppercase", letterSpacing: "0.04em", flexShrink: 0 }}>{k}</span>
                        <span style={{ fontSize: "0.84rem", fontWeight: 700, color: "#0c3558" }}>{v}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: "#f0fdfa", padding: "8px 16px", display: "flex", alignItems: "center", gap: "6px", borderTop: "1px solid #99f6e4" }}>
                    <CheckCircle size={14} color="#059669" />
                    <span style={{ fontSize: "0.72rem", color: "#059669", fontWeight: 700 }}>Consent confirmed • Static demo — not a real visitor pass</span>
                    <Printer size={14} color="#64748b" style={{ marginLeft: "auto" }} />
                  </div>
                </div>

                {/* Mock Host Notification */}
                <div style={{ background: "#fffbeb", border: "1.5px solid #fde68a", borderRadius: "14px", overflow: "hidden" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", background: "#fef3c7", borderBottom: "1px solid #fde68a", fontSize: "0.84rem" }}>
                    <Bell size={16} color="#d97706" />
                    <strong style={{ color: "#92400e" }}>Mock Host Notification</strong>
                    <span style={{ fontSize: "0.7rem", color: "#64748b", marginLeft: "auto" }}>Just now</span>
                  </div>
                  <div style={{ padding: "12px 14px", fontSize: "0.82rem", color: "#334155", lineHeight: 1.5 }}>
                    🔔 <strong>{DEPARTMENTS.find((d) => d.id === ciDept)?.person || "Host"}</strong> — Visitor <strong>{ciName}</strong> (+91 {ciPhone}) has arrived at the reception and wishes to meet you. Pass No: <strong>{visitorPassNumber}</strong>. Please acknowledge at Reception Desk.
                  </div>
                  <div style={{ padding: "0 14px 12px", display: "flex", gap: "8px" }}>
                    <button style={{ background: "#059669", color: "#ffffff", border: "none", borderRadius: "8px", padding: "6px 14px", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer" }}>
                      Acknowledge (Mock)
                    </button>
                    <button style={{ background: "transparent", color: "#64748b", border: "1px solid #cbd5e1", borderRadius: "8px", padding: "6px 14px", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer" }}>
                      Reschedule
                    </button>
                  </div>
                </div>

                <button onClick={() => { setCiPassGenerated(false); setCiErrors({}); }} style={{ display: "flex", alignItems: "center", gap: "8px", height: "42px", borderRadius: "9999px", border: "1.5px solid #e2e8f0", background: "#f8fafc", color: "#334155", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer", padding: "0 20px", fontFamily: "inherit" }}>
                  <ArrowLeft size={16} />New Check-In
                </button>
              </div>
            )}
          </DetailView>
        )}

        {/* ─── ADMISSIONS ─── */}
        {activeCard === "admissions" && (
          <DetailView title="Admissions 2026-27" onBack={goBack} icon={<GraduationCap size={22} color="#16a34a" />} accentColor="#16a34a">
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {(["steps", "docs", "eligibility", "enquiry"] as const).map((tab) => (
                <button key={tab} onClick={() => setAdmTab(tab)} style={{ padding: "7px 14px", borderRadius: "9999px", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", background: admTab === tab ? "#16a34a" : "transparent", color: admTab === tab ? "#ffffff" : "#64748b", border: admTab === tab ? "1.5px solid #16a34a" : "1.5px solid #e2e8f0", transition: "all 0.15s" }}>
                  {tab === "steps" ? "📋 Admission Steps" : tab === "docs" ? "📂 Documents" : tab === "eligibility" ? "🎂 Age Criteria" : "📩 Sample Enquiry"}
                </button>
              ))}
            </div>

            {admTab === "steps" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {ADMISSION_STEPS.map((s) => (
                  <div key={s.step} style={{ display: "flex", alignItems: "flex-start", gap: "14px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "14px" }}>
                    <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "linear-gradient(135deg, #16a34a, #059669)", color: "#ffffff", fontSize: "0.82rem", fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{s.step}</div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: "0.92rem", color: "#0c3558" }}>{s.icon} {s.title}</div>
                      <div style={{ fontSize: "0.8rem", color: "#475569", marginTop: "4px", lineHeight: 1.45 }}>{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {admTab === "docs" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <p style={{ fontSize: "0.84rem", color: "#475569", margin: 0 }}>Ensure all documents are self-attested and carry originals for verification.</p>
                {REQUIRED_DOCS.map((doc, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 12px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "9px" }}>
                    <CheckCircle size={16} color="#16a34a" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: "0.84rem", color: "#334155", fontWeight: 600 }}>{doc}</span>
                  </div>
                ))}
                <div style={noteStyle}><Info size={14} color="#16a34a" /><span>Document requirements may vary by class. Please confirm with the Admissions Office.</span></div>
              </div>
            )}

            {admTab === "eligibility" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <p style={{ fontSize: "0.84rem", color: "#475569", margin: 0 }}>Age eligibility as per CBSE norms for the academic year 2026-27.</p>
                <div style={{ border: "1.5px solid #e2e8f0", borderRadius: "12px", overflow: "hidden" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", background: "#16a34a", color: "#ffffff", fontSize: "0.78rem", fontWeight: 800, padding: "10px 14px", gap: "8px" }}>
                    <span>Class / Programme</span><span>Age Criteria</span>
                  </div>
                  {ELIGIBILITY.map((e, i) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", padding: "9px 14px", gap: "8px", fontSize: "0.82rem", borderBottom: "1px solid #e2e8f0", background: i % 2 === 0 ? "#f8fafc" : "#ffffff" }}>
                      <span style={{ fontWeight: 700, color: "#0c3558" }}>{e.cls}</span>
                      <span style={{ color: "#475569" }}>{e.age}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {admTab === "enquiry" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <p style={{ fontSize: "0.84rem", color: "#475569", margin: 0 }}>Sample admission enquiry as registered at the Admissions Office.</p>
                <div style={{ border: "1.5px solid #e2e8f0", borderRadius: "14px", overflow: "hidden", background: "#ffffff" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 14px", background: "#f0fdf4", borderBottom: "1px solid #e2e8f0", fontSize: "0.86rem", fontWeight: 700, color: "#0c3558" }}>
                    <FileText size={16} color="#16a34a" />
                    <strong>Sample Enquiry — ENQ-2026-00784</strong>
                    <span style={{ fontSize: "0.7rem", fontWeight: 800, padding: "2px 10px", borderRadius: "9999px", background: "#dcfce7", color: "#166534", marginLeft: "auto" }}>Active</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {[
                      ["Student Name", "Arjun Suresh Nair"],
                      ["Date of Birth", "12 March 2019 (Age: 7 yrs)"],
                      ["Class Sought", "Class II (2026-27)"],
                      ["Parent Name", "Mr. Suresh Nair / Mrs. Latha Nair"],
                      ["Mobile", "+91 98457 23190"],
                      ["Email", "suresh.nair@gmail.com"],
                      ["Previous School", "Little Angels Convent, Bengaluru"],
                      ["Enquiry Date", "14 October 2026"],
                      ["Assigned To", "Mr. Suresh Pillai – Admissions Coordinator"],
                      ["Next Step", "Assessment scheduled — 28 October 2026, 10:00 AM"],
                    ].map(([k, v], i) => (
                      <div key={k} style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: "8px", padding: "7px 14px", borderBottom: "1px solid #f1f5f9", fontSize: "0.82rem", background: i % 2 === 0 ? "#fafafa" : "#ffffff" }}>
                        <span style={{ fontWeight: 700, color: "#64748b", fontSize: "0.76rem", textTransform: "uppercase", letterSpacing: "0.03em" }}>{k}</span>
                        <span style={{ fontWeight: 600, color: "#0f172a" }}>{v}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ ...noteStyle, margin: "8px 14px 12px" }}>
                    <Info size={13} color="#16a34a" />
                    <span style={{ fontSize: "0.74rem" }}>This is a sample enquiry for demonstration only. No real application is submitted.</span>
                  </div>
                </div>
              </div>
            )}
          </DetailView>
        )}

        {/* ─── CAMPUS MAP ─── */}
        {activeCard === "map" && (
          <DetailView title="Campus Map" onBack={goBack} icon={<MapPin size={22} color="#7c3aed" />} accentColor="#7c3aed">
            <p style={{ fontSize: "0.86rem", color: "#475569", lineHeight: 1.5, margin: 0, paddingBottom: "4px", borderBottom: "1px solid #f1f5f9" }}>
              Green Valley Public School — 40-acre smart campus. Hover or tap a location pin to explore.
            </p>
            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", flex: 1 }}>
              {/* Map area */}
              <div style={{ flex: 1, minWidth: "280px", height: "380px", background: "linear-gradient(135deg, #e8f5e9 0%, #e3f2fd 50%, #f3e5f5 100%)", borderRadius: "14px", border: "1.5px solid #e2e8f0", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(100,116,139,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(100,116,139,0.12) 1px, transparent 1px)", backgroundSize: "40px 40px" }} aria-hidden="true" />
                {CAMPUS_LOCATIONS.map((loc) => (
                  <button
                    key={loc.id}
                    style={{ position: "absolute", width: "36px", height: "36px", borderRadius: "50%", background: loc.color, border: "2px solid rgba(255,255,255,0.8)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "transform 0.18s ease", boxShadow: "0 4px 12px rgba(0,0,0,0.18)", zIndex: 5, left: `${loc.x}%`, top: `${loc.y}%`, transform: mapHover === loc.id ? "translate(-50%, -50%) scale(1.2)" : "translate(-50%, -50%) scale(1)", fontFamily: "inherit" }}
                    onMouseEnter={() => setMapHover(loc.id)}
                    onMouseLeave={() => setMapHover(null)}
                    onFocus={() => setMapHover(loc.id)}
                    onBlur={() => setMapHover(null)}
                    onClick={() => setMapHover(mapHover === loc.id ? null : loc.id)}
                    aria-label={loc.name}
                  >
                    <span style={{ fontSize: "0.9rem" }}>{loc.icon}</span>
                    {mapHover === loc.id && (
                      <div style={{ position: "absolute", bottom: "44px", left: "50%", transform: "translateX(-50%)", background: "#0c3558", color: "#ffffff", borderRadius: "10px", padding: "8px 12px", minWidth: "160px", boxShadow: "0 4px 16px rgba(0,0,0,0.18)", zIndex: 20, whiteSpace: "nowrap", pointerEvents: "none" }}>
                        <div style={{ fontWeight: 800, fontSize: "0.8rem", color: "#ffffff" }}>{loc.name}</div>
                        <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: "2px" }}>{loc.desc}</div>
                      </div>
                    )}
                  </button>
                ))}
                <div style={{ position: "absolute", bottom: "12px", right: "12px", display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", background: "rgba(255,255,255,0.9)", borderRadius: "8px", padding: "5px 7px", border: "1px solid #e2e8f0" }}>
                  <Navigation size={20} color="#7c3aed" />
                  <span style={{ fontSize: "0.6rem", fontWeight: 800, color: "#7c3aed" }}>N</span>
                </div>
                <div style={{ position: "absolute", bottom: "14px", left: "14px", display: "flex", alignItems: "center", gap: "4px", fontSize: "0.65rem", fontWeight: 700, color: "#64748b", background: "rgba(255,255,255,0.9)", borderRadius: "6px", padding: "4px 8px", border: "1px solid #e2e8f0" }}>
                  <div style={{ width: "40px", height: "3px", background: "#64748b", borderRadius: "2px" }} />
                  <span>~200m</span>
                </div>
              </div>
              {/* Legend */}
              <div style={{ minWidth: "180px", maxWidth: "220px", background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "14px", padding: "12px", display: "flex", flexDirection: "column", gap: "2px", overflowY: "auto" }}>
                <div style={{ fontSize: "0.74rem", fontWeight: 800, color: "#64748b", marginBottom: "6px", textTransform: "uppercase" }}>Locations</div>
                {CAMPUS_LOCATIONS.map((loc) => (
                  <button key={loc.id} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "5px 8px", borderRadius: "8px", cursor: "pointer", border: "none", transition: "background 0.15s", width: "100%", textAlign: "left", background: mapHover === loc.id ? `${loc.color}18` : "transparent", fontFamily: "inherit" }} onClick={() => setMapHover(mapHover === loc.id ? null : loc.id)}>
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: loc.color, flexShrink: 0 }} />
                    <span style={{ fontSize: "0.78rem", color: "#334155", fontWeight: 600 }}>{loc.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </DetailView>
        )}

        {/* ─── EVENTS & GALLERY ─── */}
        {activeCard === "events" && (
          <DetailView title="Events & Gallery" onBack={goBack} icon={<Calendar size={22} color="#ea580c" />} accentColor="#ea580c">
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.95rem", fontWeight: 800, color: "#0c3558", margin: "0 0 10px 0" }}>📅 School Events & Open House Dates</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {EVENTS.map((ev) => (
                    <div key={ev.id} style={{ display: "flex", background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "12px", overflow: "hidden" }}>
                      <div style={{ width: "5px", flexShrink: 0, background: ev.color }} />
                      <div style={{ flex: 1, padding: "12px 14px", display: "flex", flexDirection: "column", gap: "6px" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "6px" }}>
                          <span style={{ fontWeight: 800, fontSize: "0.9rem", color: "#0c3558" }}>{ev.title}</span>
                          <span style={{ fontSize: "0.68rem", fontWeight: 800, padding: "2px 10px", borderRadius: "9999px", background: ev.tag === "Upcoming" ? "#dbeafe" : "#f1f5f9", color: ev.tag === "Upcoming" ? "#1d4ed8" : "#64748b" }}>{ev.tag}</span>
                        </div>
                        <div style={{ display: "flex", gap: "12px", fontSize: "0.76rem", color: "#64748b", fontWeight: 600, flexWrap: "wrap", alignItems: "center" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Calendar size={12} /> {ev.date}</span>
                          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Clock size={12} /> {ev.time}</span>
                          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><MapPin size={12} /> {ev.venue}</span>
                        </div>
                        <p style={{ fontSize: "0.78rem", color: "#475569", lineHeight: 1.45, margin: 0 }}>{ev.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.95rem", fontWeight: 800, color: "#0c3558", margin: "0 0 6px 0" }}>📸 Campus Photo Gallery</h3>
                <p style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: "10px" }}>
                  ⚠️ Static demo — real campus photos would appear here.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "10px" }}>
                  {GALLERY_ITEMS.map((g) => (
                    <div key={g.id} style={{ borderRadius: "12px", padding: "14px", display: "flex", flexDirection: "column", gap: "6px", border: "1px solid rgba(0,0,0,0.05)", background: g.bg }}>
                      <div style={{ fontSize: "2rem", lineHeight: 1 }}>{g.emoji}</div>
                      <div style={{ fontWeight: 700, fontSize: "0.8rem", color: "#0f172a" }}>{g.title}</div>
                      <div style={{ fontSize: "0.72rem", color: "#64748b", lineHeight: 1.35 }}>{g.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DetailView>
        )}

        {/* ─── ASK CBS ─── */}
        {activeCard === "ask" && (
          <DetailView title="Ask CBS — Visitor Helpdesk" onBack={goBack} icon={<MessageSquare size={22} color="#db2777" />} accentColor="#db2777">
            <p style={{ fontSize: "0.86rem", color: "#475569", lineHeight: 1.5, margin: 0, paddingBottom: "4px", borderBottom: "1px solid #f1f5f9" }}>
              Select a common question or type your own query. This is a static demo with predefined answers.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#64748b", marginBottom: "8px", textTransform: "uppercase" }}>Frequently Asked Questions</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {CBS_FAQS.map((faq) => (
                    <button key={faq.id} onClick={() => { setAskSelected(faq.id); setAskCustom(""); setAskResponse(null); }} style={{ padding: "7px 12px", borderRadius: "9999px", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", textAlign: "left", fontFamily: "inherit", background: askSelected === faq.id ? "#fce7f3" : "#f8fafc", border: askSelected === faq.id ? "1.5px solid #db2777" : "1.5px solid #e2e8f0", color: askSelected === faq.id ? "#9d174d" : "#334155", transition: "all 0.15s" }}>
                      {faq.question}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#64748b", marginBottom: "6px", textTransform: "uppercase" }}>Or type your question:</div>
                <textarea rows={3} value={askCustom} onChange={(e) => { setAskCustom(e.target.value); setAskSelected(null); setAskResponse(null); }} placeholder="e.g. Does the school have a swimming pool? What extra-curricular activities are offered?" style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #e2e8f0", fontSize: "0.86rem", fontWeight: 500, color: "#0f172a", outline: "none", resize: "vertical", fontFamily: "inherit", lineHeight: 1.5, boxSizing: "border-box" }} />
              </div>
              <button onClick={handleAskSubmit} disabled={!askSelected && askCustom.trim().length < 5} style={{ ...primaryBtnStyle, background: "linear-gradient(135deg, #db2777, #be185d)", opacity: (!askSelected && askCustom.trim().length < 5) ? 0.5 : 1, cursor: (!askSelected && askCustom.trim().length < 5) ? "not-allowed" : "pointer" }}>
                <MessageSquare size={18} />Get Answer
              </button>
              {askResponse && (
                <div style={{ background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: "14px", padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", fontWeight: 700, fontSize: "0.88rem" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg, #059669, #16a34a)", color: "#ffffff", fontSize: "0.68rem", fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>CBS</div>
                    <strong style={{ color: "#0c3558" }}>CBS Visitor Helpdesk Response</strong>
                  </div>
                  <p style={{ fontSize: "0.84rem", color: "#334155", lineHeight: 1.6, margin: "10px 0 0" }}>{askResponse}</p>
                  <div style={{ ...noteStyle, marginTop: "10px" }}><Info size={13} color="#db2777" /><span>Static demo response. Visit the school or call +91-80-4567-8901 for real assistance.</span></div>
                </div>
              )}
            </div>
          </DetailView>
        )}
      </main>

      {/* ── FOOTER ── */}
      <footer style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 28px", background: "rgba(255,255,255,0.95)", backdropFilter: "blur(14px)", borderTop: "1.5px solid #e2e8f0", flexWrap: "wrap", gap: "8px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <svg width="22" height="22" viewBox="0 0 48 48" fill="none">
            <path d="M24 7C28 11 34 13 38 10C38 18 31 23 24 24C17 23 10 18 10 10C14 13 20 11 24 7Z" fill="#10b981" />
            <path d="M5 36C12 31.5 18 32.5 24 37C30 32.5 36 31.5 43 36V18C36 13.5 30 14.5 24 19C18 14.5 12 13.5 5 18V36Z" fill="#0369a1" />
          </svg>
          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#065f46" }}>
            Green Valley Public School — Smart Campus Kiosk • CBSE Affiliation No. 1930421
          </span>
        </div>
        <span style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 600 }}>
          📍 No. 14, Green Valley Layout, Whitefield, Bengaluru — 560066 | 📞 +91-80-4567-8901
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.7rem", fontWeight: 700, color: "#64748b", background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: "9999px", padding: "4px 10px" }}>
          <Shield size={11} /><span>Static Kiosk Demo — No live data</span>
        </div>
      </footer>
    </div>
  );
}
