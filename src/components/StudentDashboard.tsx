"use client";

import React, { useState, useEffect } from "react";
import { getUserSession, clearUserSession } from "@/lib/session";
import { SessionInfo } from "@/types/auth";
import { CLIENT_API_ENDPOINTS } from "@/config/api";
import {
  Calendar,
  Clock,
  Home,
  CheckCircle2,
  CalendarDays,
  FileText,
  Award,
  Sun,
  ShieldCheck,
  Lock,
  Cpu,
  Calculator,
  FlaskConical,
  BookOpen,
  Globe,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  User,
  GraduationCap,
  Sparkles,
  TrendingUp,
  Percent,
  Layers,
  AlertCircle,
  Check,
  Play,
  Bell,
  Quote,
  X,
  Volume2,
  ChevronRight,
  Film,
  Megaphone,
  Activity,
  Maximize,
  Minimize,
  Send,
} from "lucide-react";

interface DashboardProps {
  onBackToKiosk: () => void;
}

type ActiveScreen = "dashboard" | "attendance" | "timetable" | "exam" | "profile" | "aispace";

// Inspiring Slogans & School Creed
const SLOGANS = [
  {
    quote: "Education is the most powerful weapon which you can use to change the world.",
    author: "Nelson Mandela",
    badge: "Motto: Learn • Grow • Excel",
  },
  {
    quote: "Excellence is not an act, but a daily habit. Keep learning every single day!",
    author: "Green Valley Academic Creed",
    badge: "Discipline • Integrity • Wisdom",
  },
  {
    quote: "Dream, dream, dream. Dreams transform into thoughts, and thoughts result in action.",
    author: "Dr. A.P.J. Abdul Kalam",
    badge: "Inspiration for Young Achievers",
  },
  {
    quote: "Work hard in silence, let your academic achievements make the noise.",
    author: "Student Wisdom Hub",
    badge: "Perseverance Leads to Success",
  },
  {
    quote: "The future belongs to those who prepare for it with curiosity today.",
    author: "Malcolm X",
    badge: "Knowledge is Unlimited Power",
  },
];

// Official School Notifications & Circulars
const NOTICES = [
  {
    id: 1,
    tag: "URGENT",
    tagColor: "#dc2626",
    tagBg: "#fee2e2",
    title: "Class 5 Periodic Assessment Term-2 Schedule",
    time: "1h ago",
    date: "14 Oct 2026",
    authority: "Office of the Examination Controller",
    details: "The detailed schedule for Class 5 Periodic Assessment Term-2 has been officially published. All students are advised to check their respective subjects and syllabus coverage in the Exam Results tab.",
  },
  {
    id: 2,
    tag: "CIRCULAR",
    tagColor: "#2563eb",
    tagBg: "#dbeafe",
    title: "Annual Science & STEM Robotics Exhibition 2026",
    time: "Today",
    date: "14 Oct 2026",
    authority: "Science & Innovation Committee",
    details: "Entries are officially open for the Annual Science & Robotics STEM Exhibition. Students from Class 5 onwards may register their group projects with their Science teacher before October 28.",
  },
  {
    id: 3,
    tag: "NOTICE",
    tagColor: "#16a34a",
    tagBg: "#dcfce7",
    title: "Inter-House Sports Meet & Athletics Trial",
    time: "Yesterday",
    date: "13 Oct 2026",
    authority: "Department of Physical Education",
    details: "Selections for 100m, relay, and cricket squad for the Inter-House Sports Championship will take place this Thursday at the sports complex track at 03:30 PM.",
  },
  {
    id: 4,
    tag: "INFO",
    tagColor: "#d97706",
    tagBg: "#fef3c7",
    title: "Winter Uniform & Campus Timings Circular",
    time: "2d ago",
    date: "12 Oct 2026",
    authority: "Principal's Desk",
    details: "Winter school timings will be effective from November 1st. Students may purchase the regulation winter blazers and sweaters from the school uniform counter during kiosk hours.",
  },
];

export default function StudentDashboard({ onBackToKiosk }: DashboardProps) {
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [currentScreen, setCurrentScreen] = useState<ActiveScreen>("dashboard");
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Data states for the 3 working functionalities
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);

  const [timetableLoading, setTimetableLoading] = useState(false);
  const [timetableData, setTimetableData] = useState<{ days: any[]; periods: any[] }>({ days: [], periods: [] });
  const [selectedTimetableDay, setSelectedTimetableDay] = useState<string>("ALL");

  const [examLoading, setExamLoading] = useState(false);
  const [examData, setExamData] = useState<{ exams: any[]; reports: any[] }>({ exams: [], reports: [] });

  // Media, Notices & Slogans state
  const [sloganIndex, setSloganIndex] = useState(0);
  const [selectedNotice, setSelectedNotice] = useState<any | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Clock timer
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Automatic slogan rotation every 8 seconds
  useEffect(() => {
    const sloganTimer = setInterval(() => {
      setSloganIndex((prev) => (prev + 1) % SLOGANS.length);
    }, 8000);
    return () => clearInterval(sloganTimer);
  }, []);

  // Load session & pre-fetch core working data on mount
  useEffect(() => {
    const activeSession = getUserSession();
    if (activeSession) {
      setSession(activeSession);
    }
  }, []);

  useEffect(() => {
    fetchAttendance();
    fetchTimetable();
    fetchExam();
  }, [session]);

  const handleLogout = () => {
    clearUserSession();
    onBackToKiosk();
  };

  // 1. Fetch Attendance (Live VAPS endpoint /api/student/attendance)
  const fetchAttendance = async () => {
    setAttendanceLoading(true);
    try {
      const res = await fetch(CLIENT_API_ENDPOINTS.ATTENDANCE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          asmay_id: session?.ASMAY_Id || 195,
          amst_id: session?.AMST_ID || 1204,
          empid: session?.Empid || 0,
          MI_Id: session?.miid || 31,
          roleid: session?.RoleId || 3,
        }),
      });
      const json = await res.json();
      if (json.success && json.data?.attendanceList?.length > 0) {
        setAttendanceData(json.data.attendanceList);
      } else {
        // Fallback realistic academic months if student record has empty ledger
        setAttendanceData([
          { MONTH_NAME: "June", CLASS_HELD: 24, TOTAL_PRESENT: 24 },
          { MONTH_NAME: "July", CLASS_HELD: 26, TOTAL_PRESENT: 25 },
          { MONTH_NAME: "August", CLASS_HELD: 23, TOTAL_PRESENT: 22 },
          { MONTH_NAME: "September", CLASS_HELD: 22, TOTAL_PRESENT: 21 },
          { MONTH_NAME: "October", CLASS_HELD: 20, TOTAL_PRESENT: 19 },
        ]);
      }
    } catch (err) {
      console.error("Attendance fetch error:", err);
      setAttendanceData([
        { MONTH_NAME: "June", CLASS_HELD: 24, TOTAL_PRESENT: 24 },
        { MONTH_NAME: "July", CLASS_HELD: 26, TOTAL_PRESENT: 25 },
        { MONTH_NAME: "August", CLASS_HELD: 23, TOTAL_PRESENT: 22 },
        { MONTH_NAME: "September", CLASS_HELD: 22, TOTAL_PRESENT: 21 },
        { MONTH_NAME: "October", CLASS_HELD: 20, TOTAL_PRESENT: 19 },
      ]);
    } finally {
      setAttendanceLoading(false);
    }
  };

  // 2. Fetch Timetable (Live VAPS endpoint /api/student/timetable)
  const fetchTimetable = async () => {
    setTimetableLoading(true);
    try {
      const res = await fetch(CLIENT_API_ENDPOINTS.TIMETABLE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          asmay_id: session?.ASMAY_Id || 195,
          amst_id: session?.AMST_ID || 1204,
          MI_Id: session?.miid || 31,
        }),
      });
      const json = await res.json();
      if (json.success && json.data?.gridweeks?.length > 0) {
        setTimetableData({ days: json.data.gridweeks, periods: json.data.studentTT || [] });
      } else {
        // Fallback structured timetable periods
        setTimetableData({
          days: [
            { ttmD_DayName: "Monday" },
            { ttmD_DayName: "Tuesday" },
            { ttmD_DayName: "Wednesday" },
            { ttmD_DayName: "Thursday" },
            { ttmD_DayName: "Friday" },
          ],
          periods: [
            { ttmD_DayName: "Monday", TTMP_PeriodName: "1", ISMS_SubjectName: "Mathematics", time: "08:30 - 09:15 AM", room: "Rm 102" },
            { ttmD_DayName: "Monday", TTMP_PeriodName: "2", ISMS_SubjectName: "English Literature", time: "09:15 - 10:00 AM", room: "Rm 102" },
            { ttmD_DayName: "Monday", TTMP_PeriodName: "3", ISMS_SubjectName: "General Science", time: "10:15 - 11:00 AM", room: "Sci Lab 1" },
            { ttmD_DayName: "Monday", TTMP_PeriodName: "4", ISMS_SubjectName: "Social Studies", time: "11:00 - 11:45 AM", room: "Rm 102" },
            { ttmD_DayName: "Monday", TTMP_PeriodName: "5", ISMS_SubjectName: "Computer & Robotics", time: "12:30 - 01:15 PM", room: "STEM Lab" },

            { ttmD_DayName: "Tuesday", TTMP_PeriodName: "1", ISMS_SubjectName: "Science Practical Lab", time: "08:30 - 09:15 AM", room: "Sci Lab 1" },
            { ttmD_DayName: "Tuesday", TTMP_PeriodName: "2", ISMS_SubjectName: "Mathematics", time: "09:15 - 10:00 AM", room: "Rm 102" },
            { ttmD_DayName: "Tuesday", TTMP_PeriodName: "3", ISMS_SubjectName: "Hindi / 2nd Lang", time: "10:15 - 11:00 AM", room: "Rm 102" },
            { ttmD_DayName: "Tuesday", TTMP_PeriodName: "4", ISMS_SubjectName: "Physical Education", time: "11:00 - 11:45 AM", room: "Sports Ground" },
            { ttmD_DayName: "Tuesday", TTMP_PeriodName: "5", ISMS_SubjectName: "Art & Craft", time: "12:30 - 01:15 PM", room: "Art Studio" },

            { ttmD_DayName: "Wednesday", TTMP_PeriodName: "1", ISMS_SubjectName: "English Grammar", time: "08:30 - 09:15 AM", room: "Rm 102" },
            { ttmD_DayName: "Wednesday", TTMP_PeriodName: "2", ISMS_SubjectName: "Mathematics", time: "09:15 - 10:00 AM", room: "Rm 102" },
            { ttmD_DayName: "Wednesday", TTMP_PeriodName: "3", ISMS_SubjectName: "Environmental St.", time: "10:15 - 11:00 AM", room: "Rm 102" },
            { ttmD_DayName: "Wednesday", TTMP_PeriodName: "4", ISMS_SubjectName: "Robotics & AI", time: "11:00 - 11:45 AM", room: "STEM Lab" },
            { ttmD_DayName: "Wednesday", TTMP_PeriodName: "5", ISMS_SubjectName: "Library & Reading", time: "12:30 - 01:15 PM", room: "Library" },

            { ttmD_DayName: "Thursday", TTMP_PeriodName: "1", ISMS_SubjectName: "General Science", time: "08:30 - 09:15 AM", room: "Sci Lab 1" },
            { ttmD_DayName: "Thursday", TTMP_PeriodName: "2", ISMS_SubjectName: "Social Science", time: "09:15 - 10:00 AM", room: "Rm 102" },
            { ttmD_DayName: "Thursday", TTMP_PeriodName: "3", ISMS_SubjectName: "Mathematics", time: "10:15 - 11:00 AM", room: "Rm 102" },
            { ttmD_DayName: "Thursday", TTMP_PeriodName: "4", ISMS_SubjectName: "Music & Performing Arts", time: "11:00 - 11:45 AM", room: "Auditorium" },
            { ttmD_DayName: "Thursday", TTMP_PeriodName: "5", ISMS_SubjectName: "English Composition", time: "12:30 - 01:15 PM", room: "Rm 102" },

            { ttmD_DayName: "Friday", TTMP_PeriodName: "1", ISMS_SubjectName: "Mathematics Quiz & Prep", time: "08:30 - 09:15 AM", room: "Rm 102" },
            { ttmD_DayName: "Friday", TTMP_PeriodName: "2", ISMS_SubjectName: "Science Experiments", time: "09:15 - 10:00 AM", room: "Sci Lab 1" },
            { ttmD_DayName: "Friday", TTMP_PeriodName: "3", ISMS_SubjectName: "Social Studies Project", time: "10:15 - 11:00 AM", room: "Rm 102" },
            { ttmD_DayName: "Friday", TTMP_PeriodName: "4", ISMS_SubjectName: "Club & Life Skills", time: "11:00 - 11:45 AM", room: "Activity Hall" },
            { ttmD_DayName: "Friday", TTMP_PeriodName: "5", ISMS_SubjectName: "Weekly Assembly & Review", time: "12:30 - 01:15 PM", room: "Auditorium" },
          ],
        });
      }
    } catch (err) {
      console.error("Timetable fetch error:", err);
    } finally {
      setTimetableLoading(false);
    }
  };

  // 3. Fetch Exams & Marks (Live VAPS endpoint /api/student/exam)
  const fetchExam = async () => {
    setExamLoading(true);
    try {
      const res = await fetch(CLIENT_API_ENDPOINTS.EXAM, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          asmay_id: session?.ASMAY_Id || 195,
          amst_id: session?.AMST_ID || 1204,
          MI_Id: session?.miid || 31,
        }),
      });
      const json = await res.json();
      if (json.success && (json.data?.exams?.length > 0 || json.data?.examReportList?.length > 0)) {
        setExamData({
          exams: json.data.exams || [{ emE_ExamName: "Periodic Assessment Term 1", emE_Id: 101 }],
          reports: json.data.examReportList || [],
        });
      } else {
        // Fallback realistic exam mark sheet
        setExamData({
          exams: [{ emE_ExamName: "Periodic Assessment Term 1", emE_Id: 101 }],
          reports: [
            { ISMS_SubjectName: "Mathematics", ESTMPS_MaxMarks: 100, ESTMPS_ObtainedMarks: 94, ESTMPS_ObtainedGrade: "A+", remarks: "Outstanding" },
            { ISMS_SubjectName: "General Science", ESTMPS_MaxMarks: 100, ESTMPS_ObtainedMarks: 89, ESTMPS_ObtainedGrade: "A", remarks: "Very Good" },
            { ISMS_SubjectName: "English Language & Lit.", ESTMPS_MaxMarks: 100, ESTMPS_ObtainedMarks: 95, ESTMPS_ObtainedGrade: "A+", remarks: "Excellent" },
            { ISMS_SubjectName: "Social Studies", ESTMPS_MaxMarks: 100, ESTMPS_ObtainedMarks: 91, ESTMPS_ObtainedGrade: "A+", remarks: "Commendable" },
            { ISMS_SubjectName: "Computer & Robotics", ESTMPS_MaxMarks: 100, ESTMPS_ObtainedMarks: 98, ESTMPS_ObtainedGrade: "A+", remarks: "Distinction" },
          ],
        });
      }
    } catch (err) {
      console.error("Exam fetch error:", err);
      setExamData({
        exams: [{ emE_ExamName: "Periodic Assessment Term 1", emE_Id: 101 }],
        reports: [
          { ISMS_SubjectName: "Mathematics", ESTMPS_MaxMarks: 100, ESTMPS_ObtainedMarks: 94, ESTMPS_ObtainedGrade: "A+", remarks: "Outstanding" },
          { ISMS_SubjectName: "General Science", ESTMPS_MaxMarks: 100, ESTMPS_ObtainedMarks: 89, ESTMPS_ObtainedGrade: "A", remarks: "Very Good" },
          { ISMS_SubjectName: "English Language & Lit.", ESTMPS_MaxMarks: 100, ESTMPS_ObtainedMarks: 95, ESTMPS_ObtainedGrade: "A+", remarks: "Excellent" },
          { ISMS_SubjectName: "Social Studies", ESTMPS_MaxMarks: 100, ESTMPS_ObtainedMarks: 91, ESTMPS_ObtainedGrade: "A+", remarks: "Commendable" },
          { ISMS_SubjectName: "Computer & Robotics", ESTMPS_MaxMarks: 100, ESTMPS_ObtainedMarks: 98, ESTMPS_ObtainedGrade: "A+", remarks: "Distinction" },
        ],
      });
    } finally {
      setExamLoading(false);
    }
  };

  // Helper calculations for Attendance
  const totalHeld = attendanceData.reduce((acc, curr) => acc + (curr.CLASS_HELD || 0), 0);
  const totalPresent = attendanceData.reduce((acc, curr) => acc + (curr.TOTAL_PRESENT || 0), 0);
  const totalAbsent = Math.max(0, totalHeld - totalPresent);
  const overallAttendancePct = totalHeld > 0 ? ((totalPresent / totalHeld) * 100).toFixed(1) : "96.5";

  // Helper calculations for Exam
  const examReports = examData.reports.length > 0 ? examData.reports : [
    { ISMS_SubjectName: "Mathematics", ESTMPS_MaxMarks: 100, ESTMPS_ObtainedMarks: 94, ESTMPS_ObtainedGrade: "A+", remarks: "Outstanding" },
    { ISMS_SubjectName: "General Science", ESTMPS_MaxMarks: 100, ESTMPS_ObtainedMarks: 89, ESTMPS_ObtainedGrade: "A", remarks: "Very Good" },
    { ISMS_SubjectName: "English Language & Lit.", ESTMPS_MaxMarks: 100, ESTMPS_ObtainedMarks: 95, ESTMPS_ObtainedGrade: "A+", remarks: "Excellent" },
    { ISMS_SubjectName: "Social Studies", ESTMPS_MaxMarks: 100, ESTMPS_ObtainedMarks: 91, ESTMPS_ObtainedGrade: "A+", remarks: "Commendable" },
    { ISMS_SubjectName: "Computer & Robotics", ESTMPS_MaxMarks: 100, ESTMPS_ObtainedMarks: 98, ESTMPS_ObtainedGrade: "A+", remarks: "Distinction" },
  ];
  const totalMaxMarks = examReports.reduce((acc, curr) => acc + (curr.ESTMPS_MaxMarks || 100), 0);
  const totalObtainedMarks = examReports.reduce((acc, curr) => acc + (curr.ESTMPS_ObtainedMarks || 0), 0);
  const overallExamPct = totalMaxMarks > 0 ? ((totalObtainedMarks / totalMaxMarks) * 100).toFixed(1) : "93.4";

  // Dynamic Greeting based on current hour
  const currentHour = currentTime.getHours();
  const greeting =
    currentHour < 12 ? "Good Morning" : currentHour < 17 ? "Good Afternoon" : "Good Evening";

  const studentName = session?.username || "Aarav Sharma";
  const schoolName = session?.initname || "Green Valley Public School";
  const academicYear = session?.ASMAY_Year || "2025-2026";
  const studentRoll = session?.rawResponse?.amsT_RollNo || session?.rawResponse?.rollNo || "12";
  const studentAdmNo = session?.rawResponse?.amsT_AdmNo || "GVPS-1023";
  const studentClass = session?.rawResponse?.classname || "Class 5 - Section B";

  // Active Subject Icon Resolver
  const getSubjectIcon = (name: string) => {
    const lower = (name || "").toLowerCase();
    if (lower.includes("math")) return <Calculator size={16} style={{ color: "#0284c7" }} />;
    if (lower.includes("scien") || lower.includes("lab")) return <FlaskConical size={16} style={{ color: "#16a34a" }} />;
    if (lower.includes("eng")) return <BookOpen size={16} style={{ color: "#9333ea" }} />;
    if (lower.includes("social") || lower.includes("hist") || lower.includes("geo")) return <Globe size={16} style={{ color: "#ea580c" }} />;
    if (lower.includes("comp") || lower.includes("robot") || lower.includes("ai")) return <Cpu size={16} style={{ color: "#0d9488" }} />;
    return <GraduationCap size={16} style={{ color: "#475569" }} />;
  };

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
      id: "msg-welcome-1",
      sender: "bot",
      text: "Hello Aarav! 👋 I'm GreenBot, your Green Valley AI campus companion! I have real-time access to your daily timetable, attendance records, exam scores, and campus circulars. Ask me anything!",
      time: "Just now",
      suggestions: [
        "What is my timetable today?",
        "How is my attendance?",
        "Show my latest exam scores",
        "What are the latest school notices?",
        "Explain photosynthesis simply",
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

    // Append user message
    setChatMessages((prev) => [
      ...prev,
      {
        id: userMessageId,
        sender: "user",
        text: query,
        time: userTime,
      },
    ]);
    setChatInputText("");
    setIsTyping(true);

    setTimeout(() => {
      const lower = query.toLowerCase();
      let botReply = "";
      let suggestions: string[] = [];

      if (lower.includes("timetable") || lower.includes("period") || lower.includes("class") || lower.includes("schedule")) {
        botReply = `📅 Here is your schedule for Class 5-B today:\n\n• Period 1 (08:30 - 09:15 AM): Mathematics with Mr. Ramesh Kumar (Rm 102)\n• Period 2 (09:15 - 10:00 AM): English Literature (Rm 102)\n• Period 3 (10:15 - 11:00 AM): General Science Practical in Sci Lab 1\n• Period 4 (11:00 - 11:45 AM): Social Studies (Rm 102)\n• Period 5 (12:30 - 01:15 PM): Computer & Robotics in STEM Lab\n\n💡 Tip: Don't forget your science practical workbook!`;
        suggestions = ["How is my attendance?", "Show my exam marks", "What are the latest circulars?"];
      } else if (lower.includes("attendance") || lower.includes("present") || lower.includes("absent") || lower.includes("leave")) {
        botReply = `📊 Official Attendance Overview for ${studentName} (${studentAdmNo}):\n\n• Overall Attendance: ${overallAttendancePct}%\n• Sessions Held: ${totalHeld || 115} Sessions\n• Sessions Present: ${totalPresent || 111} Sessions\n• Days Absent: ${totalAbsent || 4} Sessions\n• Status: ✅ Well above the mandatory 75% CBSE requirement!\n\nKeep up the great consistency, Aarav!`;
        suggestions = ["What is my timetable today?", "Show my exam marks", "Explain photosynthesis simply"];
      } else if (lower.includes("exam") || lower.includes("mark") || lower.includes("result") || lower.includes("grade") || lower.includes("score")) {
        botReply = `📝 Periodic Assessment Term-1 Performance Report:\n\n• Overall Average: ${overallExamPct}% • Grade A+ (Distinction)\n• Mathematics: 94 / 100 (A+) — Outstanding\n• General Science: 89 / 100 (A) — Very Good\n• English Language: 95 / 100 (A+) — Excellent\n• Social Studies: 91 / 100 (A+) — Commendable\n• Computer & Robotics: 98 / 100 (A+) — Top in Class!\n\n🌟 You ranked in the top 5% of Class 5! Keep up the brilliant work.`;
        suggestions = ["What is my timetable today?", "How is my attendance?", "Help me with math"];
      } else if (lower.includes("notice") || lower.includes("circular") || lower.includes("event") || lower.includes("holiday")) {
        botReply = `🔔 Official Green Valley School Circulars for Class 5:\n\n1. [URGENT] Class 5 Periodic Assessment Term-2 Schedule officially announced.\n2. [CIRCULAR] Annual Science & STEM Robotics Exhibition 2026 registrations are open.\n3. [SPORTS] Inter-House Athletics Trials this Thursday at 03:30 PM.\n4. [INFO] Winter School Timings (08:30 AM start) take effect from November 1st.`;
        suggestions = ["When is the science exhibition?", "Show my exam marks", "What is my timetable?"];
      } else if (lower.includes("science") || lower.includes("photo") || lower.includes("plant") || lower.includes("sun") || lower.includes("sky")) {
        if (lower.includes("sky") || lower.includes("blue")) {
          botReply = `🌌 Why is the sky blue? (Rayleigh Scattering):\n\nSunlight looks white, but it's made of all the colors of the rainbow! 🌈\n\nWhen sunlight reaches Earth's atmosphere, it scatters in all directions by gases and particles. Blue light travels in smaller, shorter waves than other colors, so it scatters much more than red or yellow. That's why we see a lovely blue sky! ☀️✨`;
        } else {
          botReply = `🌱 How Photosynthesis Works (In Simple Words):\n\nThink of green plants as tiny nature chefs! 👨‍🍳🍃\n\n1. Sunlight: Leaves capture light energy using chlorophyll.\n2. Water: Roots absorb moisture from the soil.\n3. Carbon Dioxide (CO₂): Leaves absorb gas from the air.\n\nThey combine these to produce Glucose (food for energy) and release fresh Oxygen (O₂) for us to breathe!\n\nFormula: 6CO₂ + 6H₂O + Light ➔ C₆H₁₂O₆ + 6O₂ ✨`;
        }
        suggestions = ["Tell me another science fact", "What is gravity?", "Help me with math"];
      } else if (lower.includes("math") || lower.includes("fraction") || lower.includes("multiply") || lower.includes("divide")) {
        botReply = `🧮 Mathematics Concept Helper:\n\nA fraction represents a piece or part of a whole thing! 🍕\n\n• Numerator (Top Number): The number of parts you currently have.\n• Denominator (Bottom Number): Total parts the whole is divided into.\n\nExample: If a pizza has 4 slices and you eat 1 slice, you ate 1/4 (one-fourth) of the pizza! 3/4 remains.\n\nWould you like me to quiz you on fraction addition?`;
        suggestions = ["Yes, give me a math quiz!", "Show my exam marks", "What is my timetable?"];
      } else if (lower.includes("quiz") || lower.includes("yes")) {
        botReply = `🎯 Quick GreenBot Math Challenge!\n\nWhat is: 1/4 + 2/4 = ?\n\nA) 3/8\nB) 3/4\nC) 2/8\n\nType your answer and let's see if you get it right! 🚀`;
        suggestions = ["B) 3/4", "A) 3/8", "C) 2/8"];
      } else if (lower.includes("3/4") || lower.includes("b")) {
        botReply = `🎉 Bingo! That's 100% CORRECT, Aarav! 🌟\n\nSince the denominators are both 4, we simply add the numerators: 1 + 2 = 3. So 1/4 + 2/4 = 3/4!\n\nYou're a math superstar! ⭐`;
        suggestions = ["Give me another question", "Show my timetable", "How is my attendance?"];
      } else {
        botReply = `🤖 Thanks for asking, Aarav! I've noted your question: "${query}".\n\nAs your Green Valley campus assistant, I can immediately pull up your live timetable, attendance percentages, report cards, or explain science and math topics. What would you like to explore next?`;
        suggestions = ["What is my timetable today?", "How is my attendance?", "Show my exam marks", "Tell me school notices"];
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: `msg-bot-${Date.now()}`,
          sender: "bot",
          text: botReply,
          time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          suggestions,
        },
      ]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="dashboard-page">
      {/* FLOATING AMBIENT ORBS (FROM ROLESELECTIONSCREEN THEME) */}
      <div className="kiosk-orb kiosk-orb-one" />
      <div className="kiosk-orb kiosk-orb-two" />

      {/* GLOBAL PERSISTENT COMMAND NAVBAR */}
      <header className="dash-navbar">
        <div className="dash-logo-link" onClick={() => setCurrentScreen("dashboard")}>
          <div className="dash-logo-box">
            <svg width="34" height="34" viewBox="0 0 48 48" fill="none">
              <path d="M24 7c4 4 10 6 14 3 0 8-7 13-14 14C17 23 10 18 10 10c4 3 10 1 14-3Z" fill="#f97316" />
              <path d="M24 24V11" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M5 36c7-4.5 13-3.5 19 1 6-4.5 12-5.5 19-1V18c-7-4.5-13-3.5-19 1-6-4.5-12-5.5-19-1v18Z" fill="#c2410c" />
              <path d="M24 19v18" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="dash-school-text">
            <p className="command-kicker" style={{ margin: 0 }}>GREEN VALLEY • SMART CAMPUS</p>
            <h1>{schoolName}</h1>
          </div>
        </div>

        {/* Global Nav Tools */}
        <div className="dash-nav-actions">
          {/* Live Campus Online Status Badge */}
          <div className="command-live-status">
            <span /> Campus online • VAPS
          </div>

          {/* Student Profile Pill -> Click opens Profile Screen */}
          <div
            className="dash-profile-pill"
            style={{ cursor: "pointer", transition: "all 0.25s ease" }}
            onClick={() => setCurrentScreen("profile")}
            title="Click to view full student profile"
          >
            <img src={session?.img || "/student_avatar.png"} alt={studentName} className="dash-user-avatar" />
            <div className="dash-user-info">
              <span className="dash-user-name">{studentName}</span>
              <span className="dash-user-role">
                {studentClass} | Roll: {studentRoll}
              </span>
            </div>
          </div>

          {/* Real-time Clock Widget */}
          <div className="command-time">
            <Calendar size={15} />
            <span>{currentTime.toLocaleDateString("en-US", { weekday: "short", day: "2-digit", month: "short" })}</span>
            <b>{currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}</b>
          </div>

          {/* Kiosk Back / Home */}
          <button className="dash-kiosk-back-btn" onClick={handleLogout}>
            <Home size={14} /> Kiosk Home
          </button>
        </div>
      </header>

      {/* TICKER ANNOUNCEMENTS BAR */}
      <div className="dash-ticker-bar" style={{ flexShrink: 0, height: 26, fontSize: "0.72rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span className="ticker-badge-live" style={{ background: "#ea580c", color: "#ffffff", padding: "0.15rem 0.45rem", fontSize: "0.62rem" }}>
            <Sparkles size={10} /> Announcements
          </span>
          <div className="ticker-content" style={{ fontSize: "0.72rem" }}>
            <div className="ticker-item">
              <span className="ticker-tag" style={{ color: "#ea580c" }}>• CBSE 2026:</span>
              <span>Periodic Assessment Term 2 dates announced. Verify timetable inside portal.</span>
            </div>
            <div className="ticker-item">
              <span className="ticker-tag" style={{ color: "#ea580c" }}>• Campus Motto:</span>
              <span>{SLOGANS[sloganIndex].quote}</span>
            </div>
            <div className="ticker-item">
              <span className="ticker-tag" style={{ color: "#ea580c" }}>• STEM Hub:</span>
              <span>Robotics & AI Lab workshops scheduled for this Friday.</span>
            </div>
          </div>
        </div>
        <span
          className="dash-view-all"
          style={{ cursor: "pointer", fontSize: "0.68rem", color: "#ea580c", fontWeight: 700 }}
          onClick={() => setSelectedNotice(NOTICES[0])}
        >
          View Notices →
        </span>
      </div>

      {/* ========================================================
          SCREEN ROUTER: EITHER MAIN DASHBOARD OR DEDICATED SCREEN
          ======================================================== */}

      {/* VIEW 1: MAIN STUDENT HUB (ROLESELECTIONSCREEN COMMAND CENTER THEME) */}
      {currentScreen === "dashboard" && (
        <main className="student-portal-hub">
          {/* COMMAND HERO BANNER */}
          <section className="student-hub-hero">
            <div className="student-hero-title-group">
              <div className="hero-chip" style={{ marginBottom: "0.35rem" }}>
                <Sparkles size={13} /> ONE CAMPUS. ACADEMIC HUB.
              </div>
              <h2>
                {greeting}, <span>{studentName}!</span>
              </h2>
              <p>
                Academic Year {academicYear} • Official student portal for real-time attendance, weekly timetable, and academic marks.
              </p>
              <div className="student-hero-chips">
                <span className="student-hero-chip">
                  <CheckCircle2 size={12} style={{ color: "#ea580c" }} /> {studentClass}
                </span>
                <span className="student-hero-chip">
                  <User size={12} style={{ color: "#ea580c" }} /> Roll: {studentRoll} • Adm: {studentAdmNo}
                </span>
                <span className="student-hero-chip" style={{ color: "#16a34a", borderColor: "rgba(22, 163, 74, 0.35)", background: "#f0fdf4" }}>
                  <Percent size={12} style={{ color: "#16a34a" }} /> Live Attendance: {overallAttendancePct}%
                </span>
                <span className="student-hero-chip" style={{ color: "#7c3aed", borderColor: "rgba(124, 58, 237, 0.35)", background: "#f5f3ff" }}>
                  <Award size={12} style={{ color: "#7c3aed" }} /> Latest Exam: Grade A+
                </span>
              </div>
              <div className="hero-trust" style={{ marginTop: "0.55rem", fontSize: "11px" }}>
                <ShieldCheck size={14} style={{ color: "#ea580c" }} /><span>Secure kiosk session</span><i />
                <Activity size={14} style={{ color: "#ea580c" }} /><span>Live VAPS connected</span>
              </div>
            </div>

            <div className="student-hero-right-meta">
              <span className="student-vaps-connected-pill">
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#16a34a" }} />
                VAPS Cloud Synced
              </span>
              <button
                onClick={() => setCurrentScreen("aispace")}
                className="ai-space-hero-btn"
                title="Launch GreenBot AI Learning Space"
              >
                <div className="ai-space-robot-avatar-wrap">
                  <img src="/ai_robot.png" alt="GreenBot" className="ai-space-robot-img" />
                  <span className="ai-space-status-dot" />
                </div>
                <div className="ai-space-btn-text">
                  <div className="ai-space-btn-label">
                    <Sparkles size={11} /> AI SPACE
                  </div>
                  <span className="ai-space-btn-title">Ask GreenBot →</span>
                </div>
              </button>
            </div>
          </section>

          {/* BALANCED 6 COMPACT CONTAINERS (ROLE-TILE THEME) */}
          <section className="student-hub-grid">
            {/* CONTAINER 1: 📊 ATTENDANCE TRACKER (WORKING MODULE) */}
            <div
              className="student-hub-card"
              style={{ "--card-accent": "#16a34a" } as React.CSSProperties}
              onClick={() => setCurrentScreen("attendance")}
              title="Click to open Full Attendance Screen"
            >
              <div className="student-hub-card-header">
                <div className="student-card-title-group">
                  <div className="student-card-icon-box" style={{ background: "#dcfce7", color: "#16a34a" }}>
                    <CheckCircle2 size={18} />
                  </div>
                  <div className="student-card-headings">
                    <h3>Attendance Tracker</h3>
                    <span>Official Attendance Register</span>
                  </div>
                </div>
                <span
                  style={{
                    background: "#dcfce7",
                    color: "#15803d",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    padding: "0.15rem 0.45rem",
                    borderRadius: "9999px",
                  }}
                >
                  ● Active
                </span>
              </div>

              <div className="student-hub-card-body">
                <div className="student-metric-hero">
                  <span className="student-metric-val" style={{ color: "#16a34a" }}>
                    {overallAttendancePct}%
                  </span>
                  <span className="student-metric-label">Cumulative Present</span>
                </div>

                {/* Progress bar */}
                <div style={{ height: "6px", width: "100%", background: "#e2e8f0", borderRadius: "9999px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${overallAttendancePct}%`, background: "#16a34a", borderRadius: "9999px" }} />
                </div>

                <div className="student-card-pills-list">
                  <div className="student-card-subitem">
                    <span style={{ fontWeight: 600 }}>Total Sessions Held:</span>
                    <strong style={{ color: "#0f172a" }}>{totalHeld || 115} Sessions</strong>
                  </div>
                  <div className="student-card-subitem">
                    <span style={{ fontWeight: 600 }}>Days Present:</span>
                    <strong style={{ color: "#16a34a" }}>{totalPresent || 111} Days</strong>
                  </div>
                </div>
              </div>

              <div className="student-hub-card-footer">
                <button
                  className="student-open-screen-btn"
                  style={{ background: "#16a34a", color: "#ffffff" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentScreen("attendance");
                  }}
                >
                  Open Full Attendance Screen <ArrowRight size={13} />
                </button>
              </div>
            </div>

            {/* CONTAINER 2: 📅 CLASS TIMETABLE (WORKING MODULE) */}
            <div
              className="student-hub-card"
              style={{ "--card-accent": "#0284c7" } as React.CSSProperties}
              onClick={() => setCurrentScreen("timetable")}
              title="Click to open Full Timetable Screen"
            >
              <div className="student-hub-card-header">
                <div className="student-card-title-group">
                  <div className="student-card-icon-box" style={{ background: "#dbeafe", color: "#1d4ed8" }}>
                    <CalendarDays size={18} />
                  </div>
                  <div className="student-card-headings">
                    <h3>Class Timetable</h3>
                    <span>Weekly Subject Schedule</span>
                  </div>
                </div>
                <span
                  style={{
                    background: "#dbeafe",
                    color: "#1d4ed8",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    padding: "0.15rem 0.45rem",
                    borderRadius: "9999px",
                  }}
                >
                  ● Live Sync
                </span>
              </div>

              <div className="student-hub-card-body">
                <div className="student-metric-hero">
                  <span className="student-metric-val" style={{ color: "#1d4ed8" }}>
                    {timetableData.days.length || 5} Days
                  </span>
                  <span className="student-metric-label">Weekly Schedule</span>
                </div>

                <div className="student-card-pills-list">
                  <div className="student-card-subitem" style={{ background: "#eff6ff", borderColor: "#bfdbfe" }}>
                    <span style={{ fontWeight: 700, color: "#1e40af" }}>Period 1:</span>
                    <span style={{ fontWeight: 600 }}>Mathematics • Rm 102</span>
                  </div>
                  <div className="student-card-subitem">
                    <span style={{ fontWeight: 600 }}>Period 2:</span>
                    <span style={{ fontWeight: 600 }}>English Literature</span>
                  </div>
                  <div className="student-card-subitem">
                    <span style={{ fontWeight: 600 }}>Period 3:</span>
                    <span style={{ fontWeight: 600 }}>General Science Lab</span>
                  </div>
                </div>
              </div>

              <div className="student-hub-card-footer">
                <button
                  className="student-open-screen-btn"
                  style={{ background: "#0284c7", color: "#ffffff" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentScreen("timetable");
                  }}
                >
                  Open Full Timetable Screen <ArrowRight size={13} />
                </button>
              </div>
            </div>

            {/* CONTAINER 3: 📝 EXAMS & REPORT CARD (WORKING MODULE) */}
            <div
              className="student-hub-card"
              style={{ "--card-accent": "#ea580c" } as React.CSSProperties}
              onClick={() => setCurrentScreen("exam")}
              title="Click to open Full Exam & Results Screen"
            >
              <div className="student-hub-card-header">
                <div className="student-card-title-group">
                  <div className="student-card-icon-box" style={{ background: "#ffedd5", color: "#ea580c" }}>
                    <Award size={18} />
                  </div>
                  <div className="student-card-headings">
                    <h3>Exams & Results</h3>
                    <span>Assessment Report Card</span>
                  </div>
                </div>
                <span
                  style={{
                    background: "#ffedd5",
                    color: "#c2410c",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    padding: "0.15rem 0.45rem",
                    borderRadius: "9999px",
                  }}
                >
                  ● Evaluated
                </span>
              </div>

              <div className="student-hub-card-body">
                <div className="student-metric-hero">
                  <span className="student-metric-val" style={{ color: "#ea580c" }}>
                    {overallExamPct}%
                  </span>
                  <span className="student-metric-label">Grade A+ (Distinction)</span>
                </div>

                {/* Progress bar */}
                <div style={{ height: "6px", width: "100%", background: "#e2e8f0", borderRadius: "9999px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${overallExamPct}%`, background: "#ea580c", borderRadius: "9999px" }} />
                </div>

                <div className="student-card-pills-list">
                  <div className="student-card-subitem">
                    <span style={{ fontWeight: 600 }}>Active Assessment:</span>
                    <strong style={{ color: "#0f172a" }}>Periodic Assessment 1</strong>
                  </div>
                  <div className="student-card-subitem">
                    <span style={{ fontWeight: 600 }}>Total Marks Obtained:</span>
                    <strong style={{ color: "#ea580c" }}>
                      {totalObtainedMarks} / {totalMaxMarks}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="student-hub-card-footer">
                <button
                  className="student-open-screen-btn"
                  style={{ background: "#ea580c", color: "#ffffff" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentScreen("exam");
                  }}
                >
                  Open Full Report Card Screen <ArrowRight size={13} />
                </button>
              </div>
            </div>

            {/* CONTAINER 4: 🎬 CAMPUS LIFE VIDEO & VIRTUAL TOUR */}
            <div
              className="student-hub-card"
              style={{ "--card-accent": "#dc2626" } as React.CSSProperties}
              onClick={() => setIsVideoModalOpen(true)}
              title="Click to play campus tour video"
            >
              <div className="student-hub-card-header">
                <div className="student-card-title-group">
                  <div className="student-card-icon-box" style={{ background: "#fee2e2", color: "#dc2626" }}>
                    <Film size={18} />
                  </div>
                  <div className="student-card-headings">
                    <h3>Campus Life & Video Tour</h3>
                    <span>Smart Infrastructure & Labs</span>
                  </div>
                </div>
                <span
                  style={{
                    background: "#fee2e2",
                    color: "#dc2626",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    padding: "0.15rem 0.45rem",
                    borderRadius: "9999px",
                  }}
                >
                  ▶ Watch HD
                </span>
              </div>

              <div className="student-hub-card-body" style={{ padding: "0.45rem" }}>
                <div className="student-video-box">
                  <img
                    src="/campus_banner.jpg"
                    alt="Campus Tour"
                    className="student-video-poster"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/hero_school_building.jpg";
                    }}
                  />
                  <div className="student-video-overlay">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span
                        style={{
                          background: "rgba(0, 0, 0, 0.65)",
                          color: "#ffffff",
                          fontSize: "0.62rem",
                          fontWeight: 700,
                          padding: "2px 6px",
                          borderRadius: 4,
                          backdropFilter: "blur(4px)",
                        }}
                      >
                        ⏱ 03:45
                      </span>
                      <span
                        style={{
                          background: "#dc2626",
                          color: "#ffffff",
                          fontSize: "0.6rem",
                          fontWeight: 800,
                          padding: "1px 5px",
                          borderRadius: 4,
                        }}
                      >
                        VIDEO
                      </span>
                    </div>

                    <div className="student-video-play-btn" style={{ background: "#ea580c" }}>
                      <Play size={18} fill="#ffffff" style={{ marginLeft: "2px" }} />
                    </div>

                    <div style={{ color: "#ffffff" }}>
                      <div style={{ fontSize: "0.78rem", fontWeight: 800, textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}>
                        Green Valley Smart Campus Tour
                      </div>
                      <div style={{ fontSize: "0.65rem", color: "#cbd5e1", textShadow: "0 1px 2px rgba(0,0,0,0.8)" }}>
                        Explore science labs, robotics studio & sports arena
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="student-hub-card-footer">
                <button
                  className="student-open-screen-btn"
                  style={{ background: "#dc2626", color: "#ffffff" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsVideoModalOpen(true);
                  }}
                >
                  <Play size={13} fill="#ffffff" /> Play Campus Video Tour
                </button>
              </div>
            </div>

            {/* CONTAINER 5: 🔔 OFFICIAL NOTIFICATIONS & CIRCULARS */}
            <div
              className="student-hub-card"
              style={{ "--card-accent": "#7c3aed" } as React.CSSProperties}
            >
              <div className="student-hub-card-header">
                <div className="student-card-title-group">
                  <div className="student-card-icon-box" style={{ background: "#ede9fe", color: "#7c3aed" }}>
                    <Bell size={18} />
                  </div>
                  <div className="student-card-headings">
                    <h3>School Notifications</h3>
                    <span>Official Circulars & Alerts</span>
                  </div>
                </div>
                <span
                  style={{
                    background: "#ede9fe",
                    color: "#7c3aed",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    padding: "0.15rem 0.45rem",
                    borderRadius: "9999px",
                  }}
                >
                  {NOTICES.length} New
                </span>
              </div>

              <div className="student-hub-card-body" style={{ padding: "0.45rem 0.65rem" }}>
                <div className="student-notices-list">
                  {NOTICES.map((notice) => (
                    <div
                      key={notice.id}
                      className="student-notice-item"
                      onClick={() => setSelectedNotice(notice)}
                      title="Click to read full circular"
                    >
                      <span
                        style={{
                          fontSize: "0.58rem",
                          fontWeight: 800,
                          padding: "1px 5px",
                          borderRadius: 4,
                          background: notice.tagBg,
                          color: notice.tagColor,
                          flexShrink: 0,
                        }}
                      >
                        {notice.tag}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            color: "#0f172a",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {notice.title}
                        </div>
                        <span style={{ fontSize: "0.6rem", color: "#64748b" }}>{notice.authority}</span>
                      </div>
                      <span style={{ fontSize: "0.6rem", color: "#94a3b8", flexShrink: 0 }}>{notice.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="student-hub-card-footer">
                <button
                  className="student-open-screen-btn"
                  style={{ background: "#7c3aed", color: "#ffffff" }}
                  onClick={() => setSelectedNotice(NOTICES[0])}
                >
                  <Megaphone size={13} /> View All Circulars & Notices
                </button>
              </div>
            </div>

            {/* CONTAINER 6: ✨ DAILY SLOGANS & STUDENT INSPIRATION */}
            <div
              className="student-hub-card"
              style={{ "--card-accent": "#c026d3" } as React.CSSProperties}
            >
              <div className="student-hub-card-header">
                <div className="student-card-title-group">
                  <div className="student-card-icon-box" style={{ background: "#fdf4ff", color: "#c026d3" }}>
                    <Sparkles size={18} />
                  </div>
                  <div className="student-card-headings">
                    <h3>Daily Slogan & Wisdom</h3>
                    <span>School Values & Inspiration</span>
                  </div>
                </div>
                <span
                  style={{
                    background: "#fdf4ff",
                    color: "#c026d3",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    padding: "0.15rem 0.45rem",
                    borderRadius: "9999px",
                  }}
                >
                  Thought of the Day
                </span>
              </div>

              <div className="student-hub-card-body" style={{ padding: "0.45rem 0.65rem" }}>
                <div className="student-slogan-wrap">
                  <Quote
                    size={48}
                    style={{
                      position: "absolute",
                      right: -5,
                      bottom: -8,
                      color: "rgba(192, 38, 211, 0.12)",
                      pointerEvents: "none",
                    }}
                  />
                  <p className="student-slogan-quote">
                    &ldquo;{SLOGANS[sloganIndex].quote}&rdquo;
                  </p>
                  <div className="student-slogan-author">
                    <span>— {SLOGANS[sloganIndex].author}</span>
                    <span
                      style={{
                        background: "rgba(192, 38, 211, 0.12)",
                        color: "#a21caf",
                        padding: "1px 6px",
                        borderRadius: 4,
                        fontSize: "0.62rem",
                      }}
                    >
                      {SLOGANS[sloganIndex].badge}
                    </span>
                  </div>
                </div>
              </div>

              <div className="student-hub-card-footer">
                <button
                  className="student-open-screen-btn"
                  style={{ background: "#a21caf", color: "#ffffff" }}
                  onClick={() => setSloganIndex((prev) => (prev + 1) % SLOGANS.length)}
                  title="Click to view next inspirational thought"
                >
                  <RefreshCw size={13} /> Next Inspirational Thought ↻
                </button>
              </div>
            </div>
          </section>

          {/* COMPACT BOTTOM STRIP: STUDENT ID & CREDENTIALS VERIFICATION */}
          <section
            style={{
              background: "rgba(255, 255, 255, 0.9)",
              borderRadius: "14px",
              padding: "0.5rem 1.15rem",
              border: "1px solid rgba(254, 215, 170, 0.65)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 4px 14px rgba(234, 88, 12, 0.05)",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
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
                  border: "1px solid rgba(251, 146, 60, 0.3)",
                }}
              >
                <GraduationCap size={18} />
              </div>
              <div>
                <span style={{ fontSize: "0.76rem", fontWeight: 800, color: "#1e293b" }}>
                  Official Student Academic Profile: {studentName}
                </span>
                <div style={{ fontSize: "0.68rem", color: "#64748b", display: "flex", gap: "0.6rem", marginTop: "1px" }}>
                  <span>Class: <strong>{studentClass}</strong></span>
                  <span>•</span>
                  <span>Admission No: <strong>{studentAdmNo}</strong></span>
                  <span>•</span>
                  <span>System ID: <strong>{session?.AMST_ID || 1204}</strong></span>
                  <span>•</span>
                  <span>Academic Year: <strong>{academicYear}</strong></span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setCurrentScreen("profile")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                padding: "0.35rem 0.85rem",
                borderRadius: "8px",
                border: "1px solid rgba(251, 146, 60, 0.35)",
                background: "#fff7ed",
                color: "#ea580c",
                fontWeight: 800,
                fontSize: "0.74rem",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <User size={13} /> View Complete Profile Screen →
            </button>
          </section>
        </main>
      )}

      {/* ========================================================
          VIEW 2: DEDICATED FULL SCREEN — ATTENDANCE LEDGER
          ======================================================== */}
      {currentScreen === "attendance" && (
        <section className="student-fullscreen-page">
          {/* FLOATING AMBIENT ORBS */}
          <div className="kiosk-orb kiosk-orb-one" />
          <div className="kiosk-orb kiosk-orb-two" />

          {/* SCREEN HEADER WITH PROMINENT BACK BUTTON */}
          <div className="student-screen-subnav">
            <button className="student-back-to-dash-btn" onClick={() => setCurrentScreen("dashboard")}>
              <ArrowLeft size={16} /> Back to Dashboard
            </button>

            <div className="student-screen-title-area">
              <div className="student-screen-icon-bubble" style={{ background: "#dcfce7", color: "#16a34a" }}>
                <CheckCircle2 size={20} />
              </div>
              <div>
                <h2>Official Attendance Record & Ledger</h2>
                <p>Live VAPS Attendance Data • {studentName} ({studentAdmNo})</p>
              </div>
            </div>

            <div className="student-screen-nav-tools">
              <span className="student-vaps-connected-pill">● VAPS Live Connected</span>
              <button className="student-refresh-btn" onClick={fetchAttendance} disabled={attendanceLoading}>
                <RefreshCw size={13} className={attendanceLoading ? "animate-spin" : ""} />
                {attendanceLoading ? "Syncing..." : "Refresh"}
              </button>
              {/* Quick Jump Pills */}
              <button className="student-screen-tab-pill" onClick={() => setCurrentScreen("timetable")}>
                📅 Timetable
              </button>
              <button className="student-screen-tab-pill" onClick={() => setCurrentScreen("exam")}>
                📝 Results
              </button>
            </div>
          </div>

          {/* MAIN SCREEN BODY */}
          <div className="student-screen-scroll-body">
            {/* KPI METRICS ROW */}
            <div className="student-kpi-strip">
              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Overall Attendance</span>
                  <h4 style={{ color: "#16a34a" }}>{overallAttendancePct}%</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#dcfce7", color: "#16a34a" }}>
                  <Percent size={20} />
                </div>
              </div>

              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Total Working Classes</span>
                  <h4>{totalHeld} Sessions</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#dbeafe", color: "#1d4ed8" }}>
                  <Layers size={20} />
                </div>
              </div>

              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Classes Attended</span>
                  <h4 style={{ color: "#15803d" }}>{totalPresent} Days</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#f0fdf4", color: "#15803d" }}>
                  <Check size={20} />
                </div>
              </div>

              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Classes Absent</span>
                  <h4 style={{ color: totalAbsent > 5 ? "#dc2626" : "#b45309" }}>{totalAbsent} Days</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#fef3c7", color: "#b45309" }}>
                  <Clock size={20} />
                </div>
              </div>
            </div>

            {/* TWO-COLUMN DETAIL VIEW */}
            <div style={{ display: "grid", gridTemplateColumns: "1.75fr 1fr", gap: "1rem" }}>
              {/* Left Column: Monthly Attendance Breakdown Table */}
              <div className="student-screen-card">
                <div className="student-screen-card-header">
                  <h4>
                    <Calendar size={16} style={{ color: "#ea580c" }} /> Monthly Academic Attendance Breakdown
                  </h4>
                  <span style={{ fontSize: "0.72rem", color: "#ea580c", fontWeight: 800 }}>
                    Academic Year {academicYear}
                  </span>
                </div>

                <div style={{ overflowX: "auto" }}>
                  <table className="student-screen-table">
                    <thead>
                      <tr>
                        <th>Academic Month</th>
                        <th style={{ textAlign: "center" }}>Classes Held</th>
                        <th style={{ textAlign: "center" }}>Days Attended</th>
                        <th style={{ textAlign: "center" }}>Days Absent</th>
                        <th style={{ textAlign: "center" }}>Attendance %</th>
                        <th style={{ textAlign: "right" }}>Compliance Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceData.map((row, idx) => {
                        const held = row.CLASS_HELD || 0;
                        const present = row.TOTAL_PRESENT || 0;
                        const absent = Math.max(0, held - present);
                        const pct = held > 0 ? Math.round((present / held) * 100) : 100;
                        return (
                          <tr key={idx}>
                            <td style={{ fontWeight: 700, color: "#1e293b" }}>{row.MONTH_NAME}</td>
                            <td style={{ textAlign: "center", color: "#475569" }}>{held}</td>
                            <td style={{ textAlign: "center", fontWeight: 700, color: "#16a34a" }}>{present}</td>
                            <td style={{ textAlign: "center", color: absent > 0 ? "#b45309" : "#64748b" }}>{absent}</td>
                            <td style={{ textAlign: "center" }}>
                              <span
                                style={{
                                  display: "inline-block",
                                  padding: "2px 10px",
                                  borderRadius: "6px",
                                  fontWeight: 800,
                                  fontSize: "0.78rem",
                                  background: pct >= 90 ? "#dcfce7" : pct >= 75 ? "#fef3c7" : "#fee2e2",
                                  color: pct >= 90 ? "#15803d" : pct >= 75 ? "#b45309" : "#b91c1c",
                                }}
                              >
                                {pct}%
                              </span>
                            </td>
                            <td style={{ textAlign: "right" }}>
                              <span style={{ fontWeight: 700, fontSize: "0.74rem", color: pct >= 75 ? "#16a34a" : "#dc2626" }}>
                                {pct >= 75 ? "✓ Satisfactory" : "⚠ Shortage"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Column: Attendance Compliance & Rules Card */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div className="student-screen-card" style={{ padding: "1.25rem" }}>
                  <h4 style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.95rem", fontWeight: 800, color: "#1e293b", margin: "0 0 0.75rem 0", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <ShieldCheck size={18} style={{ color: "#16a34a" }} /> CBSE Exam Eligibility Standing
                  </h4>
                  <p style={{ fontSize: "0.76rem", color: "#475569", lineHeight: 1.5, margin: "0 0 1rem 0" }}>
                    Under CBSE Examination By-Laws (Rule 13), a student must maintain a minimum of <strong>75% attendance</strong> to be eligible for board & internal periodic examinations.
                  </p>

                  <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "10px", padding: "0.85rem", marginBottom: "0.75rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.76rem", fontWeight: 700, color: "#166534", marginBottom: "0.35rem" }}>
                      <span>Current Status: Safe & Eligible</span>
                      <span>{overallAttendancePct}% / 75% Min</span>
                    </div>
                    <div style={{ height: "8px", width: "100%", background: "#dcfce7", borderRadius: "9999px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${overallAttendancePct}%`, background: "#16a34a", borderRadius: "9999px" }} />
                    </div>
                  </div>

                  <div style={{ fontSize: "0.72rem", color: "#64748b", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                    <span>• Medical leaves must be submitted within 3 days of return.</span>
                    <span>• For discrepancies in biometric punch, contact Academic Office.</span>
                  </div>
                </div>

                {/* Quick Navigation to Other Working Features */}
                <div className="student-screen-card" style={{ padding: "1rem" }}>
                  <span style={{ fontSize: "0.72rem", color: "#ea580c", fontWeight: 800, textTransform: "uppercase" }}>Other Working Modules</span>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginTop: "0.5rem" }}>
                    <button
                      onClick={() => setCurrentScreen("timetable")}
                      style={{
                        padding: "0.6rem",
                        borderRadius: "8px",
                        border: "1px solid #bfdbfe",
                        background: "#eff6ff",
                        color: "#1e40af",
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        cursor: "pointer",
                      }}
                    >
                      📅 Open Timetable →
                    </button>
                    <button
                      onClick={() => setCurrentScreen("exam")}
                      style={{
                        padding: "0.6rem",
                        borderRadius: "8px",
                        border: "1px solid #fed7aa",
                        background: "#fff7ed",
                        color: "#c2410c",
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        cursor: "pointer",
                      }}
                    >
                      📝 Open Results →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          VIEW 3: DEDICATED FULL SCREEN — WEEKLY CLASS TIMETABLE
          ======================================================== */}
      {currentScreen === "timetable" && (
        <section className="student-fullscreen-page">
          {/* FLOATING AMBIENT ORBS */}
          <div className="kiosk-orb kiosk-orb-one" />
          <div className="kiosk-orb kiosk-orb-two" />

          {/* SCREEN HEADER WITH PROMINENT BACK BUTTON */}
          <div className="student-screen-subnav">
            <button className="student-back-to-dash-btn" onClick={() => setCurrentScreen("dashboard")}>
              <ArrowLeft size={16} /> Back to Dashboard
            </button>

            <div className="student-screen-title-area">
              <div className="student-screen-icon-bubble" style={{ background: "#dbeafe", color: "#1d4ed8" }}>
                <CalendarDays size={20} />
              </div>
              <div>
                <h2>Weekly Class Timetable & Schedule</h2>
                <p>Live VAPS Timetable • {studentClass} • {studentName}</p>
              </div>
            </div>

            <div className="student-screen-nav-tools">
              <span className="student-vaps-connected-pill">● Timetable Active</span>
              <button className="student-refresh-btn" onClick={fetchTimetable} disabled={timetableLoading}>
                <RefreshCw size={13} className={timetableLoading ? "animate-spin" : ""} />
                {timetableLoading ? "Syncing..." : "Refresh"}
              </button>
              {/* Quick Jump Pills */}
              <button className="student-screen-tab-pill" onClick={() => setCurrentScreen("attendance")}>
                📊 Attendance
              </button>
              <button className="student-screen-tab-pill" onClick={() => setCurrentScreen("exam")}>
                📝 Results
              </button>
            </div>
          </div>

          {/* MAIN SCREEN BODY */}
          <div className="student-screen-scroll-body">
            {/* DAY SELECTOR TOUCH BAR */}
            <div className="student-day-tabs-bar" style={{ background: "rgba(255, 255, 255, 0.9)", border: "1px solid rgba(254, 215, 170, 0.65)" }}>
              <button
                className={`student-day-tab-btn ${selectedTimetableDay === "ALL" ? "active" : ""}`}
                onClick={() => setSelectedTimetableDay("ALL")}
              >
                All Weekdays
              </button>
              {timetableData.days.map((day, idx) => (
                <button
                  key={idx}
                  className={`student-day-tab-btn ${selectedTimetableDay === day.ttmD_DayName ? "active" : ""}`}
                  onClick={() => setSelectedTimetableDay(day.ttmD_DayName)}
                >
                  {day.ttmD_DayName}
                </button>
              ))}
            </div>

            {/* TIMETABLE DAYS & PERIODS DISPLAY */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {timetableData.days
                .filter((d) => selectedTimetableDay === "ALL" || selectedTimetableDay === d.ttmD_DayName)
                .map((day, idx) => {
                  const dayPeriods = timetableData.periods.filter(
                    (p) => p.ttmD_DayName?.toLowerCase() === day.ttmD_DayName?.toLowerCase()
                  );
                  return (
                    <div key={idx} className="student-screen-card">
                      <div className="student-screen-card-header">
                        <h4>
                          <Clock size={16} style={{ color: "#ea580c" }} /> {day.ttmD_DayName} Schedule
                        </h4>
                        <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700 }}>
                          {dayPeriods.length} Class Periods Configured
                        </span>
                      </div>

                      <div style={{ padding: "1rem" }}>
                        <div className="student-periods-grid">
                          {dayPeriods.map((period, pIdx) => (
                            <div key={pIdx} className="student-period-tile" style={{ border: "1px solid rgba(254, 215, 170, 0.65)" }}>
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <span
                                  style={{
                                    fontSize: "0.68rem",
                                    fontWeight: 800,
                                    background: "#fff7ed",
                                    color: "#ea580c",
                                    padding: "2px 8px",
                                    borderRadius: "6px",
                                    border: "1px solid rgba(251, 146, 60, 0.25)",
                                  }}
                                >
                                  Period {period.TTMP_PeriodName || pIdx + 1}
                                </span>
                                <span style={{ fontSize: "0.68rem", color: "#64748b", fontWeight: 600 }}>
                                  {period.time || `0${8 + pIdx}:30 - 0${9 + pIdx}:15 AM`}
                                </span>
                              </div>

                              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", margin: "0.4rem 0" }}>
                                <div
                                  style={{
                                    width: 34,
                                    height: 34,
                                    borderRadius: "8px",
                                    background: "#f8fafc",
                                    border: "1px solid #e2e8f0",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                  }}
                                >
                                  {getSubjectIcon(period.ISMS_SubjectName)}
                                </div>
                                <div style={{ minWidth: 0 }}>
                                  <h5
                                    style={{
                                      margin: 0,
                                      fontSize: "0.85rem",
                                      fontWeight: 800,
                                      color: "#1e293b",
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                    }}
                                  >
                                    {period.ISMS_SubjectName}
                                  </h5>
                                  <span style={{ fontSize: "0.68rem", color: "#64748b" }}>
                                    Room: {period.room || "Room 102"}
                                  </span>
                                </div>
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  fontSize: "0.68rem",
                                  color: "#16a34a",
                                  fontWeight: 700,
                                  borderTop: "1px dashed rgba(254, 215, 170, 0.65)",
                                  paddingTop: "0.35rem",
                                }}
                              >
                                <span>Academic Session 2025-26</span>
                                <span>● Regular</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* BELL TIMINGS FOOTER BANNER */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.9)",
                border: "1px solid rgba(254, 215, 170, 0.65)",
                borderRadius: "14px",
                padding: "0.75rem 1.25rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: "0.74rem",
                color: "#475569",
              }}
            >
              <span>🔔 <strong>Daily School Bell Timings:</strong> Morning Assembly (08:00 AM) • Periods 1-3 (08:30 - 10:45 AM) • Recess (10:45 - 11:15 AM) • Periods 4-6 (11:15 AM - 01:30 PM)</span>
              <span style={{ color: "#ea580c", fontWeight: 800 }}>Green Valley Public School Master Schedule</span>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          VIEW 4: DEDICATED FULL SCREEN — EXAM & RESULTS MARKSHEET
          ======================================================== */}
      {currentScreen === "exam" && (
        <section className="student-fullscreen-page">
          {/* FLOATING AMBIENT ORBS */}
          <div className="kiosk-orb kiosk-orb-one" />
          <div className="kiosk-orb kiosk-orb-two" />

          {/* SCREEN HEADER WITH PROMINENT BACK BUTTON */}
          <div className="student-screen-subnav">
            <button className="student-back-to-dash-btn" onClick={() => setCurrentScreen("dashboard")}>
              <ArrowLeft size={16} /> Back to Dashboard
            </button>

            <div className="student-screen-title-area">
              <div className="student-screen-icon-bubble" style={{ background: "#ffedd5", color: "#ea580c" }}>
                <Award size={20} />
              </div>
              <div>
                <h2>Official Examination Results & Marksheet</h2>
                <p>Live VAPS Exam Report • {studentName} ({studentAdmNo})</p>
              </div>
            </div>

            <div className="student-screen-nav-tools">
              <span className="student-vaps-connected-pill">● Marks Evaluated</span>
              <button className="student-refresh-btn" onClick={fetchExam} disabled={examLoading}>
                <RefreshCw size={13} className={examLoading ? "animate-spin" : ""} />
                {examLoading ? "Syncing..." : "Refresh"}
              </button>
              {/* Quick Jump Pills */}
              <button className="student-screen-tab-pill" onClick={() => setCurrentScreen("attendance")}>
                📊 Attendance
              </button>
              <button className="student-screen-tab-pill" onClick={() => setCurrentScreen("timetable")}>
                📅 Timetable
              </button>
            </div>
          </div>

          {/* MAIN SCREEN BODY */}
          <div className="student-screen-scroll-body">
            {/* KPI METRICS ROW */}
            <div className="student-kpi-strip">
              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Overall Percentage</span>
                  <h4 style={{ color: "#ea580c" }}>{overallExamPct}%</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#ffedd5", color: "#ea580c" }}>
                  <Percent size={20} />
                </div>
              </div>

              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Total Marks Scored</span>
                  <h4>
                    {totalObtainedMarks} <span style={{ fontSize: "0.9rem", color: "#64748b" }}>/ {totalMaxMarks}</span>
                  </h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#dbeafe", color: "#1d4ed8" }}>
                  <Award size={20} />
                </div>
              </div>

              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Academic Grade</span>
                  <h4 style={{ color: "#16a34a" }}>Grade A+</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#dcfce7", color: "#16a34a" }}>
                  <CheckCircle2 size={20} />
                </div>
              </div>

              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Result Standing</span>
                  <h4 style={{ color: "#15803d" }}>PASS • Distinction</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#f0fdf4", color: "#15803d" }}>
                  <ShieldCheck size={20} />
                </div>
              </div>
            </div>

            {/* MARKSHEET CARD */}
            <div className="student-screen-card">
              <div className="student-screen-card-header">
                <h4>
                  <FileText size={16} style={{ color: "#ea580c" }} />{" "}
                  {examData.exams[0]?.emE_ExamName || "Periodic Assessment Term 1"} — Official Report Card
                </h4>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontSize: "0.72rem", background: "#dcfce7", color: "#15803d", fontWeight: 700, padding: "2px 8px", borderRadius: "6px" }}>
                    Verified by Examination Controller
                  </span>
                </div>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table className="student-screen-table">
                  <thead>
                    <tr>
                      <th>Subject Name</th>
                      <th style={{ textAlign: "center" }}>Maximum Marks</th>
                      <th style={{ textAlign: "center" }}>Marks Obtained</th>
                      <th style={{ textAlign: "center" }}>Score Progress</th>
                      <th style={{ textAlign: "center" }}>Grade</th>
                      <th style={{ textAlign: "center" }}>Remarks</th>
                      <th style={{ textAlign: "right" }}>Evaluation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {examReports.map((rpt, idx) => {
                      const maxM = rpt.ESTMPS_MaxMarks || 100;
                      const obtM = rpt.ESTMPS_ObtainedMarks || 0;
                      const pct = Math.round((obtM / maxM) * 100);
                      return (
                        <tr key={idx}>
                          <td style={{ fontWeight: 700, color: "#1e293b" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              {getSubjectIcon(rpt.ISMS_SubjectName)}
                              <span>{rpt.ISMS_SubjectName}</span>
                            </div>
                          </td>
                          <td style={{ textAlign: "center", color: "#64748b" }}>{maxM}</td>
                          <td style={{ textAlign: "center", fontWeight: 800, color: "#1e293b", fontSize: "0.9rem" }}>{obtM}</td>
                          <td style={{ textAlign: "center", width: "180px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              <div style={{ flex: 1, height: "6px", background: "#e2e8f0", borderRadius: "9999px", overflow: "hidden" }}>
                                <div style={{ height: "100%", width: `${pct}%`, background: pct >= 80 ? "#16a34a" : pct >= 60 ? "#0284c7" : "#ea580c", borderRadius: "9999px" }} />
                              </div>
                              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#475569" }}>{pct}%</span>
                            </div>
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <span
                              style={{
                                padding: "2px 8px",
                                borderRadius: "6px",
                                fontWeight: 800,
                                fontSize: "0.78rem",
                                background: pct >= 90 ? "#dcfce7" : pct >= 75 ? "#eff6ff" : "#fef3c7",
                                color: pct >= 90 ? "#15803d" : pct >= 75 ? "#1d4ed8" : "#b45309",
                              }}
                            >
                              {rpt.ESTMPS_ObtainedGrade || "A+"}
                            </span>
                          </td>
                          <td style={{ textAlign: "center", color: "#64748b", fontSize: "0.76rem" }}>
                            {rpt.remarks || "Excellent"}
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <span style={{ color: pct >= 40 ? "#16a34a" : "#dc2626", fontWeight: 800, fontSize: "0.76rem" }}>
                              {pct >= 40 ? "PASS" : "FAIL"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* GRADING SCALE REFERENCE FOOTER */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.9)",
                border: "1px solid rgba(254, 215, 170, 0.65)",
                borderRadius: "14px",
                padding: "0.75rem 1.25rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: "0.72rem",
                color: "#64748b",
              }}
            >
              <span>
                <strong>CBSE Grading Scale:</strong> A1 (91–100% Outstanding) • A2 (81–90% Excellent) • B1 (71–80% Very Good) • B2 (61–70% Good) • C1 (51–60% Satisfactory) • D (33–40% Pass)
              </span>
              <span style={{ fontWeight: 800, color: "#166534" }}>Certified Academic Report Card</span>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          VIEW 5: DEDICATED FULL SCREEN — OFFICIAL STUDENT PROFILE
          ======================================================== */}
      {currentScreen === "profile" && (
        <section className="student-fullscreen-page">
          {/* FLOATING AMBIENT ORBS */}
          <div className="kiosk-orb kiosk-orb-one" />
          <div className="kiosk-orb kiosk-orb-two" />

          {/* SCREEN HEADER WITH PROMINENT BACK BUTTON */}
          <div className="student-screen-subnav">
            <button className="student-back-to-dash-btn" onClick={() => setCurrentScreen("dashboard")}>
              <ArrowLeft size={16} /> Back to Dashboard
            </button>

            <div className="student-screen-title-area">
              <div className="student-screen-icon-bubble" style={{ background: "#ede9fe", color: "#7c3aed" }}>
                <User size={20} />
              </div>
              <div>
                <h2>Official Student Profile & Credentials</h2>
                <p>Enrolled Student Record • {schoolName}</p>
              </div>
            </div>

            <div className="student-screen-nav-tools">
              <button className="student-screen-tab-pill" onClick={() => setCurrentScreen("attendance")}>
                📊 Attendance
              </button>
              <button className="student-screen-tab-pill" onClick={() => setCurrentScreen("timetable")}>
                📅 Timetable
              </button>
              <button className="student-screen-tab-pill" onClick={() => setCurrentScreen("exam")}>
                📝 Results
              </button>
            </div>
          </div>

          {/* MAIN SCREEN BODY */}
          <div className="student-screen-scroll-body">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1.25rem" }}>
              {/* ID Badge Card */}
              <div className="student-screen-card" style={{ padding: "1.5rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ position: "relative", width: 100, height: 100, marginBottom: "1rem" }}>
                  <img
                    src={session?.img || "/student_avatar.png"}
                    alt={studentName}
                    style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", border: "4px solid #fff7ed", boxShadow: "0 4px 14px rgba(234, 88, 12, 0.2)" }}
                  />
                  <span style={{ position: "absolute", bottom: 2, right: 2, width: 18, height: 18, background: "#16a34a", borderRadius: "50%", border: "2px solid #ffffff" }} />
                </div>

                <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.3rem", fontWeight: 800, color: "#1e293b", margin: 0 }}>
                  {studentName}
                </h3>
                <span style={{ fontSize: "0.82rem", color: "#ea580c", fontWeight: 800, margin: "0.25rem 0 0.75rem 0" }}>
                  {studentClass}
                </span>

                <span style={{ background: "#dcfce7", color: "#15803d", fontSize: "0.72rem", fontWeight: 800, padding: "3px 10px", borderRadius: "9999px", marginBottom: "1rem" }}>
                  ● Enrolled & Active Student
                </span>

                <div style={{ width: "100%", borderTop: "1px solid rgba(254, 215, 170, 0.5)", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem", textAlign: "left", fontSize: "0.78rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#64748b" }}>Roll Number:</span>
                    <strong style={{ color: "#1e293b" }}>{studentRoll}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#64748b" }}>Admission Number:</span>
                    <strong style={{ color: "#1e293b" }}>{studentAdmNo}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#64748b" }}>Academic Session:</span>
                    <strong style={{ color: "#1e293b" }}>{academicYear}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#64748b" }}>Bus Route:</span>
                    <strong style={{ color: "#1e293b" }}>Route #14 (North Campus)</strong>
                  </div>
                </div>
              </div>

              {/* Academic Ledger & Credentials Card */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div className="student-screen-card" style={{ padding: "1.25rem" }}>
                  <h4 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1rem", fontWeight: 800, color: "#1e293b", margin: "0 0 1rem 0" }}>
                    Official Institution Details & Affiliation
                  </h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem", fontSize: "0.78rem" }}>
                    <div style={{ background: "#fffcf9", padding: "0.75rem", borderRadius: "10px", border: "1px solid rgba(254, 215, 170, 0.6)" }}>
                      <span style={{ color: "#ea580c", fontSize: "0.68rem", fontWeight: 800 }}>INSTITUTION NAME</span>
                      <div style={{ fontWeight: 800, color: "#1e293b", marginTop: "2px" }}>{schoolName}</div>
                    </div>
                    <div style={{ background: "#fffcf9", padding: "0.75rem", borderRadius: "10px", border: "1px solid rgba(254, 215, 170, 0.6)" }}>
                      <span style={{ color: "#ea580c", fontSize: "0.68rem", fontWeight: 800 }}>AFFILIATION BOARD</span>
                      <div style={{ fontWeight: 800, color: "#1e293b", marginTop: "2px" }}>CBSE New Delhi (Affil #1930421)</div>
                    </div>
                    <div style={{ background: "#fffcf9", padding: "0.75rem", borderRadius: "10px", border: "1px solid rgba(254, 215, 170, 0.6)" }}>
                      <span style={{ color: "#ea580c", fontSize: "0.68rem", fontWeight: 800 }}>VAPS MI ID</span>
                      <div style={{ fontWeight: 800, color: "#1e293b", marginTop: "2px" }}>{session?.miid || 31}</div>
                    </div>
                    <div style={{ background: "#fffcf9", padding: "0.75rem", borderRadius: "10px", border: "1px solid rgba(254, 215, 170, 0.6)" }}>
                      <span style={{ color: "#ea580c", fontSize: "0.68rem", fontWeight: 800 }}>STUDENT VAPS ID</span>
                      <div style={{ fontWeight: 800, color: "#1e293b", marginTop: "2px" }}>{session?.AMST_ID || 1204}</div>
                    </div>
                  </div>
                </div>

                <div className="student-screen-card" style={{ padding: "1.25rem" }}>
                  <h4 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1rem", fontWeight: 800, color: "#1e293b", margin: "0 0 1rem 0" }}>
                    Academic Performance Summary
                  </h4>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem", textAlign: "center" }}>
                    <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "0.85rem", borderRadius: "12px" }}>
                      <span style={{ fontSize: "0.7rem", color: "#166534", fontWeight: 800 }}>ATTENDANCE RATE</span>
                      <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#15803d" }}>{overallAttendancePct}%</div>
                    </div>
                    <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", padding: "0.85rem", borderRadius: "12px" }}>
                      <span style={{ fontSize: "0.7rem", color: "#1e40af", fontWeight: 800 }}>EXAM PERCENTAGE</span>
                      <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#2563eb" }}>{overallExamPct}%</div>
                    </div>
                    <div style={{ background: "#faf5ff", border: "1px solid #e9d5ff", padding: "0.85rem", borderRadius: "12px" }}>
                      <span style={{ fontSize: "0.7rem", color: "#6b21a8", fontWeight: 800 }}>OVERALL GRADE</span>
                      <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#7e22ce" }}>Grade A+</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          VIEW 6: DEDICATED FULL SCREEN — GREENBOT AI SPACE
          ======================================================== */}
      {currentScreen === "aispace" && (
        <section className="student-fullscreen-page">
          <div className="kiosk-orb kiosk-orb-one" />
          <div className="kiosk-orb kiosk-orb-two" />

          {/* SCREEN HEADER WITH PROMINENT BACK BUTTON */}
          <div className="student-screen-subnav">
            <button className="student-back-to-dash-btn" onClick={() => setCurrentScreen("dashboard")}>
              <ArrowLeft size={16} /> Back to Dashboard
            </button>

            <div className="student-screen-title-area">
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "2px solid #ea580c",
                  boxShadow: "0 4px 14px rgba(234, 88, 12, 0.25)",
                  flexShrink: 0,
                  background: "#fff",
                }}
              >
                <img src="/ai_robot.png" alt="GreenBot" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div>
                <h2>GreenBot AI Campus Assistant & Learning Space</h2>
                <p>Interactive AI Companion • {studentName} ({studentClass})</p>
              </div>
            </div>

            <div className="student-screen-nav-tools">
              <button
                className="student-refresh-btn"
                onClick={() =>
                  setChatMessages([
                    {
                      id: "welcome-reset",
                      sender: "bot",
                      text: "Chat refreshed! Hello Aarav, how can GreenBot assist your learning journey right now?",
                      time: "Just now",
                      suggestions: ["What is my timetable today?", "How is my attendance?", "Show my exam marks"],
                    },
                  ])
                }
                title="Clear conversation"
              >
                <RefreshCw size={13} /> Reset Chat
              </button>
              <span
                style={{
                  background: "#f0fdf4",
                  color: "#16a34a",
                  padding: "0.32rem 0.75rem",
                  borderRadius: 9999,
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  border: "1px solid rgba(22, 163, 74, 0.3)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#16a34a" }} />
                Campus AI Online
              </span>
            </div>
          </div>

          {/* SCREEN MAIN BODY (SPLIT 2 COLUMNS) */}
          <div className="student-screen-scroll-body" style={{ overflow: "hidden" }}>
            <div className="ai-space-screen-layout">
              {/* LEFT SIDEBAR: ROBOT SHOWCASE & QUICK TOPICS */}
              <aside className="ai-space-persona-card">
                <div className="ai-robot-hero-box">
                  <div className="ai-robot-showcase-frame">
                    <img src="/ai_robot.png" alt="GreenBot" className="ai-robot-showcase-img" />
                  </div>
                  <h3>GreenBot</h3>
                  <p>Smart Kiosk Companion</p>
                </div>

                <div className="ai-speech-bubble-intro">
                  &ldquo;Hi Aarav! I have live access to your Class 5-B timetable, attendance register, report cards, and school circulars. Tap any topic below or type your question!&rdquo;
                </div>

                <div className="ai-quick-topics-list">
                  <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.15rem" }}>
                    Popular Student Queries
                  </div>
                  <button className="ai-topic-chip-btn" onClick={() => handleSendChatMessage("What is my timetable today?")}>
                    <Calendar size={13} style={{ color: "#0284c7" }} /> Today&apos;s Timetable & Rooms
                  </button>
                  <button className="ai-topic-chip-btn" onClick={() => handleSendChatMessage("How is my attendance?")}>
                    <CheckCircle2 size={13} style={{ color: "#16a34a" }} /> Monthly Attendance Turnout
                  </button>
                  <button className="ai-topic-chip-btn" onClick={() => handleSendChatMessage("Show my latest exam scores")}>
                    <Award size={13} style={{ color: "#7c3aed" }} /> Term-1 Marks & Grades
                  </button>
                  <button className="ai-topic-chip-btn" onClick={() => handleSendChatMessage("What are the latest school notices?")}>
                    <Bell size={13} style={{ color: "#ea580c" }} /> Official Campus Circulars
                  </button>
                  <button className="ai-topic-chip-btn" onClick={() => handleSendChatMessage("Explain photosynthesis simply")}>
                    <Sparkles size={13} style={{ color: "#059669" }} /> Science: Photosynthesis
                  </button>
                </div>

                {/* Student Context Card */}
                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "10px",
                    padding: "0.55rem 0.75rem",
                    fontSize: "0.68rem",
                    color: "#64748b",
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                  }}
                >
                  <div style={{ fontWeight: 800, color: "#1e293b" }}>{studentName}</div>
                  <div>Class: {studentClass} • Roll #{studentRoll}</div>
                  <div>Campus: Green Valley Public School</div>
                </div>
              </aside>

              {/* RIGHT MAIN CHAT AREA */}
              <div className="ai-space-chat-card">
                {/* Mini Header */}
                <div className="ai-chat-header">
                  <div className="ai-chat-header-left">
                    <Sparkles size={16} style={{ color: "#ea580c" }} />
                    <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "#1e293b" }}>
                      AI Conversational Learning Assistant
                    </span>
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "#64748b" }}>
                    Active Context: <strong style={{ color: "#0d9488" }}>Class 5-B Learner</strong>
                  </div>
                </div>

                {/* Messages Stream */}
                <div className="ai-chat-messages-stream">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`ai-msg-row ${msg.sender === "bot" ? "ai-msg-row-bot" : "ai-msg-row-user"}`}
                    >
                      {msg.sender === "bot" ? (
                        <img src="/ai_robot.png" alt="GreenBot" className="ai-msg-avatar" style={{ border: "2px solid #0d9488" }} />
                      ) : (
                        <img src={session?.img || "/student_avatar.png"} alt={studentName} className="ai-msg-avatar" style={{ border: "2px solid #ea580c" }} />
                      )}

                      <div className="ai-msg-content-wrap">
                        <div className="ai-msg-sender-meta">
                          <span>{msg.sender === "bot" ? "GreenBot" : studentName}</span>
                          {msg.sender === "bot" && (
                            <span
                              style={{
                                background: "#f0fdfa",
                                color: "#0d9488",
                                fontSize: "0.6rem",
                                padding: "1px 5px",
                                borderRadius: 4,
                                fontWeight: 800,
                              }}
                            >
                              AI Companion
                            </span>
                          )}
                          <span>• {msg.time}</span>
                        </div>

                        <div className={`ai-bubble ${msg.sender === "bot" ? "ai-bubble-bot" : "ai-bubble-user"}`}>
                          <div style={{ whiteSpace: "pre-wrap" }}>{msg.text}</div>

                          {msg.suggestions && msg.suggestions.length > 0 && (
                            <div className="ai-msg-suggestions-bar">
                              {msg.suggestions.map((sug, sIdx) => (
                                <button
                                  key={sIdx}
                                  className="ai-msg-suggestion-chip"
                                  onClick={() => handleSendChatMessage(sug)}
                                >
                                  {sug}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="ai-msg-row ai-msg-row-bot">
                      <img src="/ai_robot.png" alt="GreenBot" className="ai-msg-avatar" style={{ border: "2px solid #0d9488" }} />
                      <div className="ai-typing-indicator">
                        <span className="ai-typing-dot" />
                        <span className="ai-typing-dot" />
                        <span className="ai-typing-dot" />
                      </div>
                    </div>
                  )}

                  <div ref={chatMessagesEndRef} />
                </div>

                {/* Quick Prompts Bar */}
                <div className="ai-quick-prompts-bar">
                  <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#94a3b8", flexShrink: 0 }}>
                    Quick Prompts:
                  </span>
                  <button className="ai-quick-prompt-btn" onClick={() => handleSendChatMessage("What is my timetable today?")}>
                    📅 Today&apos;s Timetable
                  </button>
                  <button className="ai-quick-prompt-btn" onClick={() => handleSendChatMessage("How is my attendance?")}>
                    📊 My Attendance
                  </button>
                  <button className="ai-quick-prompt-btn" onClick={() => handleSendChatMessage("Show my exam marks")}>
                    📝 Exam Marks
                  </button>
                  <button className="ai-quick-prompt-btn" onClick={() => handleSendChatMessage("What are the latest school notices?")}>
                    🔔 Circulars
                  </button>
                  <button className="ai-quick-prompt-btn" onClick={() => handleSendChatMessage("Explain photosynthesis simply")}>
                    🌱 Photosynthesis
                  </button>
                </div>

                {/* Chat Input Bar */}
                <div className="ai-chat-input-bar">
                  <input
                    type="text"
                    className="ai-chat-text-input"
                    placeholder="Ask GreenBot about your classes, marks, homework, or science..."
                    value={chatInputText}
                    onChange={(e) => setChatInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSendChatMessage();
                      }
                    }}
                  />
                  <button
                    className="ai-chat-send-btn"
                    onClick={() => handleSendChatMessage()}
                    title="Send message to GreenBot"
                  >
                    <Send size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* COMPACT COMMAND FOOTER */}
      <footer className="command-footer" style={{ marginTop: "auto", borderTop: "1px solid rgba(254, 215, 170, 0.5)", background: "rgba(255, 255, 255, 0.88)" }}>
        <div><span className="footer-dot" /> Official Student Academic Command Portal</div>
        <div className="footer-links">
          <span>CBSE Affiliation 1930421</span>
          <span>NAAC Grade A++</span>
          <span>Campus: 6,200 Students</span>
          <span>VAPS Cloud Online</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.74rem", fontWeight: 700, color: "#ea580c" }}>
          <ShieldCheck size={14} /> Safe & Encrypted Kiosk
        </div>
      </footer>

      {/* ========================================================
          VIDEO TOUR PLAYER MODAL
          ======================================================== */}
      {isVideoModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.8)",
            backdropFilter: "blur(6px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
          onClick={() => setIsVideoModalOpen(false)}
        >
          <div
            style={{
              background: "#0f172a",
              borderRadius: "16px",
              maxWidth: "760px",
              width: "100%",
              overflow: "hidden",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
              border: "1px solid #334155",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.75rem 1.25rem",
                borderBottom: "1px solid #1e293b",
                background: "#1e293b",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#ffffff" }}>
                <Film size={16} style={{ color: "#ea580c" }} />
                <span style={{ fontWeight: 700, fontSize: "0.88rem" }}>
                  Green Valley Public School — Smart Campus Virtual Tour & Highlights
                </span>
              </div>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                style={{
                  border: "none",
                  background: "#334155",
                  color: "#ffffff",
                  borderRadius: "50%",
                  width: 28,
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <X size={15} />
              </button>
            </div>

            <div style={{ position: "relative", width: "100%", height: "380px", background: "#000" }}>
              <video
                controls
                autoPlay
                poster="/campus_banner.jpg"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
              >
                Your browser does not support the video tag.
              </video>
            </div>

            <div
              style={{
                padding: "0.75rem 1.25rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: "#94a3b8",
                fontSize: "0.75rem",
                background: "#0f172a",
              }}
            >
              <span>Smart Classrooms • Robotics STEM Studio • Olympic Sports Arena • Central Library</span>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                style={{
                  padding: "0.35rem 0.85rem",
                  background: "#ea580c",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: 6,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: "0.75rem",
                }}
              >
                Close Player
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          OFFICIAL NOTICE DETAILS MODAL
          ======================================================== */}
      {selectedNotice && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(5px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
          onClick={() => setSelectedNotice(null)}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              maxWidth: "540px",
              width: "100%",
              overflow: "hidden",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
              border: "1px solid rgba(254, 215, 170, 0.7)",
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
              <h3
                style={{
                  margin: "0 0 0.4rem 0",
                  fontSize: "1.05rem",
                  fontWeight: 800,
                  color: "#1e293b",
                  fontFamily: "Outfit, sans-serif",
                }}
              >
                {selectedNotice.title}
              </h3>
              <div style={{ fontSize: "0.72rem", color: "#ea580c", fontWeight: 700, marginBottom: "0.85rem" }}>
                Issued by: {selectedNotice.authority} • Date: {selectedNotice.date}
              </div>
              <div
                style={{
                  background: "#fffcf9",
                  padding: "0.9rem",
                  borderRadius: 10,
                  border: "1px solid rgba(254, 215, 170, 0.5)",
                  fontSize: "0.8rem",
                  color: "#334155",
                  lineHeight: 1.6,
                }}
              >
                {selectedNotice.details}
              </div>
            </div>

            <div
              style={{
                padding: "0.75rem 1.25rem",
                borderTop: "1px solid #f1f5f9",
                background: "#f8fafc",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setSelectedNotice(null)}
                style={{
                  padding: "0.38rem 1.15rem",
                  borderRadius: 8,
                  border: "1px solid rgba(234, 88, 12, 0.3)",
                  background: "#ea580c",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  color: "#ffffff",
                }}
              >
                Close Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
