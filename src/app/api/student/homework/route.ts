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
    const { asmay_id, amst_id, MI_Id, empid = 0, roleid = 3, portalUrl } = body;

    let finalAsmayId = Number(asmay_id || 0);
    const instId = Number(MI_Id || 31);
    const studentId = Number(amst_id || 0);

    const endpoint = portalUrl
      ? `${portalUrl.trim().replace(/\/+$/, "")}/api/StudentDashboardFacade/Getdetails/`
      : VAPS_API_ENDPOINTS.STUDENT_HOMEWORK;

    // Auto-resolve asmay_id if missing or 0
    if (finalAsmayId <= 0 && studentId > 0) {
      try {
        const detRes = await fetch(endpoint, {
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
        console.warn("[Homework API] Could not auto-resolve asmay_id:", err);
      }
    }

    const payload = {
      asmay_id: finalAsmayId,
      empid: Number(empid || 0),
      amst_id: studentId,
      MI_Id: instId,
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
    const homeworklist = extractArray(data.homeworklist).map((h: any) => ({
      ...h,
      IHW_Topic: h.IHW_Topic || h.ihW_Topic || h.topic || "Class Assignment",
      ISMS_SubjectName: h.ISMS_SubjectName || h.ismS_SubjectName || h.subject || "General",
      IHW_Date: h.IHW_Date || h.ihW_Date || null,
      IHW_Assignment: h.IHW_Assignment || h.ihW_Assignment || h.IHW_Topic || h.ihW_Topic || "",
    }));

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
