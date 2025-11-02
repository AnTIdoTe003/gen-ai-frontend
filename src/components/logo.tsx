"use client";

import React from "react";
import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
}

const sizeMap = {
  sm: { container: "w-8 h-8" },
  md: { container: "w-12 h-12" },
  lg: { container: "w-16 h-16" },
  xl: { container: "w-24 h-24" },
};

const EMT_LOGO_URL = "https://images.emtcontent.com/brandlogo/emtlogo_new8.svg";

export function Logo({ className = "", size = "md", animated = true }: LogoProps) {
  const { container } = sizeMap[size];

  return (
    <div className={`${container} ${className} relative flex items-center justify-center`}>
      <Image
        src={EMT_LOGO_URL}
        alt="Roxy AI - EaseMyTrip Logo"
        width={size === "sm" ? 32 : size === "md" ? 48 : size === "lg" ? 64 : 96}
        height={size === "sm" ? 32 : size === "md" ? 48 : size === "lg" ? 64 : 96}
        className={`object-contain ${animated ? "animate-pulse" : ""}`}
        unoptimized
        priority
      />
    </div>
  );
}

