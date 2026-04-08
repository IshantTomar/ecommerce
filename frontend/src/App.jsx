import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './router/ProtectedRoute';
import SellerRoute from './router/SellerProtectedRoute';
import Products from './pages/Products';
import NotFound from './pages/NotFound';
import ManageProducts from './pages/ManageProducts';
import { getMe } from './services/userService';
import useUserStore from './store/useUserStore';
import UploadProduct from './pages/UploadProduct';

const App = () => {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);
  const [checking, setChecking] = useState(true);
  const [slowLoad, setSlowLoad] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setSlowLoad(true), 3000);

    const verifyUser = async () => {
      try {
        const response = await getMe();
        setUser(response.data.user);
      } catch (error) {
        clearUser();
      } finally {
        clearTimeout(timer);
        setSlowLoad(false);
        setChecking(false);
      }
    };

    verifyUser();
  }, []);

  if (checking)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3">
        {slowLoad && (
          <p className="text-gray-400 text-sm">
            Backend is waking up, this may take up to 60 seconds...
          </p>
        )}
      </div>
    );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<NotFound />} />

        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
        <Route
          path="/products/manage-products"
          element={
            <SellerRoute>
              <ManageProducts />
            </SellerRoute>
          }
        />
        <Route
          path="/products/upload-product"
          element={
            <SellerRoute>
              <UploadProduct />
            </SellerRoute>
          }
        />
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
