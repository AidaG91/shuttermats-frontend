import { useEffect, useState } from "react";
import { getEventLocations } from "../services/eventsService";

export function useEventLocations() {
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    getEventLocations()
      .then((result) => {
        if (!cancelled) setLocations(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { locations, error };
}
