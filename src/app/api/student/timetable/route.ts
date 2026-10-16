import { NextRequest, NextResponse } from "next/server";
import { VAPS_API_ENDPOINTS } from "@/config/api";

/**
 * Safely extracts array from .NET WebAPI JSON.NET output
 * (which may be a raw array, or an object with $values array)
 */
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
    const { asmay_id, amst_id, MI_Id, portalUrl } = body;

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
            console.log("[Timetable API] Auto-resolved asmay_id:", finalAsmayId);
          }
        }
      } catch (err) {
        console.warn("[Timetable API] Could not auto-resolve asmay_id:", err);
      }
    }

    const endpoint = portalUrl
      ? `${portalUrl.trim().replace(/\/+$/, "")}/api/Student_TTFacade/getStudentTT/`
      : VAPS_API_ENDPOINTS.STUDENT_TIMETABLE;

    const payload = {
      MI_Id: instId,
      asmay_id: finalAsmayId,
      amst_id: studentId,
    };

    console.log("[Timetable API] Calling:", endpoint, payload);

    let rawData: any = {};
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(12000),
    });

    if (response.ok) {
      rawData = await response.json();
    } else {
      return NextResponse.json(
        { success: false, message: `Server returned status ${response.status}` },
        { status: response.status }
      );
    }

    const gridweeks = extractArray(rawData.gridweeks).map((g: any) => {
      const day = String(g.ttmD_DayName || g.TTMD_DayName || g.dayName || "").trim();
      return {
        ...g,
        ttmD_DayName: day,
        TTMD_DayName: day,
        dayName: day,
        ttmD_DayCode: g.ttmD_DayCode || g.TTMD_DayCode || day.slice(0, 3).toUpperCase(),
      };
    });

    const studentTT = extractArray(rawData.getStudentTT).map((item: any) => {
      const day = String(item.ttmD_DayName || item.TTMD_DayName || item.dayName || "").trim();
      const rawPeriod = String(item.ttmP_PeriodName || item.TTMP_PeriodName || item.period || "").trim();
      const periodNum = parseInt(rawPeriod.replace(/\D/g, ""), 10) || 0;
      const periodStr = periodNum > 0 ? String(periodNum) : rawPeriod;
      const subject = String(item.ismS_SubjectName || item.ISMS_SubjectName || item.subjectName || "").trim();
      const teacher = String(item.staffName || item.EmpName || item.empName || "").trim();
      const className = String(item.asmcL_ClassName || item.ASMCL_ClassName || "").trim();
      const sectionName = String(item.asmC_SectionName || item.ASMC_SectionName || "").trim();

      return {
        ...item,
        ttmD_DayName: day,
        TTMD_DayName: day,
        dayName: day,
        ttmP_PeriodName: periodStr,
        TTMP_PeriodName: periodStr,
        periodName: periodStr,
        periodNumber: periodNum,
        ismS_SubjectName: subject,
        ISMS_SubjectName: subject,
        subjectName: subject,
        staffName: teacher,
        EmpName: teacher,
        teacherName: teacher,
        asmcL_ClassName: className,
        asmC_SectionName: sectionName,
      };
    });

    const periodslst = extractArray(rawData.periodslst).map((p: any) => {
      const rawPeriod = String(p.ttmP_PeriodName || p.TTMP_PeriodName || p.period || "").trim();
      return {
        ...p,
        ttmP_PeriodName: rawPeriod,
        TTMP_PeriodName: rawPeriod,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        gridweeks,
        periodslst,
        studentTT,
        raw: rawData,
      },
    });
  } catch (error: any) {
    console.error("[Timetable API] Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch timetable data" },
      { status: 500 }
    );
  }
}
