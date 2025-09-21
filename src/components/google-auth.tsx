"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  type AuthError,
} from "firebase/auth";
import { getFirebaseAuth, getGoogleProvider, debugFirebaseConfig } from "@/lib/firebase";

interface GoogleAuthProps {
  onSuccess?: (credential: string) => void;
  onError?: (error: string | Error) => void;
}

export function GoogleAuth({ onSuccess, onError }: GoogleAuthProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debug Firebase configuration on component mount
  useEffect(() => {
    debugFirebaseConfig();
  }, []);

  // Check for redirect result on component mount
  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        const auth = getFirebaseAuth();
        const result = await getRedirectResult(auth);

        if (result) {
          console.log("Redirect sign-in successful:", result);
          const idToken = await result.user.getIdToken(true);
          onSuccess?.(idToken);
        }
      } catch (error) {
        console.error("Redirect result error:", error);
        const errorMessage = getFirebaseErrorMessage(error as AuthError);
        setError(errorMessage);
        onError?.(errorMessage);
      }
    };

    checkRedirectResult();
  }, [onSuccess, onError]);

  const getFirebaseErrorMessage = (error: AuthError): string => {
    console.log("Firebase error details:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });

    switch (error.code) {
      case 'auth/popup-closed-by-user':
        return 'Sign-in popup was closed. Please try again.';
      case 'auth/popup-blocked':
        return 'Popup was blocked by your browser. Please allow popups and try again.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/invalid-credential':
        return 'Invalid credentials. Please try again.';
      case 'auth/operation-not-allowed':
        return 'Google sign-in is not enabled. Please contact support.';
      case 'auth/unauthorized-domain':
        return 'This domain is not authorized for Google sign-in.';
      case 'auth/configuration-not-found':
        return 'Firebase configuration not found. Please check your setup.';
      case 'auth/invalid-api-key':
        return 'Invalid Firebase API key. Please check your configuration.';
      case 'auth/project-not-found':
        return 'Firebase project not found. Please check your project ID.';
      default:
        return error.message || 'An unexpected error occurred during sign-in.';
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log("=== Starting Google Authentication ===");
      console.log("Current URL:", window.location.href);
      console.log("User Agent:", navigator.userAgent);

      // Validate Firebase configuration
      const auth = getFirebaseAuth();
      const provider = getGoogleProvider();

      console.log("Firebase Auth instance:", auth);
      console.log("Google Provider instance:", provider);
      console.log("Current domain:", window.location.hostname);

      try {
        console.log("Attempting popup sign-in...");
        const result = await signInWithPopup(auth, provider);

        console.log("Popup sign-in successful:", {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
        });

        const idToken = await result.user.getIdToken(true);
        console.log("ID Token obtained successfully");

        onSuccess?.(idToken);
      } catch (popupError) {
        console.error("Popup sign-in failed:", popupError);

        const authError = popupError as AuthError;
        console.log("Auth error details:", {
          code: authError.code,
          message: authError.message,
          customData: authError.customData,
        });

        // Only fallback to redirect for specific popup-related errors
        if (authError.code === 'auth/popup-closed-by-user' ||
          authError.code === 'auth/popup-blocked') {

          console.log("Attempting redirect fallback...");
          await signInWithRedirect(auth, provider);
          // Note: Redirect will cause page reload, so execution stops here
          return;
        } else {
          // For other errors, show the specific error message
          const errorMessage = getFirebaseErrorMessage(authError);
          setError(errorMessage);
          onError?.(errorMessage);
          throw popupError;
        }
      }
    } catch (error) {
      console.error("Google authentication error:", error);

      const authError = error as AuthError;
      const errorMessage = getFirebaseErrorMessage(authError);

      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        onClick={handleGoogleLogin}
        disabled={isLoading}
        variant="outline"
        className="flex items-center gap-2 bg-white text-gray-700 border-gray-300 w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          <>
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26
                1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92
                3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23
                1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99
                20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43
                8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45
                2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18
                7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </>
        )}
      </Button>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
}
