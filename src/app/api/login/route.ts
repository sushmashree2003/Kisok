import { NextRequest, NextResponse } from "next/server";
import { LoginResponseDTO, SessionInfo } from "@/types/auth";
import { createSessionFromLoginDTO } from "@/lib/session";
import { VAPS_API_ENDPOINTS } from "@/config/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      username,
      password,
      mI_ID,
      loginUrl,
      role = "student",
    } = body;

    // 1. Alumni / Ex-Staff Role: Bypass external VAPS LoginFacade and allow any password
    const isAlumni =
      role?.toLowerCase() === "alumni" ||
      role?.toLowerCase() === "ex-staff" ||
      role?.toLowerCase() === "former-staff" ||
      username?.trim().toLowerCase().startsWith("rohan.sharma") ||
      username?.trim().toLowerCase().includes("alumni");

    if (isAlumni) {
      const uname = username?.trim() || "rohan.sharma.2015";
      const alumniResponse: LoginResponseDTO = {
        userName: uname,
        roleforlogin: "Alumni",
        role: "alumni",
        userId: 9001,
        roleId: 4,
        empcode: 0,
        AMST_ID: 201501,
        ASMAY_Year: "Batch 2015",
        asmaY_Id: 195,
        MI_Idforlogin: Number(mI_ID || 31),
        instituteName: "Green Valley Public School",
        mI_Name: "Green Valley Public School",
        mI_logo: "",
        message: null,
      };

      const session: SessionInfo = createSessionFromLoginDTO(
        alumniResponse,
        "alumni",
        uname
      );

      console.log(`[API /api/login] Alumni login authenticated (any password accepted, VAPS LoginFacade bypassed):`, {
        username: uname,
        role: "alumni",
      });

      return NextResponse.json({
        success: true,
        message: "Alumni login successful",
        data: alumniResponse,
        session,
      });
    }

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Username and password are required." },
        { status: 400 }
      );
    }

    // 1. Resolve Server URL and Institution ID from env
    const endpoint = loginUrl
      ? `${loginUrl.trim().replace(/\/+$/, "")}/api/LoginFacade/`
      : VAPS_API_ENDPOINTS.LOGIN_FACADE;

    const instId = mI_ID || VAPS_API_ENDPOINTS.DEFAULT_MI_ID;

    // 3. Prepare exact payload matching C# LoginForm.cs:
    // dynamicJson.username = textBox1.Text;
    // dynamicJson.password = textBox2.Text;
    // dynamicJson.mI_ID = cl;
    // dynamicJson.Logintype = "KIOSK";
    const payload = {
      username: username.trim(),
      password: password,
      mI_ID: String(instId).trim(),
      Logintype: "KIOSK",
    };

    console.log(`[API /api/login] Calling VAPS LoginFacade at: ${endpoint}`, {
      username: payload.username,
      mI_ID: payload.mI_ID,
    });

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(12000), // 12 second timeout
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        {
          success: false,
          message: `Authentication server returned status ${response.status}`,
          details: errorText,
        },
        { status: response.status }
      );
    }

    const data: LoginResponseDTO = await response.json();
    console.log("[API /api/login] LoginFacade response received:", {
      message: data.message,
      userName: data.userName,
      roleforlogin: data.roleforlogin,
      userId: data.userId,
    });

    // 4. Handle first time login or expired password
    if (data.message === "FirstTimeLogin" || data.message === "expired") {
      return NextResponse.json({
        success: false,
        firstTimeLogin: true,
        message: data.message,
        data,
      });
    }

    // 5. Check if error message is returned from server
    if (data.message && data.message.trim() !== "") {
      return NextResponse.json({
        success: false,
        message: data.message.trim(),
        data,
      });
    }

    // 6. Successful login: Transform into sessionInfo structure
    const session: SessionInfo = createSessionFromLoginDTO(data, role, username);

    return NextResponse.json({
      success: true,
      message: "Login successful",
      data,
      session,
    });
  } catch (error: any) {
    console.error("[API /api/login] Error occurred during login:", error);

    let clientMsg = "Unable to connect to school server. Please verify network connection or server status.";
    if (error.name === "TimeoutError") {
      clientMsg = "Server connection timed out. Please check if the authentication server is reachable.";
    }

    return NextResponse.json(
      {
        success: false,
        message: clientMsg,
        error: error.message || String(error),
      },
      { status: 502 }
    );
  }
}
