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

async function handleTimetable(params: { asmay_id?: any; userid?: any; MI_Id?: any; portalUrl?: string }) {
  try {
    const { asmay_id, userid, MI_Id, portalUrl } = params;

    const endpoint = portalUrl
      ? `${portalUrl.trim().replace(/\/+$/, "")}/api/EmployeeTTFacade/getdata/`
      : VAPS_API_ENDPOINTS.EMPLOYEE_TIMETABLE;

    let finalAsmayId = Number(asmay_id || 0);
    const userIdNum = Number(userid || 0);
    const instId = Number(MI_Id || 31);

    // Auto-resolve asmay_id from EmployeePtalFacade if not provided
    if (finalAsmayId <= 0 && userIdNum > 0) {
      try {
        const detailsEndpoint = portalUrl
          ? `${portalUrl.trim().replace(/\/+$/, "")}/api/EmployeePtalFacade/getdata/`
          : VAPS_API_ENDPOINTS.EMPLOYEE_DETAILS;
        const detRes = await fetch(detailsEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ asmayID: 0, userid: userIdNum, MI_Id: instId }),
          signal: AbortSignal.timeout(5000),
        });
        if (detRes.ok) {
          const detData = await detRes.json();
          if (detData.updatedyear || detData.asmaY_Id) {
            finalAsmayId = Number(detData.updatedyear || detData.asmaY_Id);
          }
        }
      } catch (e) {
        console.warn("[Staff Timetable API] Auto-resolve year failed:", e);
      }
    }

    const payload = {
      MI_Id: instId,
      ASMAY_Id: finalAsmayId,
      UserId: userIdNum,
    };

    console.log("[Staff Timetable API] Calling:", endpoint, payload);

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
      console.warn("[Staff Timetable API] Remote call failed:", err.message || err);
    }

    if (success && rawData) {
      const allperiods = extractArray(rawData.allperiods);
      const classSections = extractArray(rawData.class_sectons || rawData.classsection || rawData.tT_final_generation);

      const scheduleList = classSections.map((cs: any) => {
        const day = (cs.p_Days || cs.ttmD_DayName || cs.TTMD_DayName || cs.day || "").trim();
        const period = String(cs.period || cs.ttmP_PeriodName || "");
        const rawClass = (cs.asmcL_ClassName || "").trim();
        const section = cs.asmC_SectionName ? ` ${cs.asmC_SectionName.trim()}` : "";
        const formattedClass = rawClass
          ? (rawClass.toLowerCase().startsWith("class") || rawClass.toLowerCase().startsWith("ps") || rawClass.toLowerCase().startsWith("grade")
            ? `${rawClass}${section}`
            : `Class ${rawClass}${section}`)
          : "";
        const subject = (cs.ISMS_SubjectName || cs.isms_subjectName || cs.subjectName || "").trim();
        const room = cs.room || cs.roomName || cs.lmsE_RoomNo || "";
        const time = cs.fromTime && cs.toTime
          ? `${cs.fromTime} - ${cs.toTime}`
          : (cs.time || cs.ttmP_FromTime ? `${cs.ttmP_FromTime} - ${cs.ttmP_ToTime || ""}` : "");

        return {
          day,
          period,
          time,
          class: formattedClass,
          subject,
          room,
          topic: cs.topic || "",
        };
      });

      return NextResponse.json({
        success: true,
        data: {
          allperiods,
          classSections,
          schedule: scheduleList,
          raw: rawData,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        allperiods: [],
        classSections: [],
        schedule: [],
      },
    });
  } catch (error: any) {
    console.error("[Staff Timetable API] Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to load staff timetable" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  return handleTimetable(body);
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const asmay_id = searchParams.get("asmay_id") || searchParams.get("asmayId") || "0";
  const userid = searchParams.get("userid") || searchParams.get("empId") || "0";
  const MI_Id = searchParams.get("MI_Id") || searchParams.get("miId") || "31";
  const portalUrl = searchParams.get("portalUrl") || "";
  return handleTimetable({ asmay_id, userid, MI_Id, portalUrl });
}
