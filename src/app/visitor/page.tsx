"use client";

import { useRouter } from "next/navigation";
import VisitorDashboard from "@/components/VisitorDashboard";

export default function VisitorPage() {
  const router = useRouter();
  return <VisitorDashboard onBackToKiosk={() => router.push("/")} />;
}
