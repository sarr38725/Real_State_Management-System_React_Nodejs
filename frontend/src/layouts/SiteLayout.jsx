import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/nav/Navbar';
import Footer from '../components/nav/Footer';

const SiteLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default SiteLayout;