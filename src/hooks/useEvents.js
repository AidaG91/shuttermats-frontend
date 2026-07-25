import { useEffect, useState } from "react";
import { getEvents } from "../services/eventsService";

export function useEvents({
  status = "upcoming",
  location = "",
  page = 0,
  size = 6,
  sort = "date,asc",
} = {}) {
  const [data, setData] = useState({
    content: [],
    totalPages: 0,
    totalElements: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getEvents({ status, location, page, size, sort })
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [status, location, page, size, sort]);

  return { ...data, loading, error };
}
