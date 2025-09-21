"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GoogleAuth } from "@/components/google-auth";
import { Menu, X, MapPin } from "lucide-react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AuthService, type UserData } from "@/lib/auth-service";

export function Navbar() {
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
    <nav className="sticky top-0 w-full bg-white/95 backdrop-blur-sm border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <MapPin className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl text-foreground font-space-grotesk">
              Roxy
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* <Link
              href="/chat"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Chat
            </Link> */}
            {/* <Link
              href="/logs"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Logs
            </Link> */}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
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
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
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
              <div className="px-3 py-2 space-y-2">
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
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
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
