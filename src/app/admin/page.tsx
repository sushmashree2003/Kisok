"use client";

import { useRouter } from "next/navigation";
import AdminDashboard from "@/components/AdminDashboard";

export default function AdminPage() {
  const router = useRouter();
  return <AdminDashboard onBackToKiosk={() => router.push("/")} />;
}
