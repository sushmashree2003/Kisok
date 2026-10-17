/**
 * Centralized API Configuration based on legacy VAPS Kiosk reference:
 * D:\Sushma\Kiosk\Old kiosk\vaps demo school\vaps demo school\App.config
 */

const BASE_PORTAL = (process.env.PORTAL_URL || "https://madhuvanvatikacloud.com:21105/").replace(/\/+$/, "");
const BASE_LOGIN = (process.env.LOGIN_URL || "https://madhuvanvatikacloud.com:21093/").replace(/\/+$/, "");
const BASE_BDAY = (process.env.BDAY_URL || "https://madhuvanvatikacloud.com:21099/").replace(/\/+$/, "");
const BASE_LEAVE = (process.env.LEAVE_URL || "https://madhuvanvatikacloud.com:21101/").replace(/\/+$/, "");
const BASE_SPORTS = (process.env.SPORTS_URL || "https://madhuvanvatikacloud.com:21106/").replace(/\/+$/, "");

// External Backend VAPS APIs (Invoked server-side via Next.js Route Handlers)
export const VAPS_API_ENDPOINTS = {
  // Base URLs
  LOGIN_URL: process.env.LOGIN_URL || "https://madhuvanvatikacloud.com:21093/",
  PORTAL_URL: process.env.PORTAL_URL || "https://madhuvanvatikacloud.com:21105/",
  BDAY_URL: process.env.BDAY_URL || "https://madhuvanvatikacloud.com:21099/",
  LEAVE_URL: process.env.LEAVE_URL || "https://madhuvanvatikacloud.com:21101/",
  SPORTS_URL: process.env.SPORTS_URL || "https://madhuvanvatikacloud.com:21106/",
  DEFAULT_MI_ID: process.env.LOGIN_MI_ID || "31",
  DEFAULT_MO_ID: "2",

  // Authentication & Smart Card Punch
  LOGIN_FACADE: process.env.API_VAPS_LOGIN || `${BASE_LOGIN}/api/LoginFacade/`,
  SMARTCARD_PUNCH: `${BASE_LOGIN}/api/LoginFacade/KioskStudentSmartCardPunch/`,

  // Student Modules
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

  // Staff Modules
  EMPLOYEE_DETAILS: `${BASE_PORTAL}/api/EmployeePtalFacade/getdata/`,
  EMPLOYEE_TIMETABLE: `${BASE_PORTAL}/api/EmployeeTTFacade/getdata/`,
  EMPLOYEE_LEAVE: `${BASE_LEAVE}/api/LeaveReportFacade/get_report/`,
  EMPLOYEE_PUNCH_LOG: `${BASE_PORTAL}/api/EmployeePunchAttendenceFacade/getrpt/`,
  EMPLOYEE_SALARY: `${BASE_PORTAL}/api/EmployeeSalaryDetailsFacade/getdaily_data/`,
  EMPLOYEE_SALARY_YEARS: `${BASE_PORTAL}/api/EmployeeSalaryDetailsFacade/getdata/`,
  STAFF_COE: `${BASE_PORTAL}/api/COEFacade/getcoedata/`,

  // Public Campus Kiosk Modules
  STUDENT_BIRTHDAYS: `${BASE_BDAY}/api/BirthDayFacade/BindStaff/`,
  STAFF_BIRTHDAYS: `${BASE_BDAY}/api/BirthDayFacade/getstaffdetails/`,
  SPORTS_WINNERS: `${BASE_SPORTS}/api/EventsStudentRecordFacade/KioskSportsWinners/`,
  EXAM_TOPPERS: `${BASE_PORTAL}/api/ExamToppersListFacade/showreport/`,
  KIOSK_GALLERY: `${BASE_PORTAL}/api/IVRM_GalleryFacade/kioskvideo/`,
};

// Client-Side Next.js API Routes (Invoked from UI Dashboards & Components)
export const CLIENT_API_ENDPOINTS = {
  // Auth
  LOGIN: process.env.NEXT_PUBLIC_API_LOGIN || "/api/login",
  SMARTCARD_PUNCH: "/api/kiosk/smartcard",

  // Student Routes
  DETAILS: "/api/student/details",
  ATTENDANCE: process.env.NEXT_PUBLIC_API_ATTENDANCE || "/api/student/attendance",
  FEES: "/api/student/fees",
  EVENTS: "/api/student/events",
  NOTICES: "/api/student/notice",
  HOMEWORK: "/api/student/homework",
  TIMETABLE: process.env.NEXT_PUBLIC_API_TIMETABLE || "/api/student/timetable",
  EXAM: process.env.NEXT_PUBLIC_API_EXAM || "/api/student/exam",
  EXAM_OVERALL: "/api/student/exam-overall",

  // Staff Routes
  STAFF_DETAILS: "/api/staff/details",
  STAFF_TIMETABLE: "/api/staff/timetable",
  STAFF_LEAVE: "/api/staff/leave",
  STAFF_PUNCH_LOG: "/api/staff/punch-log",
  STAFF_SALARY: "/api/staff/salary",
  STAFF_EVENTS: "/api/staff/events",

  // Kiosk Home Features
  KIOSK_BIRTHDAYS: "/api/kiosk/birthdays",
  KIOSK_SPORTS: "/api/kiosk/sports",
  KIOSK_TOPPERS: "/api/kiosk/toppers",

  DEFAULT_SERVER_URL: process.env.NEXT_PUBLIC_LOGIN_URL || "https://madhuvanvatikacloud.com:21093/",
  DEFAULT_MI_ID: process.env.NEXT_PUBLIC_LOGIN_MI_ID || "31",
};
