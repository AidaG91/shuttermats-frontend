import { useEffect, useState } from "react";

export function useEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/events")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      });
  }, []);

  return { events, loading };
}
