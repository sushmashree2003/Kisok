"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoginScreen, { RoleType } from "@/components/LoginScreen";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role") as RoleType;
  const validRoles: RoleType[] = ["student", "staff", "admin", "alumni", "guest"];
  const initialRole: RoleType = validRoles.includes(roleParam) ? roleParam : "alumni";

  const [role, setRole] = React.useState<RoleType>(initialRole);

  React.useEffect(() => {
    if (roleParam && validRoles.includes(roleParam)) {
      setRole(roleParam);
    }
  }, [roleParam]);

  const handleRoleChange = (newRole: RoleType) => {
    setRole(newRole);
    router.replace(`/login?role=${newRole}`);
  };

  const handleLoginSuccess = (session?: any) => {
    const roleForLogin = (session?.roleforlogin || "").toLowerCase();
    if (roleForLogin.includes("staff")) {
      router.push("/staff");
    } else if (roleForLogin.includes("student")) {
      router.push("/student");
    } else if (roleForLogin.includes("admin")) {
      router.push("/admin");
    } else if (roleForLogin.includes("alumni")) {
      router.push("/alumni");
    } else if (role === "guest") {
      router.push("/student");
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
