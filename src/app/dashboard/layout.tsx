"use client";

import { spotifyProvider } from "@/providers/spotify";
import "animate.css";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/");
    }

    spotifyProvider.refreshToken();
  }, []);

  return <>{children}</>;
}
