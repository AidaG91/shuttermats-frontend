import { useEffect, useState } from "react";
import { getAdminRequests } from "../services/adminRequestService";

const INITIAL_STATE = {
  content: [],
  totalPages: 0,
  totalElements: 0,
  loading: true,
  error: null,
};

export function useAdminRequests({ status = "", eventId = "", page = 0, size = 10 } = {}) {
  const [state, setState] = useState(INITIAL_STATE);

  useEffect(() => {
    let cancelled = false;
    setState((previous) => ({ ...previous, loading: true, error: null }));

    getAdminRequests({ status, eventId, page, size })
      .then((result) => {
        if (!cancelled) {
          setState({ ...result, loading: false, error: null });
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setState((previous) => ({ ...previous, loading: false, error: err }));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [status, eventId, page, size]);

  return state;
}
