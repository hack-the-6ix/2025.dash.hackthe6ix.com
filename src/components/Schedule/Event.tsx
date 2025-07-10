"use client"
import Text from "../Text/Text";
import { useState } from "react";

export interface EventProps {
  type: string;
  location: string;
  name: string;
  start: string; // ISO datetime
  end: string; // ISO datetime
  description?: string;
  height: string;
}

const TYPE_BORDER: Record<string, string> = {
  Announcements: "#445EBA",
  Events: "#680088",
  Ceremonies: "#0A7837",
  Activities: "#0dc6de",
  Food: "#edc009",
  Workshops: "#E42027",
};

export default function Event({
  type,
  location,
  name,
  start,
  end,
  height,
  description,
}: EventProps) {
  const [selected, setSelected] = useState<EventProps | null>(null);

  const parseTime = (iso: string) => new Date(iso.replace(/Z$/, ""));
  const borderColor = TYPE_BORDER[type] || "border-gray-400";
  const startTime = parseTime(start).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
  const endTime = parseTime(end).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  if (type == "Announcements") {
    return (
      <div
        className="
        w-full
        relative
        bg-white/80
        rounded-lg
        py-3
        pl-8
        pr-3
        items-start
        flex flex-col"
        style={{ background: borderColor }}
      >
        <Text textType="subtitle-sm" textColor="white" textWeight="semi-bold">
          {name}
        </Text>

        <Text textType="subtitle-sm" textColor="white" className="mt-1">
          <span className="font-light">
            {startTime} – {endTime} @ {location}
          </span>
        </Text>
      </div>
    );
  }
  const words = name.split(/\s+/);
  const displayName =
    words.length > 7 ? words.slice(0, 7).join(" ") + "..." : name;

  return (
    <div
      className="
        w-full
        relative
        bg-white/80
        rounded-lg
        py-3
        pl-8
        pr-3
        items-start
        flex flex-col "
      style={{ height: height }}
    >
      <div
        className="h-full absolute top-0 left-0 w-[15px]"
        style={{ background: borderColor }}
      ></div>
      <Text textType="paragraph-lg" textColor="primary" textWeight="semi-bold">
        <span className="font-semibold">{displayName.toUpperCase()}</span>
      </Text>

      <Text
        textType="paragraph-sm"
        textColor="primary"
        textWeight="regular"
        className="mt-1 font-regular"
      >
        <span className="font-light">
          {startTime} – {endTime} @ {location}
        </span>
      </Text>
    </div>
    
  );
}
