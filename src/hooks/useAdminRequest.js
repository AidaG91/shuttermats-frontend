import { useEffect, useState } from "react";
import { getAdminRequestById } from "../services/adminRequestService";

export function useAdminRequest(id) {
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getAdminRequestById(id)
      .then((result) => {
        if (!cancelled) setRequest(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { request, loading, error };
}
