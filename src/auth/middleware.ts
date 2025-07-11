import { fetchHt6 } from "../api/client";
import type { AuthResponse, LoginPayload, Profile } from "../components/types";

const REDIRECT_LOOP_KEY = "auth_redirects";
const REDIRECT_LOOP_THRESHOLD = 5;
const REDIRECT_LOOP_WINDOW = 5000; // 5 seconds

interface RedirectEntry {
  timestamp: number;
}

export interface AuthResult {
  profile: Profile | null;
  error?: {
    type: "redirect_loop" | "auth_failed";
    message: string;
  };
}

function detectRedirectLoop(): boolean {
  const redirectsStr = sessionStorage.getItem(REDIRECT_LOOP_KEY);
  const now = Date.now();

  let redirects: RedirectEntry[] = redirectsStr ? JSON.parse(redirectsStr) : [];

  // Filter out old entries outside the time window
  redirects = redirects.filter(
    (entry) => now - entry.timestamp < REDIRECT_LOOP_WINDOW,
  );

  // Check if we've exceeded the threshold
  return redirects.length >= REDIRECT_LOOP_THRESHOLD;
}

function recordRedirectAttempt(): void {
  const redirectsStr = sessionStorage.getItem(REDIRECT_LOOP_KEY);
  const now = Date.now();

  let redirects: RedirectEntry[] = redirectsStr ? JSON.parse(redirectsStr) : [];

  // Filter out old entries outside the time window
  redirects = redirects.filter(
    (entry) => now - entry.timestamp < REDIRECT_LOOP_WINDOW,
  );

  // Add current redirect attempt
  redirects.push({ timestamp: now });

  // Save updated redirects
  sessionStorage.setItem(REDIRECT_LOOP_KEY, JSON.stringify(redirects));
}

export async function checkAuth(): Promise<AuthResult> {
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");

  // If we have tokens, try to validate them first
  if (token && refreshToken) {
    try {
      const response = await fetchHt6<{ status: number; message: Profile }>(
        "/api/action/profile",
      );
      if (response.status === 200) {
        // Clear redirect tracking on successful auth
        sessionStorage.removeItem(REDIRECT_LOOP_KEY);
        return { profile: response.message };
      }
    } catch (error) {
      console.error("Profile fetch error:", error);

      // Only remove tokens if we get specific authentication errors
      // Don't remove tokens for network errors, server errors, etc.
      if (error && typeof error === "object" && "status" in error) {
        const statusCode = (error as any).status; // eslint-disable-line @typescript-eslint/no-explicit-any
        // Only clear tokens on actual auth failures (401, 403)
        if (statusCode === 401 || statusCode === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
        } else {
          // For other errors (500, network issues, etc.), keep tokens and return error
          return {
            profile: null,
            error: {
              type: "auth_failed",
              message: `API error (${statusCode}). Please try again.`,
            },
          };
        }
      } else {
        // Network error or other non-HTTP error - keep tokens
        return {
          profile: null,
          error: {
            type: "auth_failed",
            message:
              "Network error. Please check your connection and try again.",
          },
        };
      }
    }
  }

  // Check for redirect loop BEFORE attempting redirect
  if (detectRedirectLoop()) {
    return {
      profile: null,
      error: {
        type: "redirect_loop",
        message:
          "Authentication redirect loop detected. Please try refreshing the page or clearing your browser data.",
      },
    };
  }

  const callbackURL = `${window.location.origin}/callback`;

  try {
    const response = await fetchHt6<AuthResponse, LoginPayload>(
      "/auth/dash-backend/login",
      {
        method: "POST",
        body: {
          callbackURL,
          redirectTo: "/",
        },
      },
    );

    if (response.status === 200 && response.message.url) {
      // Only record the redirect attempt when we're actually about to redirect
      recordRedirectAttempt();
      window.location.href = response.message.url;
      return { profile: null };
    }
  } catch (error) {
    console.error("Login initiation failed:", error);
    return {
      profile: null,
      error: {
        type: "auth_failed",
        message: "Failed to initiate login. Please try again.",
      },
    };
  }

  return { profile: null };
}
