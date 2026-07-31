import { useAsync } from "../../../shared/hooks/useAsync";
import { getAdminContactMessages } from "../services/adminContactMessageService";

export function useAdminContactMessageList({ read, page = 0, size = 10 } = {}) {
  const { data, loading, error, refetch } = useAsync(
    () => getAdminContactMessages({ read, page, size }),
    [read, page, size],
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
