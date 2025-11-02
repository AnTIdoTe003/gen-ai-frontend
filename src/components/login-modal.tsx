"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GoogleAuth } from "@/components/google-auth";
import { AuthService } from "@/lib/auth-service";
import { Lock, Shield } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onError?: (error: string | Error) => void;
}

export function LoginModal({ isOpen, onClose, onSuccess, onError }: LoginModalProps) {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLoginSuccess = async (credential: string) => {
    try {
      setIsLoggingIn(true);

      // Call the backend login API with the Google ID token
      const loginResponse = await AuthService.login(credential);

      console.log("Login successful:", loginResponse);

      // Call the parent success callback
      onSuccess?.();

      // Close modal after successful login
      setTimeout(() => {
        setIsLoggingIn(false);
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Login failed:", error);
      setIsLoggingIn(false);
      onError?.(error instanceof Error ? error.message : "Login failed");
    }
  };

  const handleLoginError = (error: string | Error) => {
    console.error("Login error:", error);
    setIsLoggingIn(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                <Lock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold">
                  Login Required
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                  Please sign in to continue with your payment
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Login Form */}
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Sign in to your account
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Choose your preferred sign-in method
              </p>
            </div>

            <div className="space-y-3">
              <GoogleAuth
                onSuccess={handleLoginSuccess}
                onError={handleLoginError}
              />
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-gray-700 rounded-lg p-4 text-white">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <h4 className="font-medium mb-1">
                  Secure & Private
                </h4>
                <p className="text-white/90">
                  Your payment information is encrypted and protected. We use
                  industry-standard security measures to keep your data safe.
                </p>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoggingIn && (
            <div className="text-center py-4">
              <div className="inline-flex items-center space-x-2 text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm font-medium">Signing you in...</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t pt-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
