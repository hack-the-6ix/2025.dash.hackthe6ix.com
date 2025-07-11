import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchHt6, type ApiResponse } from "../../api/client.ts";
import Text from "../../components/Text/Text";
import cloudSVG from "../../assets/cloudsLaptop.svg";
import cloudPhoneSVG from "../../assets/cloudsPhone.svg";
import cloudMiddle from "../../assets/cloudMiddle.svg";
import firefly from "../../assets/firefly.svg";
import grassSVG from "../../assets/grass.svg";
import tree1SVG from "../../assets/tree1.svg";

function DiscordLink() {
  const [error, setError] = useState<{
    message: string;
    status: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getOAuthLink = async () => {
      try {
        const response = await fetchHt6<
          ApiResponse<string>,
          { redirectUrl: string }
        >("/api/action/discordOAuthUrl", {
          method: "POST",
          body: {
            redirectUrl:
              window.location.protocol +
              "//" +
              window.location.host +
              "/discord/callback"
          }
        });

        if (response.message && response.message.startsWith("http")) {
          window.location.href = response.message;
          return;
        }

        setError({
          message: (response.message as string) || "Unknown Error",
          status: response.status
        });
      } catch (err: any) {
        setError({
          message: err.message || "Unknown Error",
          status: err.status || 501
        });
      } finally {
        setLoading(false);
      }
    };

    getOAuthLink();
  }, []);

  if (error) {
    return (
      <div className="relative min-h-screen w-full flex flex-col justify-center items-center text-center overflow-x-hidden bg-gradient-to-b from-[#ACDCFD] via-[#B3E9FC] to-[#B9F2FC] p-8">
        <img
          src={cloudSVG}
          alt="Cloud"
          className="absolute w-full top-0 left-0 hidden sm:block pointer-events-none select-none"
        />
        <img
          src={cloudPhoneSVG}
          alt="Cloud"
          className="absolute w-full top-[80px] left-0 sm:hidden block pointer-events-none select-none"
        />
        <img
          src={cloudMiddle}
          alt="Cloud"
          className="absolute w-1/3 top-[290px] left-1/2 -translate-x-1/2 block pointer-events-none select-none"
        />
        <img
          src={firefly}
          alt="firefly"
          className="absolute w-1/3 top-[-5rem] left-[10%] block pointer-events-none select-none"
        />
        <img
          src={firefly}
          alt="firefly"
          className="absolute w-1/3 top-[5rem] right-[10%] block pointer-events-none select-none"
        />
        <div className="overflow-hidden absolute bottom-0 left-0 w-full flex justify-between items-end pointer-events-none select-none">
          {Array.from({ length: 40 }).map((_, index) => (
            <img
              key={index}
              src={grassSVG}
              alt="Grass"
              className="sm:h-[118px] sm:w-[78px] h-[46px] w-[30px]"
            />
          ))}
        </div>
        <div className="w-full overflow-hidden absolute top-0 left-0 h-full sm:flex hidden pointer-events-none select-none">
          <img
            src={tree1SVG}
            alt="Pine tree"
            className="absolute h-[300px] w-[300px] bottom-[80px] right-[30px]"
          />
        </div>
        <div className="flex flex-col items-center justify-center z-10 w-full max-w-[400px] mx-auto px-4">
          <div className="w-10 h-10 rounded-full bg-[#e74c3c] flex items-center justify-center text-white text-xl mb-2">
            ✕
          </div>
          <Text textType="heading-sm" textColor="orange">
            Something is bonked D:
          </Text>
          <Text textType="paragraph-lg" textColor="secondary">
            Looks like something unexpected has happened. Please reload the page
            or try again later...
          </Text>
          <Text textType="paragraph-sm" textColor="secondary">
            [{error.status} - {error.message}]
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-center items-center text-center overflow-x-hidden bg-gradient-to-b from-[#ACDCFD] via-[#B3E9FC] to-[#B9F2FC] p-8">
      <img
        src={cloudSVG}
        alt="Cloud"
        className="absolute w-full top-0 left-0 hidden sm:block pointer-events-none select-none"
      />
      <img
        src={cloudPhoneSVG}
        alt="Cloud"
        className="absolute w-full top-[80px] left-0 sm:hidden block pointer-events-none select-none"
      />
      <img
        src={cloudMiddle}
        alt="Cloud"
        className="absolute w-1/3 top-[290px] left-1/2 -translate-x-1/2 block pointer-events-none select-none"
      />
      <img
        src={firefly}
        alt="firefly"
        className="absolute w-1/3 top-[-5rem] left-[10%] block pointer-events-none select-none"
      />
      <img
        src={firefly}
        alt="firefly"
        className="absolute w-1/3 top-[5rem] right-[10%] block pointer-events-none select-none"
      />
      <div className="overflow-hidden absolute bottom-0 left-0 w-full flex justify-between items-end pointer-events-none select-none">
        {Array.from({ length: 40 }).map((_, index) => (
          <img
            key={index}
            src={grassSVG}
            alt="Grass"
            className="sm:h-[118px] sm:w-[78px] h-[46px] w-[30px]"
          />
        ))}
      </div>
      <div className="w-full overflow-hidden absolute top-0 left-0 h-full sm:flex hidden pointer-events-none select-none">
        <img
          src={tree1SVG}
          alt="Pine tree"
          className="absolute h-[300px] w-[300px] bottom-[80px] right-[30px]"
        />
      </div>
      <div className="flex flex-col items-center justify-center z-10 w-full max-w-[400px] mx-auto px-4">
        <div className="w-10 h-10 border-4 border-[#f3f3f3] border-t-[#3498db] rounded-full animate-spin mb-2" />
        <Text textType="heading-sm" textColor="primary">
          Hang in there!
        </Text>
        <Text textType="paragraph-lg" textColor="secondary">
          You'll be redirected shortly...
        </Text>
      </div>
    </div>
  );
}

export default DiscordLink;
