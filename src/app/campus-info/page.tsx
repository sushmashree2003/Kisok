"use client";

import { useRouter } from "next/navigation";
import CampusInfoPortal from "@/components/CampusInfoPortal";

export default function CampusInfoPage() {
  const router = useRouter();
  return <CampusInfoPortal onEnterRoleSelection={() => router.push("/roles")} />;
}
