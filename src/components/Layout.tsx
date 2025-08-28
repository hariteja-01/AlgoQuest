import React from 'react';
import NavLayout from './NavLayout';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <NavLayout>
      {children}
    </NavLayout>
  );
};

export default Layout;