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
    const { asmay_id, amst_id, MI_Id, portalUrl, type = "overall" } = body;

    let finalAsmayId = Number(asmay_id || 0);
    const instId = Number(MI_Id || 31);
    const studentId = Number(amst_id || 0);

    // Auto-resolve asmay_id if missing or 0 via Getdetails
    if (finalAsmayId <= 0 && studentId > 0) {
      try {
        const detailsEndpoint = portalUrl
          ? `${portalUrl.trim().replace(/\/+$/, "")}/api/StudentDashboardFacade/Getdetails/`
          : VAPS_API_ENDPOINTS.STUDENT_DETAILS;
        const detRes = await fetch(detailsEndpoint, {
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
        console.warn("[Fees API] Could not auto-resolve asmay_id:", err);
      }
    }

    const endpoint = portalUrl
      ? `${portalUrl.trim().replace(/\/+$/, "")}/api/CumulativeFeeAnalysisFacade/getloaddata/`
      : VAPS_API_ENDPOINTS.STUDENT_FEES;

    const payload = {
      asmay_id: finalAsmayId,
      amst_id: studentId,
      type: String(type || "overall"),
      MI_Id: instId,
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
    const rawList = data?.feeAnalysisList || data?.feeAnalysis || data;
    const feeAnalysisList = extractArray(rawList).map((f: any) => ({
      ...f,
      ASMAY_Year: f.ASMAY_Year || f.asmaY_Year || f.year || "N/A",
      RECEIVABLE: Number(f.RECEIVABLE || f.receivable || 0),
      COLLECTION: Number(f.COLLECTION || f.collection || f.paid || 0),
      CONCESSION: Number(f.CONCESSION || f.concession || 0),
      ADJUSTED: Number(f.ADJUSTED || f.adjusted || 0),
      BALANCE: Number(f.BALANCE || f.balance || 0),
      balance: Number(f.BALANCE || f.balance || 0),
    }));

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
