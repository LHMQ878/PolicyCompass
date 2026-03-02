import React, { useEffect, useState } from 'react';
import { Card, Typography, Breadcrumb, Empty, Spin, List } from 'antd';
import { getMyPark } from '@/services/parkApi';
import api from '@/services/api';

const InvestmentPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [chainData, setChainData] = useState<any[]>([]);
  const [targets, setTargets] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const parkRes: any = await getMyPark();
        const parkId = parkRes.data?.id;
        if (parkId) {
          const [mapRes, targetRes]: any[] = await Promise.all([
            api.get(`/insights/industry-map/${parkId}`),
            api.get(`/insights/investment-targets/${parkId}`),
          ]);
          setChainData(mapRes.data?.chain_analysis || []);
          setTargets(targetRes.data?.targets || []);
        }
      } catch { /* ignore */ }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', paddingTop: 100 }}><Spin size="large" /></div>;

  return (
    <>
      <Breadcrumb items={[{ title: '首页' }, { title: '智能招商' }]} />
      <Typography.Title level={4} style={{ marginTop: 16 }}>智能招商</Typography.Title>
      <Card title="产业链图谱" style={{ marginBottom: 16 }}>
        {chainData.length > 0 ? (
          <List dataSource={chainData} renderItem={(item: any) => <List.Item>{JSON.stringify(item)}</List.Item>} />
        ) : (
          <Empty description="完善园区画像后，系统将生成产业链分析和补链建议" />
        )}
      </Card>
      <Card title="推荐招引目标">
        {targets.length > 0 ? (
          <List dataSource={targets} renderItem={(item: any) => <List.Item>{JSON.stringify(item)}</List.Item>} />
        ) : (
          <Empty description="完善产业定位和招商需求后，系统将推荐匹配的招引目标" />
        )}
      </Card>
    </>
  );
};

export default InvestmentPage;
