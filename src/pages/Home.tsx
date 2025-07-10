import grassSVG from "../assets/grass.svg";
import tree1SVG from "../assets/tree1.svg";
import cloudSVG from "../assets/cloudsLaptop.svg";
import cloudPhoneSVG from "../assets/cloudsPhone.svg";
import cloudMiddle from "../assets/cloudMiddle.svg";
import firefly from "../assets/firefly.svg";
import Text from "../components/Text/Text";
import appleWallet from "../assets/apple-add-to-wallet.svg";
import googleWallet from "../assets/google-add-to-wallet.svg";
import { Copy } from "lucide-react";
import { FaDiscord } from "react-icons/fa";
import { ArrowRight } from "lucide-react";
import Modal from "../components/Modal/Modal";
import { updateRSVP } from "../api/client";
import { getDownloadPassQR } from "../api/client";
import Button from "../components/Button/Button";
import type { Profile } from "../components/types";

import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { checkAuth } from "../auth/middleware";

async function addToWalletGoogle(profile: Profile) {
  const userId = profile._id;
  const userType = "User";
  const userName = `${profile.firstName} ${profile.lastName}`;
  try {
    const res = await fetch(`${import.meta.env.VITE_DEV_API_URL || "https://api.hackthe6ix.com"}/passes/google/hackathon.pkpass?userId=${userId}&userType=${userType}&userName=${userName}`, { method: 'GET', headers: {
      'ngrok-skip-browser-warning': 'true'
    } });
    const data = await res.json();
    console.log(data);
    window.open(data.saveUrl, '_blank');
  } catch (err) {
    console.error('Failed to fetch pass:', err);
  }
}

async function addToWalletApple(profile: Profile) {
  const userId = profile._id;
  const userType = "User";
  const userName = `${profile.firstName} ${profile.lastName}`;
  try {
    const res = await fetch(`${import.meta.env.VITE_DEV_API_URL || "https://api.hackthe6ix.com"}/passes/apple/hackathon.pkpass?userId=${userId}&userType=${userType}&userName=${userName}`, { method: 'GET', headers: {
      'ngrok-skip-browser-warning': 'true'
    } });
    if (!res.ok) {
      console.error("Failed to fetch pass");
      console.log(res);
      return;
    }
    const blob = await res.blob();

    const url = window.URL.createObjectURL(new Blob([blob], {
      type: 'application/vnd.apple.pkpass'
    }));
    window.location.href = url;

    // kill after some time
    setTimeout(() => window.URL.revokeObjectURL(url), 5000);
  } catch (err) {
    console.error('Failed to fetch pass:', err);
  }
}

const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

const isAndroid = () => {
  return /Android/.test(navigator.userAgent);
};

export default function Home() {
  const { profile, setProfile } = useAuth();
  const GRASSCOUNT = 40;
  const [modalType, setModalType] = useState<null | "deny" | "accept">(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [qr, setQr] = useState("");
  const [downloadPassQR, setDownloadPassQR] = useState("");
  const [downloadPassError, setDownloadPassError] = useState("");


  // Load download pass QR code when profile is available
  useEffect(() => {
    if (profile?._id) {
      const userName = `${profile.firstName} ${profile.lastName}`;
      getDownloadPassQR({
        userId: profile._id,
        userType: "User",
        userName: userName,
      })
        .then((dataUri) => {
          setDownloadPassQR(dataUri);
        })
        .catch((err: any) => {
          console.error(err);
          setDownloadPassError("Failed to load download pass QR code");
        });
    }
  }, [profile?._id]);

  // TEMPORARY TO FORCE CONFIRMED STATUS
  useEffect(() => {
    if (profile && !profile.status.confirmed) {
      profile.status.confirmed = true;
    }
  }, [profile]);

  const handleRSVP = async (
    attending: boolean,
    formData?: { age: number; waiverAgreed: boolean }
  ) => {
    setLoading(true);
    try {
      if (attending && formData) {
        await updateRSVP({
          rsvp: {
            attending: true,
            form: formData,
          },
        });
      } else {
        await updateRSVP({
          rsvp: {
            attending: false,
            form: { age: 0, waiverAgreed: false },
          },
        });
      }
      setModalType(null);
      const result = await checkAuth();
      if (!result.error) {
        setProfile(result.profile);
      } else if (result.error.type === "auth_failed") {
        // For API errors, just log and continue - don't disrupt user flow
        console.log("Profile refresh failed after RSVP:", result.error.message);
        // Keep current profile state rather than clearing it
      }
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "status" in error &&
        "message" in error &&
        (error as { status?: number; message?: string }).status === 403 &&
        (error as { status?: number; message?: string }).message ===
          "You are not eligible to RSVP!"
      ) {
        alert(
          "You are not eligible to RSVP. Please check your status or contact support if you believe this is a mistake."
        );
      } else {
        console.error("RSVP error:", error);
        alert("Failed to update RSVP. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("hi", profile);
  }, []);

  return (
    <div className="flex sm:gap-0 gap-4 overflow-hidden p-8 bg-linear-to-b from-[#ACDCFD] via-[#B3E9FC] to-[#B9F2FC] h-[100vh] w-full flex-col justify-center items-center text-center overflow-x-hidden">
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

      {!profile ? (
        <div>
          <Text textType="heading-lg">Loading...</Text>
        </div>
      ) : (
        <div className="flex flex-col sm:items-start items-center justify-center z-10 w-full max-w-[1150px] mx-auto px-4">
          <Text
            textType="heading-md"
            textColor="primary"
            className="z-[100] mb-4 sm:text-start text-center"
          >
            Welcome back,{" "}
            {profile?.firstName && profile?.lastName ? (
              <span>
                {profile?.firstName} {profile?.lastName}
              </span>
            ) : (
              <span>hacker</span>
            )}
            !
          </Text>
          <Text
            textType="paragraph-lg"
            textColor="primary"
            className="z-[100] mb-4 text-center"
          >
            <span className="text-[#00786D]">
              Explore your dashboard below to find out what you can do before
              the event starts on{" "}
              <span className="text-[#EE721E]">July 18th.</span>
            </span>
          </Text>
          <Text
            textType="paragraph-lg"
            textColor="primary"
            className="z-[100] mb-4 text-center"
          >
            <span className="text-[#00786D]">Event Location: YorkU</span>
          </Text>

          <div className="flex flex-row w-full h-[68vh] gap-8">
            <div
              className="flex gap-4 h-full flex-col"
              style={{ width: profile.status.confirmed ? "70%" : "100%" }}
            >
              <div className="w-full backdrop-blur-sm bg-[#FFFFFF80] h-[22%] rounded-xl py-4 px-6 flex flex-col items-start justify-center">
                <Text
                  textType="heading-sm"
                  textColor="primary"
                  textWeight="bold"
                >
                  {profile.status.confirmed ? (
                    <span className="text-[#00AC6B]">
                      Your Status: Attending
                    </span>
                  ) : (
                    <span className="text-[#F32E26]">
                      Your Status: Not Attending
                    </span>
                  )}
                </Text>
                <Text
                  textType="paragraph-sm"
                  textColor="secondary"
                  className="mt-1 text-justify"
                >
                  {profile.status.confirmed ? (
                    <>
                      Glad you are joining us! Please ensure you go through our
                      hacker guide book and bring the necessary items on the day
                      of the hackathon. If you can no longer attend please let
                      us know as early as possible.
                    </>
                  ) : (
                    <>
                      Sorry to see you go :( Your spot has been given to another
                      exciting hacker. Hope to see you next year!
                    </>
                  )}
                </Text>
              </div>
              <div className="w-full backdrop-blur-sm bg-[#FFFFFF80] h-[40%] rounded-xl py-4 px-6 flex flex-col items-start  justify-center">
                <Text
                  textType="heading-sm"
                  textColor="primary"
                  textWeight="bold"
                >
                  Join Our Discord
                </Text>
                <Text
                  textType="paragraph-sm"
                  textColor="secondary"
                  className="mt-1 mb-2 text-justify"
                >
                  Join the server to get the latest updates and connect with
                  fellow hackers, mentors and sponsors!
                </Text>
                <div className="flex flex-row w-full gap-4">
                  <FaDiscord className="text-[#8c9eff] text-[60px]" />
                  <div className="flex flex-col items-start">
                    <Text textType="paragraph-lg" textWeight="bold">
                      <span className="text-[#8c9eff]">DISCORD -&gt;</span>
                    </Text>
                    <Text textType="paragraph-sm">
                      Issue the following command in the #verification channel:
                    </Text>
                  </div>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      "!verify youremail@gmail.com"
                    );
                  }}
                  className="cursor-pointer hover:bg-[#54595950] flex text-[#00786D] flex-row gap-2 h-[40px] items-center justify-center rounded-4xl w-full bg-[#5459592E]"
                >
                  !verify youremail@gmail.com <Copy />
                </button>
              </div>
              <div className="w-full backdrop-blur-sm bg-[#FFFFFF80] h-[38%] rounded-xl py-4 px-6 flex flex-col items-start  justify-center">
                <Text
                  textType="heading-sm"
                  textColor="primary"
                  textWeight="bold"
                >
                  Useful Links
                </Text>
                <Text
                  textType="paragraph-sm"
                  textColor="secondary"
                  className="mt-1 mb-2 text-justify"
                >
                  Explore these links to learn more about our event this year
                  and get familiar with Hack the 6ix!
                </Text>
                <div className="flex flex-row gap-8 w-full justify-center mt-2 items-center">
                  <a
                    className="flex flex-row gap-2 items-center cursor-pointer"
                    href="https://www.notion.so/hackthe6ix/Hack-the-6ix-2025-f03f9b3e42744b48a52c64a180159353"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="/src/assets/notionlogo.png"
                      className="h-[90px] w-[90px]"
                    ></img>
                    <div className="flex flex-col items-start w-[200px]">
                      <Text
                        textColor="black"
                        textType="heading-sm"
                        textWeight="bold"
                        className="text-left"
                      >
                        NOTION -&gt;
                      </Text>
                      <Text textType="paragraph-sm" className="text-left">
                        Access our live hacker guide book here!
                      </Text>
                    </div>
                  </a>
                  <a
                    className="flex flex-row gap-2 items-center cursor-pointer"
                    href="https://hackthe6ix2025.devpost.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="/src/assets/devpostlogo.png"
                      className="h-[90px] w-[90px]"
                    ></img>
                    <div className="flex flex-col items-start w-[200px]">
                      <Text
                        textColor="black"
                        textType="heading-sm"
                        textWeight="bold"
                        className="text-left"
                      >
                        DEVPOST -&gt;
                      </Text>
                      <Text textType="paragraph-sm" className="text-left">
                        Submit & share your projects here!
                      </Text>
                    </div>
                  </a>
                </div>
              </div>
            </div>
            <div
              className="flex gap-4 h-full flex-col"
              style={{
                width: profile.status.confirmed ? "30%" : "0%",
                display: profile.status.confirmed ? "flex" : "none",
              }}
            >
              <a href="/schedule" className="w-full h-[50px] rounded-xl bg-[#1C6981] hover:bg-[#134b5c] shadow-lg flex items-center justify-center">
                <Text
                  textType="paragraph-sm"
                  textColor="white"
                  className="cursor-pointer text-center"
                  textWeight="bold"
                >
                  <span className="flex flex-row font-bold items-center justify-center gap-2">
                    Hackathon Schedule <ArrowRight />
                  </span>
                </Text>
              </a>
              <div className="w-full flex flex-col backdrop-blur-sm bg-[#FFFFFF80] h-[60%] rounded-xl items-center justify-center py-4 px-6 ">
                <Text
                  textType="heading-sm"
                  textColor="primary"
                  textWeight="bold"
                >
                  Download Pass
                </Text>
                {error ? (
                  <Text
                    textType="paragraph-lg"
                    textColor="primary"
                    textWeight="bold"
                  >
                    <span className="font-bold text-red-500">
                    {error}
                    </span>
                  </Text>
                ) : (
                  <img
                    src={downloadPassQR}
                    alt="Your download pass QR code"
                    className="my-2"
                    style={{ width: 100, height: 100 }}
                  />
                )}
                {isIOS() && (
                  <img src={appleWallet} alt="Add to Apple Wallet" className="w-4/5 h-full cursor-pointer"
                    onClick={async () => {
                      if (!profile) {
                        console.error("No profile found");
                        return;
                      }
                      addToWalletApple(profile);
                    }}
                  />
                )}
                {!isIOS() && (
                  <img src={googleWallet} alt="Add to Google Wallet" className="w-4/5 h-full cursor-pointer"
                      onClick={async () => {
                        if (!profile) {
                          console.error("No profile found");
                          return;
                        }
                        addToWalletGoogle(profile);
                      }}
                    />
                )}
               {downloadPassError ? <Text
                  textType="paragraph-sm"
                  textColor="secondary"
                  className="mt-2 text-center"
                >
                  {downloadPassError}
                </Text> : <Text
                  textType="paragraph-sm"
                  textColor="secondary"
                  className="mt-2 text-center"
                >
                  Scan this QR code on mobile to download your event pass
                </Text>}
                <Text
                  textType="paragraph-sm"
                  textColor="primary"
                  textWeight="bold"
                  className="mt-1 mb-2 text-center"
                >
                  <span className="font-bold">Status: </span>
                  {profile.status.checkedIn ? (
                    <span className="text-[#00AC6B] ml-2 bg-[#dbfff2] px-2 py-1 rounded-full">
                      Checked-in
                    </span>
                  ) : (
                    <span className="text-[#F32E26] ml-2 bg-[#FEF2F2] px-2 py-1 rounded-full">
                      Not Checked-in
                    </span>
                  )}
                </Text>
              </div>
              <div className="w-full backdrop-blur-sm bg-[#FFFFFF80] h-[40%] rounded-xl py-4 px-6 flex flex-col justify-center ">
                <Text
                  textType="paragraph-lg"
                  textColor="primary"
                  className="mb-2"
                >
                  <span className="font-bold">If you can no longer attend</span>
                </Text>
                <Text
                  textType="paragraph-sm"
                  textColor="secondary"
                  className="text-center mb-4"
                >
                  If you can no longer attend, please let us know so we can pass
                  this opportunity to a waitlisted hacker.
                </Text>
                <button
                  onClick={() => setModalType("deny")}
                  className="w-full hover:bg-[#f5cecb] rounded-lg border-1 border-[#E42027] bg-white px-4 py-2"
                >
                  <Text textType="paragraph-sm">
                    <span className="font-bold text-[#E42027]">
                      I can no longer attend
                    </span>
                  </Text>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
