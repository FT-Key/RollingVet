import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Puedes usar un spinner o cualquier otro indicador de carga
  }

  if (!user) {
    return <Navigate to="/inicioSesion" replace />;
  }

  const hasRequiredRole = () => {
    if (requiredRole) {
      if (typeof requiredRole === 'string') {
        return user.rol === requiredRole;
      } else if (Array.isArray(requiredRole)) {
        return requiredRole.includes(user.rol);
      }
    }
    return true;
  };

  if (requiredRole && !hasRequiredRole()) {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
};

export default ProtectedRoute;