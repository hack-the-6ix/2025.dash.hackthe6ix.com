import grassSVG from "../assets/grass.svg";
import tree1SVG from "../assets/tree1.svg";
import cloudSVG from "../assets/cloudsLaptop.svg";
import cloudPhoneSVG from "../assets/cloudsPhone.svg";
import cloudMiddle from "../assets/cloudMiddle.svg";
import firefly from "../assets/firefly.svg";
import Text from "../components/Text/Text";
import Modal from "../components/Modal/Modal";
import RSVPForm from "../components/RSVPForm/RSVPForm";
import { updateRSVP } from "../api/client";
import Button from "../components/Button/Button";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa6";
import { Link } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { checkAuth } from "../auth/middleware";

export default function Home() {
  const { profile, setProfile } = useAuth();
  const GRASSCOUNT = 40;
  const [modalType, setModalType] = useState<null | "deny" | "accept">(null);
  const [loading, setLoading] = useState(false);

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
            form: formData
          }
        });
      } else {
        await updateRSVP({
          rsvp: {
            attending: false,
            form: { age: 0, waiverAgreed: false }
          }
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

  const handleAcceptFormSubmit = (formData: {
    age: number;
    waiverAgreed: boolean;
  }) => {
    handleRSVP(true, formData);
  };

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

      {!profile && (
        <div>
          <Text textType="heading-lg">Loading...</Text>
        </div>
      )}

      {profile?.status.confirmed === true && (
        <div className="flex flex-col items-center justify-center z-10 w-full max-w-[850px] mx-auto px-4">
          <Text textType="heading-lg" textColor="secondary" className="mb-4">
            You're confirmed!
          </Text>
          <Text textType="heading-md" textColor="primary" className="mb-4">
            Thank you for confirming your attendance at Hack the 6ix 2025.
          </Text>
          <Text textType="paragraph-lg" textColor="primary" className="mb-4">
            We can't wait to see you at the event. Check back for more details
            soon!
          </Text>
          <Text
            textType="paragraph-lg"
            textColor="secondary"
            className="!font-semibold mt-4"
          >
            Have a question? Feel free to reach out to us!
          </Text>
          <div className="flex gap-2 items-center mt-4 sm:w-auto w-full">
            <Button onClick={() => window.open("mailto:hello@hackthe6ix.com")}>
              <p>Email HT6</p>
            </Button>
          </div>
        </div>
      )}

      {profile?.status.accepted === true &&
        !profile?.status.confirmed &&
        !profile?.status.declined && (
          <div className="flex flex-col items-center justify-center z-10 w-full max-w-[850px] mx-auto px-4">
            <Text
              textType="heading-md"
              textColor="primary"
              className="z-[100] mb-8 text-center"
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
            <Text textType="heading-lg" textColor="secondary">
              Congratulations, you've been{" "}
              <span className="text-[#009D60]">accepted</span>
            </Text>
            <Text
              textType="paragraph-lg"
              textColor="primary"
              className="text-center mt-6"
            >
              Welcome to Hack the 6ix 2025! We are excited to offer you the
              opportunity to hack with us.
            </Text>
            <Text
              textType="paragraph-lg"
              textColor="secondary"
              className="!font-semibold mt-4"
            >
              To confirm your attendance, please RSVP below by{" "}
              <span className="text-[#EE721D]">July 11</span>.
            </Text>
            <div className="flex sm:flex-row flex-col gap-2 items-center mt-8 w-full justify-center">
              <Button onClick={() => setModalType("deny")} variant="back">
                I can no longer attend
              </Button>
              <Button onClick={() => setModalType("accept")}>
                Accept Invitation
              </Button>
            </div>
          </div>
        )}

      <Modal open={modalType === "deny"} onClose={() => setModalType(null)}>
        <Text
          textType="heading-md"
          className="font-bold text-[32px] !text-[#EE721D] mb-4"
        >
          Can no longer attend HT6?
        </Text>
        <Text
          textType="paragraph-lg"
          textColor="primary"
          className="mb-6 font-medium leading-snug"
        >
          This opportunity will be passed onto a waitlisted participant. This
          action cannot be undone.
        </Text>
        <div className="flex sm:flex-row flex-col gap-4 justify-center mt-2">
          <Button onClick={() => handleRSVP(false)} disabled={loading}>
            {loading ? "Submitting..." : "I can no longer attend"}
          </Button>
          <Button
            variant="back"
            onClick={() => setModalType(null)}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </Modal>
      <Modal open={modalType === "accept"} onClose={() => setModalType(null)}>
        <Text
          textType="heading-md"
          className="font-bold text-[32px] !text-[#EE721D] mb-4"
        >
          Accept Invitation?
        </Text>
        <Text
          textType="paragraph-lg"
          textColor="primary"
          className="mb-6 font-medium leading-snug"
        >
          Please fill out the form below to confirm your attendance and secure
          your spot at Hack the 6ix 2025.
        </Text>
        <RSVPForm
          onSubmit={handleAcceptFormSubmit}
          onCancel={() => setModalType(null)}
          loading={loading}
        />
      </Modal>
      {/* profile?.status.waitlisted ===  */}
      {profile?.status.waitlisted === true && (
        <div className="flex flex-col items-center justify-center z-10 w-full max-w-[850px] mx-auto px-4">
          <Text
            textType="heading-md"
            textColor="primary"
            className="z-[100] mb-8 text-center"
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
          <Text textType="heading-lg" textColor="secondary">
            You have been placed on the{" "}
            <span className="text-[#EE721D]">waitlist</span>
          </Text>
          <Text
            textType="paragraph-lg"
            textColor="primary"
            className="text-center mt-6"
          >
            We received an overwhelming amount of applications this year and
            have placed you on the waitlist. We'll let you know if a spot opens
            up, so make sure to check your inbox!
          </Text>
          <Text
            textType="paragraph-lg"
            textColor="secondary"
            className="!font-semibold mt-8"
          ></Text>
        </div>
      )}

      {profile?.status.rejected === true && (
        <div className="flex flex-col items-center justify-center z-10 w-full max-w-[850px] mx-auto px-4">
          <Text
            textType="heading-md"
            textColor="primary"
            className="z-[100] mb-8 text-center"
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
          <Text textType="heading-lg" textColor="secondary">
            Unfortunately, your hacker application has{" "}
            <span className="text-[#E42027]">not been selected</span> :(
          </Text>
          <Text
            textType="paragraph-lg"
            textColor="primary"
            className="text-center mt-6"
          >
            Thank you for your enthusiasm and dedication in applying to Hack the
            6ix 2025. We received an overwhelming amount of applications this
            year, and after careful consideration, we regret to inform you that
            your application was not chosen for this year's hackathon.
          </Text>
          <Text
            textType="paragraph-lg"
            textColor="secondary"
            className="!font-semibold mt-4"
          >
            Interested in volunteering? Sign ups close on July 7th
          </Text>
          <div className="flex gap-2 items-center mt-4 sm:w-auto w-full">
            <Button
              onClick={() =>
                window.open("https://go.hackthe6ix.com/ktD2kt", "_blank")
              }
            >
              <p>Volunteer at HT6</p>
            </Button>
          </div>
        </div>
      )}

      {profile?.status.applied === false && (
        <div className="flex flex-col items-center justify-center z-10 w-full max-w-[850px] mx-auto px-4">
          <Text
            textType="heading-md"
            textColor="primary"
            className="z-[100] mb-8 text-center"
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
          <Text textType="heading-lg" textColor="secondary">
            You did <span className="text-[#E42027]">not </span>submit an
            application to Hack the 6ix this year.
          </Text>
          <Text
            textType="paragraph-lg"
            textColor="primary"
            className="text-center mt-6"
          >
            We look forward to welcoming you to a future event!
          </Text>
          <Text
            textType="paragraph-lg"
            textColor="secondary"
            className="!font-semibold mt-4"
          >
            Have a question? Feel free to reach out to us!
          </Text>
          <div className="flex gap-2 items-center mt-4">
            <button
              className="bg-transparent text-[#00887E] transition-opacity border border-[#00887E] cursor-pointer hover:opacity-75 rounded-[8px] px-[24px] py-[12px] font-bold"
              onClick={() => window.open("mailto:hello@hackthe6ix.com")}
            >
              <p>Email HT6</p>
            </button>
          </div>
        </div>
      )}

      {profile?.status.declined && (
        <div className="flex flex-col items-center justify-center z-10 w-full max-w-[850px] mx-auto px-4">
          <Text
            textType="heading-md"
            textColor="primary"
            className="z-[100] mb-8 text-center"
          >
            Bye,{" "}
            {profile?.firstName && profile?.lastName ? (
              <span>
                {profile?.firstName} {profile?.lastName}
              </span>
            ) : (
              <span>hacker</span>
            )}
            !
          </Text>
          <Text textType="heading-lg" textColor="secondary">
            We're sad to see you go!
          </Text>
          <Text
            textType="paragraph-lg"
            textColor="primary"
            className="text-center mt-6"
          >
            Thank you for letting us know you will{" "}
            <span className="text-[#EE721D]">no longer be attending</span> Hack
            The 6ix 2025. We hope to see you next year!
          </Text>

          <div className="w-full sm:w-[60%] h-[1px] bg-[#08566B] my-6"></div>
        </div>
      )}
      <Text
        textType="paragraph-lg"
        textColor="secondary"
        className="!font-semibold mt-8"
      >
        Let's stay connected:
      </Text>

      <div className="flex flex-row gap-6 items-center mt-4 text-[#08566B] text-[20px] sm:text-[30px]">
        <Link
          to="https://www.facebook.com/Hackthe6ix/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Hack the 6ix on Facebook"
        >
          <FaFacebook />
        </Link>
        <Link
          to="https://www.instagram.com/hackthe6ix/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Hack the 6ix on Instagram"
        >
          <FaInstagram />
        </Link>
        <Link
          to="https://www.linkedin.com/company/hackthe6ixofficial/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Hack the 6ix on Linkedin"
        >
          <FaLinkedin />
        </Link>
        <Link
          to="https://x.com/hackthe6ix/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Hack the 6ix on Twitter"
        >
          <FaTwitter />
        </Link>
      </div>

      {profile &&
        !profile.status.accepted &&
        !profile.status.rejected &&
        !profile.status.waitlisted && (
          <div className="flex flex-col items-center justify-center z-10 w-full max-w-[850px] mx-auto px-4">
            <Text textType="heading-lg" textColor="secondary" className="mb-4">
              You shouldn't be here!
            </Text>
            <Text
              textType="paragraph-lg"
              textColor="primary"
              className="text-center"
            >
              If you think this is a mistake, please contact us at{" "}
              <a
                href="mailto:hello@hackthe6ix.com"
                className="underline text-[#00887E]"
              >
                hello@hackthe6ix.com
              </a>
              .
            </Text>
          </div>
        )}
    </div>
  );
}
