import { useAsync } from "../../../shared/hooks/useAsync";
import { getEventById } from "../services/eventsService";

export function useEvent(eventId) {
  const { data, loading, error } = useAsync(
    () => (eventId ? getEventById(eventId) : Promise.resolve(null)),
    [eventId],
  );

  return { event: data ?? null, loading, error: error?.message ?? null };
}
