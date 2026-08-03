import { useAsync } from "../../../shared/hooks/useAsync";
import { getAdminContactMessageById } from "../services/adminContactMessageService";

export function useAdminContactMessageDetail(id) {
  const { data, loading, error, refetch } = useAsync(
    () => getAdminContactMessageById(id),
    [id],
  );

  return { message: data ?? null, loading, error, refetch };
}
