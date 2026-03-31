import { useNavigate } from 'react-router-dom';
import { logout, logoutAll } from '../services/authService';
import { clearAccessToken } from '../utils/tokenStore';
import useUserStore from '../store/useUserStore';

const useLogout = () => {
  const clearUser = useUserStore((state) => state.clearUser);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      // even if it fails, clear locally
    } finally {
      clearAccessToken();
      clearUser();
      navigate('/login');
    }
  };

  const handleLogoutAll = async () => {
    try {
      await logoutAll();
    } catch (error) {
      // even if it fails, clear locally
    } finally {
      clearAccessToken();
      clearUser();
      navigate('/login');
    }
  };

  return { handleLogout, handleLogoutAll };
};

export default useLogout;
