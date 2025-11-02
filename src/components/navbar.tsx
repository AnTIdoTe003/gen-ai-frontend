"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GoogleAuth } from "@/components/google-auth";
import { Menu, MessageSquareDiff, X } from "lucide-react";
import { Logo } from "./logo";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AuthService, type UserData } from "@/lib/auth-service";
import { LanguageSelector } from "@/components/language-selector";

interface NavbarProps {
  onSidebarToggle?: () => void;
  showSidebarToggle?: boolean;
  onLanguageChange?: (languageCode: string) => void;
  onLanguageSelect?: (languageCode: string, languageLabel: string) => void;
}

export function Navbar({ onSidebarToggle, showSidebarToggle = false, onLanguageChange, onLanguageSelect }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [customUser, setCustomUser] = useState<UserData | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });

    // Load custom user data from localStorage on component mount
    const savedUserData = AuthService.getUserData();
    if (savedUserData) {
      setCustomUser(savedUserData);
    }

    return () => unsub();
  }, []);

  const userInitials = useMemo(() => {
    // Prioritize custom user data over Firebase user
    const name =
      customUser?.name || currentUser?.displayName || currentUser?.email || "";
    if (!name) return "U";
    const parts = name.split(" ");
    const first = parts[0]?.[0] || name[0];
    const second = parts[1]?.[0] || "";
    return (first + second).toUpperCase();
  }, [customUser, currentUser]);

  const handleSignOut = async () => {
    try {
      await signOut(getFirebaseAuth());
      // Clear custom auth data
      AuthService.clearAuthData();
      setCustomUser(null);
    } catch (e) {
      console.error("Failed to sign out", e);
    }
  };

  const handleSignIn = async (credential: string) => {
    try {
      const response = await AuthService.login(credential);
      if (response.data.user) {
        setCustomUser(response.data.user);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  return (
    <nav className="sticky top-0 w-full bg-white/95 backdrop-blur-sm border-b border-border z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Sidebar Toggle (for chat pages) */}
          {showSidebarToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onSidebarToggle}
              className="mr-2 h-8 w-8 p-0 md:hidden"
              title="Open sidebar"
            >
              <MessageSquareDiff className="h-5 w-5" />
            </Button>
          )}

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="flex items-center space-x-3">
              <div className="group-hover:scale-110 transition-transform duration-300">
                <Logo size="md" animated={false} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl text-easemytrip-primary font-space-grotesk group-hover:text-easemytrip-secondary transition-colors duration-300">
                  Roxy AI - EaseMyTrip
                </span>
                <span className="text-xs text-muted-foreground font-dm-sans group-hover:text-gray-600 transition-colors duration-300">
                  Your AI Travel Companion
                </span>
              </div>
            </div>
          </Link>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Language Selector */}
            <LanguageSelector
              onLanguageChange={onLanguageChange}
              onLanguageSelect={onLanguageSelect}
              variant="navbar"
            />

            {authLoading ? (
              <Button disabled variant="outline">
                Loading…
              </Button>
            ) : currentUser || customUser ? (
              <>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={
                        customUser?.profile ||
                        currentUser?.photoURL ||
                        undefined
                      }
                      alt={
                        customUser?.name ||
                        currentUser?.displayName ||
                        currentUser?.email ||
                        "User"
                      }
                    />
                    <AvatarFallback>{userInitials}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground max-w-[160px] truncate">
                    {customUser?.name ||
                      currentUser?.displayName ||
                      currentUser?.email}
                  </span>
                </div>
                <Button variant="outline" onClick={handleSignOut}>
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <GoogleAuth
                  onSuccess={(credential) => {
                    handleSignIn(credential);
                  }}
                />
                <Button className="bg-gradient-to-r from-easemytrip-primary to-easemytrip-secondary hover:from-easemytrip-primary/90 hover:to-easemytrip-secondary/90 text-white font-semibold px-6 py-2 rounded-lg shadow-sm">
                  Start Planning
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-border">
              <Link
                href="/"
                className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Chat
              </Link>
              <Link
                href="/logs"
                className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Logs
              </Link>
              <Link
                href="#features"
                className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="#testimonials"
                className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Testimonials
              </Link>
              <Link
                href="#pricing"
                className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>

              {/* Language Selector in Mobile Menu */}
              <div className="px-3 py-2 border-t border-border mt-2 pt-2">
                <div className="text-xs font-medium text-muted-foreground mb-2">
                  Voice Input Language
                </div>
                <LanguageSelector
                  onLanguageChange={onLanguageChange}
                  onLanguageSelect={onLanguageSelect}
                  variant="inline"
                />
              </div>

              <div className="px-3 py-2 space-y-2 border-t border-border">
                {authLoading ? (
                  <Button className="w-full" disabled variant="outline">
                    Loading…
                  </Button>
                ) : currentUser || customUser ? (
                  <>
                    <div className="flex items-center gap-3 px-1">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={
                            customUser?.profile ||
                            currentUser?.photoURL ||
                            undefined
                          }
                          alt={
                            customUser?.name ||
                            currentUser?.displayName ||
                            currentUser?.email ||
                            "User"
                          }
                        />
                        <AvatarFallback>{userInitials}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground max-w-[200px] truncate">
                        {customUser?.name ||
                          currentUser?.displayName ||
                          currentUser?.email}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleSignOut}
                    >
                      Sign out
                    </Button>
                  </>
                ) : (
                  <>
                    <GoogleAuth
                      onSuccess={(credential) => {
                        handleSignIn(credential);
                      }}
                    />
                    <Button className="w-full bg-gradient-to-r from-easemytrip-primary to-easemytrip-secondary hover:from-easemytrip-primary/90 hover:to-easemytrip-secondary/90 text-white font-semibold px-6 py-2 rounded-lg shadow-sm">
                      Start Planning
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
