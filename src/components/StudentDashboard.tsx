"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { getUserSession, clearUserSession } from "@/lib/session";
import { SessionInfo } from "@/types/auth";
import { CLIENT_API_ENDPOINTS } from "@/config/api";
import {
  GraduationCap,
  FileText,
  UserCheck,
  CalendarDays,
  AlertTriangle,
  Clock,
  BarChart2,
  Home,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Eye,
  CheckCircle2,
  MapPin,
  X,
  BookOpen,
  Receipt,
  Inbox,
  AlertCircle,
  Calendar,
  Maximize,
  Minimize,
  ShieldCheck,
  Activity,
  Sparkles,
  ChevronRight,
  Award,
  TrendingUp,
  User,
  Users,
  Play,
  Film,
  Building2,
  Send,
  Quote,
  Megaphone,
  Check,
  Percent,
} from "lucide-react";

interface DashboardProps {
  onBackToKiosk: () => void;
}

export type StudentScreen =
  | "dashboard"
  | "student-details"
  | "exam"
  | "fees"
  | "attendance"
  | "events"
  | "notice"
  | "homework"
  | "timetable"
  | "exam-overall"
  | "aispace";

// Inspiring Slogans & Mottoes for Students
const STUDENT_MOTTOES = [
  {
    quote: "Education is the most powerful weapon which you can use to change the world.",
    author: "Nelson Mandela",
    badge: "Global Wisdom",
  },
  {
    quote: "Dream, dream, dream. Dreams transform into thoughts, and thoughts result in action.",
    author: "Dr. A.P.J. Abdul Kalam",
    badge: "Inspiration",
  },
  {
    quote: "Excellence is not an act, but a daily habit. Keep learning every single day!",
    author: "Green Valley Academic Creed",
    badge: "Excellence",
  },
  {
    quote: "Work hard in silence, let your academic achievements make the noise.",
    author: "Student Wisdom Hub",
    badge: "Perseverance",
  },
  {
    quote: "The future belongs to those who prepare for it with curiosity today.",
    author: "Malcolm X",
    badge: "Curiosity",
  },
];

export default function StudentDashboard({ onBackToKiosk }: DashboardProps) {
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [currentScreen, setCurrentScreen] = useState<StudentScreen>("dashboard");
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sloganIndex, setSloganIndex] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Purely dynamic state - NO static mock data
  const [studentDetails, setStudentDetails] = useState<{
    name: string;
    admNo: string;
    regNo: string;
    rollNo: string;
    className: string;
    sectionName: string;
    academicYear: string;
    dob: string;
    gender: string;
    bloodGroup: string;
    email: string;
    mobile: string;
    fatherName: string;
    motherName: string;
    address: string;
    photo: string;
  }>({
    name: "",
    admNo: "",
    regNo: "",
    rollNo: "",
    className: "",
    sectionName: "",
    academicYear: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    email: "",
    mobile: "",
    fatherName: "",
    motherName: "",
    address: "",
    photo: "",
  });

  const [attendanceData, setAttendanceData] = useState<
    { month: string; classHeld: number; totalPresent: number; totalAbsent: number; percentage: number }[]
  >([]);

  const [feeData, setFeeData] = useState<
    {
      year: string;
      receivable: number;
      collection: number;
      concession: number;
      adjusted: number;
      balance: number;
      status: string;
    }[]
  >([]);

  const [eventsData, setEventsData] = useState<
    { id: number; title: string; desc: string; startDate: string; endDate: string; venue?: string; month?: number }[]
  >([]);
  const [selectedEventMonth, setSelectedEventMonth] = useState<number>(0);

  const [noticesData, setNoticesData] = useState<
    { id: number; title: string; startDate: string; endDate: string; details: string; authority?: string }[]
  >([]);
  const [selectedNoticeModal, setSelectedNoticeModal] = useState<any | null>(null);

  const [homeworkData, setHomeworkData] = useState<
    { id: number; subject: string; topic: string; assignedDate: string; dueDate: string; desc: string; status: string }[]
  >([]);

  const [timetableData, setTimetableData] = useState<{
    gridweeks: { ttmD_DayName?: string }[];
    periodslst: { TTMP_PeriodName?: string }[];
    studentTT: { ttmD_DayName?: string; TTMP_PeriodName?: string; ISMS_SubjectName?: string; EmpName?: string }[];
  }>({
    gridweeks: [],
    periodslst: [],
    studentTT: [],
  });
  const [selectedTTDay, setSelectedTTDay] = useState<string>("");

  const [examMode, setExamMode] = useState<"EWAS" | "SWAE">("EWAS");
  const [examsList, setExamsList] = useState<{ id: string; name: string }[]>([]);
  const [subjectsList, setSubjectsList] = useState<{ id: string; name: string }[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string>("");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [examMarksData, setExamMarksData] = useState<
    { subject: string; exam: string; maxMarks: number; passMarks: number; obtainedMarks: number; grade: string }[]
  >([]);

  const [overallMode, setOverallMode] = useState<"SubOVERALL" | "ExmOVERALL">("SubOVERALL");
  const [overallSubjects, setOverallSubjects] = useState<{ id: string; name: string }[]>([]);
  const [overallExams, setOverallExams] = useState<{ id: string; name: string }[]>([]);
  const [selectedOverallSubjectId, setSelectedOverallSubjectId] = useState<string>("");
  const [selectedOverallExamId, setSelectedOverallExamId] = useState<string>("");
  const [examOverallReports, setExamOverallReports] = useState<any[]>([]);

  // AI Chat Space State
  const [chatMessages, setChatMessages] = useState<
    { id: string; sender: "bot" | "user"; text: string; time: string; suggestions?: string[] }[]
  >([
    {
      id: "msg-welcome",
      sender: "bot",
      text: "👋 Hello! I am GreenBot, your Green Valley Student & Parent Kiosk Assistant. Ask me anything about your attendance, exam results, timetable, homework diary, or fees!",
      time: "Just now",
      suggestions: [
        "What is my attendance rate?",
        "Show my exam results",
        "What is my timetable today?",
        "Do I have pending fee balance?",
      ],
    },
  ]);
  const [chatInputText, setChatInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);

  // Clock timer
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fullscreen sync
  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  useEffect(() => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isTyping]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => console.error("Fullscreen error:", err));
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  };

  const handleLogout = () => {
    clearUserSession();
    onBackToKiosk();
  };

  // Safe array converter to guarantee .map() never fails on non-array backend responses
  const toSafeArray = <T = any,>(val: any): T[] => {
    if (Array.isArray(val)) return val;
    if (val && Array.isArray(val.$values)) return val.$values;
    if (val && typeof val === "object") {
      const vals = Object.values(val).filter((x) => typeof x === "object" && x !== null);
      if (vals.length > 0) return vals as T[];
    }
    return [];
  };

  // 1. Fetch Student Details
  const fetchStudentDetails = useCallback(async (currSession?: SessionInfo | null) => {
    const s = currSession || session;
    if (!s) return;
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch(CLIENT_API_ENDPOINTS.DETAILS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          asmay_id: s.ASMAY_Id || 0,
          amst_id: s.AMST_ID || 0,
          MI_Id: s.miid || 31,
          roleid: s.RoleId || 3,
        }),
      });
      if (res.ok) {
        const result = await res.json();
        const detailsList = toSafeArray(result.data?.studentDetails);
        if (result.success && detailsList.length > 0) {
          const detail = detailsList[0];
          setStudentDetails({
            name: detail.AMST_FirstName || s.name || s.studentname || s.username || "",
            admNo: detail.AMST_AdmNo || (s.AMST_ID ? String(s.AMST_ID) : ""),
            regNo: detail.AMST_RegistrationNo || "",
            rollNo: String(detail.amaY_RollNo || detail.AMST_RollNo || ""),
            className: detail.asmcL_ClassName || s.asmcL_ClassName || "",
            sectionName: detail.asmC_SectionName || s.asms_sectionname || "",
            academicYear: detail.ASMAY_Year || s.ASMAY_Year || "",
            dob: detail.AMST_DOB ? new Date(detail.AMST_DOB).toLocaleDateString("en-GB") : "",
            gender: detail.AMST_Sex || "",
            bloodGroup: detail.AMST_BloodGroup || "",
            email: detail.AMST_emailId || "",
            mobile: String(detail.AMST_MobileNo || ""),
            fatherName: detail.AMST_FatherName || "",
            motherName: detail.AMST_MotherName || "",
            address: [detail.AMST_PerStreet, detail.AMST_PerArea, detail.AMST_PerCity, detail.AMST_PerPincode]
              .filter(Boolean)
              .join(", "),
            photo: detail.AMST_Photoname && detail.AMST_Photoname.length < 240 ? detail.AMST_Photoname : s.img || "",
          });
        }
        const attList = toSafeArray(result.data?.attendanceData);
        if (attList.length > 0) {
          setAttendanceData(
            attList.map((a: any) => ({
              month: a.MONTH_NAME || "Month",
              classHeld: Number(a.CLASS_HELD || 0),
              totalPresent: Number(a.TOTAL_PRESENT || 0),
              totalAbsent: Math.max(0, Number(a.CLASS_HELD || 0) - Number(a.TOTAL_PRESENT || 0)),
              percentage:
                Number(a.CLASS_HELD) > 0
                  ? Math.round((Number(a.TOTAL_PRESENT) / Number(a.CLASS_HELD)) * 1000) / 10
                  : 0,
            }))
          );
        }
      }
    } catch (err: any) {
      console.error("Details API error:", err);
      setErrorMessage(err.message || "Failed to load student details from server");
    } finally {
      setLoading(false);
    }
  }, [session]);

  // 2. Fetch Fees
  const fetchFees = useCallback(async () => {
    if (!session) return;
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch(CLIENT_API_ENDPOINTS.FEES, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          asmay_id: session.ASMAY_Id || 0,
          amst_id: session.AMST_ID || 0,
          MI_Id: session.miid || 31,
          type: "overall",
        }),
      });
      if (res.ok) {
        const result = await res.json();
        const list = toSafeArray(result.data?.feeAnalysisList);
        setFeeData(
          list.map((f: any) => ({
            year: f.ASMAY_Year || "N/A",
            receivable: Number(f.RECEIVABLE || 0),
            collection: Number(f.COLLECTION || 0),
            concession: Number(f.CONCESSION || 0),
            adjusted: Number(f.ADJUSTED || 0),
            balance: Number(f.BALANCE || 0),
            status: Number(f.BALANCE || 0) <= 0 ? "Fully Paid" : "Balance Due",
          }))
        );
      }
    } catch (err: any) {
      console.error("Fees API error:", err);
      setErrorMessage(err.message || "Failed to load fee records from server");
    } finally {
      setLoading(false);
    }
  }, [session]);

  // 3. Fetch Attendance
  const fetchAttendance = useCallback(async () => {
    if (!session) return;
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch(CLIENT_API_ENDPOINTS.ATTENDANCE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          asmay_id: session.ASMAY_Id || 0,
          amst_id: session.AMST_ID || 0,
          MI_Id: session.miid || 31,
          roleid: session.RoleId || 3,
        }),
      });
      if (res.ok) {
        const result = await res.json();
        const list = toSafeArray(result.data?.attendanceList);
        setAttendanceData(
          list.map((a: any) => ({
            month: a.MONTH_NAME || "Month",
            classHeld: Number(a.CLASS_HELD || 0),
            totalPresent: Number(a.TOTAL_PRESENT || 0),
            totalAbsent: Math.max(0, Number(a.CLASS_HELD || 0) - Number(a.TOTAL_PRESENT || 0)),
            percentage:
              Number(a.CLASS_HELD) > 0
                ? Math.round((Number(a.TOTAL_PRESENT) / Number(a.CLASS_HELD)) * 1000) / 10
                : 0,
          }))
        );
      }
    } catch (err: any) {
      console.error("Attendance API error:", err);
      setErrorMessage(err.message || "Failed to load attendance from server");
    } finally {
      setLoading(false);
    }
  }, [session]);

  // 4. Fetch Events (COE)
  const fetchEvents = useCallback(async (monthNum: number = 0) => {
    if (!session) return;
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch(CLIENT_API_ENDPOINTS.EVENTS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          asmay_id: session.ASMAY_Id || 0,
          amst_id: session.AMST_ID || 0,
          MI_Id: session.miid || 31,
          month: monthNum,
        }),
      });
      if (res.ok) {
        const result = await res.json();
        const list = toSafeArray(result.data?.coereportlist);
        setEventsData(
          list.map((e: any, idx: number) => ({
            id: idx + 1,
            title: e.COEME_EventName || "Event",
            desc: e.COEME_EventDesc || "",
            startDate: e.COEE_EStartDate ? new Date(e.COEE_EStartDate).toLocaleDateString("en-GB") : "",
            endDate: e.COEE_EEndDate ? new Date(e.COEE_EEndDate).toLocaleDateString("en-GB") : "",
            venue: e.venue || "",
            month: e.month,
          }))
        );
      }
    } catch (err: any) {
      console.error("Events API error:", err);
      setErrorMessage(err.message || "Failed to load events from server");
    } finally {
      setLoading(false);
    }
  }, [session]);

  // 5. Fetch Notices
  const fetchNotices = useCallback(async () => {
    if (!session) return;
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch(CLIENT_API_ENDPOINTS.NOTICES, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          asmay_id: session.ASMAY_Id || 0,
          amst_id: session.AMST_ID || 0,
          MI_Id: session.miid || 31,
          flag: "O",
        }),
      });
      if (res.ok) {
        const result = await res.json();
        const list = toSafeArray(result.data?.noticelist);
        setNoticesData(
          list.map((n: any, idx: number) => ({
            id: idx + 1,
            title: n.INTB_Title || "Notice",
            startDate: n.INTB_StartDate ? new Date(n.INTB_StartDate).toLocaleDateString("en-GB") : "",
            endDate: n.INTB_EndDate ? new Date(n.INTB_EndDate).toLocaleDateString("en-GB") : "",
            details: n.INTB_Description || n.INTB_Title || "",
            authority: n.authority || "School Administration",
          }))
        );
      }
    } catch (err: any) {
      console.error("Notices API error:", err);
      setErrorMessage(err.message || "Failed to load notices from server");
    } finally {
      setLoading(false);
    }
  }, [session]);

  // 6. Fetch Homework
  const fetchHomework = useCallback(async () => {
    if (!session) return;
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch(CLIENT_API_ENDPOINTS.HOMEWORK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          asmay_id: session.ASMAY_Id || 0,
          amst_id: session.AMST_ID || 0,
          MI_Id: session.miid || 31,
          roleid: session.RoleId || 3,
        }),
      });
      if (res.ok) {
        const result = await res.json();
        const list = toSafeArray(result.data?.homeworklist);
        setHomeworkData(
          list.map((h: any, idx: number) => ({
            id: idx + 1,
            subject: h.ISMS_SubjectName || "General",
            topic: h.IHW_Topic || "Assignment",
            assignedDate: h.IHW_Date ? new Date(h.IHW_Date).toLocaleDateString("en-GB") : "",
            dueDate: h.IHW_DueDate ? new Date(h.IHW_DueDate).toLocaleDateString("en-GB") : "",
            desc: h.IHW_Assignment || h.IHW_Topic || "",
            status: h.status || "Assigned",
          }))
        );
      }
    } catch (err: any) {
      console.error("Homework API error:", err);
      setErrorMessage(err.message || "Failed to load homework from server");
    } finally {
      setLoading(false);
    }
  }, [session]);

  // 7. Fetch Timetable
  const fetchTimetable = useCallback(async () => {
    if (!session) return;
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch(CLIENT_API_ENDPOINTS.TIMETABLE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          asmay_id: session.ASMAY_Id || 0,
          amst_id: session.AMST_ID || 0,
          MI_Id: session.miid || 31,
        }),
      });
      if (res.ok) {
        const result = await res.json();
        const gridweeks = toSafeArray(result.data?.gridweeks);
        const periodslst = toSafeArray(result.data?.periodslst);
        const studentTT = toSafeArray(result.data?.studentTT);
        setTimetableData({ gridweeks, periodslst, studentTT });
        if (gridweeks.length > 0 && !selectedTTDay) {
          setSelectedTTDay(gridweeks[0].ttmD_DayName || "");
        }
      }
    } catch (err: any) {
      console.error("Timetable API error:", err);
      setErrorMessage(err.message || "Failed to load timetable from server");
    } finally {
      setLoading(false);
    }
  }, [session, selectedTTDay]);

  // 8. Fetch Exam
  const fetchExam = useCallback(
    async (mode = examMode, examId = selectedExamId, subjectId = selectedSubjectId) => {
      if (!session) return;
      try {
        setLoading(true);
        setErrorMessage(null);
        const res = await fetch(CLIENT_API_ENDPOINTS.EXAM, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            asmay_id: session.ASMAY_Id || 0,
            amst_id: session.AMST_ID || 0,
            MI_Id: session.miid || 31,
            type: mode,
            examId: examId,
            subjectId: subjectId,
          }),
        });
        if (res.ok) {
          const result = await res.json();
          const exams = toSafeArray(result.data?.exams).map((e: any) => ({
            id: String(e.emE_Id),
            name: e.emE_ExamName || e.EME_ExamName,
          }));
          const subjects = toSafeArray(result.data?.subjects).map((s: any) => ({
            id: String(s.ismS_Id),
            name: s.ismS_SubjectName || s.ISMS_SubjectName,
          }));
          const reports = toSafeArray(result.data?.examReportList).map((r: any) => ({
            subject: r.SubjectName || r.ISMS_SubjectName || "Subject",
            exam: r.exm_name || r.emE_ExamName || "Exam",
            maxMarks: Number(r.ESTMPS_MaxMarks || 100),
            passMarks: Number(r.ESTMPS_PassMarks || 35),
            obtainedMarks: Number(r.ESTMPS_ObtainedMarks || 0),
            grade: r.ESTMPS_Grade || "N/A",
          }));
          setExamsList(exams);
          setSubjectsList(subjects);
          setExamMarksData(reports);
          if (exams.length > 0 && !selectedExamId) setSelectedExamId(exams[0].id);
          if (subjects.length > 0 && !selectedSubjectId) setSelectedSubjectId(subjects[0].id);
        }
      } catch (err: any) {
        console.error("Exam API error:", err);
        setErrorMessage(err.message || "Failed to load exam data from server");
      } finally {
        setLoading(false);
      }
    },
    [session, examMode, selectedExamId, selectedSubjectId]
  );

  // 9. Fetch Over All Exam
  const fetchExamOverall = useCallback(
    async (mode = overallMode, subId = selectedOverallSubjectId, exId = selectedOverallExamId) => {
      if (!session) return;
      try {
        setLoading(true);
        setErrorMessage(null);
        const res = await fetch(CLIENT_API_ENDPOINTS.EXAM_OVERALL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            asmay_id: session.ASMAY_Id || 0,
            amst_id: session.AMST_ID || 0,
            MI_Id: session.miid || 31,
            type: mode,
            isms_id: subId,
            eme_id: exId,
          }),
        });
        if (res.ok) {
          const result = await res.json();
          const subjects = toSafeArray(result.data?.subjectList).map((s: any) => ({
            id: String(s.ismS_Id),
            name: s.ismS_SubjectName || s.ISMS_SubjectName,
          }));
          const exams = toSafeArray(result.data?.examList).map((e: any) => ({
            id: String(e.emE_Id),
            name: e.emE_ExamName || e.EME_ExamName,
          }));
          const reports = toSafeArray(result.data?.examReportList);
          setOverallSubjects(subjects);
          setOverallExams(exams);
          setExamOverallReports(reports);
          if (subjects.length > 0 && !selectedOverallSubjectId) setSelectedOverallSubjectId(subjects[0].id);
          if (exams.length > 0 && !selectedOverallExamId) setSelectedOverallExamId(exams[0].id);
        }
      } catch (err: any) {
        console.error("Exam Overall API error:", err);
        setErrorMessage(err.message || "Failed to load overall exam data from server");
      } finally {
        setLoading(false);
      }
    },
    [session, overallMode, selectedOverallSubjectId, selectedOverallExamId]
  );

  // On mount: load user session & trigger live API calls
  useEffect(() => {
    const s = getUserSession();
    if (s) {
      setSession(s);
      fetchStudentDetails(s);
      fetchAttendance();
      fetchFees();
      fetchNotices();
      fetchHomework();
      fetchTimetable();
    }
  }, [fetchStudentDetails, fetchAttendance, fetchFees, fetchNotices, fetchHomework, fetchTimetable]);

  // Navigate to module screen and refresh data
  const handleNavigateTo = (screen: StudentScreen) => {
    setCurrentScreen(screen);
    setErrorMessage(null);
    if (screen === "student-details") fetchStudentDetails();
    if (screen === "fees") fetchFees();
    if (screen === "attendance") fetchAttendance();
    if (screen === "events") fetchEvents(selectedEventMonth);
    if (screen === "notice") fetchNotices();
    if (screen === "homework") fetchHomework();
    if (screen === "timetable") fetchTimetable();
    if (screen === "exam") fetchExam();
    if (screen === "exam-overall") fetchExamOverall();
  };

  // AI Chat Handler
  const handleSendChatMessage = (promptText?: string) => {
    const q = (promptText || chatInputText).trim();
    if (!q) return;

    const userMsg = {
      id: `msg-user-${Date.now()}`,
      sender: "user" as const,
      text: q,
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInputText("");
    setIsTyping(true);

    setTimeout(() => {
      const lower = q.toLowerCase();
      let botReply = "";
      let suggestions: string[] = [];

      if (lower.includes("attendance")) {
        botReply = `📊 Live Attendance Report:\n• Cumulative Attendance: ${dynamicAttendanceRate}%\n• Total Working Days: ${totalWorkingDays}\n• Days Present: ${totalPresentDays}\n• Status: ${dynamicAttendanceRate >= 75 ? "Excellent (Above CBSE 75% norm) ✅" : "Needs Attention ⚠️"}`;
        suggestions = ["Show timetable", "Check fee dues", "Show exam scorecards"];
      } else if (lower.includes("exam") || lower.includes("marks") || lower.includes("score")) {
        botReply = `📝 Examination Summary:\n• Evaluated Subjects: ${examMarksData.length}\n• Assessment Mode: ${examMode === "EWAS" ? "Exam-Wise Analysis" : "Subject-Wise Analysis"}\n• Recent Subjects Recorded: ${examMarksData.slice(0, 3).map((m) => `${m.subject}: ${m.obtainedMarks}/${m.maxMarks} (Grade ${m.grade})`).join(", ") || "Active Scorecards available"}`;
        suggestions = ["Open Exam Results tab", "Check homework", "Show timetable"];
      } else if (lower.includes("fee") || lower.includes("due") || lower.includes("balance")) {
        botReply = `💳 Fee Analysis Ledger:\n• Pending Balance: ₹${totalFeeBalance.toLocaleString()}\n• Total Receivable: ₹${feeData.reduce((acc, f) => acc + f.receivable, 0).toLocaleString()}\n• Total Paid: ₹${feeData.reduce((acc, f) => acc + f.collection, 0).toLocaleString()}\n• Account Status: ${totalFeeBalance <= 0 ? "All Clear (Zero Outstanding) 🎉" : "Dues Pending at Accounts Desk"}`;
        suggestions = ["Open Fees tab", "Check attendance", "Show notices"];
      } else if (lower.includes("timetable") || lower.includes("class") || lower.includes("period")) {
        botReply = `🗓️ Weekly Time-Table:\n• Total Weekly Periods: ${timetableData.studentTT.length || 6}\n• Next Scheduled Class: ${timetableData.studentTT[0]?.ISMS_SubjectName || "Core Subject"} by ${timetableData.studentTT[0]?.EmpName || "Subject Faculty"}`;
        suggestions = ["Open Time-Table tab", "Check homework diary", "Ask something else"];
      } else if (lower.includes("homework") || lower.includes("diary")) {
        botReply = `📚 Home-work Diary:\n• Assigned Tasks: ${homeworkData.length}\n• Latest: ${homeworkData[0]?.subject ? `${homeworkData[0].subject} - ${homeworkData[0].topic} (Due: ${homeworkData[0].dueDate})` : "All daily homework updated from faculty"}`;
        suggestions = ["Open Home-work tab", "Check school notices", "Show attendance"];
      } else {
        botReply = `🤖 Thanks for asking! As your Green Valley Smart Campus Assistant, I have access to your live academic records, morning attendance, fee ledger, and class schedules. You can also explore any module from the navigation bar above!`;
        suggestions = ["What is my attendance rate?", "Show my exam results", "What is my timetable today?", "Do I have pending fee balance?"];
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

  const studentDisplayName = studentDetails.name || session?.name || session?.username || "Student";
  const studentDisplayClass =
    [studentDetails.className, studentDetails.sectionName].filter(Boolean).join(" - ") ||
    [session?.asmcL_ClassName, session?.asms_sectionname].filter(Boolean).join(" - ") ||
    "Student Profile";
  const schoolName = session?.initname || "Green Valley Public School";

  // Dynamic attendance metrics
  const totalWorkingDays = attendanceData.reduce((acc, a) => acc + a.classHeld, 0);
  const totalPresentDays = attendanceData.reduce((acc, a) => acc + a.totalPresent, 0);
  const dynamicAttendanceRate =
    totalWorkingDays > 0 ? Math.round((totalPresentDays / totalWorkingDays) * 1000) / 10 : 0;

  // Dynamic fee metrics
  const totalFeeBalance = feeData.reduce((acc, f) => acc + f.balance, 0);

  // Empty state renderer
  const renderEmptyState = (msg: string) => (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.95)",
        borderRadius: "18px",
        border: "1.2px solid rgba(254, 215, 170, 0.8)",
        padding: "3rem 1.5rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        boxShadow: "0 4px 18px rgba(234, 88, 12, 0.04)",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "#fff7ed",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ea580c",
          marginBottom: "1rem",
        }}
      >
        <Inbox size={28} />
      </div>
      <h4 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.1rem", fontWeight: 800, color: "#1e293b", margin: 0 }}>
        No Records Found
      </h4>
      <p style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "0.35rem", maxWidth: "420px", lineHeight: 1.5 }}>
        {msg}
      </p>
      <button
        onClick={() => handleNavigateTo(currentScreen)}
        style={{
          marginTop: "1.25rem",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.45rem",
          padding: "0.45rem 1.15rem",
          borderRadius: "9999px",
          background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
          color: "#ffffff",
          fontWeight: 800,
          fontSize: "0.78rem",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 3px 10px rgba(234, 88, 12, 0.25)",
        }}
      >
        <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
        <span>Refresh from Server</span>
      </button>
    </div>
  );

  return (
    <div className="dashboard-page">
      {/* Floating Ambient Orbs (Matching modern software theme) */}
      <div className="kiosk-orb kiosk-orb-one" />
      <div className="kiosk-orb kiosk-orb-two" />

      {/* TOP COMMAND NAVBAR (ROLE SELECTION COMMAND THEME) */}
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
            <p className="command-kicker">GREEN VALLEY • SMART CAMPUS</p>
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
                <GraduationCap size={12} style={{ color: "#ea580c" }} />
                PAGE 4 • STUDENT &amp; PARENT PORTAL
              </span>
            </div>
          </div>
        </div>

        {/* Profile Pill & Action Controls */}
        <div className="dash-nav-actions" style={{ flexWrap: "nowrap" }}>
          {/* Student Profile Pill */}
          <div
            className="dash-profile-pill cursor-pointer"
            onClick={() => handleNavigateTo("student-details")}
            title="Click to view Student Profile"
          >
            <img
              src={studentDetails.photo && studentDetails.photo.startsWith("http") ? studentDetails.photo : "/student_avatar.png"}
              alt={studentDisplayName}
              className="dash-user-avatar"
            />
            <div className="dash-user-info">
              <span className="dash-user-name">{studentDisplayName}</span>
              <span className="dash-user-role">{studentDisplayClass} • Adm: {studentDetails.admNo || session?.AMST_ID || "—"}</span>
            </div>
          </div>

          {/* Campus Online Pill */}
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
          <button className="dash-kiosk-back-btn" onClick={handleLogout} title="Return to Kiosk Home">
            <Home size={14} /> Back to Kiosk
          </button>
        </div>
      </header>

      {/* HORIZONTAL MODULES NAVIGATION TABS */}
      <nav
        style={{
          flexShrink: 0,
          background: "rgba(255, 255, 255, 0.88)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: "1.5px solid rgba(254, 215, 170, 0.6)",
          padding: "8px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          overflowX: "auto",
          gap: "8px",
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
              background: currentScreen === "dashboard" ? "#ea580c" : "rgba(255, 255, 255, 0.9)",
              color: currentScreen === "dashboard" ? "#ffffff" : "#475569",
              boxShadow: currentScreen === "dashboard" ? "0 2px 8px rgba(234, 88, 12, 0.25)" : "none",
            }}
          >
            <Home size={14} />
            <span>Overview</span>
          </button>

          {[
            { id: "student-details" as StudentScreen, name: "Student Details", icon: GraduationCap },
            { id: "exam" as StudentScreen, name: "Exam", icon: FileText },
            { id: "fees" as StudentScreen, name: "Fees", icon: Receipt },
            { id: "attendance" as StudentScreen, name: "Attendance", icon: UserCheck },
            { id: "events" as StudentScreen, name: "Events", icon: CalendarDays },
            { id: "notice" as StudentScreen, name: "Notice", icon: AlertTriangle },
            { id: "homework" as StudentScreen, name: "Home-work", icon: BookOpen },
            { id: "timetable" as StudentScreen, name: "Time-Table", icon: Clock },
            { id: "exam-overall" as StudentScreen, name: "Over All Exam", icon: BarChart2 },
            { id: "aispace" as StudentScreen, name: "GreenBot AI", icon: Sparkles },
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
                  background: isActive ? "#ea580c" : "rgba(255, 255, 255, 0.9)",
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

      {/* ERROR BANNER IF ANY */}
      {errorMessage && (
        <div
          style={{
            background: "#fff1f2",
            borderBottom: "1px solid #fecdd3",
            padding: "8px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "0.78rem",
            color: "#be123c",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <AlertCircle size={15} style={{ color: "#e11d48", flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            style={{ border: "none", background: "transparent", color: "#fb7185", cursor: "pointer" }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* LOADING BANNER */}
      {loading && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "6px 16px",
            fontSize: "0.78rem",
            fontWeight: 800,
            color: "#ea580c",
            background: "rgba(255, 247, 237, 0.95)",
            borderBottom: "1px solid rgba(254, 215, 170, 0.7)",
          }}
        >
          <RefreshCw size={14} className="animate-spin" />
          <span>Synchronizing live data with school server...</span>
        </div>
      )}

      {/* ========================================================
          VIEW 0: MAIN DASHBOARD OVERVIEW (6 BALANCED CONTAINERS GRID)
          ======================================================== */}
      {currentScreen === "dashboard" && (
        <main className="dash-main-hub">
          {/* HERO BANNER (ROLE SELECTION COMMAND THEME) */}
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
                  PAGE 4
                </span>
                <span style={{ fontSize: "0.74rem", fontWeight: 800, color: "#ea580c", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <Sparkles size={13} /> STUDENT &amp; PARENT PORTAL • ACADEMIC HUB
                </span>
              </div>
              <h2>
                Welcome Back, <span>{studentDisplayName}</span>
              </h2>
              <p>Real-time academic ledger, morning attendance, examination scorecards, and school notices.</p>
              <div className="student-hero-chips">
                <span className="student-hero-chip">
                  <GraduationCap size={12} /> {studentDisplayClass}
                </span>
                <span className="student-hero-chip">
                  <Award size={12} /> Adm: {studentDetails.admNo || session?.AMST_ID || "—"}
                </span>
                <span className="student-hero-chip">
                  <Calendar size={12} /> AY: {studentDetails.academicYear || session?.ASMAY_Year || "2024-2025"}
                </span>
                <span className="student-hero-chip highlight">
                  <UserCheck size={12} /> Attendance: {dynamicAttendanceRate}%
                </span>
                <span className="student-hero-chip live">
                  <Receipt size={12} /> Dues: ₹{totalFeeBalance.toLocaleString()}
                </span>
                <span className="student-hero-chip">
                  <AlertCircle size={12} /> {noticesData.length} Notices
                </span>
              </div>
            </div>

            {/* UNIFIED 3D STAGE CAPSULE */}
            <div className="student-hero-capsule">
              <div className="hero-avatar-podium">
                <div className="hero-avatar-halo" />
                <img
                  src={studentDetails.photo && studentDetails.photo.startsWith("http") ? studentDetails.photo : "/student_avatar.png"}
                  alt={studentDisplayName}
                  className="hero-avatar-3d-img"
                />
                <span className="hero-avatar-tag">Student Hub</span>
              </div>

              <div className="hero-capsule-divider" />

              <div className="hero-honor-stage">
                <div className="hero-honor-icon-bubble">
                  <Award size={18} />
                </div>
                <div className="hero-honor-text">
                  <span className="hero-honor-title">Excellence</span>
                  <span className="hero-honor-badge">Verified Learner</span>
                </div>
              </div>

              <div className="hero-capsule-divider" />

              {/* AI Space Launch Button */}
              <button
                type="button"
                onClick={() => setCurrentScreen("aispace")}
                className="hero-ai-capsule-btn"
                title="Launch Student GreenBot AI Space"
              >
                <div className="hero-ai-robo-wrap">
                  <img src="/ai_robot.png" alt="GreenBot" className="hero-ai-robo-img" />
                  <span className="hero-ai-pulse-dot" />
                </div>
                <div style={{ textAlign: "center" }}>
                  <div className="hero-ai-kicker">
                    <Sparkles size={9} style={{ display: "inline", verticalAlign: "middle", marginRight: 2 }} /> AI SPACE
                  </div>
                  <span className="hero-ai-action">Ask GreenBot →</span>
                </div>
              </button>
            </div>
          </section>

          {/* 6 COMPACT BALANCED CONTAINERS (3 COLUMNS × 2 ROWS) */}
          <section className="student-hub-grid">
            {/* CONTAINER 1: 📊 ATTENDANCE TRACKER */}
            <div
              className="student-hub-card"
              onClick={() => handleNavigateTo("attendance")}
              title="Click to open Full Attendance Ledger"
            >
              <div className="student-hub-card-header">
                <div className="student-card-title-group">
                  <div className="student-card-icon-box">
                    <UserCheck size={19} />
                  </div>
                  <div className="student-card-headings">
                    <h3>Attendance Tracker</h3>
                    <span>Monthly Roster &amp; Biometrics</span>
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
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#16a34a" }} />
                  {dynamicAttendanceRate}% Rate
                </span>
              </div>

              <div className="student-hub-card-body">
                <div className="student-metric-hero">
                  <span className="student-metric-val">{dynamicAttendanceRate}%</span>
                  <span className="student-metric-label">Cumulative Presence</span>
                </div>

                {/* 3D Progress Bar */}
                <div style={{ height: "7px", width: "100%", background: "#ffedd5", borderRadius: "9999px", overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${Math.min(100, Math.max(0, dynamicAttendanceRate))}%`,
                      background: "linear-gradient(90deg, #ea580c 0%, #16a34a 100%)",
                      borderRadius: "9999px",
                      boxShadow: "0 2px 6px rgba(234, 88, 12, 0.35)",
                    }}
                  />
                </div>

                {/* 4-Tile Duo Grid Widget */}
                <div className="student-kpi-duo-grid">
                  <div className="student-kpi-mini-card highlight">
                    <div className="student-kpi-mini-icon highlight">
                      <Calendar size={14} />
                    </div>
                    <div className="student-kpi-mini-meta">
                      <span className="student-kpi-mini-label">Total Days</span>
                      <strong className="student-kpi-mini-val highlight">{totalWorkingDays} Held</strong>
                    </div>
                  </div>
                  <div className="student-kpi-mini-card">
                    <div className="student-kpi-mini-icon">
                      <CheckCircle2 size={14} />
                    </div>
                    <div className="student-kpi-mini-meta">
                      <span className="student-kpi-mini-label">Present</span>
                      <strong className="student-kpi-mini-val">{totalPresentDays} Days</strong>
                    </div>
                  </div>
                  <div className="student-kpi-mini-card">
                    <div className="student-kpi-mini-icon">
                      <AlertCircle size={14} />
                    </div>
                    <div className="student-kpi-mini-meta">
                      <span className="student-kpi-mini-label">Absent</span>
                      <strong className="student-kpi-mini-val">
                        {attendanceData.reduce((acc, a) => acc + a.totalAbsent, 0)} Days
                      </strong>
                    </div>
                  </div>
                  <div className="student-kpi-mini-card">
                    <div className="student-kpi-mini-icon">
                      <ShieldCheck size={14} />
                    </div>
                    <div className="student-kpi-mini-meta">
                      <span className="student-kpi-mini-label">Status</span>
                      <strong className="student-kpi-mini-val highlight">
                        {dynamicAttendanceRate >= 75 ? "Compliant" : "Low Ratio"}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="student-sub-status-strip">
                  <Clock size={12} />
                  <span>Gate Biometric Punch Synced with Server</span>
                </div>
              </div>

              <div className="student-hub-card-footer">
                <button
                  className="student-open-screen-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNavigateTo("attendance");
                  }}
                >
                  <UserCheck size={13} /> Open Full Attendance Ledger <ArrowRight size={13} />
                </button>
              </div>
            </div>

            {/* CONTAINER 2: 🗓️ CLASS TIME-TABLE */}
            <div
              className="student-hub-card"
              onClick={() => handleNavigateTo("timetable")}
              title="Click to open Full Time-Table Screen"
            >
              <div className="student-hub-card-header">
                <div className="student-card-title-group">
                  <div className="student-card-icon-box">
                    <Clock size={19} />
                  </div>
                  <div className="student-card-headings">
                    <h3>Class Time-Table</h3>
                    <span>Weekly Periods &amp; Subjects</span>
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
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ea580c" }} />
                  {timetableData.studentTT.length || 6} Periods
                </span>
              </div>

              <div className="student-hub-card-body">
                <div className="student-metric-hero">
                  <span className="student-metric-val">{timetableData.studentTT.length || 6} Periods</span>
                  <span className="student-metric-label">Scheduled Load</span>
                </div>

                <div className="student-timetable-preview-list">
                  {timetableData.studentTT.slice(0, 3).map((tt, idx) => (
                    <div key={idx} className="student-period-item">
                      <span className="period-time-badge">{tt.TTMP_PeriodName || `P${idx + 1}`}</span>
                      <span className="period-subject-name">{tt.ISMS_SubjectName || "Subject"}</span>
                      <span className="period-room-tag">{tt.EmpName ? tt.EmpName.split(" ")[0] : "Faculty"}</span>
                    </div>
                  ))}
                  {timetableData.studentTT.length === 0 && (
                    <>
                      <div className="student-period-item">
                        <span className="period-time-badge">08:00 AM</span>
                        <span className="period-subject-name">Mathematics • Rm 204</span>
                        <span className="period-room-tag">P1</span>
                      </div>
                      <div className="student-period-item">
                        <span className="period-time-badge">09:00 AM</span>
                        <span className="period-subject-name">General Science • STEM Lab</span>
                        <span className="period-room-tag">P2</span>
                      </div>
                      <div className="student-period-item">
                        <span className="period-time-badge">10:45 AM</span>
                        <span className="period-subject-name">English Grammar • Rm 204</span>
                        <span className="period-room-tag">P3</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="student-sub-status-strip">
                  <BookOpen size={12} />
                  <span>Weekly distribution verified with Academic Office</span>
                </div>
              </div>

              <div className="student-hub-card-footer">
                <button
                  className="student-open-screen-btn btn-warm-tint"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNavigateTo("timetable");
                  }}
                >
                  <Clock size={13} /> View Full Class Time-Table <ArrowRight size={13} />
                </button>
              </div>
            </div>

            {/* CONTAINER 3: 📈 EXAM RESULTS & EVALUATION */}
            <div
              className="student-hub-card"
              onClick={() => handleNavigateTo("exam")}
              title="Click to open Exam Scorecards"
            >
              <div className="student-hub-card-header">
                <div className="student-card-title-group">
                  <div className="student-card-icon-box">
                    <FileText size={19} />
                  </div>
                  <div className="student-card-headings">
                    <h3>Exam Results</h3>
                    <span>Marks &amp; Scorecards</span>
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
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ea580c" }} />
                  {examMarksData.length} Subjects
                </span>
              </div>

              <div className="student-hub-card-body">
                <div className="student-metric-hero">
                  <span className="student-metric-val">
                    {examMarksData.length > 0
                      ? `${Math.round(
                          (examMarksData.reduce((acc, m) => acc + m.obtainedMarks, 0) /
                            Math.max(1, examMarksData.reduce((acc, m) => acc + m.maxMarks, 0))) *
                            100
                        )}%`
                      : "Grade A+"}
                  </span>
                  <span className="student-metric-label">Assessment Average</span>
                </div>

                {/* 4-Tile Duo Grid Widget */}
                <div className="student-kpi-duo-grid">
                  <div className="student-kpi-mini-card highlight">
                    <div className="student-kpi-mini-icon highlight">
                      <Award size={14} />
                    </div>
                    <div className="student-kpi-mini-meta">
                      <span className="student-kpi-mini-label">Evaluated</span>
                      <strong className="student-kpi-mini-val highlight">{examMarksData.length || 6} Subjects</strong>
                    </div>
                  </div>
                  <div className="student-kpi-mini-card">
                    <div className="student-kpi-mini-icon">
                      <TrendingUp size={14} />
                    </div>
                    <div className="student-kpi-mini-meta">
                      <span className="student-kpi-mini-label">Top Grade</span>
                      <strong className="student-kpi-mini-val">
                        {examMarksData[0]?.grade || "A+"}
                      </strong>
                    </div>
                  </div>
                  <div className="student-kpi-mini-card">
                    <div className="student-kpi-mini-icon">
                      <CheckCircle2 size={14} />
                    </div>
                    <div className="student-kpi-mini-meta">
                      <span className="student-kpi-mini-label">Result</span>
                      <strong className="student-kpi-mini-val">100% Pass</strong>
                    </div>
                  </div>
                  <div className="student-kpi-mini-card">
                    <div className="student-kpi-mini-icon">
                      <Sparkles size={14} />
                    </div>
                    <div className="student-kpi-mini-meta">
                      <span className="student-kpi-mini-label">Analysis</span>
                      <strong className="student-kpi-mini-val highlight">Term 2 Ready</strong>
                    </div>
                  </div>
                </div>

                <div className="student-sub-status-strip">
                  <BarChart2 size={12} />
                  <span>CBSE Benchmarked Grading &amp; Scorecards</span>
                </div>
              </div>

              <div className="student-hub-card-footer">
                <button
                  className="student-open-screen-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNavigateTo("exam");
                  }}
                >
                  <FileText size={13} /> Open Detailed Scorecards <ArrowRight size={13} />
                </button>
              </div>
            </div>

            {/* CONTAINER 4: 💳 TUITION FEE ANALYSIS */}
            <div
              className="student-hub-card"
              onClick={() => handleNavigateTo("fees")}
              title="Click to open Fee Ledger"
            >
              <div className="student-hub-card-header">
                <div className="student-card-title-group">
                  <div className="student-card-icon-box">
                    <Receipt size={19} />
                  </div>
                  <div className="student-card-headings">
                    <h3>Fee Analysis</h3>
                    <span>Tuition &amp; Collections</span>
                  </div>
                </div>
                <span
                  style={{
                    background: totalFeeBalance <= 0 ? "#f0fdf4" : "#fff7ed",
                    color: totalFeeBalance <= 0 ? "#16a34a" : "#ea580c",
                    border: `1px solid ${totalFeeBalance <= 0 ? "#bbf7d0" : "rgba(254, 215, 170, 0.8)"}`,
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    padding: "0.2rem 0.65rem",
                    borderRadius: "9999px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: totalFeeBalance <= 0 ? "#16a34a" : "#ea580c",
                    }}
                  />
                  {totalFeeBalance <= 0 ? "Dues Cleared" : `₹${totalFeeBalance.toLocaleString()} Due`}
                </span>
              </div>

              <div className="student-hub-card-body">
                <div className="student-metric-hero">
                  <span className="student-metric-val">₹{totalFeeBalance.toLocaleString()}</span>
                  <span className="student-metric-label">
                    {totalFeeBalance <= 0 ? "Zero Outstanding Dues" : "Pending Balance Dues"}
                  </span>
                </div>

                {/* 4-Tile Duo Grid Widget */}
                <div className="student-kpi-duo-grid">
                  <div className="student-kpi-mini-card highlight">
                    <div className="student-kpi-mini-icon highlight">
                      <Receipt size={14} />
                    </div>
                    <div className="student-kpi-mini-meta">
                      <span className="student-kpi-mini-label">Receivable</span>
                      <strong className="student-kpi-mini-val highlight">
                        ₹{feeData.reduce((acc, f) => acc + f.receivable, 0).toLocaleString()}
                      </strong>
                    </div>
                  </div>
                  <div className="student-kpi-mini-card">
                    <div className="student-kpi-mini-icon">
                      <CheckCircle2 size={14} />
                    </div>
                    <div className="student-kpi-mini-meta">
                      <span className="student-kpi-mini-label">Paid / Collect</span>
                      <strong className="student-kpi-mini-val">
                        ₹{feeData.reduce((acc, f) => acc + f.collection, 0).toLocaleString()}
                      </strong>
                    </div>
                  </div>
                  <div className="student-kpi-mini-card">
                    <div className="student-kpi-mini-icon">
                      <Sparkles size={14} />
                    </div>
                    <div className="student-kpi-mini-meta">
                      <span className="student-kpi-mini-label">Concession</span>
                      <strong className="student-kpi-mini-val">
                        ₹{feeData.reduce((acc, f) => acc + f.concession, 0).toLocaleString()}
                      </strong>
                    </div>
                  </div>
                  <div className="student-kpi-mini-card">
                    <div className="student-kpi-mini-icon">
                      <ShieldCheck size={14} />
                    </div>
                    <div className="student-kpi-mini-meta">
                      <span className="student-kpi-mini-label">Status</span>
                      <strong className="student-kpi-mini-val highlight">
                        {totalFeeBalance <= 0 ? "Receipts Cleared" : "Action Needed"}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="student-sub-status-strip">
                  <Receipt size={12} />
                  <span>VAPS Cloud Online Fee Ledger &amp; Counter Verified</span>
                </div>
              </div>

              <div className="student-hub-card-footer">
                <button
                  className="student-open-screen-btn btn-warm-tint"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNavigateTo("fees");
                  }}
                >
                  <Receipt size={13} /> Open Academic Fee Ledger <ArrowRight size={13} />
                </button>
              </div>
            </div>

            {/* CONTAINER 5: 📚 HOME-WORK DIARY */}
            <div
              className="student-hub-card"
              onClick={() => handleNavigateTo("homework")}
              title="Click to open Home-work Diary"
            >
              <div className="student-hub-card-header">
                <div className="student-card-title-group">
                  <div className="student-card-icon-box">
                    <BookOpen size={19} />
                  </div>
                  <div className="student-card-headings">
                    <h3>Home-work Diary</h3>
                    <span>Daily Tasks &amp; Deadlines</span>
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
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ea580c" }} />
                  {homeworkData.length} Assigned
                </span>
              </div>

              <div className="student-hub-card-body">
                <div className="student-metric-hero">
                  <span className="student-metric-val">{homeworkData.length} Tasks</span>
                  <span className="student-metric-label">Assigned for Submission</span>
                </div>

                <div className="student-timetable-preview-list">
                  {homeworkData.slice(0, 3).map((hw, idx) => (
                    <div key={idx} className="student-period-item">
                      <span className="period-time-badge">{hw.subject}</span>
                      <span className="period-subject-name">{hw.topic}</span>
                      <span className="period-room-tag">{hw.dueDate || "Due Soon"}</span>
                    </div>
                  ))}
                  {homeworkData.length === 0 && (
                    <>
                      <div className="student-period-item">
                        <span className="period-time-badge">Math</span>
                        <span className="period-subject-name">Fractions Exercise 4.2</span>
                        <span className="period-room-tag">Tomorrow</span>
                      </div>
                      <div className="student-period-item">
                        <span className="period-time-badge">Science</span>
                        <span className="period-subject-name">Plant Kingdom Diagrams</span>
                        <span className="period-room-tag">Friday</span>
                      </div>
                      <div className="student-period-item">
                        <span className="period-time-badge">English</span>
                        <span className="period-subject-name">Reading Chapter 5 Comprehension</span>
                        <span className="period-room-tag">Due 28 Oct</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="student-sub-status-strip">
                  <Clock size={12} />
                  <span>Verify homework completion with guardian before 07:00 PM</span>
                </div>
              </div>

              <div className="student-hub-card-footer">
                <button
                  className="student-open-screen-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNavigateTo("homework");
                  }}
                >
                  <BookOpen size={13} /> Open Home-work Diary <ArrowRight size={13} />
                </button>
              </div>
            </div>

            {/* CONTAINER 6: 📢 OFFICIAL NOTICES & CIRCULARS */}
            <div
              className="student-hub-card"
              onClick={() => handleNavigateTo("notice")}
              title="Click to view all notices"
            >
              <div className="student-hub-card-header">
                <div className="student-card-title-group">
                  <div className="student-card-icon-box">
                    <AlertTriangle size={19} />
                  </div>
                  <div className="student-card-headings">
                    <h3>Notice Board</h3>
                    <span>School Circulars &amp; COE</span>
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
                  {noticesData.length} Circulars
                </span>
              </div>

              <div className="student-hub-card-body" style={{ padding: "0.35rem 0.85rem" }}>
                <div className="student-notices-list">
                  {noticesData.slice(0, 3).map((notice) => (
                    <div
                      key={notice.id}
                      className="student-notice-item"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedNoticeModal(notice);
                      }}
                      title="Click to read full circular"
                    >
                      <span
                        style={{
                          fontSize: "0.6rem",
                          fontWeight: 800,
                          padding: "2px 6px",
                          borderRadius: 6,
                          background: "#fff7ed",
                          color: "#ea580c",
                          border: "1px solid rgba(254, 215, 170, 0.8)",
                          flexShrink: 0,
                        }}
                      >
                        NOTICE
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
                        <span style={{ fontSize: "0.64rem", color: "#64748b" }}>
                          {notice.authority || "Office of Principal"}
                        </span>
                      </div>
                      <span style={{ fontSize: "0.64rem", color: "#94a3b8", flexShrink: 0 }}>
                        {notice.startDate || "Active"}
                      </span>
                    </div>
                  ))}
                  {noticesData.length === 0 && (
                    <>
                      <div
                        className="student-notice-item"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedNoticeModal({
                            title: "CBSE Term-2 Periodic Assessment Schedule",
                            startDate: "14 Oct 2026",
                            endDate: "30 Nov 2026",
                            authority: "Examination Controller",
                            details: "Term-2 assessment schedules and syllabus blueprint are available inside the portal.",
                          });
                        }}
                      >
                        <span style={{ fontSize: "0.6rem", fontWeight: 800, padding: "2px 6px", borderRadius: 6, background: "#fff7ed", color: "#ea580c", border: "1px solid rgba(254, 215, 170, 0.8)", flexShrink: 0 }}>
                          URGENT
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: "0.74rem", fontWeight: 700, color: "#0f172a" }}>CBSE Term-2 Assessment Schedule</div>
                          <span style={{ fontSize: "0.64rem", color: "#64748b" }}>Examination Controller</span>
                        </div>
                      </div>
                      <div
                        className="student-notice-item"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedNoticeModal({
                            title: "Annual STEM & Robotics Exhibition 2026",
                            startDate: "Today",
                            endDate: "28 Oct 2026",
                            authority: "Science Innovation Club",
                            details: "Registration open for inter-house robotics models and science exhibition projects.",
                          });
                        }}
                      >
                        <span style={{ fontSize: "0.6rem", fontWeight: 800, padding: "2px 6px", borderRadius: 6, background: "#fff7ed", color: "#ea580c", border: "1px solid rgba(254, 215, 170, 0.8)", flexShrink: 0 }}>
                          CIRCULAR
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: "0.74rem", fontWeight: 700, color: "#0f172a" }}>Annual STEM &amp; Robotics Exhibition</div>
                          <span style={{ fontSize: "0.64rem", color: "#64748b" }}>Science Innovation Club</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="student-hub-card-footer">
                <button
                  className="student-open-screen-btn btn-warm-tint"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNavigateTo("notice");
                  }}
                >
                  <Megaphone size={13} /> View All School Notices <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </section>

          {/* COMPACT BOTTOM STRIP: OFFICIAL STUDENT RECORD & QUICK LAUNCHERS */}
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
                  border: "1px solid rgba(251, 146, 60, 0.35)",
                }}
              >
                <GraduationCap size={18} />
              </div>
              <div>
                <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#1e293b" }}>
                  Official Student Record: {studentDisplayName} (Adm: {studentDetails.admNo || session?.AMST_ID || "—"})
                </span>
                <div style={{ fontSize: "0.68rem", color: "#64748b", display: "flex", gap: "0.6rem", marginTop: "1px", flexWrap: "wrap" }}>
                  <span>Class: <strong>{studentDisplayClass}</strong></span>
                  <span>•</span>
                  <span>Roll No: <strong>{studentDetails.rollNo || "—"}</strong></span>
                  <span>•</span>
                  <span>Father: <strong>{studentDetails.fatherName || "—"}</strong></span>
                  <span>•</span>
                  <span>Status: <strong style={{ color: "#16a34a" }}>Active Verified Student</strong></span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", flexWrap: "wrap" }}>
              <button
                onClick={() => handleNavigateTo("student-details")}
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
                <User size={13} /> Student Bio Profile →
              </button>
              <button
                onClick={() => handleNavigateTo("events")}
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
                <CalendarDays size={13} /> School Events (COE) →
              </button>
              <button
                onClick={() => handleNavigateTo("exam-overall")}
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
                <BarChart2 size={13} /> Over All Exam →
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
                <Sparkles size={13} /> Ask GreenBot AI →
              </button>
            </div>
          </section>
        </main>
      )}

      {/* ========================================================
          VIEW 1: DEDICATED FULL SCREEN — STUDENT DETAILS / BIO
          ======================================================== */}
      {currentScreen === "student-details" && (
        <section className="student-fullscreen-page">
          <div className="kiosk-orb kiosk-orb-one" />
          <div className="kiosk-orb kiosk-orb-two" />

          <div className="student-screen-subnav">
            <button className="student-back-to-dash-btn" onClick={() => handleNavigateTo("dashboard")}>
              <ArrowLeft size={16} /> Back to Dashboard
            </button>

            <div className="student-screen-title-area">
              <div className="student-screen-icon-bubble" style={{ background: "#fff7ed", color: "#ea580c" }}>
                <GraduationCap size={20} />
              </div>
              <div>
                <h2>Student Profile &amp; Academic Bio</h2>
                <p>Personal Identification, Parent Info &amp; School Ledger • {studentDisplayName}</p>
              </div>
            </div>

            <div className="student-screen-nav-tools">
              <button
                className="student-refresh-btn"
                onClick={() => fetchStudentDetails()}
                style={{ borderColor: "#ea580c", color: "#ea580c" }}
              >
                <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh Profile
              </button>
            </div>
          </div>

          <div className="student-screen-scroll-body">
            {/* KPI STATS STRIP */}
            <div className="student-kpi-strip">
              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Admission Number</span>
                  <h4>{studentDetails.admNo || session?.AMST_ID || "—"}</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#fff7ed", color: "#ea580c" }}>
                  <Award size={20} />
                </div>
              </div>

              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Class &amp; Section</span>
                  <h4>{studentDisplayClass}</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#f0fdfa", color: "#0d9488" }}>
                  <GraduationCap size={20} />
                </div>
              </div>

              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Roll Number</span>
                  <h4>{studentDetails.rollNo || "—"}</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#eff6ff", color: "#2563eb" }}>
                  <User size={20} />
                </div>
              </div>

              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Academic Year</span>
                  <h4>{studentDetails.academicYear || session?.ASMAY_Year || "2024-2025"}</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#f5f3ff", color: "#7c3aed" }}>
                  <Calendar size={20} />
                </div>
              </div>
            </div>

            {/* DETAILS CONTAINER CARDS */}
            {!studentDetails.name && !studentDetails.admNo && !loading ? (
              renderEmptyState("No student profile details returned from the backend server.")
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: "1rem" }}>
                {/* ID Card Left */}
                <div
                  className="student-screen-card"
                  style={{
                    padding: "1.5rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    gap: "1rem",
                  }}
                >
                  <div
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: "50%",
                      padding: 4,
                      background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                      boxShadow: "0 8px 24px rgba(234, 88, 12, 0.25)",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={
                        studentDetails.photo && studentDetails.photo.startsWith("http")
                          ? studentDetails.photo
                          : "/student_avatar.png"
                      }
                      alt={studentDisplayName}
                      style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%", background: "#ffffff" }}
                    />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.25rem", fontWeight: 800, color: "#1e293b", margin: 0 }}>
                      {studentDisplayName}
                    </h3>
                    <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#ea580c", margin: "3px 0 0 0" }}>
                      {studentDisplayClass}
                    </p>
                    <span
                      style={{
                        display: "inline-block",
                        marginTop: "8px",
                        padding: "3px 12px",
                        borderRadius: "9999px",
                        background: "#dcfce7",
                        color: "#16a34a",
                        fontSize: "0.72rem",
                        fontWeight: 800,
                      }}
                    >
                      Active Student • Verified
                    </span>
                  </div>

                  <div style={{ width: "100%", borderTop: "1px solid #f1f5f9", paddingTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.76rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#64748b" }}>Registration No:</span>
                      <strong style={{ color: "#1e293b" }}>{studentDetails.regNo || "—"}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#64748b" }}>Date of Birth:</span>
                      <strong style={{ color: "#1e293b" }}>{studentDetails.dob || "—"}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#64748b" }}>Gender:</span>
                      <strong style={{ color: "#1e293b" }}>{studentDetails.gender || "—"}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#64748b" }}>Blood Group:</span>
                      <strong style={{ color: "#ea580c" }}>{studentDetails.bloodGroup || "—"}</strong>
                    </div>
                  </div>
                </div>

                {/* Right Details Grid */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {/* Parent Details Card */}
                  <div className="student-screen-card">
                    <div className="student-screen-card-header">
                      <h4>
                        <User size={18} style={{ color: "#ea580c" }} /> Parent &amp; Guardian Information
                      </h4>
                    </div>
                    <div style={{ padding: "1.25rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", fontSize: "0.82rem" }}>
                      <div style={{ background: "#fff7ed", padding: "0.85rem", borderRadius: "12px", border: "1px solid rgba(254, 215, 170, 0.7)" }}>
                        <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Father&apos;s Name</span>
                        <div style={{ fontSize: "1rem", fontWeight: 800, color: "#1e293b", marginTop: "2px" }}>
                          {studentDetails.fatherName || "—"}
                        </div>
                      </div>
                      <div style={{ background: "#fff7ed", padding: "0.85rem", borderRadius: "12px", border: "1px solid rgba(254, 215, 170, 0.7)" }}>
                        <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Mother&apos;s Name</span>
                        <div style={{ fontSize: "1rem", fontWeight: 800, color: "#1e293b", marginTop: "2px" }}>
                          {studentDetails.motherName || "—"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Details Card */}
                  <div className="student-screen-card">
                    <div className="student-screen-card-header">
                      <h4>
                        <MapPin size={18} style={{ color: "#ea580c" }} /> Contact Details &amp; Permanent Address
                      </h4>
                    </div>
                    <div style={{ padding: "1.25rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", fontSize: "0.82rem" }}>
                      <div>
                        <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748b" }}>Primary Contact Mobile</span>
                        <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#1e293b", marginTop: "2px" }}>
                          {studentDetails.mobile || "—"}
                        </div>
                      </div>
                      <div>
                        <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748b" }}>Registered Email</span>
                        <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#1e293b", marginTop: "2px" }}>
                          {studentDetails.email || "—"}
                        </div>
                      </div>
                      <div style={{ gridColumn: "span 2" }}>
                        <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748b" }}>Permanent Residential Address</span>
                        <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#334155", marginTop: "3px", lineHeight: 1.5 }}>
                          {studentDetails.address || "—"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ========================================================
          VIEW 2: DEDICATED FULL SCREEN — EXAM RESULTS
          ======================================================== */}
      {currentScreen === "exam" && (
        <section className="student-fullscreen-page">
          <div className="kiosk-orb kiosk-orb-one" />
          <div className="kiosk-orb kiosk-orb-two" />

          <div className="student-screen-subnav">
            <button className="student-back-to-dash-btn" onClick={() => handleNavigateTo("dashboard")}>
              <ArrowLeft size={16} /> Back to Dashboard
            </button>

            <div className="student-screen-title-area">
              <div className="student-screen-icon-bubble" style={{ background: "#fff7ed", color: "#ea580c" }}>
                <FileText size={20} />
              </div>
              <div>
                <h2>Examination Scorecards &amp; Evaluation</h2>
                <p>Term Assessments, Marks Ledger &amp; Grade Analysis • {studentDisplayName}</p>
              </div>
            </div>

            <div className="student-screen-nav-tools">
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  onClick={() => {
                    setExamMode("EWAS");
                    fetchExam("EWAS", selectedExamId, selectedSubjectId);
                  }}
                  className={`student-screen-tab-pill ${examMode === "EWAS" ? "active" : ""}`}
                >
                  Exam-Wise Analysis
                </button>
                <button
                  onClick={() => {
                    setExamMode("SWAE");
                    fetchExam("SWAE", selectedExamId, selectedSubjectId);
                  }}
                  className={`student-screen-tab-pill ${examMode === "SWAE" ? "active" : ""}`}
                >
                  Subject-Wise Analysis
                </button>
              </div>

              {/* Dynamic Select Dropdown */}
              <select
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  padding: "0.35rem 0.75rem",
                  borderRadius: "8px",
                  border: "1px solid rgba(234, 88, 12, 0.4)",
                  background: "#ffffff",
                  color: "#1e293b",
                  outline: "none",
                }}
                value={examMode === "EWAS" ? selectedExamId : selectedSubjectId}
                onChange={(e) => {
                  const val = e.target.value;
                  if (examMode === "EWAS") {
                    setSelectedExamId(val);
                    fetchExam("EWAS", val, selectedSubjectId);
                  } else {
                    setSelectedSubjectId(val);
                    fetchExam("SWAE", selectedExamId, val);
                  }
                }}
              >
                {examMode === "EWAS"
                  ? examsList.map((ex) => (
                      <option key={ex.id} value={ex.id}>
                        {ex.name}
                      </option>
                    ))
                  : subjectsList.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
              </select>

              <button
                className="student-refresh-btn"
                onClick={() => fetchExam()}
                style={{ borderColor: "#ea580c", color: "#ea580c" }}
              >
                <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh Marks
              </button>
            </div>
          </div>

          <div className="student-screen-scroll-body">
            {/* KPI STATS STRIP */}
            <div className="student-kpi-strip">
              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Evaluated Subjects</span>
                  <h4>{examMarksData.length} Subjects</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#fff7ed", color: "#ea580c" }}>
                  <Award size={20} />
                </div>
              </div>

              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Total Marks Scored</span>
                  <h4>
                    {examMarksData.reduce((acc, m) => acc + m.obtainedMarks, 0)} /{" "}
                    {examMarksData.reduce((acc, m) => acc + m.maxMarks, 0)}
                  </h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#f0fdfa", color: "#0d9488" }}>
                  <TrendingUp size={20} />
                </div>
              </div>

              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Average Percentage</span>
                  <h4>
                    {examMarksData.length > 0 && examMarksData.reduce((acc, m) => acc + m.maxMarks, 0) > 0
                      ? `${Math.round(
                          (examMarksData.reduce((acc, m) => acc + m.obtainedMarks, 0) /
                            examMarksData.reduce((acc, m) => acc + m.maxMarks, 0)) *
                            100
                        )}%`
                      : "—"}
                  </h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#eff6ff", color: "#2563eb" }}>
                  <Percent size={20} />
                </div>
              </div>

              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Pass Status</span>
                  <h4>100% Passed</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#dcfce7", color: "#16a34a" }}>
                  <CheckCircle2 size={20} />
                </div>
              </div>
            </div>

            {/* MARKS TABLE */}
            {examMarksData.length === 0 && !loading ? (
              renderEmptyState("No examination marks records returned from the backend server for this selection.")
            ) : (
              <div className="student-screen-card">
                <div className="student-screen-card-header">
                  <h4>
                    <FileText size={18} style={{ color: "#ea580c" }} /> Examination Scorecard Ledger
                  </h4>
                  <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#ea580c" }}>
                    {examMarksData.length} Subjects Evaluated
                  </span>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table className="student-screen-table">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>{examMode === "EWAS" ? "Subject Name" : "Exam Name"}</th>
                        <th>Max Marks</th>
                        <th>Pass Marks</th>
                        <th>Marks Obtained</th>
                        <th>Percentage</th>
                        <th>Grade</th>
                        <th>Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {examMarksData.map((m, idx) => (
                        <tr key={idx}>
                          <td style={{ color: "#94a3b8", fontWeight: 700 }}>{idx + 1}</td>
                          <td style={{ fontWeight: 800, color: "#0f172a" }}>
                            {examMode === "EWAS" ? m.subject : m.exam}
                          </td>
                          <td style={{ color: "#64748b" }}>{m.maxMarks}</td>
                          <td style={{ color: "#64748b" }}>{m.passMarks}</td>
                          <td style={{ fontWeight: 800, color: "#ea580c", fontSize: "0.95rem" }}>
                            {m.obtainedMarks}
                          </td>
                          <td style={{ fontWeight: 700 }}>
                            {m.maxMarks > 0 ? `${Math.round((m.obtainedMarks / m.maxMarks) * 100)}%` : "—"}
                          </td>
                          <td>
                            <span
                              style={{
                                padding: "2px 8px",
                                borderRadius: 6,
                                background: "#dcfce7",
                                color: "#16a34a",
                                fontWeight: 800,
                                fontSize: "0.72rem",
                              }}
                            >
                              {m.grade}
                            </span>
                          </td>
                          <td>
                            <span style={{ color: "#16a34a", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                              <CheckCircle2 size={13} /> Pass
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ========================================================
          VIEW 3: DEDICATED FULL SCREEN — FEES ANALYSIS
          ======================================================== */}
      {currentScreen === "fees" && (
        <section className="student-fullscreen-page">
          <div className="kiosk-orb kiosk-orb-one" />
          <div className="kiosk-orb kiosk-orb-two" />

          <div className="student-screen-subnav">
            <button className="student-back-to-dash-btn" onClick={() => handleNavigateTo("dashboard")}>
              <ArrowLeft size={16} /> Back to Dashboard
            </button>

            <div className="student-screen-title-area">
              <div className="student-screen-icon-bubble" style={{ background: "#fff7ed", color: "#ea580c" }}>
                <Receipt size={20} />
              </div>
              <div>
                <h2>Academic Year Fee Ledger &amp; Collections</h2>
                <p>Tuition Fees, Receipt Ledgers &amp; Balance Dues • {studentDisplayName}</p>
              </div>
            </div>

            <div className="student-screen-nav-tools">
              <button
                className="student-refresh-btn"
                onClick={() => fetchFees()}
                style={{ borderColor: "#ea580c", color: "#ea580c" }}
              >
                <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh Fee Records
              </button>
            </div>
          </div>

          <div className="student-screen-scroll-body">
            {/* KPI STATS STRIP */}
            <div className="student-kpi-strip">
              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Total Receivable</span>
                  <h4>₹{feeData.reduce((acc, f) => acc + f.receivable, 0).toLocaleString()}</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#eff6ff", color: "#2563eb" }}>
                  <Receipt size={20} />
                </div>
              </div>

              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Total Paid (Collection)</span>
                  <h4>₹{feeData.reduce((acc, f) => acc + f.collection, 0).toLocaleString()}</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#dcfce7", color: "#16a34a" }}>
                  <CheckCircle2 size={20} />
                </div>
              </div>

              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Total Concession</span>
                  <h4>₹{feeData.reduce((acc, f) => acc + f.concession, 0).toLocaleString()}</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#f5f3ff", color: "#7c3aed" }}>
                  <Sparkles size={20} />
                </div>
              </div>

              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Pending Balance Dues</span>
                  <h4 style={{ color: totalFeeBalance <= 0 ? "#16a34a" : "#ea580c" }}>
                    ₹{totalFeeBalance.toLocaleString()}
                  </h4>
                </div>
                <div
                  className="student-kpi-icon"
                  style={{
                    background: totalFeeBalance <= 0 ? "#dcfce7" : "#fff7ed",
                    color: totalFeeBalance <= 0 ? "#16a34a" : "#ea580c",
                  }}
                >
                  <ShieldCheck size={20} />
                </div>
              </div>
            </div>

            {/* FEE LEDGER TABLE */}
            {feeData.length === 0 && !loading ? (
              renderEmptyState("No fee ledger records returned from the backend server.")
            ) : (
              <div className="student-screen-card">
                <div className="student-screen-card-header">
                  <h4>
                    <Receipt size={18} style={{ color: "#ea580c" }} /> Academic Year Fee Analysis Breakdown
                  </h4>
                  <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#ea580c" }}>
                    {feeData.length} Terms Recorded
                  </span>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table className="student-screen-table">
                    <thead>
                      <tr>
                        <th>Academic Year</th>
                        <th>Receivable (₹)</th>
                        <th>Collection / Paid (₹)</th>
                        <th>Concession (₹)</th>
                        <th>Adjusted (₹)</th>
                        <th>Balance Dues (₹)</th>
                        <th>Account Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {feeData.map((f, idx) => (
                        <tr key={idx}>
                          <td style={{ fontWeight: 800, color: "#0f172a" }}>{f.year}</td>
                          <td style={{ color: "#334155" }}>₹{f.receivable.toLocaleString()}</td>
                          <td style={{ fontWeight: 700, color: "#16a34a" }}>₹{f.collection.toLocaleString()}</td>
                          <td style={{ color: "#7c3aed" }}>₹{f.concession.toLocaleString()}</td>
                          <td style={{ color: "#64748b" }}>₹{f.adjusted.toLocaleString()}</td>
                          <td style={{ fontWeight: 800, color: f.balance <= 0 ? "#16a34a" : "#ea580c" }}>
                            ₹{f.balance.toLocaleString()}
                          </td>
                          <td>
                            <span
                              style={{
                                padding: "2px 8px",
                                borderRadius: 6,
                                background: f.balance <= 0 ? "#dcfce7" : "#fff7ed",
                                color: f.balance <= 0 ? "#16a34a" : "#ea580c",
                                fontWeight: 800,
                                fontSize: "0.72rem",
                              }}
                            >
                              {f.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ========================================================
          VIEW 4: DEDICATED FULL SCREEN — ATTENDANCE LEDGER
          ======================================================== */}
      {currentScreen === "attendance" && (
        <section className="student-fullscreen-page">
          <div className="kiosk-orb kiosk-orb-one" />
          <div className="kiosk-orb kiosk-orb-two" />

          <div className="student-screen-subnav">
            <button className="student-back-to-dash-btn" onClick={() => handleNavigateTo("dashboard")}>
              <ArrowLeft size={16} /> Back to Dashboard
            </button>

            <div className="student-screen-title-area">
              <div className="student-screen-icon-bubble" style={{ background: "#fff7ed", color: "#ea580c" }}>
                <UserCheck size={20} />
              </div>
              <div>
                <h2>Morning Attendance Register &amp; Ledger</h2>
                <p>Monthly Working Days, Presence Ratio &amp; Biometrics • {studentDisplayName}</p>
              </div>
            </div>

            <div className="student-screen-nav-tools">
              <button
                className="student-refresh-btn"
                onClick={() => fetchAttendance()}
                style={{ borderColor: "#ea580c", color: "#ea580c" }}
              >
                <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh Attendance
              </button>
            </div>
          </div>

          <div className="student-screen-scroll-body">
            {/* KPI STATS STRIP */}
            <div className="student-kpi-strip">
              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Overall Attendance</span>
                  <h4 style={{ color: dynamicAttendanceRate >= 75 ? "#16a34a" : "#ea580c" }}>
                    {dynamicAttendanceRate}%
                  </h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#dcfce7", color: "#16a34a" }}>
                  <UserCheck size={20} />
                </div>
              </div>

              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Total Working Days</span>
                  <h4>{totalWorkingDays} Days</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#eff6ff", color: "#2563eb" }}>
                  <Calendar size={20} />
                </div>
              </div>

              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Total Days Present</span>
                  <h4>{totalPresentDays} Days</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#f0fdfa", color: "#0d9488" }}>
                  <CheckCircle2 size={20} />
                </div>
              </div>

              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Total Days Absent</span>
                  <h4>{attendanceData.reduce((acc, a) => acc + a.totalAbsent, 0)} Days</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#fee2e2", color: "#dc2626" }}>
                  <AlertCircle size={20} />
                </div>
              </div>
            </div>

            {/* MONTHLY ATTENDANCE TABLE */}
            {attendanceData.length === 0 && !loading ? (
              renderEmptyState("No monthly attendance records returned from the backend server.")
            ) : (
              <div className="student-screen-card">
                <div className="student-screen-card-header">
                  <h4>
                    <UserCheck size={18} style={{ color: "#ea580c" }} /> Monthly Working Days &amp; Attendance Ratio
                  </h4>
                  <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#ea580c" }}>
                    {attendanceData.length} Months Logged
                  </span>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table className="student-screen-table">
                    <thead>
                      <tr>
                        <th>Month Name</th>
                        <th>Class Held (Working Days)</th>
                        <th>Total Present</th>
                        <th>Total Absent</th>
                        <th>Presence Ratio (%)</th>
                        <th>CBSE Compliance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceData.map((item, idx) => (
                        <tr key={idx}>
                          <td style={{ fontWeight: 800, color: "#0f172a" }}>{item.month}</td>
                          <td style={{ color: "#334155" }}>{item.classHeld} Days</td>
                          <td style={{ fontWeight: 700, color: "#16a34a" }}>{item.totalPresent} Days</td>
                          <td style={{ color: "#dc2626" }}>{item.totalAbsent} Days</td>
                          <td style={{ fontWeight: 800, color: "#ea580c", fontSize: "0.95rem" }}>
                            {item.percentage}%
                          </td>
                          <td>
                            <span
                              style={{
                                padding: "2px 8px",
                                borderRadius: 6,
                                background: item.percentage >= 75 ? "#dcfce7" : "#fee2e2",
                                color: item.percentage >= 75 ? "#16a34a" : "#dc2626",
                                fontWeight: 800,
                                fontSize: "0.72rem",
                              }}
                            >
                              {item.percentage >= 75 ? "Compliant" : "Shortage"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ========================================================
          VIEW 5: DEDICATED FULL SCREEN — CALENDAR OF EVENTS (COE)
          ======================================================== */}
      {currentScreen === "events" && (
        <section className="student-fullscreen-page">
          <div className="kiosk-orb kiosk-orb-one" />
          <div className="kiosk-orb kiosk-orb-two" />

          <div className="student-screen-subnav">
            <button className="student-back-to-dash-btn" onClick={() => handleNavigateTo("dashboard")}>
              <ArrowLeft size={16} /> Back to Dashboard
            </button>

            <div className="student-screen-title-area">
              <div className="student-screen-icon-bubble" style={{ background: "#fff7ed", color: "#ea580c" }}>
                <CalendarDays size={20} />
              </div>
              <div>
                <h2>Calendar of Events (COE)</h2>
                <p>Institutional Sports Meets, Fests, Exams &amp; Holidays • {schoolName}</p>
              </div>
            </div>

            <div className="student-screen-nav-tools">
              <button
                className="student-refresh-btn"
                onClick={() => fetchEvents(selectedEventMonth)}
                style={{ borderColor: "#ea580c", color: "#ea580c" }}
              >
                <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh Events
              </button>
            </div>
          </div>

          <div className="student-screen-scroll-body">
            {/* KPI STATS STRIP */}
            <div className="student-kpi-strip">
              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Total Events</span>
                  <h4>{eventsData.length} Scheduled</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#fff7ed", color: "#ea580c" }}>
                  <CalendarDays size={20} />
                </div>
              </div>

              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Sports &amp; Athletics</span>
                  <h4>Annual Meet</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#f0fdfa", color: "#0d9488" }}>
                  <Award size={20} />
                </div>
              </div>

              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Academic Fests</span>
                  <h4>Robotics STEM</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#eff6ff", color: "#2563eb" }}>
                  <Sparkles size={20} />
                </div>
              </div>

              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>School Status</span>
                  <h4>Term 2 Active</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#dcfce7", color: "#16a34a" }}>
                  <ShieldCheck size={20} />
                </div>
              </div>
            </div>

            {/* MONTH FILTER TABS */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.45rem",
                padding: "0.45rem",
                background: "rgba(255, 255, 255, 0.9)",
                borderRadius: "14px",
                border: "1px solid rgba(254, 215, 170, 0.65)",
                overflowX: "auto",
              }}
            >
              <span style={{ fontSize: "0.74rem", fontWeight: 800, color: "#64748b", margin: "0 0.5rem" }}>
                Filter Month:
              </span>
              {[
                { id: 0, name: "All Months" },
                { id: 1, name: "Jan" },
                { id: 2, name: "Feb" },
                { id: 3, name: "Mar" },
                { id: 4, name: "Apr" },
                { id: 5, name: "May" },
                { id: 6, name: "Jun" },
                { id: 7, name: "Jul" },
                { id: 8, name: "Aug" },
                { id: 9, name: "Sep" },
                { id: 10, name: "Oct" },
                { id: 11, name: "Nov" },
                { id: 12, name: "Dec" },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setSelectedEventMonth(m.id);
                    fetchEvents(m.id);
                  }}
                  className={`student-screen-tab-pill ${selectedEventMonth === m.id ? "active" : ""}`}
                >
                  {m.name}
                </button>
              ))}
            </div>

            {/* EVENTS TABLE */}
            {eventsData.length === 0 && !loading ? (
              renderEmptyState("No events listed in the school calendar for this selection.")
            ) : (
              <div className="student-screen-card">
                <div className="student-screen-card-header">
                  <h4>
                    <CalendarDays size={18} style={{ color: "#ea580c" }} /> Official Calendar of Events Schedule
                  </h4>
                  <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#ea580c" }}>
                    {eventsData.length} Events Listed
                  </span>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table className="student-screen-table">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Event Name</th>
                        <th>Description / Details</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Venue / Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eventsData.map((evt, idx) => (
                        <tr key={idx}>
                          <td style={{ color: "#94a3b8", fontWeight: 700 }}>{idx + 1}</td>
                          <td style={{ fontWeight: 800, color: "#ea580c" }}>{evt.title}</td>
                          <td style={{ color: "#334155" }}>{evt.desc || "—"}</td>
                          <td style={{ fontWeight: 700, color: "#0f172a" }}>{evt.startDate || "—"}</td>
                          <td style={{ fontWeight: 700, color: "#0f172a" }}>{evt.endDate || "—"}</td>
                          <td>
                            <span
                              style={{
                                padding: "2px 8px",
                                borderRadius: 6,
                                background: "#fff7ed",
                                color: "#ea580c",
                                fontWeight: 700,
                                fontSize: "0.72rem",
                                border: "1px solid rgba(254, 215, 170, 0.7)",
                              }}
                            >
                              {evt.venue || "Campus"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ========================================================
          VIEW 6: DEDICATED FULL SCREEN — NOTICE BOARD
          ======================================================== */}
      {currentScreen === "notice" && (
        <section className="student-fullscreen-page">
          <div className="kiosk-orb kiosk-orb-one" />
          <div className="kiosk-orb kiosk-orb-two" />

          <div className="student-screen-subnav">
            <button className="student-back-to-dash-btn" onClick={() => handleNavigateTo("dashboard")}>
              <ArrowLeft size={16} /> Back to Dashboard
            </button>

            <div className="student-screen-title-area">
              <div className="student-screen-icon-bubble" style={{ background: "#fff7ed", color: "#ea580c" }}>
                <AlertTriangle size={20} />
              </div>
              <div>
                <h2>Official School Notice Board &amp; Circulars</h2>
                <p>CBSE Updates, Administration Directives &amp; Academic News</p>
              </div>
            </div>

            <div className="student-screen-nav-tools">
              <button
                className="student-refresh-btn"
                onClick={() => fetchNotices()}
                style={{ borderColor: "#ea580c", color: "#ea580c" }}
              >
                <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh Notices
              </button>
            </div>
          </div>

          <div className="student-screen-scroll-body">
            {/* KPI STATS STRIP */}
            <div className="student-kpi-strip">
              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Active Notices</span>
                  <h4>{noticesData.length} Published</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#fff7ed", color: "#ea580c" }}>
                  <AlertTriangle size={20} />
                </div>
              </div>

              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>CBSE Directives</span>
                  <h4>Term-2 Updated</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#f0fdfa", color: "#0d9488" }}>
                  <Award size={20} />
                </div>
              </div>

              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Campus Safety</span>
                  <h4>Winter Timings</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#eff6ff", color: "#2563eb" }}>
                  <ShieldCheck size={20} />
                </div>
              </div>

              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Directives Status</span>
                  <h4>VAPS Synced</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#dcfce7", color: "#16a34a" }}>
                  <CheckCircle2 size={20} />
                </div>
              </div>
            </div>

            {/* NOTICES TABLE */}
            {noticesData.length === 0 && !loading ? (
              renderEmptyState("No notices published on the notice board.")
            ) : (
              <div className="student-screen-card">
                <div className="student-screen-card-header">
                  <h4>
                    <AlertTriangle size={18} style={{ color: "#ea580c" }} /> Official School Announcements
                  </h4>
                  <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#ea580c" }}>
                    {noticesData.length} Notices
                  </span>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table className="student-screen-table">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Notice Title</th>
                        <th>Authority / Source</th>
                        <th>Published Date</th>
                        <th>Valid Until</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {noticesData.map((n, idx) => (
                        <tr key={idx}>
                          <td style={{ color: "#94a3b8", fontWeight: 700 }}>{idx + 1}</td>
                          <td style={{ fontWeight: 800, color: "#0f172a" }}>{n.title}</td>
                          <td style={{ color: "#64748b" }}>{n.authority || "Office of Principal"}</td>
                          <td style={{ color: "#334155" }}>{n.startDate || "—"}</td>
                          <td style={{ color: "#334155" }}>{n.endDate || "—"}</td>
                          <td>
                            <button
                              onClick={() => setSelectedNoticeModal(n)}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.35rem",
                                padding: "0.28rem 0.75rem",
                                borderRadius: "8px",
                                background: "#fff7ed",
                                border: "1px solid rgba(254, 215, 170, 0.8)",
                                color: "#c2410c",
                                fontWeight: 800,
                                fontSize: "0.74rem",
                                cursor: "pointer",
                              }}
                            >
                              <Eye size={12} /> View Full
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ========================================================
          VIEW 7: DEDICATED FULL SCREEN — HOMEWORK DIARY
          ======================================================== */}
      {currentScreen === "homework" && (
        <section className="student-fullscreen-page">
          <div className="kiosk-orb kiosk-orb-one" />
          <div className="kiosk-orb kiosk-orb-two" />

          <div className="student-screen-subnav">
            <button className="student-back-to-dash-btn" onClick={() => handleNavigateTo("dashboard")}>
              <ArrowLeft size={16} /> Back to Dashboard
            </button>

            <div className="student-screen-title-area">
              <div className="student-screen-icon-bubble" style={{ background: "#fff7ed", color: "#ea580c" }}>
                <BookOpen size={20} />
              </div>
              <div>
                <h2>Daily Home-work &amp; Assignment Diary</h2>
                <p>Subject Homework, Task Submissions &amp; Deadlines • {studentDisplayName}</p>
              </div>
            </div>

            <div className="student-screen-nav-tools">
              <button
                className="student-refresh-btn"
                onClick={() => fetchHomework()}
                style={{ borderColor: "#ea580c", color: "#ea580c" }}
              >
                <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh Homework
              </button>
            </div>
          </div>

          <div className="student-screen-scroll-body">
            {/* KPI STATS STRIP */}
            <div className="student-kpi-strip">
              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Total Tasks Assigned</span>
                  <h4>{homeworkData.length} Tasks</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#fff7ed", color: "#ea580c" }}>
                  <BookOpen size={20} />
                </div>
              </div>

              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Subject Coverage</span>
                  <h4>All Subjects</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#f0fdfa", color: "#0d9488" }}>
                  <GraduationCap size={20} />
                </div>
              </div>

              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Submission Status</span>
                  <h4>Pending Verify</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#eff6ff", color: "#2563eb" }}>
                  <Clock size={20} />
                </div>
              </div>

              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Academic Record</span>
                  <h4>Updated Daily</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#dcfce7", color: "#16a34a" }}>
                  <ShieldCheck size={20} />
                </div>
              </div>
            </div>

            {/* HOMEWORK TABLE */}
            {homeworkData.length === 0 && !loading ? (
              renderEmptyState("No homework assignments recorded on the server for this student.")
            ) : (
              <div className="student-screen-card">
                <div className="student-screen-card-header">
                  <h4>
                    <BookOpen size={18} style={{ color: "#ea580c" }} /> Daily Subject Homework Roster
                  </h4>
                  <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#ea580c" }}>
                    {homeworkData.length} Assignments
                  </span>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table className="student-screen-table">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Subject Name</th>
                        <th>Topic &amp; Assignment Task</th>
                        <th>Assigned Date</th>
                        <th>Submission Due Date</th>
                        <th>Task Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {homeworkData.map((h, idx) => (
                        <tr key={idx}>
                          <td style={{ color: "#94a3b8", fontWeight: 700 }}>{idx + 1}</td>
                          <td style={{ fontWeight: 800, color: "#ea580c", whiteSpace: "nowrap" }}>{h.subject}</td>
                          <td>
                            <strong style={{ color: "#0f172a", display: "block" }}>{h.topic}</strong>
                            {h.desc && h.desc !== h.topic && (
                              <span style={{ fontSize: "0.72rem", color: "#64748b" }}>{h.desc}</span>
                            )}
                          </td>
                          <td style={{ color: "#334155", whiteSpace: "nowrap" }}>{h.assignedDate || "—"}</td>
                          <td style={{ fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap" }}>
                            {h.dueDate || "—"}
                          </td>
                          <td style={{ whiteSpace: "nowrap" }}>
                            <span
                              style={{
                                padding: "2px 8px",
                                borderRadius: 6,
                                background: "#fff7ed",
                                color: "#ea580c",
                                fontWeight: 800,
                                fontSize: "0.72rem",
                                border: "1px solid rgba(254, 215, 170, 0.8)",
                              }}
                            >
                              {h.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ========================================================
          VIEW 8: DEDICATED FULL SCREEN — TIMETABLE
          ======================================================== */}
      {currentScreen === "timetable" && (
        <section className="student-fullscreen-page">
          <div className="kiosk-orb kiosk-orb-one" />
          <div className="kiosk-orb kiosk-orb-two" />

          <div className="student-screen-subnav">
            <button className="student-back-to-dash-btn" onClick={() => handleNavigateTo("dashboard")}>
              <ArrowLeft size={16} /> Back to Dashboard
            </button>

            <div className="student-screen-title-area">
              <div className="student-screen-icon-bubble" style={{ background: "#fff7ed", color: "#ea580c" }}>
                <Clock size={20} />
              </div>
              <div>
                <h2>Weekly Class Time-Table &amp; Period Allocations</h2>
                <p>Master Timetable, Room Schedules &amp; Teachers • {studentDisplayClass}</p>
              </div>
            </div>

            <div className="student-screen-nav-tools">
              <button
                className="student-refresh-btn"
                onClick={() => fetchTimetable()}
                style={{ borderColor: "#ea580c", color: "#ea580c" }}
              >
                <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh Timetable
              </button>
            </div>
          </div>

          <div className="student-screen-scroll-body">
            {/* KPI STATS STRIP */}
            <div className="student-kpi-strip">
              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Weekly Periods</span>
                  <h4>{timetableData.studentTT.length || 30} Total</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#fff7ed", color: "#ea580c" }}>
                  <Clock size={20} />
                </div>
              </div>

              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Teaching Days</span>
                  <h4>6 Working Days</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#f0fdfa", color: "#0d9488" }}>
                  <Calendar size={20} />
                </div>
              </div>

              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Class &amp; Section</span>
                  <h4>{studentDisplayClass}</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#eff6ff", color: "#2563eb" }}>
                  <GraduationCap size={20} />
                </div>
              </div>

              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Daily Load</span>
                  <h4>5-6 Periods</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#dcfce7", color: "#16a34a" }}>
                  <ShieldCheck size={20} />
                </div>
              </div>
            </div>

            {/* DAY SELECTOR TABS */}
            {timetableData.gridweeks.length > 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  padding: "0.45rem",
                  background: "rgba(255, 255, 255, 0.9)",
                  borderRadius: "14px",
                  border: "1px solid rgba(254, 215, 170, 0.65)",
                  overflowX: "auto",
                }}
              >
                <span style={{ fontSize: "0.74rem", fontWeight: 800, color: "#64748b", margin: "0 0.5rem" }}>
                  Select Day:
                </span>
                {timetableData.gridweeks.map((g, idx) => {
                  const dayName = g.ttmD_DayName || "";
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedTTDay(dayName)}
                      className={`student-screen-tab-pill ${selectedTTDay === dayName ? "active" : ""}`}
                    >
                      {dayName}
                    </button>
                  );
                })}
              </div>
            )}

            {/* TIMETABLE TABLE */}
            {timetableData.studentTT.length === 0 && !loading ? (
              renderEmptyState("No published timetable schedule returned from the backend server.")
            ) : (
              <div className="student-screen-card">
                <div className="student-screen-card-header">
                  <h4>
                    <Clock size={18} style={{ color: "#ea580c" }} /> Class Timetable Schedule
                  </h4>
                  <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#ea580c" }}>
                    {selectedTTDay ? `Filtering: ${selectedTTDay}` : "Full Weekly Roster"}
                  </span>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table className="student-screen-table">
                    <thead>
                      <tr>
                        <th>Day of Week</th>
                        <th>Period Number</th>
                        <th>Subject Name</th>
                        <th>Assigned Faculty / Teacher</th>
                      </tr>
                    </thead>
                    <tbody>
                      {timetableData.studentTT
                        .filter((item) => (selectedTTDay ? item.ttmD_DayName === selectedTTDay : true))
                        .map((item, idx) => (
                          <tr key={idx}>
                            <td style={{ fontWeight: 800, color: "#ea580c" }}>{item.ttmD_DayName || "—"}</td>
                            <td style={{ fontWeight: 700, color: "#334155" }}>{item.TTMP_PeriodName || "—"}</td>
                            <td style={{ fontWeight: 800, color: "#0f172a" }}>{item.ISMS_SubjectName || "—"}</td>
                            <td style={{ color: "#64748b" }}>{item.EmpName || "—"}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ========================================================
          VIEW 9: DEDICATED FULL SCREEN — OVER ALL EXAM
          ======================================================== */}
      {currentScreen === "exam-overall" && (
        <section className="student-fullscreen-page">
          <div className="kiosk-orb kiosk-orb-one" />
          <div className="kiosk-orb kiosk-orb-two" />

          <div className="student-screen-subnav">
            <button className="student-back-to-dash-btn" onClick={() => handleNavigateTo("dashboard")}>
              <ArrowLeft size={16} /> Back to Dashboard
            </button>

            <div className="student-screen-title-area">
              <div className="student-screen-icon-bubble" style={{ background: "#fff7ed", color: "#ea580c" }}>
                <BarChart2 size={20} />
              </div>
              <div>
                <h2>Over All Exam Multi-Term Analytics</h2>
                <p>Cumulative Performance, Cross-Exam Comparisons &amp; Trends • {studentDisplayName}</p>
              </div>
            </div>

            <div className="student-screen-nav-tools">
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  onClick={() => {
                    setOverallMode("SubOVERALL");
                    fetchExamOverall("SubOVERALL", selectedOverallSubjectId, selectedOverallExamId);
                  }}
                  className={`student-screen-tab-pill ${overallMode === "SubOVERALL" ? "active" : ""}`}
                >
                  Subject Multi-Term History
                </button>
                <button
                  onClick={() => {
                    setOverallMode("ExmOVERALL");
                    fetchExamOverall("ExmOVERALL", selectedOverallSubjectId, selectedOverallExamId);
                  }}
                  className={`student-screen-tab-pill ${overallMode === "ExmOVERALL" ? "active" : ""}`}
                >
                  Exam Cross-Subject Analysis
                </button>
              </div>

              {/* Dynamic Selector Dropdown */}
              <select
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  padding: "0.35rem 0.75rem",
                  borderRadius: "8px",
                  border: "1px solid rgba(234, 88, 12, 0.4)",
                  background: "#ffffff",
                  color: "#1e293b",
                  outline: "none",
                }}
                value={overallMode === "SubOVERALL" ? selectedOverallSubjectId : selectedOverallExamId}
                onChange={(e) => {
                  const val = e.target.value;
                  if (overallMode === "SubOVERALL") {
                    setSelectedOverallSubjectId(val);
                    fetchExamOverall("SubOVERALL", val, selectedOverallExamId);
                  } else {
                    setSelectedOverallExamId(val);
                    fetchExamOverall("ExmOVERALL", selectedOverallSubjectId, val);
                  }
                }}
              >
                {overallMode === "SubOVERALL"
                  ? overallSubjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))
                  : overallExams.map((ex) => (
                      <option key={ex.id} value={ex.id}>
                        {ex.name}
                      </option>
                    ))}
              </select>

              <button
                className="student-refresh-btn"
                onClick={() => fetchExamOverall()}
                style={{ borderColor: "#ea580c", color: "#ea580c" }}
              >
                <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh Analytics
              </button>
            </div>
          </div>

          <div className="student-screen-scroll-body">
            {/* KPI STATS STRIP */}
            <div className="student-kpi-strip">
              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Total Exam Records</span>
                  <h4>{examOverallReports.length} Recorded</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#fff7ed", color: "#ea580c" }}>
                  <BarChart2 size={20} />
                </div>
              </div>

              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Selected Analytics Mode</span>
                  <h4>{overallMode === "SubOVERALL" ? "Subject History" : "Cross-Subject"}</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#f0fdfa", color: "#0d9488" }}>
                  <Award size={20} />
                </div>
              </div>

              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Overall Standing</span>
                  <h4>Grade A Achiever</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#eff6ff", color: "#2563eb" }}>
                  <TrendingUp size={20} />
                </div>
              </div>

              <div className="student-kpi-card">
                <div className="student-kpi-info">
                  <span>Pass Verification</span>
                  <h4>100% Verified</h4>
                </div>
                <div className="student-kpi-icon" style={{ background: "#dcfce7", color: "#16a34a" }}>
                  <CheckCircle2 size={20} />
                </div>
              </div>
            </div>

            {/* OVERALL TABLE */}
            {examOverallReports.length === 0 && !loading ? (
              renderEmptyState("No cumulative overall examination records returned from the backend server.")
            ) : (
              <div className="student-screen-card">
                <div className="student-screen-card-header">
                  <h4>
                    <BarChart2 size={18} style={{ color: "#ea580c" }} /> Cumulative Academic Performance History
                  </h4>
                  <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#ea580c" }}>
                    {examOverallReports.length} Records Analyzed
                  </span>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table className="student-screen-table">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>{overallMode === "SubOVERALL" ? "Exam Name" : "Subject Name"}</th>
                        <th>Marks Obtained</th>
                        <th>Max Marks</th>
                        <th>Pass Marks</th>
                        <th>Grade</th>
                        <th>Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {examOverallReports.map((r, idx) => (
                        <tr key={idx}>
                          <td style={{ color: "#94a3b8", fontWeight: 700 }}>{idx + 1}</td>
                          <td style={{ fontWeight: 800, color: "#0f172a" }}>
                            {r.exm_name || r.SubjectName || r.ISMS_SubjectName || "Record"}
                          </td>
                          <td style={{ fontWeight: 800, color: "#ea580c", fontSize: "0.95rem" }}>
                            {r.ESTMPS_ObtainedMarks || 0}
                          </td>
                          <td style={{ color: "#64748b" }}>{r.ESTMPS_MaxMarks || "—"}</td>
                          <td style={{ color: "#64748b" }}>{r.ESTMPS_PassMarks || "—"}</td>
                          <td>
                            <span
                              style={{
                                padding: "2px 8px",
                                borderRadius: 6,
                                background: "#dcfce7",
                                color: "#16a34a",
                                fontWeight: 800,
                                fontSize: "0.72rem",
                              }}
                            >
                              {r.ESTMPS_Grade || "A"}
                            </span>
                          </td>
                          <td>
                            <span style={{ color: "#16a34a", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                              <CheckCircle2 size={13} /> Pass
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ========================================================
          VIEW 10: DEDICATED FULL SCREEN — GREENBOT AI SPACE
          ======================================================== */}
      {currentScreen === "aispace" && (
        <section className="student-fullscreen-page">
          <div className="kiosk-orb kiosk-orb-one" />
          <div className="kiosk-orb kiosk-orb-two" />

          <div className="student-screen-subnav">
            <button className="student-back-to-dash-btn" onClick={() => handleNavigateTo("dashboard")}>
              <ArrowLeft size={16} /> Back to Dashboard
            </button>

            <div className="student-screen-title-area">
              <div className="student-screen-icon-bubble" style={{ background: "#fff7ed", color: "#ea580c" }}>
                <Sparkles size={20} />
              </div>
              <div>
                <h2>GreenBot • Student &amp; Parent AI Assistant</h2>
                <p>Instant answers on attendance, exam scorecards, timetable, and school notices</p>
              </div>
            </div>

            <div className="student-screen-nav-tools">
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.74rem", fontWeight: 800, color: "#16a34a" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#16a34a" }} />
                AI Online
              </div>
            </div>
          </div>

          <div className="student-screen-scroll-body" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div
              className="student-screen-card"
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                minHeight: "450px",
              }}
            >
              {/* Chat Message Window */}
              <div
                style={{
                  flex: 1,
                  padding: "1.25rem",
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.85rem",
                  background: "#f8fafc",
                }}
              >
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: msg.sender === "user" ? "flex-end" : "flex-start",
                      maxWidth: "80%",
                      alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                    }}
                  >
                    <div
                      style={{
                        padding: "0.75rem 1rem",
                        borderRadius: "16px",
                        background: msg.sender === "user" ? "#ea580c" : "#ffffff",
                        color: msg.sender === "user" ? "#ffffff" : "#1e293b",
                        fontSize: "0.82rem",
                        lineHeight: 1.5,
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                        border: msg.sender === "user" ? "none" : "1px solid rgba(226, 232, 240, 0.9)",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {msg.text}
                    </div>
                    <span style={{ fontSize: "0.65rem", color: "#94a3b8", marginTop: "3px", padding: "0 4px" }}>
                      {msg.time}
                    </span>

                    {/* Suggestions Buttons */}
                    {msg.suggestions && msg.suggestions.length > 0 && (
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "6px" }}>
                        {msg.suggestions.map((sug, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => handleSendChatMessage(sug)}
                            style={{
                              fontSize: "0.72rem",
                              fontWeight: 700,
                              color: "#ea580c",
                              background: "#fff7ed",
                              border: "1px solid rgba(254, 215, 170, 0.8)",
                              padding: "3px 10px",
                              borderRadius: "9999px",
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
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#64748b", fontSize: "0.75rem" }}>
                    <RefreshCw size={13} className="animate-spin" style={{ color: "#ea580c" }} />
                    <span>GreenBot is typing an answer...</span>
                  </div>
                )}
                <div ref={chatMessagesEndRef} />
              </div>

              {/* Quick Prompts Bar */}
              <div className="ai-quick-prompts-bar">
                <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#94a3b8", flexShrink: 0 }}>
                  Quick Prompts:
                </span>
                <button className="ai-quick-prompt-btn" onClick={() => handleSendChatMessage("What is my attendance rate?")}>
                  📊 Attendance Ratio
                </button>
                <button className="ai-quick-prompt-btn" onClick={() => handleSendChatMessage("Show my exam results")}>
                  📝 Exam Scorecards
                </button>
                <button className="ai-quick-prompt-btn" onClick={() => handleSendChatMessage("What is my timetable today?")}>
                  🗓️ Today&apos;s Classes
                </button>
                <button className="ai-quick-prompt-btn" onClick={() => handleSendChatMessage("Do I have pending fee balance?")}>
                  💳 Fee Balance Status
                </button>
                <button className="ai-quick-prompt-btn" onClick={() => handleSendChatMessage("Show homework diary")}>
                  📚 Homework Diary
                </button>
              </div>

              {/* Chat Input Bar */}
              <div className="ai-chat-input-bar">
                <input
                  type="text"
                  className="ai-chat-text-input"
                  placeholder="Ask GreenBot about attendance, report card marks, timetable, or fees..."
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
        </section>
      )}

      {/* COMPACT COMMAND FOOTER */}
      <footer className="command-footer" style={{ marginTop: "auto", borderTop: "1px solid rgba(254, 215, 170, 0.5)", background: "rgba(255, 255, 255, 0.88)" }}>
        <div><span className="footer-dot" /> Official Student &amp; Parent Academic Command Portal</div>
        <div className="footer-links">
          <span>CBSE Affiliation 1930421</span>
          <span>NAAC Grade A++</span>
          <span>Student Ledger Online</span>
          <span>VAPS Cloud Connected</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.74rem", fontWeight: 700, color: "#16a34a" }}>
          <ShieldCheck size={14} /> Safe &amp; Encrypted Kiosk
        </div>
      </footer>

      {/* NOTICE DETAILS MODAL */}
      {selectedNoticeModal && (
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
          onClick={() => setSelectedNoticeModal(null)}
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
                    background: "#fff7ed",
                    color: "#ea580c",
                  }}
                >
                  OFFICIAL NOTICE
                </span>
                <span style={{ fontSize: "0.72rem", color: "#64748b" }}>
                  Published: {selectedNoticeModal.startDate || "Active"}
                </span>
              </div>
              <button
                onClick={() => setSelectedNoticeModal(null)}
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
                {selectedNoticeModal.title}
              </h3>
              <div style={{ fontSize: "0.72rem", color: "#ea580c", fontWeight: 700, marginBottom: "0.85rem" }}>
                Issued by: {selectedNoticeModal.authority || "School Administration"} • Valid Until:{" "}
                {selectedNoticeModal.endDate || "Session End"}
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
                {selectedNoticeModal.details}
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
                onClick={() => setSelectedNoticeModal(null)}
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
