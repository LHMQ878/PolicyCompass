import React from 'react';
import { Card, Typography, Breadcrumb, Skeleton, Divider } from 'antd';
import { useParams } from 'react-router-dom';

const PolicyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  console.log('policyId:', id); // TODO: 使用 id 加载数据
  return (
    <>
      <Breadcrumb items={[{ title: '首页' }, { title: '政策库' }, { title: '政策详情' }]} />
      <Typography.Title level={4} style={{ marginTop: 16 }}>政策详情</Typography.Title>
      <Card style={{ marginBottom: 16 }}><Skeleton active /></Card>
      <Divider>申报条件</Divider>
      <Card style={{ marginBottom: 16 }}><Skeleton active /></Card>
      <Divider>我的匹配</Divider>
      <Card><Skeleton active /></Card>
    </>
  );
};

export default PolicyDetailPage;
