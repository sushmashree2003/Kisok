import { NextRequest, NextResponse } from "next/server";
import { VAPS_API_ENDPOINTS } from "@/config/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { asmay_id, amst_id, MI_Id, month = 0, portalUrl } = body;

    const endpoint = portalUrl
      ? `${portalUrl.trim().replace(/\/+$/, "")}/api/COEFacade/getcoedata/`
      : VAPS_API_ENDPOINTS.STUDENT_EVENTS;

    const payload = {
      asmay_id: Number(asmay_id || 0),
      amst_id: Number(amst_id || 0),
      month: Number(month || 0),
      MI_Id: Number(MI_Id || 31),
    };

    console.log("[Events COE API] Calling:", endpoint, payload);

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
    const coereportlist = data.coereportlist || data.coestudentlist || [];

    return NextResponse.json({
      success: true,
      data: {
        coereportlist,
        raw: data,
      },
    });
  } catch (error: any) {
    console.error("[Events COE API] Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch COE events" },
      { status: 500 }
    );
  }
}
