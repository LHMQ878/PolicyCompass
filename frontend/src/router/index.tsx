import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Spin } from 'antd';
import MainLayout from '@/layouts/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'));
const EnterpriseProfilePage = lazy(() => import('@/pages/profile/EnterpriseProfilePage'));
const TalentProfilePage = lazy(() => import('@/pages/profile/TalentProfilePage'));
const ParkProfilePage = lazy(() => import('@/pages/profile/ParkProfilePage'));
const PolicyListPage = lazy(() => import('@/pages/policy/PolicyListPage'));
const PolicyDetailPage = lazy(() => import('@/pages/policy/PolicyDetailPage'));
const MatchResultPage = lazy(() => import('@/pages/matching/MatchResultPage'));
const GapAnalysisPage = lazy(() => import('@/pages/matching/GapAnalysisPage'));
const GrowthNavigatorPage = lazy(() => import('@/pages/matching/GrowthNavigatorPage'));
const MaterialsPage = lazy(() => import('@/pages/application/MaterialsPage'));
const GenerateMaterialPage = lazy(() => import('@/pages/application/GenerateMaterialPage'));
const ApplicationRecordsPage = lazy(() => import('@/pages/application/ApplicationRecordsPage'));
const CollaborationPage = lazy(() => import('@/pages/collaboration/CollaborationPage'));
const MessageCenterPage = lazy(() => import('@/pages/message/MessageCenterPage'));
const InvestmentPage = lazy(() => import('@/pages/park/InvestmentPage'));
const PolicyPushPage = lazy(() => import('@/pages/park/PolicyPushPage'));
const InsightsPage = lazy(() => import('@/pages/park/InsightsPage'));

const Loading = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <Spin size="large" />
  </div>
);

const AppRouter: React.FC = () => (
  <Suspense fallback={<Loading />}>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/profile/enterprise" element={<EnterpriseProfilePage />} />
          <Route path="/profile/talent" element={<TalentProfilePage />} />
          <Route path="/profile/park" element={<ParkProfilePage />} />
          <Route path="/policies" element={<PolicyListPage />} />
          <Route path="/policies/:id" element={<PolicyDetailPage />} />
          <Route path="/matching" element={<MatchResultPage />} />
          <Route path="/matching/gap/:policyId" element={<GapAnalysisPage />} />
          <Route path="/matching/growth" element={<GrowthNavigatorPage />} />
          <Route path="/application/materials" element={<MaterialsPage />} />
          <Route path="/application/generate/:policyId" element={<GenerateMaterialPage />} />
          <Route path="/application/records" element={<ApplicationRecordsPage />} />
          <Route path="/collaboration" element={<CollaborationPage />} />
          <Route path="/messages" element={<MessageCenterPage />} />
          <Route path="/park/investment" element={<InvestmentPage />} />
          <Route path="/park/policy-push" element={<PolicyPushPage />} />
          <Route path="/park/insights" element={<InsightsPage />} />
        </Route>
      </Route>
    </Routes>
  </Suspense>
);

export default AppRouter;
