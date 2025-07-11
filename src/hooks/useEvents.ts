import { useEffect, useState } from "react";
import { fetchEvents } from "../api/airtable";
import type { AirtableRecord, EventFields } from "../api/airtable";

export function useEvents(date: string) {
  const [events, setEvents] = useState<AirtableRecord<EventFields>[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let canceled = false;
    setLoading(true);
    setError(null);

    fetchEvents(date)
      .then((recs) => {
        if (!canceled) {
          setEvents(recs);
        }
      })
      .catch((err) => {
        if (!canceled) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (!canceled) {
          setLoading(false);
        }
      });

    return () => {
      canceled = true;
    };
  }, [date]);

  return { events, loading, error };
}
