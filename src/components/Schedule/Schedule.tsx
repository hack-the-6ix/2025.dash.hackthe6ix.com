"use client";

import { useEvents } from "../../hooks/useEvents";
import Event from "./Event";
import { useState } from "react";
import Text from "../Text/Text";
import { format } from "date-fns";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function EventsList() {
  const parseTime = (iso: string) => new Date(iso.replace(/Z$/, ""));
  const parseDate = (isoDate: string) => {
    const [year, month, day] = isoDate.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const types = [
    "Announcements",
    "Events",
    "Ceremonies",
    "Activities",
    "Food",
    "Workshops",
  ];

  const TYPE_BORDER: Record<string, string> = {
    Announcements: "#445EBA",
    Events: "#680088",
    Ceremonies: "#0A7837",
    Activities: "#0dc6de",
    Food: "#edc009",
    Workshops: "#E42027",
  };

  const [date, setDate] = useState("2025-07-18");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterItem, setFilterItem] = useState("");

  const { events, loading, error } = useEvents(date);

  const EVENTDATES = ["2025-07-18", "2025-07-19", "2025-07-20"];
  const PERIODS_PER_HOUR = 4;
  const SLOT_HEIGHT = 25; 

  const startDates = events.map((e) => parseTime(e.fields.Start));
  const endDates = events.map((e) => parseTime(e.fields.End));
  const earliestHour = startDates.length
    ? Math.min(...startDates.map((d) => d.getHours()))
    : 8;
  const latestHour = endDates.length
    ? Math.max(
        ...endDates.map((d) => (d.getMinutes() ? d.getHours() + 1 : d.getHours()))
      )
    : 20;

  const HOURS = Array.from(
    { length: latestHour - earliestHour + 1 },
    (_, i) => earliestHour + i
  );
  const TOTAL_SLOTS = HOURS.length * PERIODS_PER_HOUR;

  const getRowStart = (ts: string) => {
    const d = parseTime(ts);
    const hourIdx = d.getHours() - HOURS[0];
    const minuteSlot = Math.floor(d.getMinutes() / (60 / PERIODS_PER_HOUR));
    return hourIdx * PERIODS_PER_HOUR + minuteSlot + 1;
  };

  const getRowSpan = (startTs: string, endTs: string) => {
    const diffMs = parseTime(endTs).getTime() - parseTime(startTs).getTime();
    const slotMinutes = 60 / PERIODS_PER_HOUR;
    return Math.max(1, Math.ceil(diffMs / (1000 * 60 * slotMinutes)));
  };

  if (loading) return <p>Loading events…</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  const filtered = events.filter((ev) =>
    filterItem ? ev.fields.Type === filterItem : true
  );
  const sorted = [...filtered].sort(
    (a, b) => parseTime(a.fields.Start).getTime() - parseTime(b.fields.Start).getTime()
  );

  const overlapInfo = sorted.reduce((acc, ev, _, arr) => {
    const collisions = arr.filter((o) => {
      const s1 = parseTime(o.fields.Start).getTime();
      const e1 = parseTime(o.fields.End).getTime();
      const s2 = parseTime(ev.fields.Start).getTime();
      const e2 = parseTime(ev.fields.End).getTime();
      return s1 < e2 && s2 < e1;
    });
    const index = collisions.findIndex((o) => o.id === ev.id);
    acc[ev.id] = { count: collisions.length, index };
    return acc;
  }, {} as Record<string, { count: number; index: number }>);

  return (
    <div className="w-full">
      <div className="flex mb-4">
        {EVENTDATES.map((d) => (
          <div
            key={d}
            className="flex-1 text-center cursor-pointer"
            onClick={() => setDate(d)}
            style={{
              borderBottom: `${date === d ? "3px #F47F1F" : "1px black"} solid`,
            }}
          >
            <Text textType="paragraph-lg" textColor="primary" className="py-3">
              <span
                style={{
                  color: date === d ? "#F47F1F" : "#08566B",
                  fontWeight: date === d ? 600 : 400,
                }}
              >
                {format(parseDate(d), "EEE. MMM d")}
              </span>
            </Text>
          </div>
        ))}
      </div>

      <div
        className="flex items-center gap-2 mb-6 cursor-pointer"
        onClick={() => setFilterOpen((o) => !o)}
      >
        <Text textType="paragraph-sm" textColor="primary">
          Filter by type
        </Text>
        {filterOpen ? <ChevronUp /> : <ChevronDown />}
      </div>
      {filterOpen && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilterItem("")}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filterItem === "" ? "bg-[#F47F1F] text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            All
          </button>
          {types.map((type) => {
            const isActive = filterItem === type;
            return (
              <button
                key={type}
                onClick={() => setFilterItem(type)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isActive ? "text-white" : "bg-gray-200 text-gray-700"
                }`}
                style={{ backgroundColor: isActive ? TYPE_BORDER[type] : undefined }}
              >
                {type}
              </button>
            );
          })}
        </div>
      )}

      <div
        className="grid grid-cols-[80px_1fr] gap-[1px] w-full"
        style={{ gridTemplateRows: `repeat(${TOTAL_SLOTS}, ${SLOT_HEIGHT}px)` }}
      >
        {HOURS.map((h, i) => (
          <div
            key={h}
            className="text-left text-sm text-[#08566B] font-bold"
            style={{
              gridColumn: 1,
              gridRow: `${i * PERIODS_PER_HOUR + 1} / span ${PERIODS_PER_HOUR}`,
            }}
          >
            {h < 12 ? `${h} AM` : h === 12 ? "12 PM" : `${h - 12} PM`}
          </div>
        ))}

        {sorted.map(({ id, fields }) => {
          const startRow = getRowStart(fields.Start);
          const span = getRowSpan(fields.Start, fields.End);
          const { count, index } = overlapInfo[id];
          const slotWidth = 100 / count;
          const leftOffset = index * slotWidth;
          return (
            <div
              key={id}
              className="px-1"
              style={{
                gridColumn: 2,
                gridRow: `${startRow} / span ${span}`,
                width: `${slotWidth}%`,
                marginLeft: `${leftOffset}%`,
              }}
            >
              <Event
                type={fields.Type}
                name={fields.Name}
                start={fields.Start}
                end={fields.End}
                location={fields.Location ?? "TBD"}
                description={fields.Description}
                height={span*25+"px"}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
