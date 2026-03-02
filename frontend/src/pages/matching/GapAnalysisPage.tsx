import React from 'react';
import { Card, Typography, Breadcrumb, Skeleton } from 'antd';
import { useParams } from 'react-router-dom';

const GapAnalysisPage: React.FC = () => {
  const { policyId } = useParams<{ policyId: string }>();
  return (
    <>
      <Breadcrumb items={[{ title: '首页' }, { title: '政策匹配' }, { title: '卡点分析' }]} />
      <Typography.Title level={4} style={{ marginTop: 16 }}>卡点分析</Typography.Title>
      <Card><Skeleton active paragraph={{ rows: 8 }} /></Card>
    </>
  );
};

export default GapAnalysisPage;
