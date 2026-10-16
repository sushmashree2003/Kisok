/**
 * Centralized API Configuration
 * 
 * All external VAPS endpoints and client routes are read strictly
 * from environment variables (process.env) as defined in .env / .env.local.
 */

const BASE_PORTAL = (process.env.PORTAL_URL || "https://madhuvanvatikacloud.com:21105/").replace(/\/+$/, "");
const BASE_LOGIN = (process.env.LOGIN_URL || "https://madhuvanvatikacloud.com:21093/").replace(/\/+$/, "");

// External Backend VAPS APIs (Accessed server-side via Next.js Route Handlers)
export const VAPS_API_ENDPOINTS = {
  // Base URLs
  LOGIN_URL: process.env.LOGIN_URL || "https://madhuvanvatikacloud.com:21093/",
  PORTAL_URL: process.env.PORTAL_URL || "https://madhuvanvatikacloud.com:21105/",
  DEFAULT_MI_ID: process.env.LOGIN_MI_ID || "31",

  // Direct Facade Endpoints
  LOGIN_FACADE: process.env.API_VAPS_LOGIN || `${BASE_LOGIN}/api/LoginFacade/`,
  STUDENT_DETAILS: `${BASE_PORTAL}/api/StudentDashboardFacade/Getdetails/`,
  STUDENT_ATTENDANCE: `${BASE_PORTAL}/api/StudentDashboardFacade/Getdetails/`,
  STUDENT_FEES: `${BASE_PORTAL}/api/CumulativeFeeAnalysisFacade/getloaddata/`,
  STUDENT_EVENTS: `${BASE_PORTAL}/api/COEFacade/getcoedata/`,
  STUDENT_NOTICES: `${BASE_PORTAL}/api/StudentDashboardFacade/onclick_notice/`,
  STUDENT_HOMEWORK: `${BASE_PORTAL}/api/StudentDashboardFacade/Getdetails/`,
  STUDENT_TIMETABLE: process.env.API_VAPS_STUDENT_TIMETABLE || `${BASE_PORTAL}/api/Student_TTFacade/getStudentTT/`,
  EXAM_LIST: process.env.API_VAPS_EXAM_LIST || `${BASE_PORTAL}/api/ExamReportFacade/getexamdata/`,
  EXAM_SUBJECTS: `${BASE_PORTAL}/api/CumulativeSubjectFacade/getSubjectsdata/`,
  EXAM_DETAILS: process.env.API_VAPS_EXAM_DETAILS || `${BASE_PORTAL}/api/ExamReportFacade/StudentExamDetails/`,
};

// Client-Side Next.js API Routes (Invoked from UI Dashboards & Components)
export const CLIENT_API_ENDPOINTS = {
  LOGIN: process.env.NEXT_PUBLIC_API_LOGIN || "/api/login",
  DETAILS: "/api/student/details",
  ATTENDANCE: process.env.NEXT_PUBLIC_API_ATTENDANCE || "/api/student/attendance",
  FEES: "/api/student/fees",
  EVENTS: "/api/student/events",
  NOTICES: "/api/student/notice",
  HOMEWORK: "/api/student/homework",
  TIMETABLE: process.env.NEXT_PUBLIC_API_TIMETABLE || "/api/student/timetable",
  EXAM: process.env.NEXT_PUBLIC_API_EXAM || "/api/student/exam",
  EXAM_OVERALL: "/api/student/exam-overall",

  DEFAULT_SERVER_URL: process.env.NEXT_PUBLIC_LOGIN_URL || "https://madhuvanvatikacloud.com:21093/",
  DEFAULT_MI_ID: process.env.NEXT_PUBLIC_LOGIN_MI_ID || "31",
};
