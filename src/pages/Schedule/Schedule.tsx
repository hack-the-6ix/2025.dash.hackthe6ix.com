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

      {!profile ? (
        <div>
          <Text textType="heading-lg">Loading...</Text>
        </div>
      ) : profile.status.confirmed ? (
        <div className="flex flex-col sm:items-start items-center justify-center z-10 w-full max-w-[1150px] mx-auto px-4">
          <Text textType="display" textColor="primary" className="text-center">
            Event Schedule
          </Text>
          <Text
            textType="paragraph-lg"
            textColor="black"
            className="text-center mb-6 mt-4"
          >
            There are [x days] left until the hackathon begins. Click on each
            block for more details about each workshop.
          </Text>

          <div className="h-full flex flex-row w-full gap-8">
            <div className="flex gap-4 flex-col w-[75%]">
              <div className="overflow-scroll w-full backdrop-blur-sm bg-[#FFFFFF80] h-[70vh] rounded-xl py-4 px-6 flex flex-col items-start justify-start">
                <EventsList />
              </div>
            </div>
            <div className="flex gap-4 h-full flex-col w-[25%]">
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
              <div className="w-full flex flex-col backdrop-blur-sm bg-[#FFFFFF80] rounded-xl items-start justify-center p-6">
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
        <div>
          <Text textType="heading-lg">
            You do not have permission to view this page...
          </Text>
        </div>
      )}
    </div>
  );
}
