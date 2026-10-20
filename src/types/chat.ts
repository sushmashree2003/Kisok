/**
 * Shared TypeScript definitions for the Smart Campus AI Chatbot
 * Supports 29 specialized agents across 4 core role groups with dual-engine (Groq + NVIDIA) routing.
 */

export type RoleGroup =
  | "student_parent"
  | "teacher_staff"
  | "visitor_applicant"
  | "alumni_ex_employee"
  | "admin";

export type ClientRole =
  | "student"
  | "parent"
  | "student_parent"
  | "student / parent"
  | "staff"
  | "teacher"
  | "faculty"
  | "teacher_staff"
  | "teacher / staff"
  | "visitor"
  | "applicant"
  | "guest"
  | "visitor_applicant"
  | "visitor / applicant"
  | "alumni"
  | "ex-employee"
  | "former-staff"
  | "alumni_ex_employee"
  | "alumni / ex-employee"
  | "admin";

export type LLMProvider = "groq" | "nvidia";

export type StudentAgentName =
  | "StudentAssistant"
  | "Attendance"
  | "Academic"
  | "Exam"
  | "Fee"
  | "Transport"
  | "Notice"
  | "Learning"
  | "FamilySupport";

export type StaffAgentName =
  | "TeacherCopilot"
  | "Class"
  | "AttendanceAnalysis"
  | "Assessment"
  | "Lesson"
  | "StaffKnowledge"
  | "HRLeave"
  | "Resource";

export type VisitorAgentName =
  | "Admission"
  | "Visitor"
  | "CampusNavigation"
  | "Appointment"
  | "Application"
  | "PublicKnowledge";

export type AlumniAgentName =
  | "AlumniAssistant"
  | "Event"
  | "Records"
  | "Community"
  | "Achievement"
  | "OfficeSupport";

export type AdminAgentName = "AdminCommand";

export type AgentName =
  | StudentAgentName
  | StaffAgentName
  | VisitorAgentName
  | AlumniAgentName
  | AdminAgentName;

export interface AgentDescriptor {
  name: AgentName;
  roleGroup: RoleGroup;
  title: string;
  description: string;
  capabilities: string[];
  defaultForRole?: boolean;
  requiresPrediction?: boolean;
  requiresRecommendation?: boolean;
  keywords: string[];
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatRequest {
  message: string;
  role: string;
  sessionId?: string;
  history?: ChatMessage[];
  forceProvider?: LLMProvider;
}

export interface ChatResponse {
  success: boolean;
  answer: string;
  role: string;
  model: string;
  selectedAgent?: AgentName;
  provider?: LLMProvider;
  reasoning?: string;
  error?: string;
}

export interface PlanRequest {
  message: string;
  role: string;
}

export interface PlanResponse {
  success: boolean;
  intent: string;
  selectedAgent: AgentName;
  needsPrediction: boolean;
  needsRecommendation: boolean;
  needsKnowledgeBase: boolean;
  provider: LLMProvider;
  error?: string;
}
