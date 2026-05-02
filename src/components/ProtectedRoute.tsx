import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ReactNode } from "react";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex min-h-screen items-center justify-center text-muted-foreground tracking-editorial text-xs uppercase">Loading</div>;
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
};
