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

async function handleLeave(params: { emp_id?: any; MI_Id?: any; fromDate?: string; toDate?: string; leaveUrl?: string }) {
  try {
    const { emp_id, MI_Id, fromDate, toDate, leaveUrl } = params;

    const endpoint = leaveUrl
      ? `${leaveUrl.trim().replace(/\/+$/, "")}/api/LeaveReportFacade/get_report/`
      : VAPS_API_ENDPOINTS.EMPLOYEE_LEAVE;

    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1).toISOString();
    const endOfYear = new Date(now.getFullYear(), 11, 31).toISOString();

    const payload = {
      MI_Id: Number(MI_Id || 31),
      selectedEmployee: Number(emp_id || 0),
      HRELTD_FromDate: fromDate || startOfYear,
      HRELT_ToDate: toDate || endOfYear,
      selectedLeave: 1,
    };

    console.log("[Staff Leave API] Calling:", endpoint, payload);

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
      console.warn("[Staff Leave API] Remote call failed:", err.message || err);
    }

    if (success && rawData) {
      const leave_details = extractArray(rawData.leave_details);
      const leave_summary = extractArray(rawData.leave_summary);

      // Extract specific balances if present in summary
      let casualLeaveTotal = 0;
      let casualLeaveBalance = 0;
      let medicalLeaveTotal = 0;
      let medicalLeaveBalance = 0;
      let earnedLeaveTotal = 0;
      let earnedLeaveBalance = 0;
      let onDutyTotal = 0;
      let onDutyBalance = 0;

      leave_summary.forEach((ls: any) => {
        const name = (ls.HRL_LeaveName || ls.hrL_LeaveName || "").toLowerCase();
        const total = Number(ls.HRELS_TotalLeaves || ls.hrelS_TotalLeaves || 0);
        const bal = Number(ls.HRELS_CBLeaves || ls.hrelS_CBLeaves || 0);

        if (name.includes("casual")) {
          casualLeaveTotal = total;
          casualLeaveBalance = bal;
        } else if (name.includes("medical") || name.includes("sick")) {
          medicalLeaveTotal = total;
          medicalLeaveBalance = bal;
        } else if (name.includes("earned") || name.includes("privilege")) {
          earnedLeaveTotal = total;
          earnedLeaveBalance = bal;
        } else if (name.includes("duty") || name.includes("od")) {
          onDutyTotal = total;
          onDutyBalance = bal;
        }
      });

      const parsedLeaveDetails = leave_details.map((ld: any) => ({
        leaveName: ld.HRL_LeaveName || ld.hrL_LeaveName || "Leave",
        fromDate: ld.HRELTD_FromDate ? new Date(ld.HRELTD_FromDate).toLocaleDateString("en-GB") : "-",
        toDate: ld.HRELTD_ToDate ? new Date(ld.HRELTD_ToDate).toLocaleDateString("en-GB") : "-",
        totalDays: Number(ld.HRELTD_TotDays || ld.hrelD_TotalDays || 0),
        runningBal: Number(ld.HRELTD_RunningBalance || ld.balance || 0),
        status: ld.HRELT_Status || ld.status || "—",
      }));

      return NextResponse.json({
        success: true,
        data: {
          summary: {
            casualLeaveTotal,
            casualLeaveBalance,
            medicalLeaveTotal,
            medicalLeaveBalance,
            earnedLeaveTotal,
            earnedLeaveBalance,
            onDutyTotal,
            onDutyBalance,
          },
          leaveDetails: parsedLeaveDetails,
          raw: rawData,
        },
      });
    }

    // Default zero/empty state when no API records are published
    return NextResponse.json({
      success: true,
      data: {
        summary: {
          casualLeaveTotal: 0,
          casualLeaveBalance: 0,
          medicalLeaveTotal: 0,
          medicalLeaveBalance: 0,
          earnedLeaveTotal: 0,
          earnedLeaveBalance: 0,
          onDutyTotal: 0,
          onDutyBalance: 0,
        },
        leaveDetails: [],
      },
    });
  } catch (error: any) {
    console.error("[Staff Leave API] Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to load leave records" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  return handleLeave(body);
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const emp_id = searchParams.get("emp_id") || searchParams.get("empId") || "0";
  const MI_Id = searchParams.get("MI_Id") || searchParams.get("miId") || "31";
  const fromDate = searchParams.get("fromDate") || "";
  const toDate = searchParams.get("toDate") || "";
  const leaveUrl = searchParams.get("leaveUrl") || "";
  return handleLeave({ emp_id, MI_Id, fromDate, toDate, leaveUrl });
}
