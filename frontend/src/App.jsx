import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './router/ProtectedRoute';
import Products from './pages/Products';
import { getMe } from './services/userService';
import useUserStore from './store/useUserStore';

const App = () => {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await getMe();
        setUser(response.data.user);
      } catch (error) {
        clearUser();
      } finally {
        setChecking(false);
      }
    };

    verifyUser();
  }, []);

  if (checking) return null; // or a spinner

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/products"
          element={
            <PrivateRoute>
              <Products />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
