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
      examId,
      subjectId,
      portalUrl,
      type = "EWAS", // "EWAS" (Exam-Wise All Subjects) or "SWAE" (Subject-Wise All Exams)
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
        console.warn("[Exam API] Could not auto-resolve asmay_id:", err);
      }
    }

    const getExamUrl = `${base}/api/ExamReportFacade/getexamdata/`;
    const getSubjectUrl = `${base}/api/CumulativeSubjectFacade/getSubjectsdata/`;
    const detailsUrl = `${base}/api/ExamReportFacade/StudentExamDetails/`;

    const commonPayload = {
      asmay_id: finalAsmayId,
      amst_id: studentId,
      MI_Id: instId,
    };

    // Parallel fetch exam list and subjects list
    const [examListRes, subjListRes] = await Promise.allSettled([
      fetch(getExamUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...commonPayload, Type: "EWAS" }),
        signal: AbortSignal.timeout(10000),
      }),
      fetch(getSubjectUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...commonPayload,
          asmcL_Id: Number(asmcL_Id || 0),
          asmS_Id: Number(asmS_Id || 0),
        }),
        signal: AbortSignal.timeout(10000),
      }),
    ]);

    let examData: any = {};
    let exams: any[] = [];
    if (examListRes.status === "fulfilled" && examListRes.value.ok) {
      examData = await examListRes.value.json();
      exams = extractArray(examData.examlist).map((e: any) => ({
        ...e,
        emE_Id: e.emE_Id || e.EME_Id,
        emE_ExamName: e.emE_ExamName || e.EME_ExamName || e.examName || "Exam",
      }));
    }

    let subjects: any[] = [];
    if (subjListRes.status === "fulfilled" && subjListRes.value.ok) {
      const sData = await subjListRes.value.json();
      subjects = extractArray(sData.subjectlist || sData.subjlist).map((s: any) => ({
        ...s,
        ismS_Id: s.ismS_Id || s.ISMS_Id,
        ismS_SubjectName: s.ismS_SubjectName || s.ISMS_SubjectName || s.subjectName || "Subject",
      }));
    }

    // Determine IDs for details call
    const selectedEmeId = examId || exams[0]?.emE_Id || 0;
    const selectedSubjId = subjectId || subjects[0]?.ismS_Id || 0;

    let examReportList: any[] = [];
    let detailsData: any = {};

    const detailsPayload = {
      ...commonPayload,
      EME_Id: type === "SWAE" ? 0 : selectedEmeId,
      ISMS_Id: type === "SWAE" ? selectedSubjId : 0,
      type: type,
    };

    try {
      const detailsRes = await fetch(detailsUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(detailsPayload),
        signal: AbortSignal.timeout(12000),
      });

      if (detailsRes.ok) {
        detailsData = await detailsRes.json();
        examReportList = extractArray(detailsData.examReportList);
      }
    } catch (err) {
      console.warn("[Exam API] Could not fetch exam details:", err);
    }

    return NextResponse.json({
      success: true,
      data: {
        exams,
        subjects,
        examReportList,
        selectedExamId: selectedEmeId,
        selectedSubjectId: selectedSubjId,
        type,
        raw: detailsData,
      },
    });
  } catch (error: any) {
    console.error("[Exam API] Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch exam data" },
      { status: 500 }
    );
  }
}
