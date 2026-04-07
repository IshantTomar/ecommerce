import React from 'react';
import useUserStore from '../store/useUserStore';
import useLogout from '../hooks/useLogout';
import Header from '../components/Header';

const Dashboard = () => {
  const { handleLogout, handleLogoutAll } = useLogout();

  const user = useUserStore((state) => state.user);

  return (
    <>
      <Header />
      <div>{user?.email}</div>
      <div>{user?._id}</div>
      <br />
      <button onClick={handleLogout}>Logout</button>
      <br />
      <button onClick={handleLogoutAll}>Logout All Devices</button>
    </>
  );
};

export default Dashboard;
