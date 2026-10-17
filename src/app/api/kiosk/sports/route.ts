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

async function handleSports(params: { MI_Id?: any; MO_Id?: any }) {
  try {
    const { MI_Id, MO_Id } = params;

    const payload = {
      MI_Id: Number(MI_Id || 31),
      MO_Id: Number(MO_Id || 2),
    };

    let rawData: any = null;
    let success = false;

    try {
      const res = await fetch(VAPS_API_ENDPOINTS.SPORTS_WINNERS, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(6000),
      });

      if (res.ok) {
        rawData = await res.json();
        success = true;
      }
    } catch (e) {
      console.warn("[Sports Winners API] Remote fetch failed:", e);
    }

    if (success && rawData) {
      const winners = extractArray(rawData.kiosksportswinners || rawData.sports || rawData.classlist).map((w: any) => ({
        studentName: w.studentName || w.AMST_FirstName || "Student Athlete",
        event: w.spccE_EventName || w.eventName || "Annual Athletic Meet",
        position: w.place || w.position || "1st Place (Gold Medal)",
        className: w.className || "Class 10",
        photo: w.photo || "",
      }));

      if (winners.length > 0) {
        return NextResponse.json({
          success: true,
          data: winners,
          raw: rawData,
        });
      }
    }

    // Return empty array when no sports winners are published
    return NextResponse.json({
      success: true,
      data: [],
    });
  } catch (error: any) {
    console.error("[Sports Winners API] Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to load sports winners" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  return handleSports(body);
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const MI_Id = searchParams.get("MI_Id") || searchParams.get("miId") || "31";
  const MO_Id = searchParams.get("MO_Id") || searchParams.get("moId") || "2";
  return handleSports({ MI_Id, MO_Id });
}
