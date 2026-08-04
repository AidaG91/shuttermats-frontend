import { get, post, put, del } from "../../../shared/services/httpClient";
import { getAdminAuthHeaders } from "../../auth/services/authService";

export function getAdminPricingPlans() {
  return get("/admin/pricing-plans", undefined, getAdminAuthHeaders());
}

export function createPricingPlan(plan) {
  return post("/admin/pricing-plans", plan, getAdminAuthHeaders());
}

export function updatePricingPlan(id, plan) {
  return put(`/admin/pricing-plans/${id}`, plan, getAdminAuthHeaders());
}

export function deletePricingPlan(id) {
  return del(`/admin/pricing-plans/${id}`, getAdminAuthHeaders());
}
