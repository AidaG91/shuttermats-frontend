import { useAsync } from "./useAsync";
import { getEvents } from "../services/eventsService";

export function useEvents({
  status = "upcoming",
  location = "",
  page = 0,
  size = 6,
  sort = "date,asc",
} = {}) {
  const { data, loading, error } = useAsync(
    () => getEvents({ status, location, page, size, sort }),
    [status, location, page, size, sort],
  );

  return {
    content: data?.content ?? [],
    totalPages: data?.totalPages ?? 0,
    totalElements: data?.totalElements ?? 0,
    loading,
    error: error?.message ?? null,
  };
}
