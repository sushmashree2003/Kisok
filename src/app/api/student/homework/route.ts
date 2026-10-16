import { NextRequest, NextResponse } from "next/server";
import { VAPS_API_ENDPOINTS } from "@/config/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { asmay_id, amst_id, MI_Id, empid = 0, roleid = 3, portalUrl } = body;

    const endpoint = portalUrl
      ? `${portalUrl.trim().replace(/\/+$/, "")}/api/StudentDashboardFacade/Getdetails/`
      : VAPS_API_ENDPOINTS.STUDENT_HOMEWORK;

    const payload = {
      asmay_id: Number(asmay_id || 0),
      empid: Number(empid || 0),
      amst_id: Number(amst_id || 0),
      MI_Id: Number(MI_Id || 31),
      roleid: Number(roleid || 3),
    };

    console.log("[Homework API] Calling:", endpoint, payload);

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
    const homeworklist = data.homeworklist || [];

    return NextResponse.json({
      success: true,
      data: {
        homeworklist,
        raw: data,
      },
    });
  } catch (error: any) {
    console.error("[Homework API] Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch homework" },
      { status: 500 }
    );
  }
}
