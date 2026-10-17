import { NextRequest, NextResponse } from "next/server";
import { VAPS_API_ENDPOINTS } from "@/config/api";

function extractArray(val: any): any[] {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (val && Array.isArray(val.$values)) return val.$values;
  if (typeof val === "object") {
    const list = Object.values(val).filter((x) => typeof x === "object" && x !== null);
    if (list.length > 0) return list;
  }
  return [];
}

async function handleDetails(params: { asmay_id?: any; userid?: any; MI_Id?: any; name?: string; userName?: string; empCode?: string; portalUrl?: string }) {
  try {
    const { asmay_id, userid, MI_Id, name, userName, empCode, portalUrl } = params;

    const endpoint = portalUrl
      ? `${portalUrl.trim().replace(/\/+$/, "")}/api/EmployeePtalFacade/getdata/`
      : VAPS_API_ENDPOINTS.EMPLOYEE_DETAILS;

    const payload = {
      asmayID: Number(asmay_id || 0),
      userid: Number(userid || 0),
      MI_Id: Number(MI_Id || 31),
    };

    console.log("[Staff Details API] Calling:", endpoint, payload);

    let rawData: any = null;
    let success = false;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000),
      });

      if (response.ok) {
        rawData = await response.json();
        success = true;
      }
    } catch (err: any) {
      console.warn("[Staff Details API] Remote call failed:", err.message || err);
    }

    const defaultName = name || userName || (userid ? `Staff Member (${userid})` : "Faculty Member");

    if (success && rawData) {
      const filldept = extractArray(rawData.filldepartment);
      const emailList = extractArray(rawData.email);
      const mobileList = extractArray(rawData.mobile);

      const emp = filldept.length > 0 ? filldept[0] : {};
      const empFirstName = (emp.HRME_EmployeeFirstName || emp.hrmE_EmployeeFirstName || "").trim();
      const empMiddleName = (emp.HRME_EmployeeMiddleName || emp.hrmE_EmployeeMiddleName || "").trim();
      const empLastName = (emp.HRME_EmployeeLastName || emp.hrmE_EmployeeLastName || "").trim();
      const remoteFullName = [empFirstName, empMiddleName, empLastName].filter(Boolean).join(" ");
      const fullName = remoteFullName || defaultName;

      const staffProfile = {
        name: fullName,
        empCode: emp.HRME_EmployeeCode || emp.hrmE_EmployeeCode || empCode || (userid ? `EMP-${userid}` : ""),
        dob: emp.HRME_DOB ? new Date(emp.HRME_DOB).toLocaleDateString("en-GB") : "",
        doj: emp.HRME_DOJ ? new Date(emp.HRME_DOJ).toLocaleDateString("en-GB") : "",
        department: emp.HRMD_DepartmentName || emp.hrmD_DepartmentName || "",
        designation: emp.HRMDES_DesignationName || emp.hrmdeS_DesignationName || "",
        email: emailList[0]?.hrmE_EmailId || emp.HRME_EmailId || "",
        mobile: mobileList[0]?.hrmE_MobileNo || emp.HRME_MobileNo || "",
        photo: emp.HRME_PhotoNo || emp.hrmE_PhotoNo || "",
        bloodGroup: emp.HRME_BloodGroup || emp.hrmE_BloodGroup || "",
        panCard: emp.HRME_PANCardNo || emp.hrmE_PANCardNo || "",
        aadharCard: emp.HRME_AadharCardNo || emp.hrmE_AadharCardNo || "",
        gender: emp.IVRMMG_GenderName || emp.ivrmmG_GenderName || "",
      };

      return NextResponse.json({
        success: true,
        data: staffProfile,
        raw: rawData,
      });
    }

    // Clean profile if remote records are empty
    return NextResponse.json({
      success: true,
      data: {
        name: defaultName,
        empCode: empCode || (userid ? `EMP-${userid}` : ""),
        dob: "",
        doj: "",
        department: "",
        designation: "",
        email: "",
        mobile: "",
        photo: "",
        bloodGroup: "",
        panCard: "",
        aadharCard: "",
        gender: "",
      },
    });
  } catch (error: any) {
    console.error("[Staff Details API] Unexpected error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to load staff details" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  return handleDetails(body);
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const asmay_id = searchParams.get("asmay_id") || searchParams.get("asmayId") || "0";
  const userid = searchParams.get("userid") || searchParams.get("empId") || "0";
  const MI_Id = searchParams.get("MI_Id") || searchParams.get("miId") || "31";
  const name = searchParams.get("name") || "";
  const userName = searchParams.get("userName") || searchParams.get("username") || "";
  const empCode = searchParams.get("empCode") || "";
  const portalUrl = searchParams.get("portalUrl") || "";
  return handleDetails({ asmay_id, userid, MI_Id, name, userName, empCode, portalUrl });
}
