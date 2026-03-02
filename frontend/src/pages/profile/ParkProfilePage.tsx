import React, { useEffect, useState } from 'react';
import { Card, Typography, Breadcrumb, Progress, Descriptions, Form, Input, InputNumber, Button, Space, Spin, Empty, message } from 'antd';
import { EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { getMyPark, updatePark } from '@/services/parkApi';
import type { Park } from '@/types';

const ParkProfilePage: React.FC = () => {
  const [park, setPark] = useState<Park | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    try {
      setLoading(true);
      const res: any = await getMyPark();
      setPark(res.data);
    } catch {
      setPark(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async (section: string) => {
    if (!park) return;
    try {
      const values = form.getFieldsValue();
      const payload: Record<string, unknown> = {};
      if (section === 'basic') {
        payload.name = values.name;
        payload.address = values.address;
        payload.basic_info = { area: values.area, established: values.established, level: values.level, operator: values.operator };
      } else if (section === 'industry') {
        payload.industry_focus = { main_industries: values.main_industries, key_chains: values.key_chains, target_scale: values.target_scale };
        payload.tenant_info = { total_tenants: values.total_tenants, ai_tenants: values.ai_tenants, occupancy_rate: values.occupancy_rate };
      } else if (section === 'opc') {
        payload.opc_community_info = { is_opc_community: values.is_opc_community, workspace_count: values.workspace_count, computing_power: values.computing_power, incubation_services: values.incubation_services };
        payload.investment_needs = { target_industries: values.target_industries, gap_chains: values.gap_chains, preferred_stage: values.preferred_stage };
      }
      const res: any = await updatePark(park.id, payload);
      setPark(res.data);
      setEditing(null);
      message.success('保存成功');
    } catch {
      message.error('保存失败');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', paddingTop: 100 }}><Spin size="large" /></div>;
  if (!park) return <Empty description="未找到园区信息" />;

  const bi = (park.basic_info || {}) as Record<string, any>;
  const ind = (park.industry_focus || {}) as Record<string, any>;
  const ten = ((park as any).tenant_info || {}) as Record<string, any>;
  const opc = (park.opc_community_info || {}) as Record<string, any>;
  const inv = ((park as any).investment_needs || {}) as Record<string, any>;

  const jsonbFields = ['basic_info', 'industry_focus', 'tenant_info', 'investment_needs', 'opc_community_info'];
  const filled = jsonbFields.filter((f) => (park as any)[f] != null).length;
  const completeness = Math.round((filled / jsonbFields.length) * 100);

  const renderActions = (section: string) => (
    editing === section ? (
      <Space>
        <Button type="primary" icon={<SaveOutlined />} size="small" onClick={() => handleSave(section)}>保存</Button>
        <Button icon={<CloseOutlined />} size="small" onClick={() => setEditing(null)}>取消</Button>
      </Space>
    ) : (
      <Button type="link" icon={<EditOutlined />} onClick={() => {
        setEditing(section);
        if (section === 'basic') form.setFieldsValue({ name: park.name, address: park.address, area: bi.area, established: bi.established, level: bi.level, operator: bi.operator });
        else if (section === 'industry') form.setFieldsValue({ main_industries: ind.main_industries, key_chains: ind.key_chains, target_scale: ind.target_scale, total_tenants: ten.total_tenants, ai_tenants: ten.ai_tenants, occupancy_rate: ten.occupancy_rate });
        else if (section === 'opc') form.setFieldsValue({ is_opc_community: opc.is_opc_community, workspace_count: opc.workspace_count, computing_power: opc.computing_power, incubation_services: opc.incubation_services, target_industries: inv.target_industries, gap_chains: inv.gap_chains, preferred_stage: inv.preferred_stage });
      }}>编辑</Button>
    )
  );

  return (
    <>
      <Breadcrumb items={[{ title: '首页' }, { title: '园区画像' }]} />
      <Typography.Title level={4} style={{ marginTop: 16 }}>园区画像</Typography.Title>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span>画像完整度</span>
          <Progress percent={completeness} style={{ flex: 1, maxWidth: 300 }} strokeColor={completeness >= 80 ? '#52c41a' : completeness >= 60 ? '#faad14' : '#ff4d4f'} />
          <Typography.Text type="secondary">{filled}/{jsonbFields.length} 模块已填写</Typography.Text>
        </div>
      </Card>
      <Form form={form} layout="vertical">
        <Card title="基础信息" extra={renderActions('basic')} style={{ marginBottom: 16 }}>
          {editing === 'basic' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Form.Item label="园区名称" name="name"><Input /></Form.Item>
              <Form.Item label="地址" name="address"><Input /></Form.Item>
              <Form.Item label="占地面积 (亩)" name="area"><InputNumber style={{ width: '100%' }} /></Form.Item>
              <Form.Item label="成立年份" name="established"><InputNumber style={{ width: '100%' }} /></Form.Item>
              <Form.Item label="园区级别" name="level"><Input placeholder="国家级/省级/市级" /></Form.Item>
              <Form.Item label="运营主体" name="operator"><Input /></Form.Item>
            </div>
          ) : (
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="园区名称">{park.name || '-'}</Descriptions.Item>
              <Descriptions.Item label="地址">{park.address || '-'}</Descriptions.Item>
              <Descriptions.Item label="占地面积">{bi.area ? `${bi.area} 亩` : '-'}</Descriptions.Item>
              <Descriptions.Item label="成立年份">{bi.established || '-'}</Descriptions.Item>
              <Descriptions.Item label="园区级别">{bi.level || '-'}</Descriptions.Item>
              <Descriptions.Item label="运营主体">{bi.operator || '-'}</Descriptions.Item>
            </Descriptions>
          )}
        </Card>
        <Card title="产业定位与入驻情况" extra={renderActions('industry')} style={{ marginBottom: 16 }}>
          {editing === 'industry' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Form.Item label="主导产业" name="main_industries"><Input placeholder="例：人工智能,集成电路" /></Form.Item>
              <Form.Item label="重点产业链" name="key_chains"><Input placeholder="例：大模型,智能制造" /></Form.Item>
              <Form.Item label="目标规模 (家)" name="target_scale"><InputNumber style={{ width: '100%' }} /></Form.Item>
              <Form.Item label="入驻企业总数" name="total_tenants"><InputNumber style={{ width: '100%' }} /></Form.Item>
              <Form.Item label="AI 企业数" name="ai_tenants"><InputNumber style={{ width: '100%' }} /></Form.Item>
              <Form.Item label="入驻率 (%)" name="occupancy_rate"><InputNumber style={{ width: '100%' }} max={100} /></Form.Item>
            </div>
          ) : (
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="主导产业">{ind.main_industries || '-'}</Descriptions.Item>
              <Descriptions.Item label="重点产业链">{ind.key_chains || '-'}</Descriptions.Item>
              <Descriptions.Item label="目标规模">{ind.target_scale ? `${ind.target_scale} 家` : '-'}</Descriptions.Item>
              <Descriptions.Item label="入驻企业">{ten.total_tenants ?? '-'}</Descriptions.Item>
              <Descriptions.Item label="AI 企业">{ten.ai_tenants ?? '-'}</Descriptions.Item>
              <Descriptions.Item label="入驻率">{ten.occupancy_rate ? `${ten.occupancy_rate}%` : '-'}</Descriptions.Item>
            </Descriptions>
          )}
        </Card>
        <Card title="OPC 社区与招商需求" extra={renderActions('opc')}>
          {editing === 'opc' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Form.Item label="是否 OPC 社区" name="is_opc_community"><Input placeholder="是/否" /></Form.Item>
              <Form.Item label="工位数" name="workspace_count"><InputNumber style={{ width: '100%' }} /></Form.Item>
              <Form.Item label="算力资源" name="computing_power"><Input placeholder="例：100TOPS" /></Form.Item>
              <Form.Item label="孵化服务" name="incubation_services"><Input placeholder="例：培训,投融资对接" /></Form.Item>
              <Form.Item label="招商目标产业" name="target_industries"><Input placeholder="例：大模型,AI Agent" /></Form.Item>
              <Form.Item label="补链方向" name="gap_chains"><Input /></Form.Item>
              <Form.Item label="偏好企业阶段" name="preferred_stage"><Input placeholder="例：初创/成长/成熟" /></Form.Item>
            </div>
          ) : (
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="OPC 社区">{opc.is_opc_community || '-'}</Descriptions.Item>
              <Descriptions.Item label="工位数">{opc.workspace_count ?? '-'}</Descriptions.Item>
              <Descriptions.Item label="算力资源">{opc.computing_power || '-'}</Descriptions.Item>
              <Descriptions.Item label="孵化服务">{opc.incubation_services || '-'}</Descriptions.Item>
              <Descriptions.Item label="招商目标产业">{inv.target_industries || '-'}</Descriptions.Item>
              <Descriptions.Item label="补链方向">{inv.gap_chains || '-'}</Descriptions.Item>
              <Descriptions.Item label="偏好阶段">{inv.preferred_stage || '-'}</Descriptions.Item>
            </Descriptions>
          )}
        </Card>
      </Form>
    </>
  );
};

export default ParkProfilePage;
