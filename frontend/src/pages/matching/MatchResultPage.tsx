import React, { useEffect, useState } from 'react';
import { Card, Typography, Breadcrumb, Statistic, Row, Col, Table, Tag, Empty, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getMatchResults } from '@/services/matchingApi';
import { getMyTalent } from '@/services/talentApi';
import { getMyEnterprise } from '@/services/enterpriseApi';
import { useAuthStore } from '@/stores/authStore';
import type { MatchResult } from '@/types';

const MatchResultPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [results, setResults] = useState<MatchResult[]>([]);
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
          const res: any = await getMatchResults(entityId);
          setResults(Array.isArray(res.data) ? res.data : []);
        }
      } catch { /* ignore */ }
      setLoading(false);
    };
    load();
  }, [user]);

  const full = results.filter((r) => r.match_score >= 100).length;
  const high = results.filter((r) => r.match_score >= 80 && r.match_score < 100).length;
  const partial = results.filter((r) => r.match_score >= 50 && r.match_score < 80).length;
  const totalAmount = results.reduce((s, r) => s + (r.estimated_amount || 0), 0);

  const columns = [
    { title: '政策 ID', dataIndex: 'policy_id', key: 'policy_id', ellipsis: true },
    {
      title: '匹配度', dataIndex: 'match_score', key: 'match_score', width: 120,
      sorter: (a: MatchResult, b: MatchResult) => a.match_score - b.match_score,
      render: (v: number) => {
        const color = v >= 80 ? 'green' : v >= 50 ? 'orange' : 'red';
        return <Tag color={color}>{v}%</Tag>;
      },
    },
    {
      title: '状态', dataIndex: 'match_status', key: 'match_status', width: 100,
      render: (v: string) => v === 'matched' ? <Tag color="green">已匹配</Tag> : <Tag>{v}</Tag>,
    },
    {
      title: '预估金额', dataIndex: 'estimated_amount', key: 'estimated_amount', width: 120,
      render: (v: number | null) => v ? `${v} 万` : '-',
    },
    {
      title: '操作', key: 'action', width: 100,
      render: (_: unknown, record: MatchResult) => (
        <a onClick={() => navigate(`/matching/gap/${record.policy_id}`)}>卡点分析</a>
      ),
    },
  ];

  if (loading) return <div style={{ textAlign: 'center', paddingTop: 100 }}><Spin size="large" /></div>;

  return (
    <>
      <Breadcrumb items={[{ title: '首页' }, { title: '政策匹配' }]} />
      <Typography.Title level={4} style={{ marginTop: 16 }}>我的政策匹配</Typography.Title>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}><Card><Statistic title="完全匹配" value={full} /></Card></Col>
        <Col span={6}><Card><Statistic title="高度匹配" value={high} /></Card></Col>
        <Col span={6}><Card><Statistic title="部分匹配" value={partial} /></Card></Col>
        <Col span={6}><Card><Statistic title="预估总额" value={totalAmount} suffix="万" /></Card></Col>
      </Row>
      <Card>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={results}
          locale={{ emptyText: <Empty description="暂无匹配结果，请先完善画像信息" /> }}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </>
  );
};

export default MatchResultPage;
