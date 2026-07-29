import { useAsync } from "./useAsync";
import { getActiveExtras } from "../services/coverageExtrasService";

export function useCoverageExtras() {
  const { data, loading, error } = useAsync(() => getActiveExtras(), []);

  return { extras: data ?? [], loading, error: error?.message ?? null };
}
