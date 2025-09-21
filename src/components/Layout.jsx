import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <>
      <Navbar />
      <main>
        {/* All your other page components will render here */}
        <Outlet />
      </main>
    </>
  );
};

export default Layout;