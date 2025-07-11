import grassSVG from "../assets/grass.svg";
import tree1SVG from "../assets/tree1.svg";
import cloudSVG from "../assets/cloudsLaptop.svg";
import cloudPhoneSVG from "../assets/cloudsPhone.svg";
import cloudMiddle from "../assets/cloudMiddle.svg";
import firefly from "../assets/firefly.svg";
import Text from "../../components/Text/Text";

import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchHt6 } from "../../api/client";
import type { AuthResponse, CallbackPayload } from "../../components/types";
import { useAuth } from "../../contexts/AuthContext";

export default function Callback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setProfile } = useAuth();
  const GRASSCOUNT = 40;

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

          // Clear redirect tracking on successful authentication
          sessionStorage.removeItem("auth_redirects");

          // Don't call checkAuth() here - it has redirect logic that can cause loops
          // Just navigate away from the callback page
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

  return (
    <div className="sm:gap-0 gap-4 overflow-hidden p-8 bg-linear-to-b from-[#ACDCFD] via-[#B3E9FC] to-[#B9F2FC] h-[100vh] w-full flex flex-col justify-center items-center text-center overflow-x-hidden">
      <img
        src={cloudSVG}
        alt="Cloud"
        className="absolute w-full top-0 left-0 hidden sm:block"
      />

      <img
        src={cloudPhoneSVG}
        alt="Cloud"
        className="absolute w-full top-[80px] left-0 sm:hidden block"
      />

      <img
        src={cloudMiddle}
        alt="Cloud"
        className="absolute w-1/3 top-[290px] left-1/2 -translate-x-1/2 block"
      />

      <img
        src={firefly}
        alt="firefly"
        className="absolute w-1/3 top-[-5rem] left-[10%] block"
      />

      <img
        src={firefly}
        alt="firefly"
        className="absolute w-1/3 top-[5rem] right-[10%] block"
      />
      <div className="overflow-hidden absolute bottom-0 left-0 w-full flex justify-between items-end">
        {Array.from({ length: GRASSCOUNT }).map((_, index) => (
          <img
            key={index}
            src={grassSVG}
            alt="Grass"
            className="sm:h-[118px] sm:w-[78px] h-[46px] w-[30px]"
          />
        ))}
      </div>

      <div className="w-full overflow-hidden absolute top-0 left-0 h-full sm:flex hidden">
        <img
          src={tree1SVG}
          alt="Pine tree"
          className="absolute h-[300px] w-[300px] bottom-[80px] right-[30px]"
        />
      </div>

      <div>
        <Text textType="heading-lg">Loading...</Text>
      </div>
    </div>
  );
}
