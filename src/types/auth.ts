/**
 * Authentication and Session Types based on C# VAPS Kiosk reference:
 * D:\Sushma\Kiosk\Old kiosk\vaps demo school\vaps demo school
 */

export interface LoginRequestPayload {
  username: string;
  password: string;
  mI_ID: string | number;
  Logintype: string; // "KIOSK"
}

export interface LoginResponseDTO {
  userName?: string;
  message?: string | null;
  roleId?: number;
  isLogged?: boolean | string;
  userId?: number;
  ivrM_MO_Id?: string | number;
  asmaY_Id?: number;
  role?: string | number;
  mI_ID?: number;
  pageId?: number;
  ivrmirP_AddFlag?: boolean | string;
  ivrmirP_UpdateFlag?: boolean | string;
  ivrmirP_DeleteFlag?: boolean | string;
  ivrmirP_ReportFlag?: boolean | string;
  ivrmirP_SearchFlag?: boolean | string;
  ivrmirP_ProcessFlag?: boolean | string;
  cutoffdate?: string;
  subscriptionenddate?: string;
  flag?: string;
  subscriptionFlag?: boolean | string;
  AMST_ID?: number;
  amsT_Id?: number;
  classList?: any[];
  sectionList?: any[];
  ASMAY_Year?: string;
  roleforlogin?: string;
  instituteName?: string;
  empcode?: number;
  MI_Idforlogin?: number;
  mI_Name?: string;
  mI_logo?: string;
  fillinstition1?: any[];
  loginlist?: any[];
  [key: string]: any;
}

/**
 * Exact replica of C# `sessionInfo` class in reference LoginForm.cs:
 * public class sessionInfo {
 *    public static string username;
 *    public static string ASMAY_Year;
 *    public static long ASMAY_Id;
 *    public static long UserId;
 *    public static string Rolename;
 *    public static long RoleId;
 *    public static long Empid;
 *    public static long miid;
 *    public static long AMST_ID;
 *    public static string initname;
 *    public static string initlogo;
 *    public static string img;
 *    ...
 * }
 */
export interface SessionInfo {
  username: string;
  ASMAY_Year: string;
  ASMAY_Id: number;
  AMST_ID: number;
  UserId: number;
  RoleId: number;
  Rolename: string;
  Empid: number;
  initname: string;
  initlogo: string;
  miid: number;
  img: string;
  roleforlogin: string;
  loginTime: string;
  rawResponse?: LoginResponseDTO;
  name?: string;
  studentname?: string;
  asmcL_ClassName?: string;
  asms_sectionname?: string;
  role?: string;
  photo?: string;
}

export interface LoginApiResponse {
  success: boolean;
  message?: string;
  data?: LoginResponseDTO;
  session?: SessionInfo;
  firstTimeLogin?: boolean;
}
