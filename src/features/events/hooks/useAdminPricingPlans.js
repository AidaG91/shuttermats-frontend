import { useAsync } from "../../../shared/hooks/useAsync";
import { getAdminPricingPlans } from "../services/adminPricingPlansService";

export function useAdminPricingPlans() {
  const { data, loading, error, refetch } = useAsync(() => getAdminPricingPlans(), []);

  return { plans: data ?? [], loading, error, refetch };
}
