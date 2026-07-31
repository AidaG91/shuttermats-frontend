import { useAsync } from "../../../shared/hooks/useAsync";
import { getActiveExtras } from "../services/coverageExtrasService";

export function useCoverageExtras() {
  const { data, loading, error } = useAsync(() => getActiveExtras(), []);

  return { extras: data ?? [], loading, error: error?.message ?? null };
}
