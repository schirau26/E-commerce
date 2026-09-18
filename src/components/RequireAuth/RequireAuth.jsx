import { Navigate, useLocation } from "react-router-dom";
import { loginPath, useAuth } from "../../context/AuthContext";

export default function RequireAuth({ children, cartOnly = false }) {
  const { canBrowse, canCart } = useAuth();
  const location = useLocation();
  const next = `${location.pathname}${location.search}`;

  if (cartOnly && !canCart) {
    return <Navigate to={loginPath(next)} replace />;
  }

  if (!canBrowse) {
    return <Navigate to={loginPath(next)} replace />;
  }

  return children;
}
