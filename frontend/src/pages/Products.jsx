import React from 'react';
import useUserStore from '../store/useUserStore';
import useLogout from '../hooks/useLogout';

const Products = () => {
  const { handleLogout, handleLogoutAll } = useLogout();

  const user = useUserStore((state) => state.user);

  return (
    <>
      <div>
        Welcome <u>{user?.username}</u> to prodcuts page!
      </div>
      <br />
      <button onClick={handleLogout}>Logout</button>
      <br />
      <button onClick={handleLogoutAll}>Logout All Devices</button>
    </>
  );
};

export default Products;
