"use client";

import React, { useState, useEffect, useCallback } from "react";
import { getUserSession, clearUserSession } from "@/lib/session";
import { SessionInfo } from "@/types/auth";
import { CLIENT_API_ENDPOINTS } from "@/config/api";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  Award,
  Building2,
  Activity,
  Sparkles,
  User,
  Users,
  ShieldCheck,
  X,
  Play,
  Bell,
  Quote,
  RefreshCw,
  GraduationCap,
  BarChart3,
  FileCheck,
  ClipboardList,
  FlaskConical,
  Maximize,
  Minimize,
  Home,
  Megaphone,
  Send,
  Layers,
  Film,
  TrendingUp,
  Receipt,
  Fingerprint,
  FileSpreadsheet,
  Download,
  CreditCard,
  Wallet,
  CalendarCheck,
  Check,
} from "lucide-react";

interface DashboardProps {
  onBackToKiosk: () => void;
}

export type ActiveScreen =
  | "dashboard"
  | "timetable"
  | "leave"
  | "punchlog"
  | "salary"
  | "events"
  | "notices"
  | "meetings"
  | "evaluation"
  | "profile"
  | "aispace";

export default function StaffDashboard({ onBackToKiosk }: DashboardProps) {
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [currentScreen, setCurrentScreen] = useState<ActiveScreen>("dashboard");
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Dynamic API states matching legacy C# VAPS Staff modules
  const [staffProfile, setStaffProfile] = useState<{
    name: string;
    empCode: string;
    dob: string;
    doj: string;
    department: string;
    designation: string;
    email: string;
    mobile: string;
    photo: string;
    bloodGroup: string;
    gender: string;
  }>({
    name: "",
    empCode: "",
    dob: "",
    doj: "",
    department: "",
    designation: "",
    email: "",
    mobile: "",
    photo: "",
    bloodGroup: "",
    gender: "",
  });

  const [timetableSchedule, setTimetableSchedule] = useState<any[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>("ALL");
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>("ALL");

  const [leaveData, setLeaveData] = useState<{
    summary: {
      casualLeaveTotal: number;
      casualLeaveBalance: number;
      medicalLeaveTotal: number;
      medicalLeaveBalance: number;
      earnedLeaveTotal: number;
      earnedLeaveBalance: number;
      onDutyTotal?: number;
      onDutyBalance?: number;
    };
    leaveDetails: any[];
  }>({
    summary: {
      casualLeaveTotal: 0,
      casualLeaveBalance: 0,
      medicalLeaveTotal: 0,
      medicalLeaveBalance: 0,
      earnedLeaveTotal: 0,
      earnedLeaveBalance: 0,
      onDutyTotal: 0,
      onDutyBalance: 0,
    },
    leaveDetails: [],
  });

  const [punchData, setPunchData] = useState<any[]>([]);
  const [salaryData, setSalaryData] = useState<any[]>([]);
  const [staffEvents, setStaffEvents] = useState<any[]>([]);
  const [staffNotices, setStaffNotices] = useState<any[]>([]);
  const [evaluationRoster, setEvaluationRoster] = useState<any[]>([]);

  // Interactive Widgets state
  const [selectedNotice, setSelectedNotice] = useState<any | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Clock timer
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync fullscreen state
  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  // Load active session and fetch live API data
  useEffect(() => {
    const activeSession = getUserSession();
    if (activeSession) {
      setSession(activeSession);
      fetchStaffDetails(activeSession);
      fetchStaffTimetable(activeSession);
      fetchStaffLeave(activeSession);
      fetchStaffPunchLog(activeSession);
      fetchStaffSalary(activeSession);
      fetchStaffEvents(activeSession);
      fetchStaffNotices(activeSession);
    }
  }, []);

  // Sync document title dynamically
  useEffect(() => {
    if (session?.initname) {
      document.title = `${session.initname} • Faculty & Staff Portal`;
    } else {
      document.title = "Campus Smart Portal • Faculty & Staff";
    }
  }, [session]);

  // Fetch Staff Details (matching legacy EmployeeDetails.cs)
  const fetchStaffDetails = async (s: SessionInfo) => {
    try {
      const res = await fetch(CLIENT_API_ENDPOINTS.STAFF_DETAILS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          asmay_id: s.ASMAY_Id || 0,
          userid: s.UserId || 0,
          MI_Id: s.miid || 31,
          name: s.name,
          userName: s.username,
          empCode: s.Empid ? `EMP-${s.Empid}` : undefined,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const resolvedName = (json.data.name && json.data.name !== "Faculty Member") ? json.data.name : (s.name || s.username || "Faculty Member");
          setStaffProfile({
            name: resolvedName,
            empCode: json.data.empCode || (s.Empid ? `EMP-${s.Empid}` : (s.UserId ? `EMP-${s.UserId}` : "")),
            dob: json.data.dob || "",
            doj: json.data.doj || "",
            department: json.data.department || "",
            designation: json.data.designation || "",
            email: json.data.email || "",
            mobile: json.data.mobile || "",
            photo: json.data.photo || s.img || "",
            bloodGroup: json.data.bloodGroup || "",
            gender: json.data.gender || "",
          });
        }
      }
    } catch (err) {
      console.warn("Could not load live staff details:", err);
    }
  };


  // Fetch Staff Timetable (matching legacy TimeTable.cs)
  const fetchStaffTimetable = async (s: SessionInfo) => {
    try {
      const res = await fetch(CLIENT_API_ENDPOINTS.STAFF_TIMETABLE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          asmay_id: s.ASMAY_Id || 0,
          userid: s.UserId || 0,
          MI_Id: s.miid || 31,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.schedule) {
          setTimetableSchedule(json.data.schedule);
        }
      }
    } catch (err) {
      console.warn("Could not load staff timetable:", err);
    }
  };

  // Fetch Staff Leave Records (matching legacy EmpLeave.cs)
  const fetchStaffLeave = async (s: SessionInfo) => {
    try {
      const res = await fetch(CLIENT_API_ENDPOINTS.STAFF_LEAVE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emp_id: s.Empid || s.UserId || 0,
          MI_Id: s.miid || 31,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setLeaveData(json.data);
        }
      }
    } catch (err) {
      console.warn("Could not load staff leave records:", err);
    }
  };

  // Fetch Staff Punch Attendance Log (matching legacy Emplogreport.cs)
  const fetchStaffPunchLog = async (s: SessionInfo) => {
    try {
      const res = await fetch(CLIENT_API_ENDPOINTS.STAFF_PUNCH_LOG, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userid: s.UserId || s.Empid || 0,
          MI_Id: s.miid || 31,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const list = Array.isArray(json.data)
            ? json.data
            : (json.data.punchDetails || json.data.filldata || []);
          setPunchData(list);
        }
      }
    } catch (err) {
      console.warn("Could not load punch log:", err);
    }
  };

  // Fetch Staff Salary Details (matching legacy SalaryDetails.cs)
  const fetchStaffSalary = async (s: SessionInfo) => {
    try {
      const res = await fetch(CLIENT_API_ENDPOINTS.STAFF_SALARY, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          asmay_id: s.ASMAY_Id || 0,
          userid: s.UserId || s.Empid || 0,
          year: s.ASMAY_Year || "",
          MI_Id: s.miid || 31,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const list = Array.isArray(json.data)
            ? json.data
            : (json.data.salaryList || json.data.salary_details || []);
          setSalaryData(list);
        }
      }
    } catch (err) {
      console.warn("Could not load salary details:", err);
    }
  };

  // Fetch Staff Events Calendar (matching legacy StaffCOE.cs)
  const fetchStaffEvents = async (s: SessionInfo) => {
    try {
      const res = await fetch(CLIENT_API_ENDPOINTS.STAFF_EVENTS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          asmay_id: s.ASMAY_Id || 0,
          month: 0,
          MI_Id: s.miid || 31,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const list = Array.isArray(json.data)
            ? json.data
            : (json.data.events || json.data.coereport || []);
          setStaffEvents(list);
        }
      }
    } catch (err) {
      console.warn("Could not load staff events:", err);
    }
  };

  // Fetch Staff Circulars / Notices (matching legacy notice facade)
  const fetchStaffNotices = async (s: SessionInfo) => {
    try {
      const res = await fetch(CLIENT_API_ENDPOINTS.NOTICES, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          asmay_id: s.ASMAY_Id || 0,
          MI_Id: s.miid || 31,
          amst_id: 0,
          flag: "O",
        }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.noticelist) {
          const list = json.data.noticelist.map((n: any, idx: number) => ({
            id: n.INTB_Id || n.intB_Id || idx + 1,
            tag: n.INTB_Tag || "CIRCULAR",
            tagColor: "#ea580c",
            tagBg: "#fff7ed",
            title: n.INTB_Title || n.intB_Title || n.title || "School Directive",
            time: n.INTB_StartDate ? new Date(n.INTB_StartDate).toLocaleDateString("en-GB") : (n.date || "Recent"),
            date: n.INTB_StartDate ? new Date(n.INTB_StartDate).toLocaleDateString("en-GB") : (n.date || ""),
            authority: n.INTB_Authority || n.authority || s.initname || "Administration",
            details: n.INTB_Description || n.intB_Description || n.details || "",
          }));
          setStaffNotices(list);
        }
      }
    } catch (err) {
      console.warn("Could not load staff circulars:", err);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => console.error("Fullscreen error:", err));
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  };

  const handleNavigateTo = (screen: ActiveScreen) => {
    setCurrentScreen(screen);
    const active = session || getUserSession();
    if (active) {
      if (screen === "dashboard") {
        fetchStaffDetails(active);
        fetchStaffTimetable(active);
        fetchStaffLeave(active);
        fetchStaffPunchLog(active);
        fetchStaffSalary(active);
        fetchStaffEvents(active);
        fetchStaffNotices(active);
      } else if (screen === "timetable") {
        fetchStaffTimetable(active);
      } else if (screen === "leave") {
        fetchStaffLeave(active);
      } else if (screen === "punchlog") {
        fetchStaffPunchLog(active);
      } else if (screen === "salary") {
        fetchStaffSalary(active);
      } else if (screen === "events") {
        fetchStaffEvents(active);
      } else if (screen === "notices") {
        fetchStaffNotices(active);
      } else if (screen === "profile") {
        fetchStaffDetails(active);
      }
    }
  };

  const handleLogout = () => {
    clearUserSession();
    onBackToKiosk();
  };

  const staffName =
    staffProfile.name ||
    session?.name ||
    session?.username ||
    "Faculty Member";
  const schoolName = session?.initname || "Campus Portal";
  const staffRole = session?.Rolename || "Faculty";
  const staffDept = staffProfile.department || (session?.Rolename ? `${session.Rolename} Department` : "Academic Department");
  const empId = staffProfile.empCode || (session?.Empid ? `EMP-${session.Empid}` : (session?.UserId ? `ID: ${session.UserId}` : ""));

  // Master schedule - live from timetable API
  const activeSchedule = timetableSchedule;

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentDayName = dayNames[new Date().getDay()];
  const isWeekend = currentDayName === "Saturday" || currentDayName === "Sunday";

  // Dynamic today's teaching classes (deduplicated by period, clean timings)
  const todayClasses = React.useMemo(() => {
    if (!activeSchedule || activeSchedule.length === 0) return [];

    let itemsForDay = activeSchedule.filter((item: any) =>
      item.day && item.day.toLowerCase() === currentDayName.toLowerCase()
    );
    if (itemsForDay.length === 0) {
      itemsForDay = activeSchedule.filter((item: any) => item.day && item.day.toLowerCase() === "monday");
      if (itemsForDay.length === 0) {
        itemsForDay = activeSchedule.slice(0, 5);
      }
    }

    const periodMap = new Map();
    itemsForDay.forEach((item: any, idx: number) => {
      const pKey = String(item.period || idx + 1);
      if (!periodMap.has(pKey)) {
        periodMap.set(pKey, item);
      }
    });

    const uniqueList = Array.from(periodMap.values());
    uniqueList.sort((a, b) => (parseInt(a.period, 10) || 1) - (parseInt(b.period, 10) || 1));
    return uniqueList.slice(0, 5);
  }, [activeSchedule, currentDayName]);

  const totalLeaveDays =
    leaveData.summary.casualLeaveBalance +
    leaveData.summary.medicalLeaveBalance +
    leaveData.summary.earnedLeaveBalance +
    (leaveData.summary.onDutyBalance || 0);

  const filteredSchedule = activeSchedule.filter((item) => {
    const matchesDay = selectedDay === "ALL" || (item.day && item.day.toUpperCase() === selectedDay.toUpperCase());
    const matchesClass = selectedClassFilter === "ALL" || (item.class && item.class.toLowerCase().includes(selectedClassFilter.toLowerCase()));
    return matchesDay && matchesClass;
  });

  // Dynamic punch metrics computed from API
  const latestPunch = punchData.length > 0 ? punchData[0] : null;
  const morningPunchIn = latestPunch?.inTime && latestPunch.inTime !== "—" ? latestPunch.inTime : "—";
  const shiftDuration = latestPunch?.hours ? `${latestPunch.hours} Active` : "—";
  const punchTerminal = latestPunch?.device
    ? (latestPunch.device.length > 18 ? latestPunch.device.split("(")[0].trim() : latestPunch.device)
    : "—";
  const punchStatus = latestPunch?.status || (punchData.length > 0 ? "Synced" : "No Punch Records");

  // Dynamic salary metrics computed from API
  const latestSalary = salaryData.length > 0 ? salaryData[0] : null;
  const netSalaryDisplay = latestSalary?.net ? `₹${Number(latestSalary.net).toLocaleString("en-IN")}` : "—";
  const salaryMonthDisplay = latestSalary?.month ? `${latestSalary.month} Disbursal` : "No Disbursals Recorded";
  const grossSalaryDisplay = latestSalary?.gross ? `₹${Number(latestSalary.gross).toLocaleString("en-IN")}` : "—";
  const deductionsDisplay = latestSalary?.deductions ? `₹${Number(latestSalary.deductions).toLocaleString("en-IN")}` : "—";
  const pfDisplay = latestSalary?.pf ? `₹${Number(latestSalary.pf).toLocaleString("en-IN")}` : "—";
  const bankModeDisplay = latestSalary?.status || "—";

  // Dynamic events list computed from API
  const activeEvents = staffEvents;

  // Dynamic handled classes from schedule
  const handledClasses = Array.from(new Set(activeSchedule.map((s) => s.class).filter(Boolean))).join(", ");

  // AI Space & Chatbot State
  const [chatMessages, setChatMessages] = useState<
    Array<{
      id: string;
      sender: "bot" | "user";
      text: string;
      time: string;
      suggestions?: string[];
    }>
  >([
    {
      id: "msg-welcome-staff",
      sender: "bot",
      text: "Welcome to Faculty AI Assistant! 👋 I can help summarize your class schedule, check leave balances, attendance logs, or payslip records. How may I assist you today?",
      time: "Just now",
      suggestions: [
        "What are my classes today?",
        "Show my leave balances",
        "Recent biometric punch records",
        "Show my latest salary details",
      ],
    },
  ]);
  const [chatInputText, setChatInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatMessagesEndRef = React.useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (currentScreen === "aispace") {
      scrollToBottom();
    }
  }, [chatMessages, currentScreen, isTyping]);

  const handleSendChatMessage = (customQuery?: string) => {
    const query = (customQuery || chatInputText).trim();
    if (!query) return;

    const userMessageId = `msg-user-${Date.now()}`;
    const userTime = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    setChatMessages((prev) => [
      ...prev,
      {
        id: userMessageId,
        sender: "user",
        text: query,
        time: userTime,
      },
    ]);
    if (!customQuery) setChatInputText("");
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = "I have noted your request. You can check the respective tabs for detailed records.";
      const q = query.toLowerCase();

      if (q.includes("class") || q.includes("timetable") || q.includes("period") || q.includes("schedule")) {
        botResponse = todayClasses.length > 0
          ? `📅 **Today's Teaching Schedule**: You have ${todayClasses.length} period(s) scheduled for today. Period 1 begins at ${todayClasses[0].time || "morning"} (${todayClasses[0].class}, ${todayClasses[0].room}).`
          : `📅 **Today's Teaching Schedule**: No active teaching periods scheduled for today.`;
      } else if (q.includes("leave") || q.includes("cl") || q.includes("balance")) {
        botResponse = `🏖️ **Leave Balance Status**: You currently have **${leaveData.summary.casualLeaveBalance} Casual Leaves**, **${leaveData.summary.medicalLeaveBalance} Medical Leaves**, and **${leaveData.summary.earnedLeaveBalance} Earned Leaves** available.`;
      } else if (q.includes("punch") || q.includes("biometric") || q.includes("attendance")) {
        botResponse = latestPunch?.inTime
          ? `⏱️ **Biometric Status**: Your check-in was recorded at **${latestPunch.inTime}** via ${punchTerminal}. Status: ${punchStatus}.`
          : `⏱️ **Biometric Status**: No check-in records found for today.`;
      } else if (q.includes("salary") || q.includes("payslip") || q.includes("pay")) {
        botResponse = latestSalary?.net
          ? `💳 **Salary Record**: ${latestSalary.month || "Latest"} salary: Net Pay ${netSalaryDisplay}, Gross: ${grossSalaryDisplay}.`
          : `💳 **Salary Record**: No salary records published for current fiscal year.`;
      } else if (q.includes("exam") || q.includes("mark") || q.includes("grade") || q.includes("score")) {
        botResponse = `📊 **Student Evaluation**: Please navigate to the Student Evaluation tab to view class scorecards and marksheet submissions.`;
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: `msg-bot-${Date.now()}`,
          sender: "bot",
          text: botResponse,
          time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          suggestions: [
            "View Full Timetable",
            "Open Leave Management",
            "View Salary Slips",
            "Check Punch Attendance",
          ],
        },
      ]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="dashboard-page">
      {/* Ambient Orbs */}
      <div className="kiosk-orb kiosk-orb-one" />
      <div className="kiosk-orb kiosk-orb-two" />

      {/* TOP COMMAND NAVBAR */}
      <header className="dash-navbar">
        <div className="command-brand" onClick={handleLogout} style={{ cursor: "pointer" }}>
          <div className="command-mark" aria-hidden="true">
            <svg width="34" height="34" viewBox="0 0 48 48" fill="none">
              <path d="M24 7c4 4 10 6 14 3 0 8-7 13-14 14C17 23 10 18 10 10c4 3 10 1 14-3Z" fill="#ea580c" />
              <path d="M24 24V11" stroke="#c2410c" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M5 36c7-4.5 13-3.5 19 1 6-4.5 12-5.5 19-1V18c-7-4.5-13-3.5-19 1-6-4.5-12-5.5-19-1v18Z" fill="#9a3412" />
              <path d="M24 19v18" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <p className="command-kicker">
              {session?.initname ? `${session.initname.toUpperCase()} • SMART CAMPUS` : "CAMPUS PORTAL"}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "nowrap" }}>
              <h1 style={{ margin: 0, fontFamily: "Outfit, sans-serif", fontSize: "1.15rem", fontWeight: 800, color: "#1e293b", whiteSpace: "nowrap" }}>
                {schoolName}
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
                FACULTY &amp; STAFF PORTAL
              </span>
            </div>
          </div>
        </div>

        {/* Profile Pill & Control Actions */}
        <div className="dash-nav-actions" style={{ flexWrap: "nowrap" }}>
          {/* Staff Profile Pill */}
          <div
            className="dash-profile-pill"
            onClick={() => handleNavigateTo("profile")}
            title="Click to view Faculty Profile"
            style={{ cursor: "pointer" }}
          >
            <img
              src={staffProfile.photo || "/staff_avatar.png"}
              alt={staffName}
              className="dash-user-avatar"
              style={{ border: "2px solid #ea580c", borderRadius: "50%", objectFit: "cover" }}
            />
            <div className="dash-user-info">
              <span className="dash-user-name">{staffName}</span>
              <span className="dash-user-role">{staffRole} • ID: {empId}</span>
            </div>
          </div>

          {/* Live Campus Telemetry Pill */}
          <div className="command-live-status">
            <span style={{ background: "#16a34a" }} />
            <span>Campus online</span>
          </div>

          {/* Command Time Pill */}
          <div className="dash-clock-widget">
            <Calendar size={13} style={{ color: "#ea580c" }} />
            <span>
              {currentTime.toLocaleDateString("en-US", { weekday: "short", day: "2-digit", month: "short" })} •{" "}
              <b>{currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}</b>
            </span>
          </div>

          {/* Fullscreen Button */}
          <button className="command-fullscreen" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize size={15} /> : <Maximize size={15} />}
            <span>{isFullscreen ? "Exit" : "Full screen"}</span>
          </button>

          {/* Back to Kiosk Home */}
          <button className="dash-kiosk-back-btn" onClick={handleLogout} title="Return to Role Selection Home">
            <ArrowLeft size={14} />
            <span>Kiosk Home</span>
          </button>
        </div>
      </header>

      {/* HORIZONTAL MODULES NAVIGATION TABS (MATCHING STUDENT DASHBOARD) */}
      <nav
        style={{
          flexShrink: 0,
          background: "rgba(255, 255, 255, 0.92)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: "1.5px solid rgba(254, 215, 170, 0.65)",
          padding: "8px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          overflowX: "auto",
          gap: "8px",
          position: "relative",
          zIndex: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <button
            onClick={() => handleNavigateTo("dashboard")}
            style={{
              padding: "6px 14px",
              borderRadius: "9999px",
              fontSize: "0.82rem",
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.2s ease",
              border: currentScreen === "dashboard" ? "1.5px solid #ea580c" : "1.5px solid rgba(254, 215, 170, 0.5)",
              background: currentScreen === "dashboard" ? "#ea580c" : "rgba(255, 255, 255, 0.95)",
              color: currentScreen === "dashboard" ? "#ffffff" : "#475569",
              boxShadow: currentScreen === "dashboard" ? "0 2px 8px rgba(234, 88, 12, 0.25)" : "none",
            }}
          >
            <Home size={14} />
            <span>Overview</span>
          </button>

          {[
            { id: "timetable" as ActiveScreen, name: "Teaching Schedule", icon: Clock },
            { id: "leave" as ActiveScreen, name: "Leave Records", icon: CalendarCheck },
            { id: "punchlog" as ActiveScreen, name: "Attendance Log", icon: Fingerprint },
            { id: "salary" as ActiveScreen, name: "Salary & Slips", icon: Receipt },
            { id: "events" as ActiveScreen, name: "Calendar (COE)", icon: CalendarDays },
            { id: "notices" as ActiveScreen, name: "Staff Circulars", icon: Megaphone },
            { id: "evaluation" as ActiveScreen, name: "Student Evaluation", icon: BarChart3 },
            { id: "profile" as ActiveScreen, name: "Faculty Profile", icon: User },
            { id: "aispace" as ActiveScreen, name: "Campus AI", icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = currentScreen === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleNavigateTo(tab.id)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "9999px",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s ease",
                  border: isActive ? "1.5px solid #ea580c" : "1.5px solid rgba(254, 215, 170, 0.5)",
                  background: isActive ? "#ea580c" : "rgba(255, 255, 255, 0.95)",
                  color: isActive ? "#ffffff" : "#475569",
                  boxShadow: isActive ? "0 2px 8px rgba(234, 88, 12, 0.25)" : "none",
                }}
              >
                <Icon size={14} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {currentScreen !== "dashboard" && (
          <button
            onClick={() => handleNavigateTo("dashboard")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              borderRadius: "9999px",
              background: "#fff7ed",
              border: "1.5px solid #fed7aa",
              color: "#c2410c",
              fontSize: "0.82rem",
              fontWeight: 800,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            <ArrowLeft size={14} />
            <span>Back to Hub</span>
          </button>
        )}
      </nav>

      {/* ========================================================
          VIEW 1: PRIMARY STAFF COMMAND CENTER (DASHBOARD)
          ======================================================== */}
      {currentScreen === "dashboard" && (
        <main className="dash-main-hub">
          {/* HERO BANNER SECTION (MATCHING STUDENT DASHBOARD HERO STRUCTURE) */}
          <section className="student-hub-hero">
            <div className="student-hero-title-group">
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", marginBottom: "0.25rem" }}>
                <span style={{ fontSize: "0.74rem", fontWeight: 800, color: "#ea580c", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <Sparkles size={13} /> FACULTY &amp; STAFF PORTAL • COMMAND CENTER
                </span>
              </div>
              <h2>
                Welcome, <span>{staffName}</span>
              </h2>
              <p>
                {staffDept} • Academic Session {session?.ASMAY_Year || "Current Session"}
              </p>

              {/* Data & Status Chips from Live API */}
              <div className="student-hero-chips">
                <span className="student-hero-chip">
                  <Award size={12} /> {staffProfile.designation || staffRole || "Faculty"}
                </span>
                <span className="student-hero-chip">
                  <User size={12} /> {empId ? `Emp ID: ${empId}` : "Faculty Portal"}
                </span>
                <span className="student-hero-chip highlight">
                  <Clock size={12} /> {todayClasses.length} Classes Today
                </span>
                <span className="student-hero-chip">
                  <CalendarCheck size={12} /> Leave Bal: {totalLeaveDays} Days
                </span>
                <span className="student-hero-chip live">
                  <CheckCircle2 size={12} /> {punchData.length > 0 ? "Biometric Synced" : "Biometric Portal"}
                </span>
                <span className="student-hero-chip">
                  <Megaphone size={12} /> {staffNotices.length} Circulars
                </span>
              </div>
            </div>

            {/* UNIFIED 3D STAGE CAPSULE WITH PROPER BORDERS & ALIGNMENT */}
            <div className="student-hero-capsule">
              <div className="hero-avatar-podium">
                <div className="hero-avatar-halo" />
                <img
                  src={staffProfile.photo || "/staff_avatar.png"}
                  alt={staffName}
                  className="hero-avatar-3d-img"
                  style={{
                    border: "2px solid #ea580c",
                    borderRadius: "14px",
                    width: "60px",
                    height: "75px",
                    objectFit: "cover",
                    boxShadow: "0 4px 12px rgba(234, 88, 12, 0.25)",
                  }}
                />
                <span className="hero-avatar-tag">Faculty Hub</span>
              </div>

              <div className="hero-capsule-divider" />

              <div className="hero-honor-stage">
                <div className="hero-honor-icon-bubble">
                  <Users size={18} />
                </div>
                <div className="hero-honor-text">
                  <span className="hero-honor-title">{staffProfile.designation ? staffProfile.designation.split(" ")[0] : (staffRole || "Faculty")}</span>
                  <span className="hero-honor-badge">{session?.Rolename ? `${session.Rolename} Verified` : "Verified Staff"}</span>
                </div>
              </div>

              <div className="hero-capsule-divider" />

              {/* AI Space Launch Button with Border */}
              <button
                type="button"
                onClick={() => handleNavigateTo("aispace")}
                className="hero-ai-capsule-btn"
                title="Launch Faculty AI Space"
              >
                <div className="hero-ai-robo-wrap">
                  <img
                    src="/ai_robot.png"
                    alt="Campus AI"
                    className="hero-ai-robo-img"
                    style={{
                      border: "2px solid #ea580c",
                      borderRadius: "50%",
                      width: "34px",
                      height: "34px",
                      objectFit: "cover",
                    }}
                  />
                  <span className="hero-ai-pulse-dot" />
                </div>
                <div style={{ textAlign: "center" }}>
                  <div className="hero-ai-kicker">
                    <Sparkles size={9} style={{ display: "inline", verticalAlign: "middle", marginRight: 2 }} /> AI SPACE
                  </div>
                  <span className="hero-ai-action">Ask AI Assistant →</span>
                </div>
              </button>
            </div>
          </section>

          {/* 6 COMPACT BALANCED CONTAINERS (3 COLUMNS × 2 ROWS) */}
          <section className="student-hub-grid">
            {/* CONTAINER 1: 📖 TEACHING TIMETABLE (MATCHES TimeTable.cs) */}
            <div
              className="student-hub-card"
              onClick={() => handleNavigateTo("timetable")}
              title="Click to open Full Teaching Timetable"
            >
              <div className="student-hub-card-header">
                <div className="student-card-title-group" style={{ minWidth: 0, overflow: "hidden" }}>
                  <div className="student-card-icon-box">
                    <BookOpen size={19} />
                  </div>
                  <div className="student-card-headings" style={{ minWidth: 0, overflow: "hidden" }}>
                    <h3 style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Teaching Schedule</h3>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Active Periods &amp; Rooms</span>
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
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ea580c" }} />
                  {todayClasses.length > 0 ? `${todayClasses.length} Periods Today` : "Schedule"}
                </span>
              </div>

              <div className="student-hub-card-body">
                <div className="student-metric-hero">
                  <span className="student-metric-val">{todayClasses.length} Classes</span>
                  <span className="student-metric-label">Assigned for Today</span>
                </div>

                <div className="student-timetable-preview-list">
                  {todayClasses.slice(0, 3).map((item, idx) => {
                    const cleanSubject = item.subject || "Subject";
                    return (
                      <div key={idx} className="student-period-item" style={{ minWidth: 0 }}>
                        <span className="period-time-badge" style={{ flexShrink: 0 }}>{item.time ? item.time.split(" - ")[0] : (item.period ? `P${item.period}` : "—")}</span>
                        <span className="period-subject-name" style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={`${item.class ? `${item.class} • ` : ""}${cleanSubject}`}>
                          {item.class ? `${item.class} • ` : ""}{cleanSubject}
                        </span>
                        <span className="period-room-tag" style={{ flexShrink: 0 }}>{item.room || "—"}</span>
                      </div>
                    );
                  })}
                  {todayClasses.length === 0 && (
                    <div style={{ textAlign: "center", padding: "1rem 0", color: "#94a3b8", fontSize: "0.78rem" }}>
                      No teaching periods scheduled for today.
                    </div>
                  )}
                </div>

                <div className="student-sub-status-strip">
                  <Clock size={12} />
                  <span>Weekly Master Schedule • Synchronized</span>
                </div>
              </div>

              <div className="student-hub-card-footer">
                <button
                  className="student-open-screen-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNavigateTo("timetable");
                  }}
                >
                  <Clock size={13} /> View Full Teaching Timetable <ArrowRight size={13} />
                </button>
              </div>
            </div>


            {/* CONTAINER 2: 🏖️ LEAVE MANAGEMENT (MATCHES EmpLeave.cs) */}
            <div
              className="student-hub-card"
              onClick={() => setCurrentScreen("leave")}
              title="Click to open Leave Records & Balance"
            >
              <div className="student-hub-card-header">
                <div className="student-card-title-group">
                  <div className="student-card-icon-box" style={{ background: "#ecfdf5", color: "#059669" }}>
                    <CalendarCheck size={19} />
                  </div>
                  <div className="student-card-headings">
                    <h3>Leave Management</h3>
                    <span>Balances &amp; Approvals</span>
                  </div>
                </div>
                <span
                  style={{
                    background: "#ecfdf5",
                    color: "#059669",
                    border: "1px solid rgba(167, 243, 208, 0.8)",
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    padding: "0.2rem 0.65rem",
                    borderRadius: "9999px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#059669" }} />
                  {leaveData.summary.casualLeaveBalance} CL Avail
                </span>
              </div>

              <div className="student-hub-card-body">
                <div className="student-metric-hero">
                  <span className="student-metric-val">{leaveData.summary.casualLeaveBalance + leaveData.summary.medicalLeaveBalance + leaveData.summary.earnedLeaveBalance} Days</span>
                  <span className="student-metric-label">Total Leave Balance</span>
                </div>

                {/* 4-Tile Duo Grid Widget */}
                <div className="student-kpi-duo-grid">
                  <div className="student-kpi-mini-card highlight">
                    <div className="student-kpi-mini-icon highlight">
                      <CheckCircle2 size={14} />
                    </div>
                    <div className="student-kpi-mini-meta">
                      <span className="student-kpi-mini-label">Casual Leave</span>
                      <strong className="student-kpi-mini-val highlight">{leaveData.summary.casualLeaveBalance} / {leaveData.summary.casualLeaveTotal} Days</strong>
                    </div>
                  </div>
                  <div className="student-kpi-mini-card">
                    <div className="student-kpi-mini-icon">
                      <ShieldCheck size={14} />
                    </div>
                    <div className="student-kpi-mini-meta">
                      <span className="student-kpi-mini-label">Medical Leave</span>
                      <strong className="student-kpi-mini-val">{leaveData.summary.medicalLeaveBalance} / {leaveData.summary.medicalLeaveTotal} Days</strong>
                    </div>
                  </div>
                  <div className="student-kpi-mini-card">
                    <div className="student-kpi-mini-icon">
                      <Award size={14} />
                    </div>
                    <div className="student-kpi-mini-meta">
                      <span className="student-kpi-mini-label">Earned Leave</span>
                      <strong className="student-kpi-mini-val">{leaveData.summary.earnedLeaveBalance} / {leaveData.summary.earnedLeaveTotal} Days</strong>
                    </div>
                  </div>
                  <div className="student-kpi-mini-card">
                    <div className="student-kpi-mini-icon">
                      <Clock size={14} />
                    </div>
                    <div className="student-kpi-mini-meta">
                      <span className="student-kpi-mini-label">On Duty (OD)</span>
                      <strong className="student-kpi-mini-val highlight">{leaveData.summary.onDutyBalance || 0} Days</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="student-hub-card-footer">
                <button
                  className="student-open-screen-btn btn-warm-tint"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentScreen("leave");
                  }}
                >
                  <CalendarCheck size={13} /> Open Leave Records &amp; Apply <ArrowRight size={13} />
                </button>
              </div>
            </div>

            {/* CONTAINER 3: ⏱️ PUNCH / BIOMETRIC ATTENDANCE LOG (MATCHES Emplogreport.cs) */}
            <div
              className="student-hub-card"
              onClick={() => handleNavigateTo("punchlog")}
              title="Click to open Biometric Attendance Log"
            >
              <div className="student-hub-card-header">
                <div className="student-card-title-group">
                  <div className="student-card-icon-box" style={{ background: "#f0fdfa", color: "#0d9488" }}>
                    <Fingerprint size={19} />
                  </div>
                  <div className="student-card-headings">
                    <h3>Biometric Attendance</h3>
                    <span>Punch In / Out Telemetry</span>
                  </div>
                </div>
                <span
                  style={{
                    background: "#f0fdfa",
                    color: "#0d9488",
                    border: "1px solid rgba(153, 246, 228, 0.8)",
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    padding: "0.2rem 0.65rem",
                    borderRadius: "9999px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    whiteSpace: "nowrap",
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#0d9488" }} />
                  {punchData.length > 0 ? "Punch Synced" : "Telemetry Online"}
                </span>
              </div>

              <div className="student-hub-card-body">
                <div className="student-metric-hero">
                  <span className="student-metric-val">{morningPunchIn}</span>
                  <span className="student-metric-label">Today&apos;s Morning Punch In</span>
                </div>

                {/* 4-Tile Duo Grid Widget */}
                <div className="student-kpi-duo-grid">
                  <div className="student-kpi-mini-card highlight">
                    <div className="student-kpi-mini-icon highlight">
                      <Clock size={14} />
                    </div>
                    <div className="student-kpi-mini-meta">
                      <span className="student-kpi-mini-label">Shift Duration</span>
                      <strong className="student-kpi-mini-val highlight">{shiftDuration}</strong>
                    </div>
                  </div>
                  <div className="student-kpi-mini-card">
                    <div className="student-kpi-mini-icon">
                      <Building2 size={14} />
                    </div>
                    <div className="student-kpi-mini-meta">
                      <span className="student-kpi-mini-label">Terminal</span>
                      <strong className="student-kpi-mini-val">{punchTerminal}</strong>
                    </div>
                  </div>
                  <div className="student-kpi-mini-card">
                    <div className="student-kpi-mini-icon">
                      <CheckCircle2 size={14} />
                    </div>
                    <div className="student-kpi-mini-meta">
                      <span className="student-kpi-mini-label">Attendance Records</span>
                      <strong className="student-kpi-mini-val">{punchData.length > 0 ? `${punchData.length} Punches` : "—"}</strong>
                    </div>
                  </div>
                  <div className="student-kpi-mini-card">
                    <div className="student-kpi-mini-icon">
                      <ShieldCheck size={14} />
                    </div>
                    <div className="student-kpi-mini-meta">
                      <span className="student-kpi-mini-label">Status</span>
                      <strong className="student-kpi-mini-val highlight">{punchStatus}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="student-hub-card-footer">
                <button
                  className="student-open-screen-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNavigateTo("punchlog");
                  }}
                >
                  <Fingerprint size={13} /> View Biometric Punch History <ArrowRight size={13} />
                </button>
              </div>
            </div>

            {/* CONTAINER 4: 💳 SALARY & PAYSLIP DETAILS (MATCHES SalaryDetails.cs) */}
            <div
              className="student-hub-card"
              onClick={() => handleNavigateTo("salary")}
              title="Click to open Salary & Payslips Ledger"
            >
              <div className="student-hub-card-header">
                <div className="student-card-title-group">
                  <div className="student-card-icon-box" style={{ background: "#eff6ff", color: "#2563eb" }}>
                    <Receipt size={19} />
                  </div>
                  <div className="student-card-headings">
                    <h3>Salary &amp; Payslips</h3>
                    <span>Monthly Ledger &amp; Benefits</span>
                  </div>
                </div>
                <span
                  style={{
                    background: "#eff6ff",
                    color: "#2563eb",
                    border: "1px solid rgba(191, 219, 254, 0.8)",
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    padding: "0.2rem 0.65rem",
                    borderRadius: "9999px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Check size={10} /> {latestSalary?.status || (salaryData.length > 0 ? "Credited" : "Disbursal Ledger")}
                </span>
              </div>

              <div className="student-hub-card-body">
                <div className="student-metric-hero">
                  <span className="student-metric-val">{netSalaryDisplay}</span>
                  <span className="student-metric-label">{salaryMonthDisplay}</span>
                </div>

                <div className="student-kpi-duo-grid">
                  <div className="student-kpi-mini-card highlight">
                    <div className="student-kpi-mini-icon highlight">
                      <Wallet size={14} />
                    </div>
                    <div className="student-kpi-mini-meta">
                      <span className="student-kpi-mini-label">Gross Salary</span>
                      <strong className="student-kpi-mini-val highlight">{grossSalaryDisplay}</strong>
                    </div>
                  </div>
                  <div className="student-kpi-mini-card">
                    <div className="student-kpi-mini-icon">
                      <Receipt size={14} />
                    </div>
                    <div className="student-kpi-mini-meta">
                      <span className="student-kpi-mini-label">Total Deductions</span>
                      <strong className="student-kpi-mini-val">{deductionsDisplay}</strong>
                    </div>
                  </div>
                  <div className="student-kpi-mini-card">
                    <div className="student-kpi-mini-icon">
                      <ShieldCheck size={14} />
                    </div>
                    <div className="student-kpi-mini-meta">
                      <span className="student-kpi-mini-label">PF Contribution</span>
                      <strong className="student-kpi-mini-val">{pfDisplay}</strong>
                    </div>
                  </div>
                  <div className="student-kpi-mini-card">
                    <div className="student-kpi-mini-icon">
                      <CreditCard size={14} />
                    </div>
                    <div className="student-kpi-mini-meta">
                      <span className="student-kpi-mini-label">Bank Mode</span>
                      <strong className="student-kpi-mini-val highlight">{bankModeDisplay}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="student-hub-card-footer">
                <button
                  className="student-open-screen-btn btn-warm-tint"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNavigateTo("salary");
                  }}
                >
                  <Receipt size={13} /> Open Payslips Ledger <ArrowRight size={13} />
                </button>
              </div>
            </div>

            {/* CONTAINER 5: 🗓️ CALENDAR OF EVENTS / COE (MATCHES StaffCOE.cs) */}
            <div
              className="student-hub-card"
              onClick={() => handleNavigateTo("events")}
              title="Click to open Institutional Events Calendar"
            >
              <div className="student-hub-card-header">
                <div className="student-card-title-group">
                  <div className="student-card-icon-box" style={{ background: "#fdf2f8", color: "#db2777" }}>
                    <CalendarDays size={19} />
                  </div>
                  <div className="student-card-headings">
                    <h3>Calendar of Events</h3>
                    <span>COE &amp; Institutional Syncs</span>
                  </div>
                </div>
                <span
                  style={{
                    background: "#fdf2f8",
                    color: "#db2777",
                    border: "1px solid rgba(251, 207, 232, 0.8)",
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    padding: "0.2rem 0.65rem",
                    borderRadius: "9999px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {activeEvents.length} Events
                </span>
              </div>

              <div className="student-hub-card-body" style={{ padding: "0.35rem 0.85rem" }}>
                <div className="student-timetable-preview-list">
                  {activeEvents.slice(0, 3).map((ev: any, idx: number) => (
                    <div key={idx} className="student-period-item" style={{ minWidth: 0 }}>
                      <span className="period-time-badge" style={{ background: "#fdf2f8", color: "#db2777", flexShrink: 0 }}>
                        {ev.startDate || "Active"}
                      </span>
                      <span
                        className="period-subject-name"
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          flex: 1,
                          minWidth: 0,
                        }}
                        title={ev.eventName || ev.title}
                      >
                        {ev.eventName || ev.title || "Campus Event"}
                      </span>
                      <span className="period-room-tag" style={{ flexShrink: 0 }}>{ev.desc || ev.venue || "Campus"}</span>
                    </div>
                  ))}
                  {activeEvents.length === 0 && (
                    <div style={{ textAlign: "center", padding: "1rem 0", color: "#94a3b8", fontSize: "0.78rem" }}>
                      No academic events scheduled.
                    </div>
                  )}
                </div>
              </div>

              <div className="student-hub-card-footer">
                <button
                  className="student-open-screen-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNavigateTo("events");
                  }}
                >
                  <CalendarDays size={13} /> View Full Academic Calendar <ArrowRight size={13} />
                </button>
              </div>
            </div>

            {/* CONTAINER 6: 🔔 OFFICIAL CIRCULARS & NOTICES */}
            <div
              className="student-hub-card"
              onClick={() => handleNavigateTo("notices")}
              title="Click to view all faculty circulars"
            >
              <div className="student-hub-card-header">
                <div className="student-card-title-group">
                  <div className="student-card-icon-box">
                    <Bell size={19} />
                  </div>
                  <div className="student-card-headings">
                    <h3>Staff Circulars</h3>
                    <span>Official Directives &amp; Guidelines</span>
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
                    whiteSpace: "nowrap",
                  }}
                >
                  {staffNotices.length} Circulars
                </span>
              </div>

              <div className="student-hub-card-body" style={{ padding: "0.35rem 0.85rem" }}>
                <div className="student-notices-list">
                  {staffNotices.slice(0, 3).map((notice) => (
                    <div
                      key={notice.id}
                      className="student-notice-item"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedNotice(notice);
                      }}
                      title="Click to read full circular"
                      style={{ minWidth: 0 }}
                    >
                      <span
                        style={{
                          fontSize: "0.6rem",
                          fontWeight: 800,
                          padding: "2px 6px",
                          borderRadius: 6,
                          background: notice.tagBg,
                          color: notice.tagColor,
                          border: `1px solid ${notice.tagColor}33`,
                          flexShrink: 0,
                        }}
                      >
                        {notice.tag}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: "0.74rem",
                            fontWeight: 700,
                            color: "#0f172a",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {notice.title}
                        </div>
                        <span style={{ fontSize: "0.64rem", color: "#64748b", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {notice.authority}
                        </span>
                      </div>
                      <span style={{ fontSize: "0.64rem", color: "#94a3b8", flexShrink: 0 }}>{notice.time}</span>
                    </div>
                  ))}
                  {staffNotices.length === 0 && (
                    <div style={{ textAlign: "center", padding: "1rem 0", color: "#94a3b8", fontSize: "0.78rem" }}>
                      No official circulars published.
                    </div>
                  )}
                </div>
              </div>

              <div className="student-hub-card-footer">
                <button
                  className="student-open-screen-btn btn-warm-tint"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNavigateTo("notices");
                  }}
                >
                  <Megaphone size={13} /> View All Faculty Notices <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </section>

          {/* COMPACT BOTTOM STRIP: OFFICIAL FACULTY RECORD & QUICK LAUNCHERS (MATCHING STUDENT DASHBOARD) */}
          <section
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              borderRadius: "14px",
              padding: "0.45rem 1.15rem",
              border: "1.2px solid rgba(251, 146, 60, 0.3)",
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
                  border: "1.5px solid #ea580c",
                }}
              >
                <Users size={18} />
              </div>
              <div style={{ minWidth: 0 }}>
                <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#1e293b", whiteSpace: "nowrap" }}>
                  Official Faculty Record: {staffName} {empId ? `(Emp ID: ${empId})` : ""}
                </span>
                <div style={{ fontSize: "0.68rem", color: "#64748b", display: "flex", gap: "0.6rem", marginTop: "1px", flexWrap: "wrap", alignItems: "center" }}>
                  <span>Dept: <strong>{staffDept}</strong></span>
                  <span>•</span>
                  <span>Designation: <strong>{staffProfile.designation || staffRole || "Faculty"}</strong></span>
                  <span>•</span>
                  <span>Status: <strong style={{ color: "#16a34a" }}>Active Verified Faculty</strong></span>
                  {staffProfile.email ? (
                    <>
                      <span>•</span>
                      <span>Email: <strong>{staffProfile.email}</strong></span>
                    </>
                  ) : null}
                  {staffProfile.mobile ? (
                    <>
                      <span>•</span>
                      <span>Mobile: <strong>{staffProfile.mobile}</strong></span>
                    </>
                  ) : null}
                  {staffProfile.doj ? (
                    <>
                      <span>•</span>
                      <span>Joined: <strong>{staffProfile.doj}</strong></span>
                    </>
                  ) : null}
                  {session?.ASMAY_Year ? (
                    <>
                      <span>•</span>
                      <span>Session: <strong>{session.ASMAY_Year}</strong></span>
                    </>
                  ) : null}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", flexWrap: "wrap" }}>
              <button
                onClick={() => handleNavigateTo("profile")}
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
                <User size={13} /> Faculty Bio Profile →
              </button>
              <button
                onClick={() => handleNavigateTo("timetable")}
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
                <Clock size={13} /> Teaching Schedule →
              </button>
              <button
                onClick={() => handleNavigateTo("leave")}
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
                <CalendarCheck size={13} /> Leave Records →
              </button>
              <button
                onClick={() => handleNavigateTo("salary")}
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
                <Receipt size={13} /> Salary Slips →
              </button>
              <button
                onClick={() => handleNavigateTo("aispace")}
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
                <Sparkles size={13} /> Ask Campus AI →
              </button>
            </div>
          </section>
        </main>
      )}

      {/* ========================================================  
          VIEW 2: DEDICATED FULL SCREEN — TEACHING TIMETABLE
          ======================================================== */}
      {
        currentScreen === "timetable" && (
          <section className="student-fullscreen-page">
            <div className="kiosk-orb kiosk-orb-one" />
            <div className="kiosk-orb kiosk-orb-two" />

            <div className="student-screen-subnav">
              <button className="student-back-to-dash-btn" onClick={() => setCurrentScreen("dashboard")}>
                <ArrowLeft size={16} /> Back to Dashboard
              </button>

              <div className="student-screen-title-area">
                <div className="student-screen-icon-bubble" style={{ background: "#f0fdfa", color: "#0d9488" }}>
                  <Clock size={20} />
                </div>
                <div>
                  <h2>Teaching Schedule &amp; Class Roster</h2>
                  <p>Weekly Master Schedule • {staffName} ({staffDept})</p>
                </div>
              </div>

              <div className="student-screen-nav-tools">
                <button
                  className="student-refresh-btn"
                  onClick={() => setSelectedDay("ALL")}
                  style={{ borderColor: "#0d9488", color: "#0d9488" }}
                >
                  Reset Day Filter
                </button>
              </div>
            </div>

            <div className="student-screen-scroll-body">
              {/* KPI STATS STRIP */}
              <div className="student-kpi-strip">
                <div className="student-kpi-card">
                  <div className="student-kpi-info">
                    <span>Assigned Periods</span>
                    <h4>{activeSchedule.length} Periods</h4>
                  </div>
                  <div className="student-kpi-icon" style={{ background: "#f0fdfa", color: "#0d9488" }}>
                    <Clock size={20} />
                  </div>
                </div>

                <div className="student-kpi-card">
                  <div className="student-kpi-info">
                    <span>Distinct Classes</span>
                    <h4>{new Set(activeSchedule.map((s) => s.class)).size} Classes</h4>
                  </div>
                  <div className="student-kpi-icon" style={{ background: "#eff6ff", color: "#2563eb" }}>
                    <Users size={20} />
                  </div>
                </div>

                <div className="student-kpi-card">
                  <div className="student-kpi-info">
                    <span>Teaching Days</span>
                    <h4>{new Set(activeSchedule.map((s) => s.day)).size} Days / Wk</h4>
                  </div>
                  <div className="student-kpi-icon" style={{ background: "#f5f3ff", color: "#7c3aed" }}>
                    <BookOpen size={20} />
                  </div>
                </div>

                <div className="student-kpi-card">
                  <div className="student-kpi-info">
                    <span>Assigned Rooms</span>
                    <h4>{new Set(activeSchedule.map((s) => s.room)).size} Rooms</h4>
                  </div>
                  <div className="student-kpi-icon" style={{ background: "#fff7ed", color: "#ea580c" }}>
                    <Building2 size={20} />
                  </div>
                </div>
              </div>

              {/* DAY SELECTOR FILTER BUTTONS */}
              <div className="student-screen-card" style={{ padding: "0.75rem 1.25rem" }}>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#64748b", marginRight: "0.5rem" }}>
                    Filter by Day:
                  </span>
                  {["ALL", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      style={{
                        padding: "0.35rem 0.85rem",
                        borderRadius: "9999px",
                        border: "1.5px solid",
                        borderColor: selectedDay === day ? "#0d9488" : "#cbd5e1",
                        background: selectedDay === day ? "#0d9488" : "#ffffff",
                        color: selectedDay === day ? "#ffffff" : "#334155",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* SCHEDULE LIST TABLE */}
              <div className="student-screen-card" style={{ padding: "1.25rem" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
                      <th style={{ padding: "0.6rem", fontSize: "0.78rem", color: "#64748b" }}>Day</th>
                      <th style={{ padding: "0.6rem", fontSize: "0.78rem", color: "#64748b" }}>Period</th>
                      <th style={{ padding: "0.6rem", fontSize: "0.78rem", color: "#64748b" }}>Time</th>
                      <th style={{ padding: "0.6rem", fontSize: "0.78rem", color: "#64748b" }}>Class &amp; Section</th>
                      <th style={{ padding: "0.6rem", fontSize: "0.78rem", color: "#64748b" }}>Subject &amp; Curriculum Topic</th>
                      <th style={{ padding: "0.6rem", fontSize: "0.78rem", color: "#64748b" }}>Room</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSchedule.length > 0 ? (
                      filteredSchedule.map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                          <td style={{ padding: "0.65rem", fontSize: "0.82rem", fontWeight: 700, color: "#1e293b" }}>{item.day}</td>
                          <td style={{ padding: "0.65rem", fontSize: "0.82rem", fontWeight: 800, color: "#0d9488" }}>Period {item.period}</td>
                          <td style={{ padding: "0.65rem", fontSize: "0.78rem", color: "#64748b" }}>{item.time || "—"}</td>
                          <td style={{ padding: "0.65rem", fontSize: "0.82rem", fontWeight: 700, color: "#0f172a" }}>{item.class}</td>
                          <td style={{ padding: "0.65rem", fontSize: "0.82rem", color: "#334155" }}>
                            <b>{item.subject}</b>{item.topic ? ` — ${item.topic}` : ""}
                          </td>
                          <td style={{ padding: "0.65rem", fontSize: "0.82rem", fontWeight: 700, color: "#ea580c" }}>{item.room || "—"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} style={{ textAlign: "center", padding: "2.5rem 1rem", color: "#94a3b8", fontSize: "0.85rem" }}>
                          No teaching periods published for this filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )
      }

      {/* ========================================================
          VIEW 3: DEDICATED FULL SCREEN — LEAVE MANAGEMENT (EmpLeave.cs)
          ======================================================== */}
      {
        currentScreen === "leave" && (
          <section className="student-fullscreen-page">
            <div className="kiosk-orb kiosk-orb-one" />
            <div className="kiosk-orb kiosk-orb-two" />

            <div className="student-screen-subnav">
              <button className="student-back-to-dash-btn" onClick={() => setCurrentScreen("dashboard")}>
                <ArrowLeft size={16} /> Back to Dashboard
              </button>

              <div className="student-screen-title-area">
                <div className="student-screen-icon-bubble" style={{ background: "#ecfdf5", color: "#059669" }}>
                  <CalendarCheck size={20} />
                </div>
                <div>
                  <h2>Faculty Leave Records &amp; Balance</h2>
                  <p>Official Leave Ledger • {staffName} ({empId})</p>
                </div>
              </div>

              <div className="student-screen-nav-tools">
                <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#059669" }}>
                  {session?.ASMAY_Year ? `Academic Year ${session.ASMAY_Year}` : "Academic Leave Ledger"}
                </span>
              </div>
            </div>

            <div className="student-screen-scroll-body">
              {/* KPI STATS STRIP */}
              <div className="student-kpi-strip">
                <div className="student-kpi-card">
                  <div className="student-kpi-info">
                    <span>Casual Leave (CL)</span>
                    <h4>{leaveData.summary.casualLeaveBalance} Days</h4>
                  </div>
                  <div className="student-kpi-icon" style={{ background: "#ecfdf5", color: "#059669" }}>
                    <CheckCircle2 size={20} />
                  </div>
                </div>

                <div className="student-kpi-card">
                  <div className="student-kpi-info">
                    <span>Medical Leave (ML)</span>
                    <h4>{leaveData.summary.medicalLeaveBalance} Days</h4>
                  </div>
                  <div className="student-kpi-icon" style={{ background: "#eff6ff", color: "#2563eb" }}>
                    <ShieldCheck size={20} />
                  </div>
                </div>

                <div className="student-kpi-card">
                  <div className="student-kpi-info">
                    <span>Earned Leave (EL)</span>
                    <h4>{leaveData.summary.earnedLeaveBalance} Days</h4>
                  </div>
                  <div className="student-kpi-icon" style={{ background: "#f5f3ff", color: "#7c3aed" }}>
                    <Award size={20} />
                  </div>
                </div>

                <div className="student-kpi-card">
                  <div className="student-kpi-info">
                    <span>On Duty (OD)</span>
                    <h4>{leaveData.summary.onDutyBalance || 0} Days</h4>
                  </div>
                  <div className="student-kpi-icon" style={{ background: "#fff7ed", color: "#ea580c" }}>
                    <Building2 size={20} />
                  </div>
                </div>
              </div>

              {/* LEAVE HISTORY TABLE */}
              <div className="student-screen-card" style={{ padding: "1.25rem" }}>
                <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.05rem", fontWeight: 800, color: "#1e293b", fontFamily: "Outfit, sans-serif" }}>
                  Leave Application &amp; Approval History
                </h3>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
                      <th style={{ padding: "0.6rem", fontSize: "0.78rem", color: "#64748b" }}>Leave Type</th>
                      <th style={{ padding: "0.6rem", fontSize: "0.78rem", color: "#64748b" }}>From Date</th>
                      <th style={{ padding: "0.6rem", fontSize: "0.78rem", color: "#64748b" }}>To Date</th>
                      <th style={{ padding: "0.6rem", fontSize: "0.78rem", color: "#64748b" }}>Duration</th>
                      <th style={{ padding: "0.6rem", fontSize: "0.78rem", color: "#64748b" }}>Balance After</th>
                      <th style={{ padding: "0.6rem", fontSize: "0.78rem", color: "#64748b" }}>Approval Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveData.leaveDetails.length > 0 ? (
                      leaveData.leaveDetails.map((leave, idx) => (
                        <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                          <td style={{ padding: "0.65rem", fontSize: "0.82rem", fontWeight: 700, color: "#0f172a" }}>{leave.leaveName}</td>
                          <td style={{ padding: "0.65rem", fontSize: "0.8rem", color: "#334155" }}>{leave.fromDate}</td>
                          <td style={{ padding: "0.65rem", fontSize: "0.8rem", color: "#334155" }}>{leave.toDate}</td>
                          <td style={{ padding: "0.65rem", fontSize: "0.82rem", fontWeight: 800, color: "#ea580c" }}>{leave.totalDays} Day(s)</td>
                          <td style={{ padding: "0.65rem", fontSize: "0.82rem", color: "#64748b" }}>{leave.runningBal} Days Rem.</td>
                          <td style={{ padding: "0.65rem" }}>
                            <span style={{ background: "#ecfdf5", color: "#059669", padding: "3px 8px", borderRadius: "9999px", fontSize: "0.72rem", fontWeight: 800 }}>
                              ✓ {leave.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} style={{ textAlign: "center", padding: "2.5rem 1rem", color: "#94a3b8", fontSize: "0.85rem" }}>
                          No leave records or applications published.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )
      }

      {/* ========================================================
          VIEW 4: DEDICATED FULL SCREEN — PUNCH / BIOMETRIC LOG (Emplogreport.cs)
          ======================================================== */}
      {
        currentScreen === "punchlog" && (
          <section className="student-fullscreen-page">
            <div className="kiosk-orb kiosk-orb-one" />
            <div className="kiosk-orb kiosk-orb-two" />

            <div className="student-screen-subnav">
              <button className="student-back-to-dash-btn" onClick={() => setCurrentScreen("dashboard")}>
                <ArrowLeft size={16} /> Back to Dashboard
              </button>

              <div className="student-screen-title-area">
                <div className="student-screen-icon-bubble" style={{ background: "#f0fdfa", color: "#0d9488" }}>
                  <Fingerprint size={20} />
                </div>
                <div>
                  <h2>Biometric Attendance &amp; Punch Logs</h2>
                  <p>Campus Smart Card &amp; Fingerprint Reader Report • {staffName}</p>
                </div>
              </div>

              <div className="student-screen-nav-tools">
                <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#0d9488" }}>
                  ● Real-time Biometric Terminal Online
                </span>
              </div>
            </div>

            <div className="student-screen-scroll-body">
              {/* KPI STATS STRIP */}
              <div className="student-kpi-strip">
                <div className="student-kpi-card">
                  <div className="student-kpi-info">
                    <span>Today&apos;s In Time</span>
                    <h4>{morningPunchIn}</h4>
                  </div>
                  <div className="student-kpi-icon" style={{ background: "#f0fdfa", color: "#0d9488" }}>
                    <Clock size={20} />
                  </div>
                </div>

                <div className="student-kpi-card">
                  <div className="student-kpi-info">
                    <span>Attendance Status</span>
                    <h4>{punchData.length > 0 ? "Present" : "—"}</h4>
                  </div>
                  <div className="student-kpi-icon" style={{ background: "#ecfdf5", color: "#059669" }}>
                    <CheckCircle2 size={20} />
                  </div>
                </div>

                <div className="student-kpi-card">
                  <div className="student-kpi-info">
                    <span>Shift Length</span>
                    <h4>{shiftDuration}</h4>
                  </div>
                  <div className="student-kpi-icon" style={{ background: "#eff6ff", color: "#2563eb" }}>
                    <Activity size={20} />
                  </div>
                </div>

                <div className="student-kpi-card">
                  <div className="student-kpi-info">
                    <span>Gate Reader</span>
                    <h4>{punchTerminal}</h4>
                  </div>
                  <div className="student-kpi-icon" style={{ background: "#fff7ed", color: "#ea580c" }}>
                    <Fingerprint size={20} />
                  </div>
                </div>
              </div>

              {/* PUNCH LOG TABLE */}
              <div className="student-screen-card" style={{ padding: "1.25rem" }}>
                <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.05rem", fontWeight: 800, color: "#1e293b", fontFamily: "Outfit, sans-serif" }}>
                  Daily Punch In / Out Time History
                </h3>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
                      <th style={{ padding: "0.6rem", fontSize: "0.78rem", color: "#64748b" }}>Date</th>
                      <th style={{ padding: "0.6rem", fontSize: "0.78rem", color: "#64748b" }}>Day</th>
                      <th style={{ padding: "0.6rem", fontSize: "0.78rem", color: "#64748b" }}>In Time</th>
                      <th style={{ padding: "0.6rem", fontSize: "0.78rem", color: "#64748b" }}>Out Time</th>
                      <th style={{ padding: "0.6rem", fontSize: "0.78rem", color: "#64748b" }}>Work Duration</th>
                      <th style={{ padding: "0.6rem", fontSize: "0.78rem", color: "#64748b" }}>Terminal Device</th>
                      <th style={{ padding: "0.6rem", fontSize: "0.78rem", color: "#64748b" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {punchData.length > 0 ? (
                      punchData.map((punch, idx) => (
                        <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                          <td style={{ padding: "0.65rem", fontSize: "0.82rem", fontWeight: 700, color: "#0f172a" }}>{punch.date}</td>
                          <td style={{ padding: "0.65rem", fontSize: "0.8rem", color: "#64748b" }}>
                            {punch.day || (punch.date && !isNaN(Date.parse(punch.date)) ? new Date(punch.date).toLocaleDateString("en-US", { weekday: "short" }) : "—")}
                          </td>
                          <td style={{ padding: "0.65rem", fontSize: "0.82rem", fontWeight: 800, color: "#059669" }}>{punch.inTime || "—"}</td>
                          <td style={{ padding: "0.65rem", fontSize: "0.82rem", fontWeight: 800, color: "#ea580c" }}>{punch.outTime || "—"}</td>
                          <td style={{ padding: "0.65rem", fontSize: "0.8rem", color: "#334155" }}>{punch.hours || punch.duration || "—"}</td>
                          <td style={{ padding: "0.65rem", fontSize: "0.78rem", color: "#64748b" }}>{punch.device || punch.terminal || "—"}</td>
                          <td style={{ padding: "0.65rem" }}>
                            <span style={{ background: "#ecfdf5", color: "#059669", padding: "3px 8px", borderRadius: "9999px", fontSize: "0.72rem", fontWeight: 800 }}>
                              ✓ {punch.status || "Recorded"}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} style={{ textAlign: "center", padding: "2.5rem 1rem", color: "#94a3b8", fontSize: "0.85rem" }}>
                          No biometric punch records available for this period.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )
      }

      {/* ========================================================
          VIEW 5: DEDICATED FULL SCREEN — SALARY & PAYSLIP (SalaryDetails.cs)
          ======================================================== */}
      {
        currentScreen === "salary" && (
          <section className="student-fullscreen-page">
            <div className="kiosk-orb kiosk-orb-one" />
            <div className="kiosk-orb kiosk-orb-two" />

            <div className="student-screen-subnav">
              <button className="student-back-to-dash-btn" onClick={() => setCurrentScreen("dashboard")}>
                <ArrowLeft size={16} /> Back to Dashboard
              </button>

              <div className="student-screen-title-area">
                <div className="student-screen-icon-bubble" style={{ background: "#eff6ff", color: "#2563eb" }}>
                  <Receipt size={20} />
                </div>
                <div>
                  <h2>Salary Details &amp; Monthly Payslips</h2>
                  <p>Remuneration Ledger • {staffName} ({empId})</p>
                </div>
              </div>

              <div className="student-screen-nav-tools">
                <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#2563eb" }}>
                  {latestSalary?.status ? `Payment Mode: ${latestSalary.status}` : "Direct Bank Credit"}
                </span>
              </div>
            </div>

            <div className="student-screen-scroll-body">
              {/* KPI STATS STRIP */}
              <div className="student-kpi-strip">
                <div className="student-kpi-card">
                  <div className="student-kpi-info">
                    <span>Last Net Pay</span>
                    <h4>{netSalaryDisplay}</h4>
                  </div>
                  <div className="student-kpi-icon" style={{ background: "#eff6ff", color: "#2563eb" }}>
                    <Wallet size={20} />
                  </div>
                </div>

                <div className="student-kpi-card">
                  <div className="student-kpi-info">
                    <span>Gross Pay</span>
                    <h4>{grossSalaryDisplay}</h4>
                  </div>
                  <div className="student-kpi-icon" style={{ background: "#ecfdf5", color: "#059669" }}>
                    <CheckCircle2 size={20} />
                  </div>
                </div>

                <div className="student-kpi-card">
                  <div className="student-kpi-info">
                    <span>PF Contribution</span>
                    <h4>{pfDisplay}</h4>
                  </div>
                  <div className="student-kpi-icon" style={{ background: "#f5f3ff", color: "#7c3aed" }}>
                    <ShieldCheck size={20} />
                  </div>
                </div>

                <div className="student-kpi-card">
                  <div className="student-kpi-info">
                    <span>Total Deductions</span>
                    <h4>{deductionsDisplay}</h4>
                  </div>
                  <div className="student-kpi-icon" style={{ background: "#fff7ed", color: "#ea580c" }}>
                    <Receipt size={20} />
                  </div>
                </div>
              </div>

              {/* SALARY MONTHLY TABLE */}
              <div className="student-screen-card" style={{ padding: "1.25rem" }}>
                <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.05rem", fontWeight: 800, color: "#1e293b", fontFamily: "Outfit, sans-serif" }}>
                  Monthly Payslip Disbursal Records
                </h3>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
                      <th style={{ padding: "0.6rem", fontSize: "0.78rem", color: "#64748b" }}>Pay Month</th>
                      <th style={{ padding: "0.6rem", fontSize: "0.78rem", color: "#64748b" }}>Gross Amount</th>
                      <th style={{ padding: "0.6rem", fontSize: "0.78rem", color: "#64748b" }}>Deductions</th>
                      <th style={{ padding: "0.6rem", fontSize: "0.78rem", color: "#64748b" }}>Net Disbursed</th>
                      <th style={{ padding: "0.6rem", fontSize: "0.78rem", color: "#64748b" }}>Payment Date</th>
                      <th style={{ padding: "0.6rem", fontSize: "0.78rem", color: "#64748b" }}>Transfer Status</th>
                      <th style={{ padding: "0.6rem", fontSize: "0.78rem", color: "#64748b" }}>Payslip</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salaryData.length > 0 ? (
                      salaryData.map((sal, idx) => (
                        <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                          <td style={{ padding: "0.65rem", fontSize: "0.82rem", fontWeight: 700, color: "#0f172a" }}>{sal.month}</td>
                          <td style={{ padding: "0.65rem", fontSize: "0.82rem", color: "#334155" }}>₹{Number(sal.gross || sal.grossSalary || 0).toLocaleString("en-IN")}</td>
                          <td style={{ padding: "0.65rem", fontSize: "0.82rem", color: "#dc2626" }}>- ₹{Number(sal.deductions || 0).toLocaleString("en-IN")}</td>
                          <td style={{ padding: "0.65rem", fontSize: "0.85rem", fontWeight: 800, color: "#059669" }}>₹{Number(sal.net || sal.netSalary || 0).toLocaleString("en-IN")}</td>
                          <td style={{ padding: "0.65rem", fontSize: "0.8rem", color: "#64748b" }}>{sal.paidDate || "—"}</td>
                          <td style={{ padding: "0.65rem" }}>
                            <span style={{ background: "#ecfdf5", color: "#059669", padding: "3px 8px", borderRadius: "9999px", fontSize: "0.72rem", fontWeight: 800 }}>
                              ✓ {sal.status || "Credited"}
                            </span>
                          </td>
                          <td style={{ padding: "0.65rem" }}>
                            <button
                              onClick={() => alert(`Official payslip for ${sal.month}`)}
                              style={{
                                background: "#f8fafc",
                                border: "1px solid #cbd5e1",
                                borderRadius: "6px",
                                padding: "3px 8px",
                                fontSize: "0.74rem",
                                fontWeight: 700,
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                color: "#0369a1",
                              }}
                            >
                              <Download size={12} /> PDF Slip
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} style={{ textAlign: "center", padding: "2.5rem 1rem", color: "#94a3b8", fontSize: "0.85rem" }}>
                          No salary slips published for current fiscal year.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )
      }

      {/* ========================================================
          VIEW 6: DEDICATED FULL SCREEN — CALENDAR OF EVENTS / COE (StaffCOE.cs)
          ======================================================== */}
      {
        currentScreen === "events" && (
          <section className="student-fullscreen-page">
            <div className="kiosk-orb kiosk-orb-one" />
            <div className="kiosk-orb kiosk-orb-two" />

            <div className="student-screen-subnav">
              <button className="student-back-to-dash-btn" onClick={() => setCurrentScreen("dashboard")}>
                <ArrowLeft size={16} /> Back to Dashboard
              </button>

              <div className="student-screen-title-area">
                <div className="student-screen-icon-bubble" style={{ background: "#fdf2f8", color: "#db2777" }}>
                  <CalendarDays size={20} />
                </div>
                <div>
                  <h2>Academic Calendar of Events (COE)</h2>
                  <p>Institutional Milestones &amp; Scheduled Duties • {schoolName}</p>
                </div>
              </div>

              <div className="student-screen-nav-tools">
                <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#db2777" }}>
                  {session?.ASMAY_Year ? `Academic Session ${session.ASMAY_Year}` : "Institutional Calendar"}
                </span>
              </div>
            </div>

            <div className="student-screen-scroll-body">
              <div className="student-screen-card" style={{ padding: "1.25rem" }}>
                {staffEvents.length > 0 ? (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1rem" }}>
                    {staffEvents.map((event, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: "#fffcf9",
                          border: "1.5px solid rgba(254, 215, 170, 0.7)",
                          borderRadius: "14px",
                          padding: "1rem",
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.5rem",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ background: "#fff7ed", color: "#ea580c", padding: "2px 8px", borderRadius: "9999px", fontSize: "0.72rem", fontWeight: 800 }}>
                            {event.startDate || "Scheduled"}
                          </span>
                          <span style={{ fontSize: "0.72rem", color: "#64748b" }}>Academic Event</span>
                        </div>
                        <h4 style={{ margin: "0.25rem 0", fontSize: "0.95rem", fontWeight: 800, color: "#1e293b", fontFamily: "Outfit, sans-serif" }}>
                          {event.eventName}
                        </h4>
                        <p style={{ margin: 0, fontSize: "0.78rem", color: "#475569", lineHeight: 1.5 }}>
                          {event.eventDesc || "Institutional event scheduled for faculty participation."}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#94a3b8" }}>
                    <CalendarDays size={48} style={{ margin: "0 auto 1rem", opacity: 0.4, color: "#ea580c" }} />
                    <div style={{ fontSize: "1rem", fontWeight: 700, color: "#475569", marginBottom: "0.25rem" }}>
                      No Academic Events Published
                    </div>
                    <div style={{ fontSize: "0.82rem", color: "#94a3b8" }}>
                      The institutional calendar of events has not published any scheduled milestones for this period.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )
      }

      {/* ========================================================
          VIEW 7: DEDICATED FULL SCREEN — FACULTY PROFILE (EmployeeDetails.cs)
          ======================================================== */}
      {
        currentScreen === "profile" && (
          <section className="student-fullscreen-page">
            <div className="kiosk-orb kiosk-orb-one" />
            <div className="kiosk-orb kiosk-orb-two" />

            <div className="student-screen-subnav">
              <button className="student-back-to-dash-btn" onClick={() => setCurrentScreen("dashboard")}>
                <ArrowLeft size={16} /> Back to Dashboard
              </button>

              <div className="student-screen-title-area">
                <div className="student-screen-icon-bubble" style={{ background: "#f0fdfa", color: "#0d9488" }}>
                  <User size={20} />
                </div>
                <div>
                  <h2>Faculty Service Record &amp; Profile</h2>
                  <p>Institutional Credential Registry • {staffName}</p>
                </div>
              </div>

              <div className="student-screen-nav-tools">
                <button className="student-back-to-dash-btn" onClick={handleLogout} style={{ color: "#dc2626", borderColor: "#fca5a5" }}>
                  Sign Out
                </button>
              </div>
            </div>

            <div className="student-screen-scroll-body">
              <div
                className="student-screen-card"
                style={{ padding: "1.5rem", display: "flex", gap: "2rem", alignItems: "center" }}
              >
                <img
                  src={staffProfile.photo || "/staff_avatar.png"}
                  alt={staffName}
                  style={{ width: 100, height: 100, borderRadius: "50%", border: "4px solid #ea580c", objectFit: "cover" }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
                    <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.45rem", fontWeight: 800, color: "#1e293b", margin: 0 }}>
                      {staffName}
                    </h2>
                    <span style={{ background: "#fff7ed", color: "#ea580c", padding: "2px 8px", borderRadius: 6, fontSize: "0.72rem", fontWeight: 800 }}>
                      {staffProfile.designation}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "0.75rem" }}>
                    {staffDept} • {schoolName}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem" }}>
                    <div style={{ background: "#f8fafc", padding: "0.5rem 0.75rem", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                      <span style={{ fontSize: "0.68rem", color: "#64748b" }}>Employee Code</span>
                      <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#1e293b" }}>{empId}</div>
                    </div>
                    <div style={{ background: "#f8fafc", padding: "0.5rem 0.75rem", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                      <span style={{ fontSize: "0.68rem", color: "#64748b" }}>Date of Joining</span>
                      <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#1e293b" }}>{staffProfile.doj}</div>
                    </div>
                    <div style={{ background: "#f8fafc", padding: "0.5rem 0.75rem", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                      <span style={{ fontSize: "0.68rem", color: "#64748b" }}>Blood Group</span>
                      <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#1e293b" }}>{staffProfile.bloodGroup}</div>
                    </div>
                    <div style={{ background: "#f8fafc", padding: "0.5rem 0.75rem", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                      <span style={{ fontSize: "0.68rem", color: "#64748b" }}>Contact Email</span>
                      <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#1e293b" }}>{staffProfile.email}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="student-screen-card" style={{ padding: "1.25rem" }}>
                <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.05rem", fontWeight: 800, color: "#1e293b", margin: "0 0 0.85rem 0" }}>
                  Teaching Assignments &amp; Responsibilities
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
                  <div style={{ background: "#fffcf9", padding: "0.85rem", borderRadius: 10, border: "1px solid rgba(254, 215, 170, 0.6)" }}>
                    <h4 style={{ margin: "0 0 0.35rem 0", fontSize: "0.85rem", color: "#ea580c" }}>Active Classes Handled</h4>
                    <p style={{ margin: 0, fontSize: "0.78rem", color: "#475569", lineHeight: 1.5 }}>
                      {handledClasses ? `Assigned to: ${handledClasses}` : "No active teaching class allocations published for current term."}
                    </p>
                  </div>

                  <div style={{ background: "#f0fdfa", padding: "0.85rem", borderRadius: 10, border: "1px solid rgba(13, 148, 136, 0.3)" }}>
                    <h4 style={{ margin: "0 0 0.35rem 0", fontSize: "0.85rem", color: "#0d9488" }}>Special Portfolios</h4>
                    <p style={{ margin: 0, fontSize: "0.78rem", color: "#475569", lineHeight: 1.5 }}>
                      {staffProfile.designation ? `${staffProfile.designation} • ${staffDept || "Academic Faculty"}` : "Institutional Faculty Member"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )
      }

      {/* ========================================================
          VIEW 8: DEDICATED FULL SCREEN — FACULTY AI SPACE
          ======================================================== */}
      {
        currentScreen === "aispace" && (
          <section className="student-fullscreen-page">
            <div className="kiosk-orb kiosk-orb-one" />
            <div className="kiosk-orb kiosk-orb-two" />

            <div className="student-screen-subnav">
              <button className="student-back-to-dash-btn" onClick={() => setCurrentScreen("dashboard")}>
                <ArrowLeft size={16} /> Back to Dashboard
              </button>

              <div className="student-screen-title-area">
                <div className="student-screen-icon-bubble" style={{ background: "#f5f3ff", color: "#7c3aed" }}>
                  <Sparkles size={20} />
                </div>
                <div>
                  <h2>Faculty AI Teaching Assistant</h2>
                  <p>Instant answers on Timetable, Leaves, Biometrics &amp; Academic Guidelines</p>
                </div>
              </div>

              <div className="student-screen-nav-tools">
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#7c3aed" }}>
                  ● Smart AI Assistant Online
                </div>
              </div>
            </div>

            <div className="student-screen-scroll-body" style={{ display: "flex", flexDirection: "column", height: "calc(100% - 70px)" }}>
              <div style={{ flex: 1, overflowY: "auto", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                      maxWidth: "75%",
                      background: msg.sender === "user" ? "#ea580c" : "#ffffff",
                      color: msg.sender === "user" ? "#ffffff" : "#1e293b",
                      padding: "0.85rem 1.15rem",
                      borderRadius: msg.sender === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                      border: msg.sender === "user" ? "none" : "1px solid #e2e8f0",
                      fontSize: "0.85rem",
                      lineHeight: 1.5,
                    }}
                  >
                    <div>{msg.text}</div>
                    <div style={{ fontSize: "0.68rem", opacity: 0.7, marginTop: "4px", textAlign: msg.sender === "user" ? "right" : "left" }}>
                      {msg.time}
                    </div>
                    {msg.suggestions && msg.suggestions.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
                        {msg.suggestions.map((sug, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => handleSendChatMessage(sug)}
                            style={{
                              background: "#f8fafc",
                              border: "1px solid #cbd5e1",
                              borderRadius: "9999px",
                              padding: "4px 10px",
                              fontSize: "0.72rem",
                              fontWeight: 700,
                              color: "#ea580c",
                              cursor: "pointer",
                            }}
                          >
                            {sug}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {isTyping && (
                  <div style={{ alignSelf: "flex-start", background: "#ffffff", padding: "0.6rem 1rem", borderRadius: "18px", border: "1px solid #e2e8f0", fontSize: "0.8rem", color: "#64748b" }}>
                    AI Assistant is typing...
                  </div>
                )}
                <div ref={chatMessagesEndRef} />
              </div>

              {/* AI INPUT BAR */}
              <div style={{ padding: "0.85rem", background: "#ffffff", borderTop: "1px solid #e2e8f0", display: "flex", gap: "0.75rem" }}>
                <input
                  type="text"
                  placeholder="Ask AI Assistant about classes, leaves, salary or academic schedules..."
                  value={chatInputText}
                  onChange={(e) => setChatInputText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendChatMessage()}
                  style={{
                    flex: 1,
                    height: "44px",
                    borderRadius: "9999px",
                    border: "1.5px solid #cbd5e1",
                    padding: "0 16px",
                    fontSize: "0.85rem",
                    outline: "none",
                  }}
                />
                <button
                  onClick={() => handleSendChatMessage()}
                  style={{
                    background: "#ea580c",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "50%",
                    width: "44px",
                    height: "44px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </section>
        )
      }

      {/* ========================================================
          VIEW: DEDICATED FULL SCREEN — STAFF CIRCULARS & NOTICES
          ======================================================== */}
      {currentScreen === "notices" && (
        <section className="student-fullscreen-page">
          <div className="kiosk-orb kiosk-orb-one" />
          <div className="kiosk-orb kiosk-orb-two" />

          <div className="student-screen-subnav">
            <button className="student-back-to-dash-btn" onClick={() => handleNavigateTo("dashboard")}>
              <ArrowLeft size={16} /> Back to Dashboard
            </button>

            <div className="student-screen-title-area">
              <div className="student-screen-icon-bubble" style={{ background: "#fff7ed", color: "#ea580c" }}>
                <Megaphone size={20} />
              </div>
              <div>
                <h2>Official Faculty Circulars &amp; Directives</h2>
                <p>CBSE Updates, Administrative Orders &amp; Academic Directives</p>
              </div>
            </div>

            <div className="student-screen-nav-tools">
              <span
                style={{
                  background: "#fff7ed",
                  color: "#c2410c",
                  padding: "4px 12px",
                  borderRadius: "9999px",
                  border: "1px solid rgba(254, 215, 170, 0.8)",
                  fontSize: "0.74rem",
                  fontWeight: 800,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <CheckCircle2 size={13} /> {staffNotices.length} Active Directives
              </span>
            </div>
          </div>

          <div className="student-screen-scroll-body">
            {/* KPI STATS STRIP */}
            <div className="student-kpi-strip">
              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Active Circulars</span>
                  <h4>{staffNotices.length} Published</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#fff7ed", color: "#ea580c" }}>
                  <Megaphone size={20} />
                </div>
              </div>

              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Academic Term</span>
                  <h4>{session?.ASMAY_Year ? `Year ${session.ASMAY_Year}` : "Active"}</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#f0fdfa", color: "#0d9488" }}>
                  <Award size={20} />
                </div>
              </div>

              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Assigned Periods</span>
                  <h4>{activeSchedule.length > 0 ? `${activeSchedule.length} Periods` : "—"}</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#eff6ff", color: "#2563eb" }}>
                  <CalendarCheck size={20} />
                </div>
              </div>

              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Telemetry Status</span>
                  <h4>Synced Live</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#dcfce7", color: "#16a34a" }}>
                  <CheckCircle2 size={20} />
                </div>
              </div>
            </div>

            {/* CIRCULARS TABLE */}
            <div className="student-screen-card">
              <div className="student-screen-card-header">
                <h4>
                  <Megaphone size={18} style={{ color: "#ea580c" }} /> Official Staff Directives &amp; Circulars
                </h4>
                <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#ea580c" }}>
                  {staffNotices.length} Directives Active
                </span>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table className="student-screen-table">
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Category</th>
                      <th>Directive Title</th>
                      <th>Issuing Authority</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffNotices.length > 0 ? (
                      staffNotices.map((n, idx) => (
                        <tr key={n.id || idx}>
                          <td style={{ color: "#94a3b8", fontWeight: 700 }}>{idx + 1}</td>
                          <td>
                            <span
                              style={{
                                fontSize: "0.62rem",
                                fontWeight: 800,
                                padding: "2px 8px",
                                borderRadius: "9999px",
                                background: n.tagBg || "#fff7ed",
                                color: n.tagColor || "#ea580c",
                                border: `1px solid ${n.tagColor || "#ea580c"}33`,
                              }}
                            >
                              {n.tag || "General"}
                            </span>
                          </td>
                          <td style={{ fontWeight: 800, color: "#0f172a" }}>{n.title}</td>
                          <td style={{ color: "#64748b" }}>{n.authority || schoolName}</td>
                          <td style={{ color: "#334155" }}>{n.date || "—"}</td>
                          <td>
                            <button
                              onClick={() => setSelectedNotice(n)}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.35rem",
                                padding: "0.28rem 0.75rem",
                                borderRadius: "8px",
                                background: "#fff7ed",
                                border: "1px solid rgba(254, 215, 170, 0.8)",
                                color: "#c2410c",
                                fontWeight: 700,
                                fontSize: "0.74rem",
                                cursor: "pointer",
                              }}
                            >
                              Read Circular →
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} style={{ textAlign: "center", padding: "2.5rem 1rem", color: "#94a3b8", fontWeight: 600 }}>
                          No official staff circulars or directives published at this time.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          VIEW: DEDICATED FULL SCREEN — STUDENT EVALUATION ROSTER
          ======================================================== */}
      {currentScreen === "evaluation" && (
        <section className="student-fullscreen-page">
          <div className="kiosk-orb kiosk-orb-one" />
          <div className="kiosk-orb kiosk-orb-two" />

          <div className="student-screen-subnav">
            <button className="student-back-to-dash-btn" onClick={() => handleNavigateTo("dashboard")}>
              <ArrowLeft size={16} /> Back to Dashboard
            </button>

            <div className="student-screen-title-area">
              <div className="student-screen-icon-bubble" style={{ background: "#fff7ed", color: "#ea580c" }}>
                <BarChart3 size={20} />
              </div>
              <div>
                <h2>Student Academic Evaluation &amp; Marksheet Roster</h2>
                <p>{handledClasses ? `Classes ${handledClasses} • Academic Scorecards` : `Academic Assessment Roster • ${schoolName}`}</p>
              </div>
            </div>

            <div className="student-screen-nav-tools">
              <span
                style={{
                  background: evaluationRoster.length > 0 ? "#f0fdf4" : "#f8fafc",
                  color: evaluationRoster.length > 0 ? "#16a34a" : "#64748b",
                  padding: "4px 12px",
                  borderRadius: "9999px",
                  border: `1px solid ${evaluationRoster.length > 0 ? "#bbf7d0" : "#e2e8f0"}`,
                  fontSize: "0.74rem",
                  fontWeight: 800,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <CheckCircle2 size={13} /> {evaluationRoster.length > 0 ? "100% Evaluated & Synced" : "Pending Assessment Sync"}
              </span>
            </div>
          </div>

          <div className="student-screen-scroll-body">
            {/* KPI STATS STRIP */}
            <div className="student-kpi-strip">
              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Class Strength</span>
                  <h4>{evaluationRoster.length > 0 ? `${evaluationRoster.length} Students` : "—"}</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#fff7ed", color: "#ea580c" }}>
                  <Users size={20} />
                </div>
              </div>

              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Class Average</span>
                  <h4>{evaluationRoster.length > 0 ? `${(evaluationRoster.reduce((acc, s) => acc + (Number(s.obtained) || 0), 0) / evaluationRoster.length).toFixed(1)}%` : "—"}</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#f0fdfa", color: "#0d9488" }}>
                  <Award size={20} />
                </div>
              </div>

              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Top Score</span>
                  <h4>{evaluationRoster.length > 0 ? `${Math.max(...evaluationRoster.map(s => Number(s.obtained) || 0))} / 100` : "—"}</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#eff6ff", color: "#2563eb" }}>
                  <Sparkles size={20} />
                </div>
              </div>

              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Pass Rate</span>
                  <h4>{evaluationRoster.length > 0 ? `${((evaluationRoster.filter(s => (Number(s.obtained) || 0) >= 40).length / evaluationRoster.length) * 100).toFixed(0)}%` : "—"}</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#dcfce7", color: "#16a34a" }}>
                  <CheckCircle2 size={20} />
                </div>
              </div>
            </div>

            {/* MARKSHEET ROSTER TABLE */}
            <div className="student-screen-card">
              <div className="student-screen-card-header">
                <h4>
                  <BarChart3 size={18} style={{ color: "#ea580c" }} /> {handledClasses ? `Classes ${handledClasses} — Assessment Roster` : "Faculty Marks & Assessment Roster"}
                </h4>
                <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#ea580c" }}>
                  {session?.ASMAY_Year ? `Academic Year ${session.ASMAY_Year}` : "Academic Evaluation"}
                </span>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table className="student-screen-table">
                  <thead>
                    <tr>
                      <th>Roll No</th>
                      <th>Student Full Name</th>
                      <th>Class &amp; Section</th>
                      <th>Max Marks</th>
                      <th>Obtained Marks</th>
                      <th>Grade</th>
                      <th>Faculty Remarks</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {evaluationRoster.length > 0 ? (
                      evaluationRoster.map((st) => (
                        <tr key={st.roll}>
                          <td style={{ color: "#ea580c", fontWeight: 800 }}>{st.roll}</td>
                          <td style={{ fontWeight: 800, color: "#0f172a" }}>{st.name}</td>
                          <td style={{ color: "#64748b" }}>{st.class}</td>
                          <td style={{ color: "#64748b" }}>{st.max}</td>
                          <td style={{ fontWeight: 900, color: (Number(st.obtained) || 0) >= 90 ? "#16a34a" : "#0f172a" }}>
                            {st.obtained}
                          </td>
                          <td>
                            <span
                              style={{
                                padding: "2px 8px",
                                borderRadius: "6px",
                                fontWeight: 800,
                                fontSize: "0.72rem",
                                background: st.grade?.startsWith("A") ? "#f0fdf4" : "#fff7ed",
                                color: st.grade?.startsWith("A") ? "#16a34a" : "#ea580c",
                                border: `1px solid ${st.grade?.startsWith("A") ? "#bbf7d0" : "#fed7aa"}`,
                              }}
                            >
                              {st.grade || "—"}
                            </span>
                          </td>
                          <td style={{ color: "#475569", fontSize: "0.76rem" }}>{st.remarks || "—"}</td>
                          <td>
                            <span style={{ color: "#16a34a", fontWeight: 700, fontSize: "0.72rem" }}>
                              ✓ {st.status || "Submitted"}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} style={{ textAlign: "center", padding: "2.5rem 1rem", color: "#94a3b8", fontWeight: 600 }}>
                          No student evaluation records or marksheet submissions published for current term.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* COMPACT COMMAND FOOTER (MATCHING STUDENT DASHBOARD WITH COMFORTABLE 3.75rem DEV BADGE PADDING) */}
      <footer
        className="command-footer"
        style={{
          marginTop: "auto",
          borderTop: "1px solid rgba(254, 215, 170, 0.5)",
          background: "rgba(255, 255, 255, 0.95)",
          padding: "6px 24px 6px 3.75rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", whiteSpace: "nowrap" }}>
          <span className="footer-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "#ea580c", flexShrink: 0 }} />
          <span style={{ fontSize: "0.74rem", fontWeight: 800, color: "#1e293b" }}>
            Official Faculty &amp; Staff Academic Command Portal
          </span>
        </div>
        <div className="footer-links" style={{ display: "flex", gap: "16px", alignItems: "center", fontSize: "0.72rem", color: "#64748b" }}>
          <span>{schoolName}</span>
          <span>{session?.ASMAY_Year ? `Session ${session.ASMAY_Year}` : "Faculty Portal"}</span>
          <span>Faculty Ledger Online</span>
          <span>Cloud Synchronized</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", fontSize: "0.74rem", fontWeight: 700, color: "#16a34a", whiteSpace: "nowrap" }}>
          <ShieldCheck size={14} /> Safe &amp; Encrypted Kiosk
        </div>
      </footer>

      {/* NOTICE DETAIL MODAL */}
      {
        selectedNotice && (
          <div
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
            onClick={() => setSelectedNotice(null)}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "540px",
                background: "#ffffff",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                border: "1px solid #e2e8f0",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.9rem 1.25rem",
                  borderBottom: "1px solid #f1f5f9",
                  background: "linear-gradient(180deg, #ffffff 0%, #fff7ed 100%)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: 6,
                      fontSize: "0.68rem",
                      fontWeight: 800,
                      background: selectedNotice.tagBg,
                      color: selectedNotice.tagColor,
                    }}
                  >
                    {selectedNotice.tag}
                  </span>
                  <span style={{ fontSize: "0.72rem", color: "#64748b" }}>{selectedNotice.time}</span>
                </div>
                <button
                  onClick={() => setSelectedNotice(null)}
                  style={{
                    border: "none",
                    background: "#e2e8f0",
                    borderRadius: "50%",
                    width: 28,
                    height: 28,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#475569",
                  }}
                >
                  <X size={15} />
                </button>
              </div>

              <div style={{ padding: "1.25rem" }}>
                <h3 style={{ margin: "0 0 0.4rem 0", fontSize: "1.05rem", fontWeight: 800, color: "#1e293b", fontFamily: "Outfit, sans-serif" }}>
                  {selectedNotice.title}
                </h3>
                <div style={{ fontSize: "0.72rem", color: "#ea580c", fontWeight: 700, marginBottom: "0.85rem" }}>
                  Issued by: {selectedNotice.authority} • Date: {selectedNotice.date}
                </div>
                <div style={{ background: "#fffcf9", padding: "0.9rem", borderRadius: 10, border: "1px solid rgba(254, 215, 170, 0.5)", fontSize: "0.8rem", color: "#334155", lineHeight: 1.6 }}>
                  {selectedNotice.details}
                </div>
              </div>

              <div style={{ padding: "0.75rem 1.25rem", borderTop: "1px solid #f1f5f9", background: "#f8fafc", display: "flex", justifyContent: "flex-end" }}>
                <button
                  onClick={() => setSelectedNotice(null)}
                  style={{
                    padding: "0.38rem 1.15rem",
                    borderRadius: 8,
                    border: "none",
                    background: "#ea580c",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    color: "#ffffff",
                  }}
                >
                  Close Circular
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
}
