import { NextRequest, NextResponse } from "next/server";
import { VAPS_API_ENDPOINTS } from "@/config/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { asmay_id, amst_id, MI_Id, portalUrl, type = "overall" } = body;

    const endpoint = portalUrl
      ? `${portalUrl.trim().replace(/\/+$/, "")}/api/CumulativeFeeAnalysisFacade/getloaddata/`
      : VAPS_API_ENDPOINTS.STUDENT_FEES;

    const payload = {
      asmay_id: Number(asmay_id || 0),
      amst_id: Number(amst_id || 0),
      type: String(type || "overall"),
      MI_Id: Number(MI_Id || 31),
    };

    console.log("[Fees API] Calling:", endpoint, payload);

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
    const rawList = data?.feeAnalysisList || (Array.isArray(data) ? data : data?.feeAnalysis || []);
    const feeAnalysisList = Array.isArray(rawList)
      ? rawList
      : Array.isArray(rawList?.$values)
      ? rawList.$values
      : rawList && typeof rawList === "object"
      ? Object.values(rawList).filter((x) => typeof x === "object" && x !== null)
      : [];

    return NextResponse.json({
      success: true,
      data: {
        feeAnalysisList,
        raw: data,
      },
    });
  } catch (error: any) {
    console.error("[Fees API] Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch fee data" },
      { status: 500 }
    );
  }
}
