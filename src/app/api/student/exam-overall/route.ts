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
    const {
      asmay_id,
      amst_id,
      MI_Id,
      portalUrl,
      type = "SubOVERALL", // "SubOVERALL" or "ExmOVERALL"
      isms_id = 0,
      eme_id = 0,
      asmcL_Id = 0,
      asmS_Id = 0,
    } = body;

    let finalAsmayId = Number(asmay_id || 0);
    const instId = Number(MI_Id || 31);
    const studentId = Number(amst_id || 0);

    const base = portalUrl
      ? portalUrl.trim().replace(/\/+$/, "")
      : VAPS_API_ENDPOINTS.PORTAL_URL.trim().replace(/\/+$/, "");

    // Auto-resolve asmay_id if missing or 0
    if (finalAsmayId <= 0 && studentId > 0) {
      try {
        const detailsEndpoint = `${base}/api/StudentDashboardFacade/Getdetails/`;
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
        console.warn("[ExamOverall API] Could not auto-resolve asmay_id:", err);
      }
    }

    // 1. Fetch subjects and exams metadata
    const subjectsUrl = `${base}/api/CumulativeSubjectFacade/getSubjectsdata/`;
    const examListUrl = `${base}/api/ExamReportFacade/getexamdata/`;
    const detailsUrl = `${base}/api/ExamReportFacade/StudentExamDetails/`;

    const commonPayload = {
      asmay_id: finalAsmayId,
      amst_id: studentId,
      MI_Id: instId,
    };

    // Parallel fetch metadata
    const [subjRes, examRes] = await Promise.allSettled([
      fetch(subjectsUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...commonPayload,
          asmcL_Id: Number(asmcL_Id || 0),
          asmS_Id: Number(asmS_Id || 0),
        }),
        signal: AbortSignal.timeout(10000),
      }),
      fetch(examListUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...commonPayload, Type: "EWAS" }),
        signal: AbortSignal.timeout(10000),
      }),
    ]);

    let subjectList: any[] = [];
    if (subjRes.status === "fulfilled" && subjRes.value.ok) {
      const sData = await subjRes.value.json();
      subjectList = extractArray(sData.subjectlist || sData.subjlist).map((s: any) => ({
        ...s,
        ismS_Id: s.ismS_Id || s.ISMS_Id,
        ismS_SubjectName: s.ismS_SubjectName || s.ISMS_SubjectName || s.subjectName || "Subject",
      }));
    }

    let examList: any[] = [];
    if (examRes.status === "fulfilled" && examRes.value.ok) {
      const eData = await examRes.value.json();
      examList = extractArray(eData.examlist).map((e: any) => ({
        ...e,
        emE_Id: e.emE_Id || e.EME_Id,
        emE_ExamName: e.emE_ExamName || e.EME_ExamName || e.examName || "Exam",
      }));
    }

    // 2. Fetch overall exam details
    const selectedSubj = isms_id || subjectList[0]?.ismS_Id || 0;
    const selectedExam = eme_id || examList[0]?.emE_Id || 0;

    const detailsPayload = {
      ...commonPayload,
      EME_Id: type === "SubOVERALL" ? "" : selectedExam,
      ISMS_Id: type === "SubOVERALL" ? selectedSubj : 0,
      type: type,
    };

    console.log("[ExamOverall API] Fetching details from:", detailsUrl, detailsPayload);

    const detailsRes = await fetch(detailsUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(detailsPayload),
      signal: AbortSignal.timeout(12000),
    });

    let examReportList: any[] = [];
    let rawData: any = {};
    if (detailsRes.ok) {
      rawData = await detailsRes.json();
      examReportList = extractArray(rawData.examReportList);
    }

    return NextResponse.json({
      success: true,
      data: {
        subjectList,
        examList,
        examReportList,
        selectedSubjectId: selectedSubj,
        selectedExamId: selectedExam,
        type,
        raw: rawData,
      },
    });
  } catch (error: any) {
    console.error("[ExamOverall API] Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch overall exam data" },
      { status: 500 }
    );
  }
}
