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

async function handleSalary(params: { asmay_id?: any; userid?: any; year?: string; MI_Id?: any; portalUrl?: string }) {
  try {
    const { asmay_id, userid, year = "", MI_Id, portalUrl } = params;

    const endpoint = portalUrl
      ? `${portalUrl.trim().replace(/\/+$/, "")}/api/EmployeeSalaryDetailsFacade/getdaily_data/`
      : VAPS_API_ENDPOINTS.EMPLOYEE_SALARY;

    const payload = {
      asmay_id: Number(asmay_id || 0),
      userid: Number(userid || 0),
      HRMLY_LeaveYear: String(year || "").trim(),
      MI_Id: Number(MI_Id || 31),
    };

    console.log("[Staff Salary API] Calling:", endpoint, payload);

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
      console.warn("[Staff Salary API] Remote call failed:", err.message || err);
    }

    if (success && rawData) {
      const salaryDetails = extractArray(rawData.salarylist || rawData.salaryList || rawData.salary_details || rawData.griddata);

      if (salaryDetails.length > 0) {
        const parsedSlips = salaryDetails.map((s: any) => {
          const month = s.monthName || s.HRES_Month || s.month || "—";
          const net = Number(s.salary || s.HRES_NetSalary || s.net || 0);
          const gross = Number(s.HRES_GrossSalary || s.gross || 0);
          const deductions = Number(s.HRES_TotalDeductions || s.deductions || 0);
          const pf = Number(s.HRES_PF || s.pf || 0);
          const basic = Number(s.HRES_BasicSalary || s.basic || 0);
          const da = Number(s.HRES_DA || s.da || 0);
          const hra = Number(s.HRES_HRA || s.hra || 0);
          const tax = Number(s.HRES_Tax || s.tax || 0);
          const status = s.status || s.transferStatus || (net > 0 ? "Credited" : "—");
          const paidDate = s.HRES_SalaryDate || s.paidDate || s.DOE || "";

          return {
            month,
            basic,
            da,
            hra,
            gross,
            pf,
            tax,
            deductions,
            net,
            status,
            paidDate: paidDate && !isNaN(Date.parse(paidDate)) ? new Date(paidDate).toLocaleDateString("en-GB") : (paidDate ? String(paidDate) : "—"),
          };
        });

        return NextResponse.json({
          success: true,
          data: parsedSlips,
          raw: rawData,
        });
      }
    }

    // Return empty list if no remote payroll records exist
    return NextResponse.json({
      success: true,
      data: [],
    });
  } catch (error: any) {
    console.error("[Staff Salary API] Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to load salary details" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  return handleSalary(body);
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const asmay_id = searchParams.get("asmay_id") || searchParams.get("asmayId") || "0";
  const userid = searchParams.get("userid") || searchParams.get("empId") || "0";
  const year = searchParams.get("year") || "";
  const MI_Id = searchParams.get("MI_Id") || searchParams.get("miId") || "31";
  const portalUrl = searchParams.get("portalUrl") || "";
  return handleSalary({ asmay_id, userid, year, MI_Id, portalUrl });
}
