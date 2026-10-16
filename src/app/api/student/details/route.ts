import { NextRequest, NextResponse } from "next/server";
import { VAPS_API_ENDPOINTS } from "@/config/api";

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

    const endpoint = portalUrl
      ? `${portalUrl.trim().replace(/\/+$/, "")}/api/StudentDashboardFacade/Getdetails/`
      : VAPS_API_ENDPOINTS.STUDENT_DETAILS;

    const payload = {
      asmay_id: Number(asmay_id || 0),
      empid: Number(empid || 0),
      amst_id: Number(amst_id || 0),
      MI_Id: Number(MI_Id || 31),
      roleid: Number(roleid || 3),
    };

    console.log("[Details API] Calling:", endpoint, payload);

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

    return NextResponse.json({
      success: true,
      data: {
        studentDetails: data.studetailslist || [],
        attendanceData: data.academicyearAttendancedata || [],
        feeData: data.academicyearFeedata || [],
        homeworkList: data.homeworklist || [],
        raw: data,
      },
    });
  } catch (error: any) {
    console.error("[Details API] Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch student details" },
      { status: 500 }
    );
  }
}
