import React from 'react';
import useUserStore from '../store/useUserStore';
import useLogout from '../hooks/useLogout';
import Header from '../components/Header';
import ProductsGrid from '../layouts/ProductGrid';

const Dashboard = () => {
  const { handleLogout, handleLogoutAll } = useLogout();

  const user = useUserStore((state) => state.user);

  return (
    <>
      <Header />
      <br></br>
      <div className="dashboard-container">
        <h1 className="text-2xl font-bold text-center mb-6">Products</h1>
        <ProductsGrid />
      </div>
    </>
  );
};

export default Dashboard;
