import { useEffect, useState } from "react";
import { getEvents } from "../services/eventsService";

const INITIAL_STATE = {
  content: [],
  totalPages: 0,
  totalElements: 0,
  loading: true,
  error: null,
};

export function useEvents({
  status = "upcoming",
  location = "",
  page = 0,
  size = 6,
  sort = "date,asc",
} = {}) {
  const [state, setState] = useState(INITIAL_STATE);

  useEffect(() => {
    let cancelled = false;
    setState((previous) => ({ ...previous, loading: true, error: null }));

    getEvents({ status, location, page, size, sort })
      .then((result) => {
        if (!cancelled) {
          setState({ ...result, loading: false, error: null });
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setState((previous) => ({ ...previous, loading: false, error: err.message }));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [status, location, page, size, sort]);

  return state;
}
