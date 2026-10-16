import { NextRequest, NextResponse } from "next/server";
import { VAPS_API_ENDPOINTS } from "@/config/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { asmay_id, amst_id, MI_Id, portalUrl, flag = "O" } = body;

    const endpoint = portalUrl
      ? `${portalUrl.trim().replace(/\/+$/, "")}/api/StudentDashboardFacade/onclick_notice/`
      : VAPS_API_ENDPOINTS.STUDENT_NOTICES;

    const payload = {
      AMST_Id: Number(amst_id || 0),
      ASMAY_Id: Number(asmay_id || 0),
      mI_ID: Number(MI_Id || 31),
      flag: String(flag || "O"),
    };

    console.log("[Notice API] Calling:", endpoint, payload);

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
    const noticelist = data.noticelist || [];

    return NextResponse.json({
      success: true,
      data: {
        noticelist,
        raw: data,
      },
    });
  } catch (error: any) {
    console.error("[Notice API] Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch notices" },
      { status: 500 }
    );
  }
}
