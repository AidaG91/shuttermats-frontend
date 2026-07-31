import { useAsync } from "../../../shared/hooks/useAsync";
import { getAdminRequests } from "../services/adminRequestService";

export function useAdminRequestList({ status = "", eventId = "", page = 0, size = 10 } = {}) {
  const { data, loading, error } = useAsync(
    () => getAdminRequests({ status, eventId, page, size }),
    [status, eventId, page, size],
  );

  return {
    content: data?.content ?? [],
    totalPages: data?.totalPages ?? 0,
    totalElements: data?.totalElements ?? 0,
    loading,
    error,
  };
}
