import { NextRequest, NextResponse } from "next/server";
import { VAPS_API_ENDPOINTS } from "@/config/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
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

    const base = portalUrl
      ? portalUrl.trim().replace(/\/+$/, "")
      : VAPS_API_ENDPOINTS.PORTAL_URL.trim().replace(/\/+$/, "");

    // 1. Fetch subjects and exams metadata
    const subjectsUrl = `${base}/api/CumulativeSubjectFacade/getSubjectsdata/`;
    const examListUrl = `${base}/api/ExamReportFacade/getexamdata/`;
    const detailsUrl = `${base}/api/ExamReportFacade/StudentExamDetails/`;

    const commonPayload = {
      asmay_id: Number(asmay_id || 0),
      amst_id: Number(amst_id || 0),
      MI_Id: Number(MI_Id || 31),
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
      subjectList = sData.subjectlist || sData.subjlist || [];
    }

    let examList: any[] = [];
    if (examRes.status === "fulfilled" && examRes.value.ok) {
      const eData = await examRes.value.json();
      examList = eData.examlist || [];
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
      examReportList = rawData.examReportList || [];
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
