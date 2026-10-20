import {
  AgentDescriptor,
  AgentName,
  RoleGroup,
} from "@/types/chat";

export const AGENT_REGISTRY: Record<AgentName, AgentDescriptor> = {
  // ============================================================================
  // Student / Parent Role Group (9 Agents)
  // ============================================================================
  StudentAssistant: {
    name: "StudentAssistant",
    roleGroup: "student_parent",
    title: "Student & Parent Campus Assistant",
    description: "General academic queries, daily campus schedule, navigation, and student guidance.",
    capabilities: ["general inquiry", "campus schedule", "academics", "kiosk navigation"],
    defaultForRole: true,
    keywords: ["help", "info", "hello", "hi", "what is", "about", "timing", "school"],
  },
  Attendance: {
    name: "Attendance",
    roleGroup: "student_parent",
    title: "Attendance Desk Agent",
    description: "Attendance rules, CBSE 75% minimum criteria, morning biometric gate checks.",
    capabilities: ["attendance", "present days", "leave rules", "CBSE 75% norm"],
    keywords: ["attendance", "present", "absent", "leave", "percentage", "75", "punch"],
  },
  Academic: {
    name: "Academic",
    roleGroup: "student_parent",
    title: "Academic Curriculum Agent",
    description: "Subjects, textbook requirements, CBSE syllabus, class section timetable.",
    capabilities: ["academics", "timetable", "subjects", "periods", "syllabus"],
    keywords: ["academic", "subject", "syllabus", "book", "curriculum", "period", "class"],
  },
  Exam: {
    name: "Exam",
    roleGroup: "student_parent",
    title: "Examinations & Assessments Agent",
    description: "Examination timetables, assessment patterns, hall tickets, and scorecards.",
    capabilities: ["exams", "assessments", "hall ticket", "marksheet", "scorecard"],
    keywords: ["exam", "test", "mark", "score", "grade", "hall ticket", "result", "datesheet"],
  },
  Fee: {
    name: "Fee",
    roleGroup: "student_parent",
    title: "Accounts & Fee Desk Agent",
    description: "Tuition fee structures, payment deadlines, accounts counter timings, receipts.",
    capabilities: ["fee structures", "installments", "receipts", "accounts counter"],
    keywords: ["fee", "dues", "balance", "pay", "payment", "tuition", "installment", "receipt"],
  },
  Transport: {
    name: "Transport",
    roleGroup: "student_parent",
    title: "Campus Transport Agent",
    description: "Bus routes, vehicle telemetry, stops, driver contacts, safety protocols.",
    capabilities: ["transport", "bus routes", "pick up", "drop", "bus tracking"],
    keywords: ["bus", "transport", "route", "driver", "van", "stop", "pickup", "drop"],
  },
  Notice: {
    name: "Notice",
    roleGroup: "student_parent",
    title: "Notice & Bulletins Agent",
    description: "School circulars, holiday announcements, sports events, daily notices.",
    capabilities: ["notices", "circulars", "holidays", "bulletins", "announcements"],
    keywords: ["notice", "circular", "holiday", "event", "announcement", "bulletin"],
  },
  Learning: {
    name: "Learning",
    roleGroup: "student_parent",
    title: "Learning & Revision Coach",
    description: "Personalized study roadmaps, revision recommendations, subject coaching guidance.",
    capabilities: ["learning support", "study tips", "revision advice", "concept coaching"],
    requiresRecommendation: true,
    keywords: ["study", "learn", "recommend", "revision", "tips", "how to prepare", "improve marks"],
  },
  FamilySupport: {
    name: "FamilySupport",
    roleGroup: "student_parent",
    title: "Family & Parent Support Agent",
    description: "PTM meetings, parent counseling, wellness desk, principal appointments.",
    capabilities: ["family support", "PTM", "counseling", "parent grievance", "principal meet"],
    keywords: ["parent", "father", "mother", "ptm", "counseling", "family", "meeting", "wellness"],
  },

  // ============================================================================
  // Teacher / Staff Role Group (8 Agents)
  // ============================================================================
  TeacherCopilot: {
    name: "TeacherCopilot",
    roleGroup: "teacher_staff",
    title: "Faculty Copilot",
    description: "Primary faculty coordinator for classroom teaching and institutional inquiries.",
    capabilities: ["faculty guidance", "daily schedule", "staff notices", "coordination"],
    defaultForRole: true,
    keywords: ["hello", "hi", "teach", "staff", "faculty", "help", "copilot"],
  },
  Class: {
    name: "Class",
    roleGroup: "teacher_staff",
    title: "Classroom Management Agent",
    description: "Class assignments, substitution logs, student rosters, period timings.",
    capabilities: ["class management", "substitution", "roster", "classroom"],
    keywords: ["class", "roster", "section", "substitution", "period", "bell", "room"],
  },
  AttendanceAnalysis: {
    name: "AttendanceAnalysis",
    roleGroup: "teacher_staff",
    title: "Attendance Telemetry & Analytics",
    description: "Staff punch logs, biometric records, student absenteeism trends and risk predictions.",
    capabilities: ["attendance telemetry", "punch records", "absenteeism prediction"],
    requiresPrediction: true,
    keywords: ["punch", "biometric", "trend", "predict", "forecast", "absenteeism", "in-time"],
  },
  Assessment: {
    name: "Assessment",
    roleGroup: "teacher_staff",
    title: "Assessment & Grading Desk",
    description: "Evaluation rubrics, CBSE grading benchmarks, marks entry schedules.",
    capabilities: ["grading", "rubrics", "marks entry", "question blueprint"],
    keywords: ["assessment", "grading", "rubric", "evaluation", "marks entry", "blueprint"],
  },
  Lesson: {
    name: "Lesson",
    roleGroup: "teacher_staff",
    title: "Lesson Planning Agent",
    description: "Curriculum pacing guides, Bloom's Taxonomy lesson outlines, teaching activities.",
    capabilities: ["lesson planning", "pedagogy", "activity design", "learning objectives"],
    keywords: ["lesson", "plan", "pedagogy", "activity", "curriculum", "teaching", "bloom"],
  },
  StaffKnowledge: {
    name: "StaffKnowledge",
    roleGroup: "teacher_staff",
    title: "Staff Policy & Knowledge Base",
    description: "Staff service rules, institution code of conduct, CBSE compliance handbook.",
    capabilities: ["staff rules", "code of conduct", "CBSE norms", "service handbook"],
    keywords: ["policy", "rule", "code of conduct", "handbook", "service", "bylaw", "compliance"],
  },
  HRLeave: {
    name: "HRLeave",
    roleGroup: "teacher_staff",
    title: "HR & Leave Management Agent",
    description: "Casual leave (CL), Medical leave (ML), Earned leave (EL), salary ledger queries.",
    capabilities: ["leave balance", "CL", "ML", "EL", "salary slip", "payroll desk"],
    keywords: ["leave", "cl", "ml", "el", "salary", "payslip", "payroll", "casual leave", "medical"],
  },
  Resource: {
    name: "Resource",
    roleGroup: "teacher_staff",
    title: "Campus Resources Agent",
    description: "STEM laboratories, AV equipment, smart board facilities, auditorium bookings.",
    capabilities: ["lab booking", "resources", "smartboard", "library", "auditorium"],
    keywords: ["resource", "lab", "smartboard", "projector", "library", "booking", "equipment"],
  },

  // ============================================================================
  // Visitor / Applicant Role Group (6 Agents)
  // ============================================================================
  Visitor: {
    name: "Visitor",
    roleGroup: "visitor_applicant",
    title: "Visitor Welcome Concierge",
    description: "Primary visitor guide for campus reception, timing, and security badging.",
    capabilities: ["visitor concierge", "campus hours", "reception guidance", "badge desk"],
    defaultForRole: true,
    keywords: ["visitor", "guest", "hello", "welcome", "hours", "reception", "desk", "gate"],
  },
  Admission: {
    name: "Admission",
    roleGroup: "visitor_applicant",
    title: "Admissions Information Agent",
    description: "Admissions criteria, eligibility age, fee matrix for 2026-27, prospectus guidance.",
    capabilities: ["admissions", "eligibility", "prospectus", "seat vacancy"],
    keywords: ["admission", "nursery", "kg", "apply", "prospectus", "seat", "fees", "criteria"],
  },
  CampusNavigation: {
    name: "CampusNavigation",
    roleGroup: "visitor_applicant",
    title: "Campus Navigation & Wayfinding",
    description: "Directions to academic blocks, administrative offices, labs, canteen, grounds.",
    capabilities: ["wayfinding", "block directions", "office location", "floor map"],
    keywords: ["where", "map", "block", "direction", "location", "floor", "find", "way"],
  },
  Appointment: {
    name: "Appointment",
    roleGroup: "visitor_applicant",
    title: "Appointments & Meetings Agent",
    description: "Meeting slots with Principal, Vice-Principal, Admissions Director, and Faculty.",
    capabilities: ["principal appointment", "management meeting", "visiting hours"],
    keywords: ["appointment", "meet", "principal", "director", "slot", "schedule visit"],
  },
  Application: {
    name: "Application",
    roleGroup: "visitor_applicant",
    title: "Application Desk Agent",
    description: "Application tracking, document checklist, entrance test dates, verification.",
    capabilities: ["application status", "document list", "entrance test", "verification"],
    keywords: ["application", "form", "documents", "test date", "status", "submit", "apply online"],
  },
  PublicKnowledge: {
    name: "PublicKnowledge",
    roleGroup: "visitor_applicant",
    title: "Public Campus Information",
    description: "CBSE affiliation, institution history, green solar campus, fleet coverage.",
    capabilities: ["CBSE affiliation", "accreditation", "campus facts", "transport coverage"],
    keywords: ["affiliation", "cbse", "history", "about school", "solar", "infrastructure"],
  },

  // ============================================================================
  // Alumni / Ex-Employee Role Group (6 Agents)
  // ============================================================================
  AlumniAssistant: {
    name: "AlumniAssistant",
    roleGroup: "alumni_ex_employee",
    title: "Alumni Relations Concierge",
    description: "Homecoming concierge, batch reunions, general alumni queries, alumni portal tour.",
    capabilities: ["alumni welcome", "portal tour", "batch connection", "general inquiries"],
    defaultForRole: true,
    keywords: ["alumni", "batch", "homecoming", "hello", "reunion", "portal"],
  },
  Event: {
    name: "Event",
    roleGroup: "alumni_ex_employee",
    title: "Alumni Events & Reunions",
    description: "Decennial reunions, annual homecoming dinners, guest speaker series, RSVP.",
    capabilities: ["reunions", "annual meet", "rsvp", "guest lecture"],
    keywords: ["event", "meet", "reunion", "homecoming", "gala", "rsvp", "annual meet"],
  },
  Records: {
    name: "Records",
    roleGroup: "alumni_ex_employee",
    title: "Transcripts & Records Desk",
    description: "CBSE Class 10/12 transcript verification, migration certificates, digital LOR requests.",
    capabilities: ["transcripts", "certificates", "migration", "recommendation letter"],
    keywords: ["transcript", "record", "marksheet", "lor", "certificate", "migration", "degree"],
  },
  Community: {
    name: "Community",
    roleGroup: "alumni_ex_employee",
    title: "Community & Mentorship Agent",
    description: "Student mentorship clinics, alumni job board, startup showcase, career guidance.",
    capabilities: ["mentorship matching", "job referrals", "networking", "alumni directory"],
    requiresRecommendation: true,
    keywords: ["mentor", "community", "network", "job", "referral", "advice", "career"],
  },
  Achievement: {
    name: "Achievement",
    roleGroup: "alumni_ex_employee",
    title: "Alumni Achievements & Hall of Fame",
    description: "Distinguished alumni profiles, entrepreneurship highlights, national accolades.",
    capabilities: ["hall of fame", "achievements", "awards", "distinguished alumni"],
    keywords: ["achievement", "hall of fame", "award", "success", "distinguished", "honor"],
  },
  OfficeSupport: {
    name: "OfficeSupport",
    roleGroup: "alumni_ex_employee",
    title: "Ex-Employee & Office Support",
    description: "Relieving letters, service verification, gratuity desk, alumni campus passes.",
    capabilities: ["service verification", "relieving letter", "campus pass", "gratuity"],
    keywords: ["former staff", "ex-employee", "service", "relieving", "gratuity", "pass", "staff record"],
  },

  // ============================================================================
  // Admin Role (1 Agent)
  // ============================================================================
  AdminCommand: {
    name: "AdminCommand",
    roleGroup: "admin",
    title: "Administrative Executive Desk",
    description: "Institutional governance, compliance, fee collection metrics, transport fleet telemetry.",
    capabilities: ["institutional metrics", "regulatory compliance", "fleet telemetry"],
    defaultForRole: true,
    keywords: ["admin", "compliance", "fleet", "metric", "telemetry", "finance"],
  },
};

/**
 * Returns all agents belonging to a given role group.
 */
export function getAgentsForRole(roleGroup: RoleGroup): AgentDescriptor[] {
  return Object.values(AGENT_REGISTRY).filter((a) => a.roleGroup === roleGroup);
}

/**
 * Returns the default orchestrator agent for a role group.
 */
export function getDefaultAgentForRole(roleGroup: RoleGroup): AgentDescriptor {
  const defaultAgent = Object.values(AGENT_REGISTRY).find(
    (a) => a.roleGroup === roleGroup && a.defaultForRole
  );
  return defaultAgent || AGENT_REGISTRY.StudentAssistant;
}

/**
 * Selects the best agent for a user message within the role group using keyword heuristics.
 */
export function resolveAgentFromMessage(
  roleGroup: RoleGroup,
  message: string
): AgentDescriptor {
  const agents = getAgentsForRole(roleGroup);
  if (!agents || agents.length === 0) {
    return AGENT_REGISTRY.StudentAssistant;
  }

  const lower = (message || "").toLowerCase();

  // Find the agent with the highest number of keyword matches
  let bestAgent = agents.find((a) => a.defaultForRole) || agents[0];
  let maxScore = 0;

  for (const agent of agents) {
    let score = 0;
    for (const kw of agent.keywords) {
      if (lower.includes(kw.toLowerCase())) {
        score += 1;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestAgent = agent;
    }
  }

  return bestAgent;
}
