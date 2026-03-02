import React, { useEffect, useState } from 'react';
import { Card, Typography, Breadcrumb, Empty, Spin, Table, Tag } from 'antd';
import { getMyPark, getPolicyMatches } from '@/services/parkApi';

const PolicyPushPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const parkRes: any = await getMyPark();
        const parkId = parkRes.data?.id;
        if (parkId) {
          const res: any = await getPolicyMatches(parkId);
          setMatches(Array.isArray(res.data) ? res.data : []);
        }
      } catch { /* ignore */ }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', paddingTop: 100 }}><Spin size="large" /></div>;

  return (
    <>
      <Breadcrumb items={[{ title: '首页' }, { title: '政策推送' }]} />
      <Typography.Title level={4} style={{ marginTop: 16 }}>政策精准推送</Typography.Title>
      <Card title="发布园区政策" style={{ marginBottom: 16 }}>
        <Empty description="上传政策文件（PDF/Word）或手动填写，AI 将自动解析并匹配全平台用户" />
      </Card>
      <Card title="匹配用户与推送历史">
        {matches.length > 0 ? (
          <Table rowKey="id" dataSource={matches} columns={[
            { title: '用户', dataIndex: 'name', key: 'name' },
            { title: '匹配度', dataIndex: 'score', key: 'score', render: (v: number) => <Tag color="green">{v}%</Tag> },
          ]} />
        ) : (
          <Empty description="发布园区政策后，系统将自动匹配全平台用户" />
        )}
      </Card>
    </>
  );
};

export default PolicyPushPage;
