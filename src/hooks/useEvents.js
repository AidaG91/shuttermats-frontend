import { useEffect, useState } from "react";

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

  useEffect(() => {
    setLoading(true);

    const params = new URLSearchParams({ page, size, sort });
    if (status && status !== "all") params.set("status", status);
    if (location) params.set("location", location);

    fetch(`http://localhost:8080/api/events?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, [status, location, page, size, sort]);

  return { ...data, loading };
}
