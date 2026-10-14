import { NextRequest, NextResponse } from "next/server";
import { VAPS_API_ENDPOINTS } from "@/config/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { asmay_id, amst_id, MI_Id, examId, portalUrl } = body;

    // 1. Get Exams list from env
    const getExamUrl = portalUrl
      ? `${portalUrl.trim().replace(/\/+$/, "")}/api/ExamReportFacade/getexamdata/`
      : VAPS_API_ENDPOINTS.EXAM_LIST;

    const examPayload = {
      asmay_id: Number(asmay_id || 195),
      amst_id: Number(amst_id || 1204),
      MI_Id: Number(MI_Id || 31),
      Type: "EWAS",
    };

    console.log("[Exam API] Fetching exam list from:", getExamUrl, examPayload);

    const examListRes = await fetch(getExamUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(examPayload),
      signal: AbortSignal.timeout(12000),
    });

    let examData: any = {};
    if (examListRes.ok) {
      examData = await examListRes.json();
    }

    // 2. If specific exam marks requested or default exam available
    let examReportList: any[] = [];
    const selectedEmeId = examId || examData?.emE_Id || examData?.examlist?.[0]?.emE_Id;

    if (selectedEmeId) {
      const detailsUrl = portalUrl
        ? `${portalUrl.trim().replace(/\/+$/, "")}/api/ExamReportFacade/StudentExamDetails/`
        : VAPS_API_ENDPOINTS.EXAM_DETAILS;
      const detailsPayload = {
        MI_Id: Number(MI_Id || 31),
        asmay_id: Number(asmay_id || 195),
        amst_id: Number(amst_id || 1204),
        EME_Id: selectedEmeId,
        type: "EWAS",
      };

      try {
        const detailsRes = await fetch(detailsUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(detailsPayload),
          signal: AbortSignal.timeout(12000),
        });

        if (detailsRes.ok) {
          const detailsData = await detailsRes.json();
          examReportList = detailsData.examReportList || [];
        }
      } catch (err) {
        console.warn("[Exam API] Could not fetch specific exam marks:", err);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        exams: examData.examlist || [],
        examReportList: examReportList.length > 0 ? examReportList : (examData.examReportList || []),
        selectedExamId: selectedEmeId,
        raw: examData,
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
