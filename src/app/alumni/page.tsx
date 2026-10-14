"use client";

import { useRouter } from "next/navigation";
import AlumniDashboard from "@/components/AlumniDashboard";

export default function AlumniPage() {
  const router = useRouter();
  return <AlumniDashboard onBackToKiosk={() => router.push("/")} />;
}
