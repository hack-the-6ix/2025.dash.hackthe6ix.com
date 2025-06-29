import { fetchHt6 } from "../api/client";
import type { AuthResponse, LoginPayload, Profile } from "./types";

export async function checkAuth(): Promise<Profile | null> {
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");

  if (token && refreshToken) {
    try {
      const response = await fetchHt6<{ status: number; message: Profile }>(
        "/api/action/profile"
      );
      console.log(response);
      if (response.status === 200) {
        return response.message;
      }
    } catch (error) {
      console.error(error);
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    }
  }

  const callbackURL = `${window.location.origin}/callback`;
  const response = await fetchHt6<AuthResponse, LoginPayload>(
    "/auth/dash-backend/login",
    {
      method: "POST",
      body: {
        callbackURL,
        redirectTo: "/"
      }
    }
  );

  if (response.status === 200 && response.message.url) {
    window.location.href = response.message.url;
  }

  return null;
}
