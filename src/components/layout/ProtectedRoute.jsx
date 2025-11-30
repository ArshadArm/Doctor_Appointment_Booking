import { Navigate } from "react-router-dom";
import { useAuth } from "../../services/auth.service";

export default function ProtectedRoute({ children, role }) {
  const { user } = useAuth();

  // Not logged in → redirect to login
  if (!user) return <Navigate to="/login" replace />;

  // If a role is required but user's role doesn't match → redirect
  if (role && user.role !== role) {
    switch (user.role) {
      case "admin":
        return <Navigate to="/admin" replace />;
      case "doctor":
        return <Navigate to="/doctor" replace />;
      default:
        return <Navigate to="/patient" replace />;
    }
  }

  return children;
}