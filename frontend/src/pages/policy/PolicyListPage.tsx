import React, { useEffect, useState } from 'react';
import { Card, Typography, Breadcrumb, Input, Tag, Table, Space, Empty } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { listPolicies } from '@/services/policyApi';
import type { Policy, PaginatedData } from '@/types';

const levelMap: Record<string, string> = { national: '国家', province: '省级', city: '市级', district: '区级', park: '园区' };
const typeMap: Record<string, string> = { subsidy: '补贴', qualification: '资质', tax: '税收', talent: '人才', equipment: '设备', scenario: '场景' };

const PolicyListPage: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<PaginatedData<Policy>>({ total: 0, page: 1, page_size: 20, items: [] });
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, page_size: 20 };
      if (keyword) params.keyword = keyword;
      if (selectedLevel) params.level = selectedLevel;
      const res: any = await listPolicies(params);
      setData(res.data || { total: 0, page: 1, page_size: 20, items: [] });
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [selectedLevel]);

  const columns = [
    {
      title: '政策名称', dataIndex: 'title', key: 'title',
      render: (text: string, record: Policy) => (
        <a onClick={() => navigate(`/policies/${record.id}`)}>{text}</a>
      ),
    },
    { title: '发布机构', dataIndex: 'issuing_authority', key: 'issuing_authority', width: 150 },
    {
      title: '层级', dataIndex: 'level', key: 'level', width: 80,
      render: (v: string) => levelMap[v] || v || '-',
    },
    {
      title: '类型', dataIndex: 'policy_type', key: 'policy_type', width: 80,
      render: (v: string) => typeMap[v] || v || '-',
    },
    {
      title: 'OPC', dataIndex: 'is_opc_policy', key: 'is_opc_policy', width: 70,
      render: (v: boolean) => v ? <Tag color="blue">OPC</Tag> : null,
    },
    { title: '地区', dataIndex: 'region', key: 'region', width: 100 },
    { title: '申报截止', dataIndex: 'apply_end_date', key: 'apply_end_date', width: 110 },
  ];

  const levels = [
    { key: null, label: '全部' },
    { key: 'national', label: '国家' },
    { key: 'province', label: '省级' },
    { key: 'city', label: '市级' },
    { key: 'district', label: '区级' },
    { key: 'park', label: '园区' },
  ];

  return (
    <>
      <Breadcrumb items={[{ title: '首页' }, { title: '政策库' }]} />
      <Typography.Title level={4} style={{ marginTop: 16 }}>政策库</Typography.Title>
      <Card style={{ marginBottom: 16 }}>
        <Input.Search
          prefix={<SearchOutlined />}
          placeholder="搜索政策名称..."
          size="large"
          allowClear
          onSearch={(v) => { setKeyword(v); fetchData(1); }}
        />
        <Space style={{ marginTop: 12 }} wrap>
          <span>层级：</span>
          {levels.map((l) => (
            <Tag.CheckableTag
              key={String(l.key)}
              checked={selectedLevel === l.key}
              onChange={() => setSelectedLevel(l.key)}
            >
              {l.label}
            </Tag.CheckableTag>
          ))}
        </Space>
      </Card>
      <Card>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data.items}
          loading={loading}
          locale={{ emptyText: <Empty description="暂无政策数据" /> }}
          pagination={{
            current: data.page,
            pageSize: data.page_size,
            total: data.total,
            showTotal: (t) => `共 ${t} 条`,
            onChange: (p) => fetchData(p),
          }}
        />
      </Card>
    </>
  );
};

export default PolicyListPage;
