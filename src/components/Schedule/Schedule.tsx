"use client";

import { useEvents } from "../../hooks/useEvents";
import Event from "./Event";
import { useState, useCallback } from "react";
import Text from "../Text/Text";
import { format } from "date-fns";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { EventFields } from "../../api/airtable";
import { useEffect } from "react";
import Modal from "./Modal";
import ModalPortal from "./ModalPortal";

export default function EventsList() {
  const parseTime = useCallback(
    (iso: string) => new Date(iso.replace(/Z$/, "")),
    []
  );
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
    "Workshops"
  ];

  const TYPE_BORDER: Record<string, string> = {
    Announcements: "#445EBA",
    Events: "#680088",
    Ceremonies: "#0A7837",
    Activities: "#0dc6de",
    Food: "#edc009",
    Workshops: "#E42027"
  };

  const [selected, setSelected] = useState<EventFields | null>(null);
  const [date, setDate] = useState("2025-07-18");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterItem, setFilterItem] = useState("");
  const [nowRow, setNowRow] = useState<number | null>(null);

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
        ...endDates.map((d) =>
          d.getMinutes() ? d.getHours() + 1 : d.getHours()
        )
      )
    : 20;

  const HOURS = Array.from(
    { length: latestHour - earliestHour + 1 },
    (_, i) => earliestHour + i
  );
  const TOTAL_SLOTS = HOURS.length * PERIODS_PER_HOUR;

  const getRowStart = useCallback(
    (ts: string) => {
      const d = parseTime(ts);
      const hourIdx = d.getHours() - HOURS[0];
      const minuteSlot = Math.floor(d.getMinutes() / (60 / PERIODS_PER_HOUR));
      return hourIdx * PERIODS_PER_HOUR + minuteSlot + 1;
    },
    [HOURS, PERIODS_PER_HOUR, parseTime]
  );

  const getRowSpan = (startTs: string, endTs: string) => {
    const diffMs = parseTime(endTs).getTime() - parseTime(startTs).getTime();
    const slotMinutes = 60 / PERIODS_PER_HOUR;
    return Math.max(1, Math.ceil(diffMs / (1000 * 60 * slotMinutes)));
  };

  useEffect(() => {
    console.log(new Date());
    const todayStr = format(new Date(), "yyyy-MM-dd");
    if (date !== todayStr) {
      setNowRow(null);
      return;
    }

    const updateLine = () => {
      setNowRow(getRowStart(new Date().toString()));
    };

    updateLine();
    const timer = setInterval(updateLine, 60_000);
    return () => clearInterval(timer);
  }, [date, earliestHour, latestHour, HOURS, getRowStart]);

  if (loading) return <p>Loading events…</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  const filtered = events.filter((ev) =>
    filterItem ? ev.fields.Type === filterItem : true
  );
  const sorted = [...filtered].sort(
    (a, b) =>
      parseTime(a.fields.Start).getTime() - parseTime(b.fields.Start).getTime()
  );

  const overlapInfo = sorted.reduce(
    (acc, ev, _, arr) => {
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
    },
    {} as Record<string, { count: number; index: number }>
  );

  return (
    <div className="w-full">
      <div className="flex mb-4">
        {EVENTDATES.map((d) => (
          <div
            key={d}
            className="flex-1 text-center cursor-pointer"
            onClick={() => setDate(d)}
            style={{
              borderBottom: `${date === d ? "3px #F47F1F" : "1px black"} solid`
            }}
          >
            <Text textType="paragraph-lg" textColor="primary" className="py-3">
              <span
                style={{
                  color: date === d ? "#F47F1F" : "#08566B",
                  fontWeight: date === d ? 600 : 400
                }}
              >
                {format(parseDate(d), "EEE. MMM d")}
              </span>
            </Text>
          </div>
        ))}
      </div>

      <div
        className="flex items-center gap-2 mb-2 cursor-pointer"
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
              filterItem === ""
                ? "bg-[#F47F1F] text-white"
                : "bg-white text-black"
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
                className={`px-3 rounded-full text-sm font-medium text-white
                }`}
                style={{
                  backgroundColor: isActive ? "#F47F1F" : TYPE_BORDER[type]
                }}
              >
                {type}
              </button>
            );
          })}
        </div>
      )}

      <div
        className="relative grid grid-cols-[80px_1fr] gap-[1px] w-full"
        style={{ gridTemplateRows: `repeat(${TOTAL_SLOTS}, ${SLOT_HEIGHT}px)` }}
      >
        {HOURS.map((h, i) => (
          <div
            key={h}
            className="text-left text-sm text-[#08566B] font-bold"
            style={{
              gridColumn: 1,
              gridRow: `${i * PERIODS_PER_HOUR + 1} / span ${PERIODS_PER_HOUR}`
            }}
          >
            {h < 12 ? `${h} AM` : h === 12 ? "12 PM" : `${h - 12} PM`}
          </div>
        ))}

        {sorted.map(({ id, fields }) => {
          const startRow = getRowStart(fields.Start);
          const span = getRowSpan(fields.Start, fields.End);
          const { count, index } = overlapInfo[id];
          const slotWidth = Math.max(100 / count, 40);
          const leftOffset = index * slotWidth;
          return (
            <div
              onClick={() => setSelected(fields)}
              key={id}
              className="px-1"
              style={{
                gridColumn: 2,
                gridRow: `${startRow} / span ${span}`,
                width: `${slotWidth}%`,
                marginLeft: `${leftOffset}%`
              }}
            >
              <Event
                type={fields.Type}
                name={fields.Name}
                start={fields.Start}
                end={fields.End}
                location={fields.Location ?? "TBD"}
                description={fields.Description}
                height={
                  fields.Name == "Hacking Begins"
                    ? 8 * SLOT_HEIGHT + "px"
                    : span * SLOT_HEIGHT + "px"
                }
              />
            </div>
          );
        })}
        {nowRow && (
          <div
            className="absolute left-[80px] right-0 flex items-center pointer-events-none w-full"
            style={{ gridRow: `${nowRow} / span 1` }}
          >
            <div className="w-[12px] h-[12px] bg-red-500 rounded-full" />
            <div className="flex-1 h-[3px] w-full bg-red-500" />
          </div>
        )}
      </div>

      {selected && (
        <ModalPortal>
          <Modal
            type={selected.Type}
            name={selected.Name}
            date={date}
            start={selected.Start}
            end={selected.End}
            location={selected.Location ?? "TBD"}
            description={selected.Description}
            onClose={() => setSelected(null)}
          />
        </ModalPortal>
      )}
    </div>
  );
}
