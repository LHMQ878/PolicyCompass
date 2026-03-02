import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Result } from 'antd';
import { useAuthStore } from '@/stores/authStore';
import type { UserRole } from '@/types';

interface RoleGuardProps {
  allowedRoles: UserRole[];
}

const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles }) => {
  const user = useAuthStore((s) => s.user);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (!allowedRoles.includes(user.role)) {
    return <Result status="403" title="无权访问" subTitle="您的角色无权访问此页面" />;
  }
  return <Outlet />;
};

export default RoleGuard;
