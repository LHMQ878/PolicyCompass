import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout: React.FC = () => (
  <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
    <Outlet />
  </div>
);

export default AuthLayout;
