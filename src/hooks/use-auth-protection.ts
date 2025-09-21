"use client";

import { useEffect, useState } from "react";
import { AuthService } from "@/lib/auth-service";
import { ChatHistoryService } from "@/lib/chat-history-service";
import { useToast } from "@/hooks/use-toast";

export function useAuthProtection() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = () => {
      const hasToken = AuthService.isAuthenticated();
      setIsAuthenticated(hasToken);
      setIsLoading(false);

      if (!hasToken) {
        setShowLoginModal(true);
        toast({
          title: "Authentication Required",
          description: "Please log in to access the chat feature.",
          variant: "destructive",
        });
      }
    };

    checkAuth();
  }, [toast]);

  const handleLoginSuccess = () => {
    // Recheck authentication after successful login
    const hasToken = AuthService.isAuthenticated();
    const userData = AuthService.getUserData();

    setIsAuthenticated(hasToken);
    setShowLoginModal(false);

    if (hasToken && userData) {
      toast({
        title: `Welcome back, ${userData.name}!`,
        description: "You have been successfully logged in.",
        variant: "default",
      });
    }
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    AuthService.logout();
    ChatHistoryService.clearCacheOnLogout();
    setIsAuthenticated(false);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
      variant: "default",
    });
  };

  return {
    isAuthenticated,
    isLoading,
    showLoginModal,
    handleLoginSuccess,
    handleCloseModal,
    handleLogout,
  };
}
