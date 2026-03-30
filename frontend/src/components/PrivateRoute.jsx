import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../services/api';
import { getAccessToken, clearAccessToken } from '../utils/tokenStore';

const PrivateRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      const token = getAccessToken();

      if (!token) {
        setIsAuthorized(false);
        setLoading(false);
        return;
      }

      try {
        // Try a simple request to verify token
        await api.get('/products'); // or any lightweight protected endpoint
        setIsAuthorized(true);
      } catch (err) {
        if (err.response?.status === 401) {
          clearAccessToken(); // token missing or expired
        }
        setIsAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!isAuthorized) return <Navigate to="/login" replace />;

  return children;
};

export default PrivateRoute;
