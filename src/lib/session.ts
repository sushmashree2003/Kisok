import { LoginResponseDTO, SessionInfo } from "@/types/auth";

const SESSION_STORAGE_KEY = "vaps_kiosk_user_session";
const REMEMBERED_USER_KEY = "vaps_kiosk_remembered_user";

/**
 * Transforms the API LoginResponseDTO into the sessionInfo structure
 * exactly as performed in the reference project:
 * D:\Sushma\Kiosk\Old kiosk\vaps demo school\vaps demo school\KioskHub\LoginForm.cs
 */
export function createSessionFromLoginDTO(
  dto: LoginResponseDTO,
  fallbackRole: string = "student",
  fallbackUsername: string = "User"
): SessionInfo {
  const rolename = dto.roleforlogin || (typeof dto.role === "string" ? dto.role : fallbackRole);
  const empid = Number(dto.empcode || dto.emp_Id || 0);
  const mi_id = Number(dto.MI_Idforlogin || dto.mI_ID || 31);
  const initname = dto.instituteName || dto.mI_Name || dto.instname || dto.institutionName || "";
  const initlogo = dto.mI_logo || "";

  return {
    username: dto.userName || fallbackUsername,
    ASMAY_Year: dto.ASMAY_Year || dto.asmaY_Year || "",
    ASMAY_Id: Number(dto.asmaY_Id || 0),
    AMST_ID: Number(dto.AMST_ID || dto.amsT_Id || 0),
    UserId: Number(dto.userId || 0),
    RoleId: Number(dto.roleId || 0),
    Rolename: rolename,
    Empid: empid,
    initname: initname,
    initlogo: initlogo,
    miid: mi_id,
    img: initlogo || "",
    roleforlogin: rolename,
    loginTime: new Date().toISOString(),
    rawResponse: dto,
  };
}

/**
 * Stores session data in browser `sessionStorage` (and individual keys matching reference C# sessionInfo),
 * and optionally in `localStorage` if rememberMe is enabled.
 */
export function saveUserSession(session: SessionInfo, rememberMe: boolean = false): void {
  if (typeof window === "undefined") return;

  try {
    // 1. Unified JSON object
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));

    // 2. Individual keys matching C# `sessionInfo` class for direct access
    sessionStorage.setItem("username", session.username || "");
    sessionStorage.setItem("ASMAY_Year", session.ASMAY_Year || "");
    sessionStorage.setItem("ASMAY_Id", String(session.ASMAY_Id ?? 0));
    sessionStorage.setItem("AMST_ID", String(session.AMST_ID ?? 0));
    sessionStorage.setItem("UserId", String(session.UserId ?? 0));
    sessionStorage.setItem("RoleId", String(session.RoleId ?? 0));
    sessionStorage.setItem("Rolename", session.Rolename || "");
    sessionStorage.setItem("Empid", String(session.Empid ?? 0));
    sessionStorage.setItem("initname", session.initname || "");
    sessionStorage.setItem("initlogo", session.initlogo || "");
    sessionStorage.setItem("miid", String(session.miid ?? 0));
    sessionStorage.setItem("img", session.img || "");
    sessionStorage.setItem("roleforlogin", session.roleforlogin || "");

    if (rememberMe) {
      localStorage.setItem(REMEMBERED_USER_KEY, JSON.stringify({
        username: session.username,
        role: session.roleforlogin,
      }));
    } else {
      localStorage.removeItem(REMEMBERED_USER_KEY);
    }
  } catch (error) {
    console.error("Failed to save session data to sessionStorage:", error);
  }
}

/**
 * Retrieves the current session info from `sessionStorage`.
 */
export function getUserSession(): SessionInfo | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SessionInfo;
  } catch (error) {
    console.error("Failed to parse user session from sessionStorage:", error);
    return null;
  }
}

/**
 * Clears the session from `sessionStorage` (e.g. on logout or returning to kiosk home).
 */
export function clearUserSession(): void {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("ASMAY_Year");
    sessionStorage.removeItem("ASMAY_Id");
    sessionStorage.removeItem("AMST_ID");
    sessionStorage.removeItem("UserId");
    sessionStorage.removeItem("RoleId");
    sessionStorage.removeItem("Rolename");
    sessionStorage.removeItem("Empid");
    sessionStorage.removeItem("initname");
    sessionStorage.removeItem("initlogo");
    sessionStorage.removeItem("miid");
    sessionStorage.removeItem("img");
    sessionStorage.removeItem("roleforlogin");
  } catch (error) {
    console.error("Failed to clear session data:", error);
  }
}

/**
 * Checks if a user is currently logged in with active session data.
 */
export function isUserLoggedIn(): boolean {
  return getUserSession() !== null;
}

/**
 * Retrieves any remembered username for auto-fill on kiosk screens.
 */
export function getRememberedUser(): { username: string; role: string } | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(REMEMBERED_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
