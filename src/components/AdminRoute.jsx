import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

export const useIsAdmin = () => {
  const { roles } = useAuth();
  return roles.some((r) => r.toLowerCase() === "admin");
};

export const AdminRoute = ({ children }) => {
  const { isAuthenticated, isLoading, roles } = useAuth();
  const isAdmin = roles.some((r) => r.toLowerCase() === "admin");

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
};