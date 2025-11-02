import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";

let firebaseApp: FirebaseApp | undefined;
let firebaseAuth: Auth | undefined;
let googleProvider: GoogleAuthProvider | undefined;

export function getFirebaseApp(): FirebaseApp {
  if (!firebaseApp) {
    const config = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY as string,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN as string,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID as string,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID as string,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET as string,
      messagingSenderId: process.env
        .NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID as string,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID as string,
    } as const;

    // Enhanced error checking
    const missingConfigs = [];
    if (!config.apiKey) missingConfigs.push("NEXT_PUBLIC_FIREBASE_API_KEY");
    if (!config.authDomain)
      missingConfigs.push("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN");
    if (!config.projectId)
      missingConfigs.push("NEXT_PUBLIC_FIREBASE_PROJECT_ID");
    if (!config.appId) missingConfigs.push("NEXT_PUBLIC_FIREBASE_APP_ID");

    if (missingConfigs.length > 0) {
      console.error("Missing Firebase environment variables:", missingConfigs);
      throw new Error(
        `Missing Firebase environment configuration: ${missingConfigs.join(
          ", "
        )}`
      );
    }

    console.log("Firebase config:", {
      apiKey: config.apiKey ? "Set" : "Missing",
      authDomain: config.authDomain,
      projectId: config.projectId,
      appId: config.appId ? "Set" : "Missing",
    });

    try {
      firebaseApp = getApps().length ? getApp() : initializeApp(config);
      console.log("Firebase app initialized successfully");
    } catch (error) {
      console.error("Firebase initialization error:", error);
      throw new Error(
        `Firebase initialization failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
  return firebaseApp!;
}

export function getFirebaseAuth(): Auth {
  if (!firebaseAuth) {
    try {
      firebaseAuth = getAuth(getFirebaseApp());
      console.log("Firebase Auth initialized successfully");
    } catch (error) {
      console.error("Firebase Auth initialization error:", error);
      throw new Error(
        `Firebase Auth initialization failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
  return firebaseAuth;
}

export function getGoogleProvider(): GoogleAuthProvider {
  if (!googleProvider) {
    try {
      googleProvider = new GoogleAuthProvider();
      googleProvider.setCustomParameters({
        prompt: "select_account",
      });
      console.log("Google Provider initialized successfully");
    } catch (error) {
      console.error("Google Provider initialization error:", error);
      throw new Error(
        `Google Provider initialization failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
  return googleProvider;
}

// Debug function to check Firebase configuration
export function debugFirebaseConfig() {
  console.log("=== Firebase Configuration Debug ===");
  console.log("Environment variables:");
  console.log(
    "- NEXT_PUBLIC_FIREBASE_API_KEY:",
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "Set" : "Missing"
  );
  console.log(
    "- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:",
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  );
  console.log(
    "- NEXT_PUBLIC_FIREBASE_PROJECT_ID:",
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  );
  console.log(
    "- NEXT_PUBLIC_FIREBASE_APP_ID:",
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? "Set" : "Missing"
  );
  console.log(
    "- Current domain:",
    typeof window !== "undefined" ? window.location.hostname : "Server-side"
  );
  console.log(
    "- Current origin:",
    typeof window !== "undefined" ? window.location.origin : "Server-side"
  );

  try {
    const app = getFirebaseApp();
    const auth = getFirebaseAuth();
    const provider = getGoogleProvider();

    console.log("Firebase instances created successfully");
    console.log("- App:", app.name);
    console.log("- Auth:", auth.app.name);
    console.log("- Provider:", provider.providerId);
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
}
