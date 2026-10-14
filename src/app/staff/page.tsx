"use client";

import { useRouter } from "next/navigation";
import StaffDashboard from "@/components/StaffDashboard";

export default function StaffPage() {
  const router = useRouter();
  return <StaffDashboard onBackToKiosk={() => router.push("/")} />;
}
