import { useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RedirectToLogin } from '../helpers/Redirects';
import Loading from './Loading';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      return;
    }
  
    if (!user) {
      RedirectToLogin({ navigate });
    } else if (requiredRole) {
      const hasRequiredRole = () => {
        if (typeof requiredRole === 'string') {
          return user.rol === requiredRole;
        } else if (Array.isArray(requiredRole)) {
          return requiredRole.includes(user.rol);
        }
        return true;
      };
  
      if (!hasRequiredRole()) {
        navigate('/NotFound');
      }
    }
  }, [loading, user, navigate, requiredRole]);  

  if (loading || !user) {
    return <Loading />;
  }

  return children;
};

export default ProtectedRoute;