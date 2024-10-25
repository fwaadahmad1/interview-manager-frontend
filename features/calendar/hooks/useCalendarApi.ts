import ApiClient from "@/lib/api/ApiClient";
import { useCalendarStore } from "@/stores/useCalendarStore";
import { useEffect, useState } from "react";
import { Interview } from "../models/interview";
import FilteredEventsRequest from "../models/request/filtered-event.request";
import FilteredEventsResponse from "../models/response/filtered-event.response";

const useCalendarApi = () => {
  const [events, setEvents] = useState<Interview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { selectedDate } = useCalendarStore();

  useEffect(() => {
    const { from, to } =
      selectedDate instanceof Date
        ? { from: selectedDate, to: selectedDate }
        : selectedDate;

    if (!from || !to) {
      return;
    }
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await ApiClient.post<
          FilteredEventsRequest,
          FilteredEventsResponse
        >("/interviews/filteredInterview", {
          from: from?.toISOString(),
          to: to?.toISOString(),
        });
        setEvents(response.data.interviews);
      } catch {
        setError("Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [selectedDate]);

  return { events, loading, error };
};

export default useCalendarApi;
