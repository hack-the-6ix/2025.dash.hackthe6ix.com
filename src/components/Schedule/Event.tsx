import Text from "../Text/Text";

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
}: EventProps) {
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

  const words = name.split(/\s+/);
  const displayName =
    words.length > 7 ? words.slice(0, 7).join(" ") + "..." : name;

  return (
    <div
      className="
        w-full
        relative
        rounded-lg
        py-2
        sm:py-3
        pl-4
        sm:pl-6
        pr-1
        sm:pr-2
        items-start
        justify-start
        flex flex-col "
      style={{
        height: height,
        background: type == "Announcements" ? borderColor : "white",
      }}
    >
      <div
        className="h-full absolute top-0 left-0 w-[12px] sm:w-[15px]"
        style={{ background: borderColor }}
      ></div>
      <Text
        textType="paragraph-sm"
        textColor={type == "Announcements" ? "white" : "primary"}
        className="text-left"
      >
        <span className="font-semibold text-left text-[14px] md:text-sm">
          {displayName.toUpperCase()}
        </span>
      </Text>

      <Text
        textType="paragraph-sm"
        textColor={type == "Announcements" ? "white" : "primary"}
        className="mt-1 text-left"
      >
        <span className="font-light text-left text-[12px] md:text-sm">
          {startTime} – {endTime} @ {location}
        </span>
      </Text>
    </div>
  );
}
