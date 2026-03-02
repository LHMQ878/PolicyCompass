import React from 'react';
import { Card, Typography, Breadcrumb, Skeleton } from 'antd';

const ApplicationRecordsPage: React.FC = () => (
  <>
    <Breadcrumb items={[{ title: '首页' }, { title: '申报记录' }]} />
    <Typography.Title level={4} style={{ marginTop: 16 }}>我的申报</Typography.Title>
    <Card><Skeleton active paragraph={{ rows: 8 }} /></Card>
  </>
);

export default ApplicationRecordsPage;
