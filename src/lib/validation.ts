import { RoleGroup } from "@/types/chat";

const MAX_MESSAGE_LENGTH = 2500;

export function normalizeRole(inputRole?: string | null): RoleGroup {
  if (!inputRole || typeof inputRole !== "string") {
    return "student_parent";
  }

  const clean = inputRole.trim().toLowerCase().replace(/\s+/g, " ");

  if (
    clean === "student" ||
    clean === "parent" ||
    clean === "student_parent" ||
    clean === "student / parent" ||
    clean.includes("student") ||
    clean.includes("parent")
  ) {
    return "student_parent";
  }

  if (
    clean === "staff" ||
    clean === "teacher" ||
    clean === "faculty" ||
    clean === "teacher_staff" ||
    clean === "teacher / staff" ||
    clean.includes("teacher") ||
    clean.includes("staff") ||
    clean.includes("faculty")
  ) {
    return "teacher_staff";
  }

  if (
    clean === "visitor" ||
    clean === "applicant" ||
    clean === "guest" ||
    clean === "visitor_applicant" ||
    clean === "visitor / applicant" ||
    clean.includes("visitor") ||
    clean.includes("applicant") ||
    clean.includes("guest")
  ) {
    return "visitor_applicant";
  }

  if (
    clean === "alumni" ||
    clean === "ex-employee" ||
    clean === "former-staff" ||
    clean === "alumni_ex_employee" ||
    clean === "alumni / ex-employee" ||
    clean.includes("alumni") ||
    clean.includes("former") ||
    clean.includes("ex-employee")
  ) {
    return "alumni_ex_employee";
  }

  if (clean === "admin" || clean.includes("admin")) {
    return "admin";
  }

  return "student_parent";
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
  cleanMessage: string;
}

export function validateChatMessage(message: unknown): ValidationResult {
  if (typeof message !== "string") {
    return {
      valid: false,
      error: "Message must be a string.",
      cleanMessage: "",
    };
  }

  const trimmed = message.trim();
  if (trimmed.length === 0) {
    return {
      valid: false,
      error: "Message cannot be empty.",
      cleanMessage: "",
    };
  }

  if (trimmed.length > MAX_MESSAGE_LENGTH) {
    return {
      valid: false,
      error: `Message exceeds maximum allowed length of ${MAX_MESSAGE_LENGTH} characters.`,
      cleanMessage: trimmed.slice(0, MAX_MESSAGE_LENGTH),
    };
  }

  return {
    valid: true,
    cleanMessage: trimmed,
  };
}
