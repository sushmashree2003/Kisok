import { NextRequest, NextResponse } from "next/server";
import { VAPS_API_ENDPOINTS } from "@/config/api";

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

    const base = portalUrl
      ? portalUrl.trim().replace(/\/+$/, "")
      : VAPS_API_ENDPOINTS.PORTAL_URL.trim().replace(/\/+$/, "");

    const getExamUrl = `${base}/api/ExamReportFacade/getexamdata/`;
    const getSubjectUrl = `${base}/api/CumulativeSubjectFacade/getSubjectsdata/`;
    const detailsUrl = `${base}/api/ExamReportFacade/StudentExamDetails/`;

    const commonPayload = {
      asmay_id: Number(asmay_id || 0),
      amst_id: Number(amst_id || 0),
      MI_Id: Number(MI_Id || 31),
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
      exams = examData.examlist || [];
    }

    let subjects: any[] = [];
    if (subjListRes.status === "fulfilled" && subjListRes.value.ok) {
      const sData = await subjListRes.value.json();
      subjects = sData.subjectlist || sData.subjlist || [];
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
        examReportList = detailsData.examReportList || [];
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
