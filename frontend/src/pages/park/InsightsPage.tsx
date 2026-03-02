import React, { useEffect, useState } from 'react';
import { Card, Typography, Breadcrumb, Empty, Spin } from 'antd';
import { getMyPark } from '@/services/parkApi';
import api from '@/services/api';

const InsightsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [mapData, setMapData] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const parkRes: any = await getMyPark();
        const parkId = parkRes.data?.id;
        if (parkId) {
          const res: any = await api.get(`/insights/industry-map/${parkId}`);
          setMapData(res.data?.chain_analysis || []);
        }
      } catch { /* ignore */ }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', paddingTop: 100 }}><Spin size="large" /></div>;

  return (
    <>
      <Breadcrumb items={[{ title: '首页' }, { title: '产业洞察' }]} />
      <Typography.Title level={4} style={{ marginTop: 16 }}>产业洞察</Typography.Title>
      <Card title="产业地图" style={{ marginBottom: 16 }}>
        {mapData.length > 0 ? (
          <pre>{JSON.stringify(mapData, null, 2)}</pre>
        ) : (
          <Empty description="完善园区画像后，系统将生成产业地图与企业分布分析" />
        )}
      </Card>
      <Card title="趋势分析">
        <Empty description="AI 产业洞察引擎将根据园区数据生成趋势报告" />
      </Card>
    </>
  );
};

export default InsightsPage;
