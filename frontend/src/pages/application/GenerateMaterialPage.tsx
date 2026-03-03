import React from 'react';
import { Card, Typography, Breadcrumb, Skeleton } from 'antd';
import { useParams } from 'react-router-dom';

const GenerateMaterialPage: React.FC = () => {
  const { policyId } = useParams<{ policyId: string }>();
  console.log('policyId:', policyId); // TODO: 使用 policyId 加载数据
  return (
    <>
      <Breadcrumb items={[{ title: '首页' }, { title: '申报中心' }, { title: '生成材料' }]} />
      <Typography.Title level={4} style={{ marginTop: 16 }}>生成申报材料</Typography.Title>
      <Card title="所需材料清单" style={{ marginBottom: 16 }}><Skeleton active /></Card>
      <Card title="AI 预审报告"><Skeleton active /></Card>
    </>
  );
};

export default GenerateMaterialPage;
