import React from 'react';
import { Card, Typography, Breadcrumb, Skeleton } from 'antd';

const GrowthNavigatorPage: React.FC = () => (
  <>
    <Breadcrumb items={[{ title: '首页' }, { title: '成长导航' }]} />
    <Typography.Title level={4} style={{ marginTop: 16 }}>成长导航仪</Typography.Title>
    <Card title="当前位置" style={{ marginBottom: 16 }}><Skeleton active /></Card>
    <Card title="推荐成长路径"><Skeleton active paragraph={{ rows: 10 }} /></Card>
  </>
);

export default GrowthNavigatorPage;
