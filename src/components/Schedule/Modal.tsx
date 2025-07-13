import Text from "../Text/Text";
import { FaClock, FaLocationArrow, FaCalendar, FaBook } from "react-icons/fa";
import { X } from "lucide-react";
import { PiMicrosoftOutlookLogoFill } from "react-icons/pi";
import { FaGoogle, FaApple } from "react-icons/fa";
import { format } from "date-fns";
import { useEffect, useState } from "react";

export interface EventProps {
  type: string;
  location: string;
  name: string;
  start: string;
  end: string;
  date: string;
  description?: string;
  onClose: () => void;
}

const TYPE_BORDER: Record<string, string> = {
  Announcements: "#445EBA",
  Events: "#680088",
  Ceremonies: "#0A7837",
  Activities: "#0dc6de",
  Food: "#edc009",
  Workshops: "#E42027",
};

export default function Modal({
  type,
  location,
  name,
  start,
  date,
  end,
  description,
  onClose,
}: EventProps) {
  const parseTime = (iso: string) => new Date(iso.replace(/Z$/, ""));
  const parseDate = (isoDate: string) => {
    const [year, month, day] = isoDate.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const borderColor = TYPE_BORDER[type] || "border-gray-400";
  const startTime = parseTime(start).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
  const endTime = parseTime(end).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
  const eventDate = parseDate(date);

  const googleLink = () => {
    const s = start.replace(/[-:]/g, "").split(".")[0];
    const e = end.replace(/[-:]/g, "").split(".")[0];
    const text = encodeURIComponent(name);
    const details = encodeURIComponent(description || "");
    return `https://calendar.google.com/calendar/r/eventedit?text=${text}&dates=${s}/${e}&details=${details}&location=${encodeURIComponent(location)}`;
  };

  const [icsUrl, setIcsUrl] = useState<string>("");
  useEffect(() => {
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      `DTSTART:${start.replace(/[-:]/g, "").split(".")[0]}`,
      `DTEND:${end.replace(/[-:]/g, "").split(".")[0]}`,
      `SUMMARY:${name}`,
      `DESCRIPTION:${description || ""}`,
      `LOCATION:${location}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const blob = new Blob([lines], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    setIcsUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [name, start, end, location, description]);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-xl w-full max-w-lg p-4 sm:p-6 relative flex flex-col items-start max-h-[90vh] overflow-y-auto"
        style={{ boxShadow: `0 4px 16px rgba(0,0,0,0.2)` }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X />
        </button>

        <Text
          textType="heading-lg"
          textColor="primary"
          textWeight="bold"
          className="text-left pr-8"
        >
          {name}
        </Text>
        <div
          className="h-[4px] w-24 mt-2 mb-6"
          style={{ background: borderColor }}
        />

        <div className="space-y-3 text-[#08566B] w-full">
          <div className="flex items-center gap-2">
            <FaClock size={16} />
            <Text textType="paragraph-sm" textColor="primary" textWeight="bold">
              {format(eventDate, "EEE. MMM d")} @ {startTime}–{endTime}
            </Text>
          </div>
          <div className="flex items-center gap-2">
            <FaLocationArrow size={16} />
            <Text textType="paragraph-sm" textColor="primary" textWeight="bold">
              {location}
            </Text>
          </div>
          {description && (
            <div className="flex items-start gap-2 w-full">
              <FaBook size={16} />
              <Text
                textType="paragraph-sm"
                textColor="primary"
                textWeight="bold"
                className="text-justify w-[90%]"
              >
                {description}
              </Text>
            </div>
          )}
          <div className="flex items-center gap-2">
            <FaCalendar size={16} />
            <Text textType="paragraph-sm" textColor="primary" textWeight="bold">
              Add to calendar:
            </Text>
          </div>
        </div>

        <div className="mt-4 w-full text-[#08566B] font-semibold">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href={googleLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-3 items-center justify-center px-3 py-2 border rounded-full hover:bg-gray-100"
            >
              <FaGoogle size={16} />
              Google Calendar
            </a>
            <a
              href={icsUrl}
              download={`${name}.ics`}
              className="flex gap-3 items-center justify-center px-3 py-2 border rounded-full hover:bg-gray-100"
            >
              <FaApple size={16} />
              Apple Calendar
            </a>
            <a
              href={icsUrl}
              download={`${name}.ics`}
              className="flex gap-3 items-center justify-center col-span-1 sm:col-span-2 px-3 py-2 border rounded-full hover:bg-gray-100"
            >
              <PiMicrosoftOutlookLogoFill size={16} />
              Outlook
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
