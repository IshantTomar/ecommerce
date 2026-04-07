import { Navigate } from 'react-router-dom';
import useUserStore from '../store/useUserStore';

const SellerRoute = ({ children }) => {
  const user = useUserStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'seller') {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default SellerRoute;
