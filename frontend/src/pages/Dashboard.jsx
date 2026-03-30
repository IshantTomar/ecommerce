import React from 'react';
import useUserStore from '../store/useUserStore';

const Dashboard = () => {
  const user = useUserStore((state) => state.user);

  return (
    <>
      <div>{user?.email}</div>
      <div>{user?._id}</div>
    </>
  );
};

export default Dashboard;
