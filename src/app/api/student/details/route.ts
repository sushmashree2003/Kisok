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
      empid = 0,
      MI_Id,
      roleid = 3,
      portalUrl,
    } = body;

    const endpoint = portalUrl
      ? `${portalUrl.trim().replace(/\/+$/, "")}/api/StudentDashboardFacade/Getdetails/`
      : VAPS_API_ENDPOINTS.STUDENT_DETAILS;

    const payload = {
      asmay_id: Number(asmay_id || 0),
      empid: Number(empid || 0),
      amst_id: Number(amst_id || 0),
      MI_Id: Number(MI_Id || 31),
      roleid: Number(roleid || 3),
    };

    console.log("[Details API] Calling:", endpoint, payload);

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

    const studentDetails = extractArray(data.studetailslist).map((stu: any) => {
      const firstName = (stu.amsT_FirstName || stu.AMST_FirstName || "").trim();
      const middleName = (stu.amsT_MiddleName || stu.AMST_MiddleName || "").trim();
      const lastName = (stu.amsT_LastName || stu.AMST_LastName || "").trim();
      const fullName = [firstName, middleName, lastName].filter(Boolean).join(" ") || firstName;
      const admNo = stu.amsT_AdmNo || stu.AMST_AdmNo || "";
      const regNo = stu.amsT_RegistrationNo || stu.AMST_RegistrationNo || "";
      const rollNo = stu.amaY_RollNo || stu.AMAY_RollNo || stu.AMST_RollNo || "";
      const className = stu.asmcL_ClassName || stu.ASMCL_ClassName || "";
      const sectionName = stu.asmC_SectionName || stu.ASMC_SectionName || "";
      const year = stu.asmaY_Year || stu.ASMAY_Year || "";
      const asmayId = stu.asmaY_Id || stu.ASMAY_Id || 0;
      const dob = stu.amsT_DOB || stu.AMST_DOB || null;
      const gender = stu.amsT_Sex || stu.AMST_Sex || "";
      const blood = stu.amsT_BloodGroup || stu.AMST_BloodGroup || "";
      const email = stu.amsT_emailId || stu.AMST_emailId || "";
      const mobile = stu.amsT_MobileNo || stu.AMST_MobileNo || "";
      const father = stu.amsT_FatherName || stu.AMST_FatherName || "";
      const mother = stu.amsT_MotherName || stu.AMST_MotherName || "";
      const street = stu.amsT_PerStreet || stu.AMST_PerStreet || "";
      const area = stu.amsT_PerArea || stu.AMST_PerArea || "";
      const city = stu.amsT_PerCity || stu.AMST_PerCity || "";
      const pin = stu.amsT_PerPincode || stu.AMST_PerPincode || "";
      const photo = stu.amsT_Photoname || stu.AMST_Photoname || "";

      return {
        ...stu,
        AMST_FirstName: fullName,
        amsT_FirstName: fullName,
        name: fullName,
        AMST_AdmNo: admNo,
        amsT_AdmNo: admNo,
        admNo,
        AMST_RegistrationNo: regNo,
        amsT_RegistrationNo: regNo,
        regNo,
        amaY_RollNo: rollNo,
        AMAY_RollNo: rollNo,
        AMST_RollNo: rollNo,
        rollNo,
        asmcL_ClassName: className,
        ASMCL_ClassName: className,
        className,
        asmC_SectionName: sectionName,
        ASMC_SectionName: sectionName,
        sectionName,
        asmaY_Year: year,
        ASMAY_Year: year,
        academicYear: year,
        asmaY_Id: asmayId,
        ASMAY_Id: asmayId,
        AMST_DOB: dob,
        amsT_DOB: dob,
        AMST_Sex: gender,
        amsT_Sex: gender,
        AMST_BloodGroup: blood,
        amsT_BloodGroup: blood,
        AMST_emailId: email,
        amsT_emailId: email,
        AMST_MobileNo: mobile,
        amsT_MobileNo: mobile,
        AMST_FatherName: father,
        amsT_FatherName: father,
        AMST_MotherName: mother,
        amsT_MotherName: mother,
        AMST_PerStreet: street,
        AMST_PerArea: area,
        AMST_PerCity: city,
        AMST_PerPincode: pin,
        AMST_Photoname: photo,
        amsT_Photoname: photo,
        photo,
      };
    });

    const attendanceData = extractArray(data.academicyearAttendancedata).map((a: any) => ({
      ...a,
      MONTH_NAME: a.MONTH_NAME || a.month_name || a.monthName || "Month",
      CLASS_HELD: Number(a.CLASS_HELD || a.class_held || a.classHeld || 0),
      TOTAL_PRESENT: Number(a.TOTAL_PRESENT || a.total_present || a.totalPresent || 0),
    }));

    const feeData = extractArray(data.academicyearFeedata).map((f: any) => ({
      ...f,
      frommonth: f.frommonth || f.fromMonth || "",
      tomonth: f.tomonth || f.toMonth || "",
      paid: Number(f.paid || f.PAID || 0),
      balance: Number(f.balance || f.BALANCE || 0),
      Total: Number(f.Total || f.total || f.TOTAL || 0),
    }));

    const homeworkList = extractArray(data.homeworklist);

    return NextResponse.json({
      success: true,
      data: {
        studentDetails,
        attendanceData,
        feeData,
        homeworkList,
        yearlist: extractArray(data.yearlist),
        raw: data,
      },
    });
  } catch (error: any) {
    console.error("[Details API] Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch student details" },
      { status: 500 }
    );
  }
}
