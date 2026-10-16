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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      asmay_id,
      amst_id,
      empid = 0,
      MI_Id,
      roleid = 3,
      portalUrl,
    } = body;

    let finalAsmayId = Number(asmay_id || 0);
    const instId = Number(MI_Id || 31);
    const studentId = Number(amst_id || 0);

    const endpoint = portalUrl
      ? `${portalUrl.trim().replace(/\/+$/, "")}/api/StudentDashboardFacade/Getdetails/`
      : VAPS_API_ENDPOINTS.STUDENT_ATTENDANCE;

    // Auto-resolve asmay_id if missing or 0
    if (finalAsmayId <= 0 && studentId > 0) {
      try {
        const detRes = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            asmay_id: 0,
            empid: 0,
            amst_id: studentId,
            MI_Id: instId,
            roleid: 3,
          }),
          signal: AbortSignal.timeout(6000),
        });
        if (detRes.ok) {
          const detData = await detRes.json();
          const stuList = extractArray(detData.studetailslist);
          if (stuList.length > 0 && (stuList[0].asmaY_Id || stuList[0].ASMAY_Id)) {
            finalAsmayId = Number(stuList[0].asmaY_Id || stuList[0].ASMAY_Id);
          }
        }
      } catch (err) {
        console.warn("[Attendance API] Could not auto-resolve asmay_id:", err);
      }
    }

    const payload = {
      asmay_id: finalAsmayId,
      empid: Number(empid || 0),
      amst_id: studentId,
      MI_Id: instId,
      roleid: Number(roleid || 3),
    };

    console.log("[Attendance API] Calling:", endpoint, payload);

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(12000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: `Server returned status ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const rawList = data?.academicyearAttendancedata || data?.attendanceList || data;
    const attendanceList = extractArray(rawList).map((a: any) => ({
      ...a,
      MONTH_NAME: a.MONTH_NAME || a.month_name || a.monthName || "Month",
      CLASS_HELD: Number(a.CLASS_HELD || a.class_held || a.classHeld || 0),
      TOTAL_PRESENT: Number(a.TOTAL_PRESENT || a.total_present || a.totalPresent || 0),
    }));

    return NextResponse.json({
      success: true,
      data: {
        attendanceList,
        studentDetails: extractArray(data?.studetailslist),
        feedetails: extractArray(data?.academicyearFeedata),
        raw: data,
      },
    });
  } catch (error: any) {
    console.error("[Attendance API] Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch attendance data" },
      { status: 500 }
    );
  }
}
