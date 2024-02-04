"use client";
import { spotifyProvider } from "@/providers/spotify";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export const useHome = () => {
  const [title, setTitle] = useState("");
  const textToType = "Your mess is now sorted.";
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    let currentIndex = 0;
    const typingSpeed = 35; // Adjust this value to control typing speed

    const typingInterval = setInterval(() => {
      if (currentIndex <= textToType.length) {
        setTitle(textToType.slice(0, currentIndex));
        currentIndex += 1;
      } else {
        clearInterval(typingInterval);
      }
    }, typingSpeed);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(typingInterval);
  }, [textToType]);

  useEffect(() => {
    const token = searchParams.get("token") || localStorage.getItem("token");
    const refreshToken =
      searchParams.get("refresh_token") || localStorage.getItem("refreshToken");
    const expiresInSeconds =
      searchParams.get("expires_in") || localStorage.getItem("expiresIn");

    if (token && refreshToken && expiresInSeconds) {
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem(
        "expiresIn",
        new Date(
          new Date().getTime() + parseInt(expiresInSeconds) * 1000
        ).toISOString()
      );
      router.push("/dashboard");
    }
  }, [searchParams, router]);

  const handleConnect = useCallback(() => {
    spotifyProvider.authorize();
  }, []);

  return {
    title,
    handleConnect,
  };
};
