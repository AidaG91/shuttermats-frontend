import { useCallback, useEffect, useState } from "react";
import { getAdminContactMessages } from "../services/adminContactMessageService";

const DEFAULT_POLL_INTERVAL_MS = 30000;

/**
 * Counts unread contact messages to drive the notification badge in the
 * admin sidebar. Uses lightweight polling since we don't have
 * websockets/SSE; if message volume grows, this is the first thing to
 * replace with a real push from the backend.
 */
export function useUnreadContactMessagesCount(pollIntervalMs = DEFAULT_POLL_INTERVAL_MS) {
  const [count, setCount] = useState(0);

  const fetchCount = useCallback(() => {
    getAdminContactMessages({ read: false, page: 0, size: 1 })
      .then((data) => setCount(data?.totalElements ?? 0))
      .catch(() => {
        // If this fails (expired session, network, etc.) don't break the
        // sidebar, just keep the last known value.
      });
  }, []);

  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, pollIntervalMs);
    return () => clearInterval(interval);
  }, [fetchCount, pollIntervalMs]);

  return count;
}
