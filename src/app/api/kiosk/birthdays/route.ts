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

async function handleBirthdays(params: { type?: string; MI_Id?: any; MO_Id?: any }) {
  try {
    const { type = "both", MI_Id, MO_Id } = params;

    const instId = Number(MI_Id || 31);
    const moId = Number(MO_Id || 2);

    let students: any[] = [];
    let staff: any[] = [];

    // 1. Fetch Student Birthdays if requested
    if (type === "student" || type === "both") {
      try {
        const studRes = await fetch(VAPS_API_ENDPOINTS.STUDENT_BIRTHDAYS, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            Logintype: "KIOSK",
            lo: instId,
            MO_Id: moId,
            rdbbutton: "student",
          }),
          signal: AbortSignal.timeout(6000),
        });

        if (studRes.ok) {
          const studData = await studRes.json();
          students = extractArray(studData.studentlist).map((s: any) => ({
            name: s.studentName || s.studentname || "Student",
            className: s.ASMCL_ClassName || s.asmcL_ClassName || "Class 10",
            section: s.ASMC_SectionName || s.asmC_SectionName || "A",
            photo: s.PhotoPath || s.HRME_Photo || "",
          }));
        }
      } catch (e) {
        console.warn("[Birthdays API] Student fetch error:", e);
      }
    }

    // 2. Fetch Staff Birthdays if requested
    if (type === "staff" || type === "both") {
      try {
        const now = new Date().toISOString();
        const staffRes = await fetch(VAPS_API_ENDPOINTS.STAFF_BIRTHDAYS, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            all1: 1,
            Fromdate: now,
            Todate: now,
            months: 0,
            Logintype: "KIOSK",
            MO_Id: instId,
          }),
          signal: AbortSignal.timeout(6000),
        });

        if (staffRes.ok) {
          const staffData = await staffRes.json();
          const list = extractArray(staffData.staffList || staffData.staffDetails);
          staff = list.map((st: any) => ({
            name: st.employeeName || st.HRME_EmployeeFirstName || "Faculty Member",
            department: st.HRMD_DepartmentName || "Academics",
            photo: st.HRME_Photo || st.PhotoPath || "",
          }));
        }
      } catch (e) {
        console.warn("[Birthdays API] Staff fetch error:", e);
      }
    }

    // Return clean dynamic arrays without static mock names
    return NextResponse.json({
      success: true,
      data: {
        students,
        staff,
      },
    });
  } catch (error: any) {
    console.error("[Birthdays API] Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to load birthdays" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  return handleBirthdays(body);
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const type = searchParams.get("type") || "both";
  const MI_Id = searchParams.get("MI_Id") || searchParams.get("miId") || "31";
  const MO_Id = searchParams.get("MO_Id") || searchParams.get("moId") || "2";
  return handleBirthdays({ type, MI_Id, MO_Id });
}
