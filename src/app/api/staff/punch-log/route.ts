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

async function handlePunchLog(params: { userid?: any; MI_Id?: any; fromDate?: string; toDate?: string; portalUrl?: string }) {
  try {
    const { userid, MI_Id, fromDate, toDate, portalUrl } = params;

    const endpoint = portalUrl
      ? `${portalUrl.trim().replace(/\/+$/, "")}/api/EmployeePunchAttendenceFacade/getrpt/`
      : VAPS_API_ENDPOINTS.EMPLOYEE_PUNCH_LOG;

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const payload = {
      MI_Id: Number(MI_Id || 31),
      UserId: Number(userid || 0),
      fromdate: fromDate || thirtyDaysAgo,
      todate: toDate || now.toISOString(),
    };

    console.log("[Staff Punch Log API] Calling:", endpoint, payload);

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
      console.warn("[Staff Punch Log API] Remote call failed:", err.message || err);
    }

    if (success && rawData) {
      const punchDetails = extractArray(rawData.emp_punchDetails || rawData.filldata || rawData.griddata || rawData.punchDetails);

      if (punchDetails.length > 0) {
        // Group by punchdate if items are split by inOutFlg
        const dateMap = new Map<string, any>();

        punchDetails.forEach((item: any) => {
          const rawDate = item.punchdate || item.DOE || "";
          const formattedDate = rawDate && !isNaN(Date.parse(rawDate))
            ? new Date(rawDate).toLocaleDateString("en-GB")
            : (rawDate ? String(rawDate) : "—");

          if (!dateMap.has(formattedDate)) {
            dateMap.set(formattedDate, {
              date: formattedDate,
              inTime: item.inOutFlg === "I" || item.inOutFlg === "IN" ? (item.punchtime || item.Punch_In || "—") : (item.Punch_In || item.inTime || "—"),
              outTime: item.inOutFlg === "O" || item.inOutFlg === "OUT" ? (item.punchtime || item.Punch_Out || "—") : (item.Punch_Out || item.outTime || "—"),
              hours: item.workedHours || item.duration || "—",
              status: item.status || "Recorded",
              device: item.Punch_Device || item.device || "—",
            });
          } else {
            const existing = dateMap.get(formattedDate);
            if (item.inOutFlg === "O" || item.inOutFlg === "OUT") {
              existing.outTime = item.punchtime || item.Punch_Out || existing.outTime;
            } else if (item.inOutFlg === "I" || item.inOutFlg === "IN") {
              existing.inTime = item.punchtime || item.Punch_In || existing.inTime;
            }
          }
        });

        const logs = Array.from(dateMap.values());

        return NextResponse.json({
          success: true,
          data: logs,
          raw: rawData,
        });
      }
    }

    // Return empty list if no remote punch telemetry records exist
    return NextResponse.json({
      success: true,
      data: [],
    });
  } catch (error: any) {
    console.error("[Staff Punch Log API] Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to load punch logs" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  return handlePunchLog(body);
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const userid = searchParams.get("userid") || searchParams.get("empId") || "0";
  const MI_Id = searchParams.get("MI_Id") || searchParams.get("miId") || "31";
  const fromDate = searchParams.get("fromDate") || "";
  const toDate = searchParams.get("toDate") || "";
  const portalUrl = searchParams.get("portalUrl") || "";
  return handlePunchLog({ userid, MI_Id, fromDate, toDate, portalUrl });
}
