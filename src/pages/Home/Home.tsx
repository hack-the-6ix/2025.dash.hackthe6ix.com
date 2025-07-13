import grassSVG from "../../assets/grass.svg";
import tree1SVG from "../../assets/tree1.svg";
import cloudSVG from "../../assets/cloudsLaptop.svg";
import cloudPhoneSVG from "../../assets/cloudsPhone.svg";
import cloudMiddle from "../../assets/cloudMiddle.svg";
import firefly from "../../assets/firefly.svg";
import Text from "../../components/Text/Text";
import appleWallet from "../../assets/apple-add-to-wallet.svg";
import googleWallet from "../../assets/google-add-to-wallet.svg";
import { FaDiscord } from "react-icons/fa";
import { ArrowRight } from "lucide-react";
import { getDownloadPassQR, updateRSVP } from "../../api/client";
import type { Profile } from "../../components/types";
import notionlogo from "../../assets/notionlogo.png";
import devpostlogo from "../../assets/devpostlogo.png";

import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import Modal from "../../components/Modal/Modal";

async function addToWalletGoogle(profile: Profile) {
  const userId = profile._id;
  const userType = "User";
  const userName = `${profile.firstName} ${profile.lastName}`;
  try {
    const res = await fetch(
      `${import.meta.env.VITE_DEV_API_URL || "https://api.hackthe6ix.com"}/passes/google/hackathon.pkpass?userId=${userId}&userType=${userType}&userName=${userName}`,
      {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "true"
        }
      }
    );
    const data = await res.json();
    console.log(data);
    window.open(data.saveUrl, "_blank");
  } catch (err) {
    console.error("Failed to fetch pass:", err);
  }
}

async function addToWalletApple(profile: Profile) {
  const userId = profile._id;
  const userType = "User";
  const userName = `${profile.firstName} ${profile.lastName}`;
  try {
    const res = await fetch(
      `${import.meta.env.VITE_DEV_API_URL || "https://api.hackthe6ix.com"}/passes/apple/hackathon.pkpass?userId=${userId}&userType=${userType}&userName=${userName}`,
      {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "true"
        }
      }
    );
    if (!res.ok) {
      console.error("Failed to fetch pass");
      console.log(res);
      return;
    }
    const blob = await res.blob();

    const url = window.URL.createObjectURL(
      new Blob([blob], {
        type: "application/vnd.apple.pkpass"
      })
    );
    window.location.href = url;

    setTimeout(() => window.URL.revokeObjectURL(url), 5000);
  } catch (err) {
    console.error("Failed to fetch pass:", err);
  }
}

const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

export default function Home() {
  const { profile } = useAuth();
  const GRASSCOUNT = 40;
  const [downloadPassQR, setDownloadPassQR] = useState("");
  const [downloadPassError, setDownloadPassError] = useState("");
  const [showDeclineModal, setShowDeclineModal] = useState(false);

  useEffect(() => {
    const userId = profile?._id;
    const firstName = profile?.firstName;
    const lastName = profile?.lastName;
    if (userId) {
      const userName = `${firstName} ${lastName}`;
      getDownloadPassQR({
        userId: userId,
        userType: "User",
        userName: userName
      })
        .then((dataUri) => {
          setDownloadPassQR(dataUri);
        })
        .catch((e: unknown) => {
          console.error(e);
          setDownloadPassError("Failed to load download pass QR code");
        });
    }
  }, [profile?._id, profile?.firstName, profile?.lastName]);

  const handleDeclineAttendance = async () => {
    try {
      await updateRSVP({
        rsvp: {
          attending: false,
          form: {
            age: 0,
            waiverAgreed: false
          }
        }
      });
      setShowDeclineModal(false);
      window.location.reload();
    } catch (error) {
      console.error("Failed to update RSVP:", error);
    }
  };

  return (
    <div className="flex sm:gap-0 gap-4 overflow-hidden p-4 sm:p-8 bg-linear-to-b from-[#ACDCFD] via-[#B3E9FC] to-[#B9F2FC] min-h-screen w-full flex-col justify-start sm:justify-center items-center text-center overflow-x-hidden">
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
      <div className="overflow-hidden fixed bottom-0 left-0 w-full flex justify-between items-end z-0">
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
        <div className="flex flex-col sm:items-start items-center justify-start sm:justify-center z-10 w-full max-w-[1500px] mx-auto px-2 sm:px-4 mt-8 sm:mt-0">
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
            <span className="text-[#00786D]">
              Event Location:{" "}
              <a
                href="https://g.co/kgs/u8YRZBi"
                className="font-bold underline"
                target="_blank"
                rel="noreferrer"
              >
                Accolade East Building @ YorkU
              </a>
            </span>
          </Text>

          <div className="flex flex-col sm:flex-row w-full gap-4 sm:gap-8">
            <div
              className="flex gap-4 flex-col"
              style={{ width: profile.status.confirmed ? "100%" : "100%" }}
            >
              <div className="w-full backdrop-blur-sm bg-[#FFFFFF80] min-h-[120px] sm:h-[22%] rounded-xl py-4 px-4 sm:px-6 flex flex-col items-start justify-center">
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
                    <>Sorry to see you go :( Hope to see you next year!</>
                  )}
                </Text>
              </div>
              {profile.status.confirmed && (
                <div className="w-full backdrop-blur-sm bg-[#FFFFFF80] min-h-[200px] sm:h-[40%] rounded-xl py-4 px-4 sm:px-6 flex flex-col items-start justify-center">
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
                  <div
                    className="flex flex-row w-full gap-4 cursor-pointer"
                    onClick={() => {
                      window.open("/discord/link");
                    }}
                  >
                    <FaDiscord className="text-[#8c9eff] text-[40px] sm:text-[60px]" />
                    <div className="flex flex-col items-start flex-1">
                      <Text textType="paragraph-lg" textWeight="bold">
                        <p className="text-[#8c9eff] flex gap-1 items-center">
                          DISCORD
                          <ArrowRight className="text-[#8c9eff]" />
                        </p>
                      </Text>
                      <Text
                        textType="paragraph-sm"
                        className="text-left mb-2 py-2"
                      >
                        Click this button to join the Discord, then follow the
                        instructions in the{" "}
                        <span className="bg-[#8c9eff] p-1 text-xs rounded-sm text-white">
                          # ✅-verification
                        </span>{" "}
                        channel
                      </Text>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      window.open("/discord/link");
                    }}
                    className="cursor-pointer hover:bg-[#54595950] flex text-[#00786D] flex-row gap-2 p-2 h-[40px] items-center justify-center rounded-4xl w-full bg-[#5459592E]"
                  >
                    Join Discord
                  </button>
                </div>
              )}
              <div className="w-full backdrop-blur-sm bg-[#FFFFFF80] min-h-[200px] sm:h-[38%] rounded-xl py-4 px-4 sm:px-6 flex flex-col items-start justify-center">
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
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 w-full justify-center mt-2 items-center">
                  <a
                    className="flex flex-row gap-4 items-center cursor-pointer w-full sm:w-auto"
                    href="https://www.notion.so/hackthe6ix/Hack-the-6ix-2025-f03f9b3e42744b48a52c64a180159353"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={notionlogo}
                      className="h-[60px] w-[60px] sm:h-[90px] sm:w-[90px]"
                    ></img>
                    <div className="flex flex-col items-start flex-1 sm:w-[200px]">
                      <Text
                        textColor="black"
                        textType="heading-sm"
                        textWeight="bold"
                        className="text-left flex items-center gap-1"
                      >
                        <span className="flex items-center gap-1">
                          NOTION
                          <ArrowRight />
                        </span>
                      </Text>
                      <Text textType="paragraph-sm" className="text-left">
                        Access our live hacker guide book here!
                      </Text>
                    </div>
                  </a>
                  <a
                    className="flex flex-row gap-4 items-center cursor-pointer w-full sm:w-auto"
                    href="https://hackthe6ix2025.devpost.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={devpostlogo}
                      className="h-[60px] w-[60px] sm:h-[90px] sm:w-[90px]"
                    ></img>
                    <div className="flex flex-col items-start flex-1 sm:w-[200px]">
                      <Text
                        textColor="black"
                        textType="heading-sm"
                        textWeight="bold"
                        className="text-left flex items-center gap-1"
                      >
                        <span className="flex items-center gap-1">
                          DEVPOST
                          <ArrowRight />
                        </span>
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
              className="flex gap-4 flex-col"
              style={{
                width: profile.status.confirmed ? "100%" : "0%",
                display: profile.status.confirmed ? "flex" : "none"
              }}
            >
              <a
                href="/schedule"
                className="w-full h-[50px] rounded-xl bg-[#1C6981] hover:bg-[#134b5c] shadow-lg flex items-center justify-center"
              >
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
              <div className="w-full flex flex-col md:flex-row backdrop-blur-sm bg-[#FFFFFF80] min-h-[300px] sm:h-[60%] rounded-xl items-center justify-center py-4 px-4 sm:px-6">
                <div className="text-left md:w-full w-1/2">
                  <Text
                    textType="heading-sm"
                    textColor="primary"
                    textWeight="bold"
                  >
                    Download Pass
                  </Text>
                  {!downloadPassError && (
                    <Text
                      textType="paragraph-sm"
                      textColor="secondary"
                      className="mt-2"
                    >
                      Scan this QR code on mobile to download your event pass
                    </Text>
                  )}
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
                <div className="w-1/2 md:w-full flex flex-col items-center">
                  {downloadPassError ? (
                    <Text
                      textType="paragraph-lg"
                      textColor="primary"
                      textWeight="bold"
                    >
                      <span className="font-bold text-red-500">
                        {downloadPassError}
                      </span>
                    </Text>
                  ) : (
                    <img
                      src={downloadPassQR}
                      alt="Your download pass QR code"
                      className="my-2 max-w-[150px]"
                    />
                  )}
                  {isIOS() && (
                    <img
                      src={appleWallet}
                      alt="Add to Apple Wallet"
                      className="h-10 cursor-pointer"
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
                    <img
                      src={googleWallet}
                      alt="Add to Google Wallet"
                      className="h-10 cursor-pointer"
                      onClick={async () => {
                        if (!profile) {
                          console.error("No profile found");
                          return;
                        }
                        addToWalletGoogle(profile);
                      }}
                    />
                  )}
                </div>
              </div>
              <div className="w-full backdrop-blur-sm bg-[#FFFFFF80] min-h-[150px] sm:h-[40%] rounded-xl py-4 px-4 sm:px-6 flex flex-col justify-center">
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
                  onClick={() => setShowDeclineModal(true)}
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

      <Modal open={showDeclineModal} onClose={() => setShowDeclineModal(false)}>
        <div className="flex flex-col gap-4">
          <Text textType="heading-sm" textColor="primary" textWeight="bold">
            Confirm Attendance Decline
          </Text>
          <Text textType="paragraph-sm" textColor="secondary">
            Are you sure you can no longer attend? This action cannot be undone
            and your spot will be given to another hacker.
          </Text>
          <div className="flex gap-3 justify-center mt-4">
            <button
              onClick={() => setShowDeclineModal(false)}
              className="px-6 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
            >
              <Text textType="paragraph-sm">Cancel</Text>
            </button>
            <button
              onClick={handleDeclineAttendance}
              className="px-6 py-2 rounded-lg bg-[#E42027] hover:bg-[#c41e24] text-white"
            >
              <Text textType="paragraph-sm" textColor="white">
                Confirm
              </Text>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
