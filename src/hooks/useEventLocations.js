import { useAsync } from "./useAsync";
import { getEventLocations } from "../services/eventsService";

export function useEventLocations() {
  const { data, error } = useAsync(() => getEventLocations(), []);

  return { locations: data ?? [], error: error?.message ?? null };
}
