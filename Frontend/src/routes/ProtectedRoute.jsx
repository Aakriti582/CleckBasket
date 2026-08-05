import { Navigate, Outlet } from "react-router-dom";
import { useCurrentUser } from "../hooks/useCurrentUser";

export default function ProtectedRoute({ allowedRoles }) {
  const { data: user, isLoading, isError } = useCurrentUser();

  if (isLoading) return null;
  if (isError || !user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role))
    return <Navigate to="/" replace />;

  return <Outlet />;
}