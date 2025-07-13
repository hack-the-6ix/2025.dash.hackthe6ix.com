import grassSVG from "../../assets/grass.svg";
import tree1SVG from "../../assets/tree1.svg";
import cloudSVG from "../../assets/cloudsLaptop.svg";
import cloudPhoneSVG from "../../assets/cloudsPhone.svg";
import cloudMiddle from "../../assets/cloudMiddle.svg";
import firefly from "../../assets/firefly.svg";
import Text from "../../components/Text/Text";
import { ArrowRight } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import EventsList from "../../components/Schedule/Schedule";
import { useState, useEffect } from "react";

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const hackingStarts = new Date("2025-07-18T22:00:00");
      const hackingEnds = new Date("2025-07-20T09:30:00");
      const hackingEndsExtended = new Date("2025-07-20T10:00:00");

      if (now < hackingStarts) {
        const diff = hackingStarts.getTime() - now.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        setTimeLeft(`${days} days, ${hours} hours, ${minutes} minutes`);
        setMessage("hacking starts");
      } else if (now < hackingEnds) {
        const diff = hackingEnds.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        setTimeLeft(`${hours} hours, ${minutes} minutes`);
        setMessage("hacking ends");
      } else if (now < hackingEndsExtended) {
        const diff = hackingEndsExtended.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        setTimeLeft(`${hours} hours, ${minutes} minutes`);
        setMessage("hacking ends");
      } else {
        setTimeLeft("");
        setMessage("hacking has ended");
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Text
      textType="paragraph-lg"
      textColor="black"
      className="text-center mb-6 mt-4 px-4 sm:px-0"
    >
      {timeLeft && message !== "hacking has ended" ? (
        <>
          There are {timeLeft} left until {message}. Click on each block for
          more details about each workshop.
        </>
      ) : message === "hacking has ended" ? (
        <>
          Hacking has ended. Click on each block for more details about each
          workshop.
        </>
      ) : (
        <>Click on each block for more details about each workshop.</>
      )}
    </Text>
  );
}

export default function Schedule() {
  const { profile } = useAuth();
  const GRASSCOUNT = 40;
  const legendItems = [
    { color: "#445EBA", label: "Announcements" },
    { color: "#680088", label: "Events" },
    { color: "#0A7837", label: "Ceremonies" },
    { color: "#E42027", label: "Workshops" },
    { color: "#0dc6de", label: "Activities" },
    { color: "#edc009", label: "Food" }
  ];

  return (
    <div className="sm:gap-0 gap-4 overflow-y-auto sm:overflow-hidden p-4 sm:p-8 bg-linear-to-b from-[#ACDCFD] via-[#B3E9FC] to-[#B9F2FC] min-h-screen sm:h-screen w-full flex flex-col justify-start sm:justify-center items-center text-center overflow-x-hidden">
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
      <div className="overflow-hidden fixed bottom-0 left-0 w-full flex justify-between items-end z-10">
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
        <div className="mt-20 sm:mt-0">
          <Text textType="heading-lg">Loading...</Text>
        </div>
      ) : profile.status.confirmed ? (
        <div className="flex flex-col sm:items-start items-center justify-start sm:justify-center z-10 w-full max-w-[2000px] mx-auto px-2 sm:px-4 mt-20 sm:mt-0">
          <Text textType="display" textColor="primary" className="text-center">
            Event Schedule
          </Text>
          <CountdownTimer />

          <div className="flex flex-col sm:flex-row w-full gap-4 sm:gap-8">
            <div className="flex gap-4 flex-col w-full sm:w-[75%]">
              <div className="w-full backdrop-blur-sm bg-[#FFFFFF80] h-[60vh] sm:h-[70vh] rounded-xl py-4 px-3 sm:px-6 flex flex-col items-start justify-start">
                <EventsList />
              </div>
            </div>
            <div className="flex gap-4 flex-col w-full sm:w-[25%] mb-8 sm:mb-0">
              <a
                href="/"
                className="w-full h-[50px] rounded-xl bg-[#1C6981] hover:bg-[#134b5c] shadow-lg flex items-center justify-center"
              >
                <Text
                  textType="paragraph-sm"
                  textColor="white"
                  className="cursor-pointer text-center"
                  textWeight="bold"
                >
                  <span className="flex flex-row font-bold items-center justify-center gap-2">
                    Dashboard <ArrowRight />
                  </span>
                </Text>
              </a>
              <div className="w-full flex flex-col backdrop-blur-sm bg-[#FFFFFF80] rounded-xl items-start justify-center p-4 sm:p-6">
                <Text
                  textType="heading-sm"
                  textColor="primary"
                  textWeight="bold"
                >
                  Legend
                </Text>
                <div className="flex flex-col mt-4 items-start gap-4">
                  {legendItems.map((item) => (
                    <div
                      key={item.label}
                      className="flex flex-row gap-2 items-center justify-center"
                    >
                      <div
                        className="h-[28px] w-[28px] rounded-md"
                        style={{ backgroundColor: item.color }}
                      />
                      <Text textType="subtitle-sm" textColor="primary">
                        {item.label}
                      </Text>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-20 sm:mt-0">
          <Text textType="heading-lg">
            You do not have permission to view this page...
          </Text>
        </div>
      )}
    </div>
  );
}
