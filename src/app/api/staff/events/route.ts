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

async function handleEvents(params: { asmay_id?: any; month?: any; MI_Id?: any; portalUrl?: string }) {
  try {
    const { asmay_id, month = 0, MI_Id, portalUrl } = params;

    const endpoint = portalUrl
      ? `${portalUrl.trim().replace(/\/+$/, "")}/api/COEFacade/getcoedata/`
      : VAPS_API_ENDPOINTS.STAFF_COE;

    const payload = {
      asmay_id: Number(asmay_id || 0),
      month: Number(month || 0),
      MI_Id: Number(MI_Id || 31),
    };

    console.log("[Staff Events/COE API] Calling:", endpoint, payload);

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
      console.warn("[Staff Events/COE API] Remote call failed:", err.message || err);
    }

    if (success && rawData) {
      const coereport = extractArray(rawData.coereportlist || rawData.coereport);

      if (coereport.length > 0) {
        const events = coereport.map((c: any) => ({
          eventName: c.COEME_EventName || c.COEE_EventsName || c.eventName || "Event",
          startDate: c.COEE_EStartDate ? new Date(c.COEE_EStartDate).toLocaleDateString("en-GB") : (c.COEE_EventsStartDate ? new Date(c.COEE_EventsStartDate).toLocaleDateString("en-GB") : (c.startDate || "")),
          endDate: c.COEE_EEndDate ? new Date(c.COEE_EEndDate).toLocaleDateString("en-GB") : (c.COEE_EventsEndDate ? new Date(c.COEE_EventsEndDate).toLocaleDateString("en-GB") : (c.endDate || "")),
          desc: c.COEME_EventDesc || c.COEE_EventsDesc || c.description || c.desc || "",
        }));

        return NextResponse.json({
          success: true,
          data: events,
          raw: rawData,
        });
      }
    }

    // Return empty list if no remote COE events exist
    return NextResponse.json({
      success: true,
      data: [],
    });
  } catch (error: any) {
    console.error("[Staff Events/COE API] Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to load COE events" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  return handleEvents(body);
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const asmay_id = searchParams.get("asmay_id") || searchParams.get("asmayId") || "0";
  const month = searchParams.get("month") || "0";
  const MI_Id = searchParams.get("MI_Id") || searchParams.get("miId") || "31";
  const portalUrl = searchParams.get("portalUrl") || "";
  return handleEvents({ asmay_id, month, MI_Id, portalUrl });
}
