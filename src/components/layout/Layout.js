//** Layout component defining the general page structure: Header, main content, and Footer **//

import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

//** Define and export the Layout component **//
const Layout = () => {
  return (
    <div>
      {/* Header area */}
      <Header />

      {/* Main content area */}
      <div style={{ minHeight: '80vh' }}>
        <Outlet />
      </div>

      {/* Footer area */}
      <Footer />
    </div>
  );
};

export default Layout;
