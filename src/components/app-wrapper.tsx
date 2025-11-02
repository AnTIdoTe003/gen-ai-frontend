"use client";

import { useState, useEffect, type ReactNode } from "react";
import { SplashScreen } from "./splash-screen";

interface AppWrapperProps {
  children: ReactNode;
}

export function AppWrapper({ children }: AppWrapperProps) {
  const [showSplash, setShowSplash] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    // Check if this is the first load
    const hasVisited = sessionStorage.getItem("hasVisited");

    if (hasVisited) {
      // If user has visited before, skip splash screen
      setShowSplash(false);
      setIsFirstLoad(false);
    } else {
      // Mark as visited
      sessionStorage.setItem("hasVisited", "true");
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    setIsFirstLoad(false);
  };

  if (showSplash && isFirstLoad) {
    return <SplashScreen onComplete={handleSplashComplete} minDisplayTime={2500} />;
  }

  return <>{children}</>;
}

