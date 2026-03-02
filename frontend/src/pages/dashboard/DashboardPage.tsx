import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, Typography, Spin } from 'antd';
import { FileTextOutlined, AimOutlined, CloudUploadOutlined, BellOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/stores/authStore';
import { listPolicies } from '@/services/policyApi';
import { listApplications } from '@/services/applicationApi';
import { listMessages } from '@/services/messageApi';

const DashboardPage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const [stats, setStats] = useState({ policies: 0, applications: 0, unread: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [pRes, aRes, mRes]: any[] = await Promise.all([
          listPolicies({ page_size: 1 }),
          listApplications(),
          listMessages({ is_read: false, page_size: 1 }),
        ]);
        setStats({
          policies: pRes?.data?.total ?? 0,
          applications: Array.isArray(aRes?.data) ? aRes.data.length : 0,
          unread: Array.isArray(mRes?.data) ? mRes.data.length : 0,
        });
      } catch { /* ignore */ }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', paddingTop: 100 }}><Spin size="large" /></div>;
  }

  const roleLabel: Record<string, string> = {
    talent: '科技人才',
    tech_enterprise: '科技企业',
    transform_enterprise: '转型企业',
    park: '园区运营方',
  };

  return (
    <>
      <Typography.Title level={4}>
        欢迎回来{user ? `，${roleLabel[user.role] || ''}` : ''}
      </Typography.Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable><Statistic title="政策库总数" value={stats.policies} prefix={<FileTextOutlined />} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable><Statistic title="匹配度 ≥ 80%" value={0} prefix={<AimOutlined />} suffix="个" /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable><Statistic title="进行中申报" value={stats.applications} prefix={<CloudUploadOutlined />} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable><Statistic title="未读消息" value={stats.unread} prefix={<BellOutlined />} /></Card>
        </Col>
      </Row>
      <Card style={{ marginTop: 24 }}>
        <Typography.Paragraph>
          请先完善您的画像信息，系统将自动为您匹配适合的政策，计算申报可行性，并提供成长路径建议。
        </Typography.Paragraph>
      </Card>
    </>
  );
};

export default DashboardPage;
