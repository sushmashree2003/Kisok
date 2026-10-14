/**
 * Centralized API Configuration
 * 
 * All external VAPS endpoints and client routes are read strictly
 * from environment variables (process.env) as defined in .env / .env.local.
 */

// External Backend VAPS APIs (Accessed server-side via Next.js Route Handlers)
export const VAPS_API_ENDPOINTS = {
  // Base URLs
  LOGIN_URL: process.env.LOGIN_URL || "https://madhuvanvatikacloud.com:21093/",
  PORTAL_URL: process.env.PORTAL_URL || "https://madhuvanvatikacloud.com:21105/",
  DEFAULT_MI_ID: process.env.LOGIN_MI_ID || "31",

  // Direct Facade Endpoints
  LOGIN_FACADE:
    process.env.API_VAPS_LOGIN ||
    `${(process.env.LOGIN_URL || "https://madhuvanvatikacloud.com:21093/").replace(/\/+$/, "")}/api/LoginFacade/`,

  STUDENT_ATTENDANCE:
    process.env.API_VAPS_STUDENT_ATTENDANCE ||
    `${(process.env.PORTAL_URL || "https://madhuvanvatikacloud.com:21105/").replace(/\/+$/, "")}/api/StudentDashboardFacade/Getdetails/`,

  STUDENT_TIMETABLE:
    process.env.API_VAPS_STUDENT_TIMETABLE ||
    `${(process.env.PORTAL_URL || "https://madhuvanvatikacloud.com:21105/").replace(/\/+$/, "")}/api/Student_TTFacade/getStudentTT/`,

  EXAM_LIST:
    process.env.API_VAPS_EXAM_LIST ||
    `${(process.env.PORTAL_URL || "https://madhuvanvatikacloud.com:21105/").replace(/\/+$/, "")}/api/ExamReportFacade/getexamdata/`,

  EXAM_DETAILS:
    process.env.API_VAPS_EXAM_DETAILS ||
    `${(process.env.PORTAL_URL || "https://madhuvanvatikacloud.com:21105/").replace(/\/+$/, "")}/api/ExamReportFacade/StudentExamDetails/`,
};

// Client-Side Next.js API Routes (Invoked from UI Dashboards & Components)
export const CLIENT_API_ENDPOINTS = {
  LOGIN: process.env.NEXT_PUBLIC_API_LOGIN || "/api/login",
  ATTENDANCE: process.env.NEXT_PUBLIC_API_ATTENDANCE || "/api/student/attendance",
  TIMETABLE: process.env.NEXT_PUBLIC_API_TIMETABLE || "/api/student/timetable",
  EXAM: process.env.NEXT_PUBLIC_API_EXAM || "/api/student/exam",

  DEFAULT_SERVER_URL: process.env.NEXT_PUBLIC_LOGIN_URL || "https://madhuvanvatikacloud.com:21093/",
  DEFAULT_MI_ID: process.env.NEXT_PUBLIC_LOGIN_MI_ID || "31",
};
