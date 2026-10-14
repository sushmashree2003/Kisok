"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import RoleSelectionScreen from "@/components/RoleSelectionScreen";
import { RoleType } from "@/components/LoginScreen";

export default function RoleSelectionPage() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    document.title = "Role Selection Portal | Green Valley Public School";
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);

    return () => {
      clearInterval(timer);
      document.removeEventListener("fullscreenchange", handleFsChange);
    };
  }, []);

  const toggleFullscreen = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable fullscreen:", err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleSelectRole = (role: RoleType) => {
    router.push(`/login?role=${role}`);
  };

  return (
    <RoleSelectionScreen
      onSelectRole={handleSelectRole}
      onBackToPortal={() => router.push("/dashboard")}
      isFullscreen={isFullscreen}
      toggleFullscreen={toggleFullscreen}
      currentTime={currentTime}
    />
  );
}
