interface LoginResponse {
  error: boolean;
  data: {
    user: {
      name: string;
      email: string;
      profile: string;
    };
    token: string;
  };
  message: string;
}

interface UserData {
  name: string;
  email: string;
  profile: string;
}

export class AuthService {
  private static readonly API_BASE_URL = "https://gen-ai.bdbose.in/api/v1";
  private static readonly TOKEN_KEY = "auth_token";
  private static readonly USER_KEY = "user_data";

  static async login(credential: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: credential,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: LoginResponse = await response.json();

      if (data.error) {
        throw new Error(data.message || "Login failed");
      }

      // Save to localStorage
      this.saveToken(data.data.token);
      this.saveUserData(data.data.user);

      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  static saveToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  static getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  static saveUserData(userData: UserData): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
    }
  }

  static getUserData(): UserData | null {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem(this.USER_KEY);
      if (userData) {
        try {
          return JSON.parse(userData);
        } catch (error) {
          console.error("Error parsing user data:", error);
          return null;
        }
      }
    }
    return null;
  }

  static clearAuthData(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
      window.location.href = "/";
    }
  }

  static isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  static logout(): void {
    this.clearAuthData();
  }
}

export type { UserData, LoginResponse };
