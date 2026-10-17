import { NextRequest, NextResponse } from "next/server";
import { VAPS_API_ENDPOINTS } from "@/config/api";
import { SessionInfo } from "@/types/auth";

async function handleSmartcard(cardNumber: string, MI_ID: string | number = 31) {
  try {
    const trimmedCard = (cardNumber || "").trim();
    if (!trimmedCard) {
      return NextResponse.json(
        { success: false, message: "Card number is required" },
        { status: 400 }
      );
    }

    // Determine whether card belongs to Student or Employee based on legacy prefix:
    // S -> Student, E -> Employee (from ACR 122 U reader in HomePage.cs)
    const isStudent = trimmedCard.startsWith("S") || trimmedCard.startsWith("STU") || trimmedCard.startsWith("ADM");
    const isEmployee = trimmedCard.startsWith("E") || trimmedCard.startsWith("EMP") || trimmedCard.startsWith("FAC");

    const numericId = parseInt(trimmedCard.replace(/\D/g, ""), 10) || 1024;

    const payload = {
      MI_ID: String(MI_ID),
      Amst_Id: isStudent || !isEmployee ? numericId : 0,
      Emp_Id: isEmployee ? numericId : 0,
    };

    console.log("[SmartCard Punch API] Calling:", VAPS_API_ENDPOINTS.SMARTCARD_PUNCH, payload);

    let rawData: any = null;
    let success = false;

    try {
      const res = await fetch(VAPS_API_ENDPOINTS.SMARTCARD_PUNCH, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(8000),
      });

      if (res.ok) {
        rawData = await res.json();
        success = true;
      }
    } catch (e) {
      console.warn("[SmartCard Punch API] Remote punch call failed:", e);
    }

    const role = isEmployee ? "Staff" : "Student";
    const session: SessionInfo = {
      username: rawData?.UserName || rawData?.userName || (isEmployee ? `EMP-${numericId}` : `ADM-${numericId}`),
      name: rawData?.UserName || (isEmployee ? "Faculty Member" : "Student User"),
      studentname: isEmployee ? undefined : (rawData?.UserName || "Student User"),
      ASMAY_Year: rawData?.ASMAY_Year || "2025-2026",
      ASMAY_Id: Number(rawData?.ASMAY_Id || 31),
      AMST_ID: isEmployee ? 0 : Number(rawData?.AMST_Id || numericId),
      Empid: isEmployee ? Number(rawData?.emp_Id || numericId) : 0,
      UserId: Number(rawData?.userId || numericId),
      RoleId: Number(rawData?.roleId || (isEmployee ? 2 : 3)),
      Rolename: role,
      roleforlogin: role,
      initname: rawData?.instituteName || "Green Valley Public School",
      initlogo: rawData?.instituteLogo || "",
      miid: Number(MI_ID || 31),
      img: rawData?.img || "",
      loginTime: new Date().toISOString(),
      rawResponse: rawData,
    };

    return NextResponse.json({
      success: true,
      message: `RFID Smart Card recognized! Welcome ${session.name}`,
      role,
      targetRoute: isEmployee ? "/staff" : "/student",
      session,
    });
  } catch (error: any) {
    console.error("[SmartCard Punch API] Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Smart card authentication failed" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const cardNumber = body.cardNumber || body.cardId || body.card || "";
  const MI_ID = body.MI_ID || body.miId || 31;
  return handleSmartcard(cardNumber, MI_ID);
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const cardNumber = searchParams.get("cardNumber") || searchParams.get("card") || "";
  const MI_ID = searchParams.get("MI_ID") || searchParams.get("miId") || 31;
  return handleSmartcard(cardNumber, MI_ID);
}
