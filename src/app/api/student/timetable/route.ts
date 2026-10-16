import { NextRequest, NextResponse } from "next/server";
import { VAPS_API_ENDPOINTS } from "@/config/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { asmay_id, amst_id, MI_Id, portalUrl } = body;

    const endpoint = portalUrl
      ? `${portalUrl.trim().replace(/\/+$/, "")}/api/Student_TTFacade/getStudentTT/`
      : VAPS_API_ENDPOINTS.STUDENT_TIMETABLE;

    const payload = {
      MI_Id: Number(MI_Id || 31),
      asmay_id: Number(asmay_id || 0),
      amst_id: Number(amst_id || 0),
    };

    console.log("[Timetable API] Calling:", endpoint, payload);

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

    // TT DTO structure from StudentTT.cs:
    // data.gridweeks: Array of days ({ ttmD_DayName })
    // data.periodslst: Array of periods ({ TTMP_PeriodName })
    // data.getStudentTT: Array of periods & subjects ({ ttmD_DayName, TTMP_PeriodName, ISMS_SubjectName, EmpName })
    const gridweeks = data.gridweeks || [];
    const periodslst = data.periodslst || [];
    const studentTT = data.getStudentTT || [];

    return NextResponse.json({
      success: true,
      data: {
        gridweeks,
        periodslst,
        studentTT,
        raw: data,
      },
    });
  } catch (error: any) {
    console.error("[Timetable API] Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch timetable data" },
      { status: 500 }
    );
  }
}
