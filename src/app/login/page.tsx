"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoginScreen, { RoleType } from "@/components/LoginScreen";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRole = (searchParams.get("role") || "").toLowerCase();

  const normalizeRole = (r: string): RoleType => {
    if (r === "visitor" || r === "guest") return "visitor";
    if (r === "staff") return "staff";
    if (r === "alumni" || r === "ex-staff" || r === "former-staff") return "alumni";
    if (r === "student" || r === "parent") return "student";
    return "student";
  };

  const [role, setRole] = React.useState<RoleType>(() => normalizeRole(rawRole));

  React.useEffect(() => {
    if (rawRole) {
      setRole(normalizeRole(rawRole));
    }
  }, [rawRole]);

  const handleRoleChange = (newRole: RoleType) => {
    setRole(newRole);
    router.replace(`/login?role=${newRole}`);
  };

  const handleLoginSuccess = (session?: any) => {
    const roleForLogin = (session?.roleforlogin || "").toLowerCase();
    if (roleForLogin.includes("staff")) {
      router.push("/staff");
    } else if (roleForLogin.includes("student") || roleForLogin.includes("parent")) {
      router.push("/student");
    } else if (roleForLogin.includes("alumni") || roleForLogin.includes("ex-staff")) {
      router.push("/alumni");
    } else if (role === "visitor") {
      router.push("/visitor");
    } else {
      router.push(`/${role}`);
    }
  };

  return (
    <LoginScreen
      role={role}
      onLoginSuccess={handleLoginSuccess}
      onBackToKiosk={() => router.push("/")}
      onSwitchRole={handleRoleChange}
    />
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Outfit, sans-serif",
            color: "#0c3558",
            fontWeight: 700,
          }}
        >
          Loading Green Valley Portal Login...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
