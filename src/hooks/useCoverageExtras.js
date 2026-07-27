import { useEffect, useState } from "react";
import { getActiveExtras } from "../services/coverageExtrasService";

export function useCoverageExtras() {
  const [extras, setExtras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    getActiveExtras()
      .then((result) => {
        if (!cancelled) setExtras(result);
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
  }, []);

  return { extras, loading, error };
}
