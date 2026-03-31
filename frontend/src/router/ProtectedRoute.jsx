import { Navigate } from 'react-router-dom';
import useUserStore from '../store/useUserStore';

const ProtectedRoute = ({ children }) => {
  const user = useUserStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
