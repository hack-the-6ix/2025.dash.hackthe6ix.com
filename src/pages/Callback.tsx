import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchHt6 } from "../api/client";
import type { AuthResponse, CallbackPayload } from "../auth/types";
import { checkAuth } from "../auth/middleware";
import { useAuth } from "../contexts/AuthContext";

export default function Callback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setProfile } = useAuth();

  useEffect(() => {
    const state = searchParams.get("state");
    const code = searchParams.get("code");

    if (!state || !code) {
      navigate("/");
      return;
    }

    async function setSession() {
      try {
        const response = await fetchHt6<AuthResponse, CallbackPayload>(
          "/auth/dash-backend/callback",
          {
            method: "POST",
            body: { state: state || "", code: code || "" }
          }
        );

        if (
          response.status === 200 &&
          response.message.token &&
          response.message.refreshToken
        ) {
          localStorage.setItem("token", response.message.token);
          localStorage.setItem("refreshToken", response.message.refreshToken);

          const profile = await checkAuth();
          setProfile(profile);
          navigate("/");
        }
      } catch (error) {
        console.error("Authentication failed:", error);
        setProfile(null);
        navigate("/");
      }
    }

    setSession();
  }, [searchParams, navigate, setProfile]);

  return <>loading</>;
}
