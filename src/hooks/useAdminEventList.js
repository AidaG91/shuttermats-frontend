import { useAsync } from "./useAsync";
import { getEvents } from "../services/eventsService";

const PAGE_SIZE = 10;

export function useAdminEventList({ page = 0, size = PAGE_SIZE } = {}) {
  const { data, loading, error, refetch } = useAsync(
    () => getEvents({ status: "all", page, size, sort: "date,desc" }),
    [page, size],
  );

  return {
    content: data?.content ?? [],
    totalPages: data?.totalPages ?? 0,
    totalElements: data?.totalElements ?? 0,
    loading,
    error,
    refetch,
  };
}
