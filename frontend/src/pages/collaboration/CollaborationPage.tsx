import React, { useEffect, useState } from 'react';
import { Card, Typography, Breadcrumb, Empty, Spin, List } from 'antd';
import { getOpportunities } from '@/services/collaborationApi';
import { getMyTalent } from '@/services/talentApi';
import { getMyEnterprise } from '@/services/enterpriseApi';
import { useAuthStore } from '@/stores/authStore';

const CollaborationPage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        let entityId = '';
        if (user?.role === 'talent') {
          const r: any = await getMyTalent();
          entityId = r.data?.id;
        } else {
          const r: any = await getMyEnterprise();
          entityId = r.data?.id;
        }
        if (entityId) {
          const res: any = await getOpportunities(entityId);
          setOpportunities(res.data?.opportunities || []);
        }
      } catch { /* ignore */ }
      setLoading(false);
    };
    load();
  }, [user]);

  if (loading) return <div style={{ textAlign: 'center', paddingTop: 100 }}><Spin size="large" /></div>;

  return (
    <>
      <Breadcrumb items={[{ title: '首页' }, { title: '协同申报' }]} />
      <Typography.Title level={4} style={{ marginTop: 16 }}>产业协同与联合申报</Typography.Title>
      <Card title="推荐合作伙伴" style={{ marginBottom: 16 }}>
        {opportunities.length > 0 ? (
          <List
            dataSource={opportunities}
            renderItem={(item: any) => <List.Item>{item.name || JSON.stringify(item)}</List.Item>}
          />
        ) : (
          <Empty description="系统正在分析您的画像数据，完善画像后将推荐合作伙伴" />
        )}
      </Card>
      <Card title="联合申报机会">
        <Empty description="完善画像并进行政策匹配后，系统将自动识别联合申报机会" />
      </Card>
    </>
  );
};

export default CollaborationPage;
