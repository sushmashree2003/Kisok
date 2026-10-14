"use client";

import { useRouter } from "next/navigation";
import StudentDashboard from "@/components/StudentDashboard";

export default function ParentPage() {
  const router = useRouter();
  return <StudentDashboard onBackToKiosk={() => router.push("/dashboard")} />;
}
