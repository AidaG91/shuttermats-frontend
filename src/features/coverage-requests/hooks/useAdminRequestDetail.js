import { useAsync } from "../../../shared/hooks/useAsync";
import { getAdminRequestById } from "../services/adminRequestService";

export function useAdminRequestDetail(id) {
  const { data, loading, error } = useAsync(() => getAdminRequestById(id), [id]);

  return { request: data ?? null, loading, error };
}
