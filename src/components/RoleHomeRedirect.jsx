import { Navigate } from "react-router-dom";
import { useIsAdmin } from "@/components/AdminRoute";
import Dashboard from "@/pages/Dashboard";

/**
 * Renders the customer Dashboard for regular users,
 * but redirects admins to the admin dashboard.
 */
export const RoleHomeRedirect = () => {
  const isAdmin = useIsAdmin();
  if (isAdmin) return <Navigate to="/admin" replace />;
  return <Dashboard />;
};