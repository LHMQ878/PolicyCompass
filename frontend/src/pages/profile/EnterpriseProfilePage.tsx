import React, { useEffect, useState } from 'react';
import { Card, Typography, Breadcrumb, Progress, Descriptions, Form, Input, InputNumber, Button, Space, Spin, message, Empty } from 'antd';
import { EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/stores/authStore';
import { getMyEnterprise, updateEnterprise } from '@/services/enterpriseApi';
import type { Enterprise } from '@/types';

const EnterpriseProfilePage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const [enterprise, setEnterprise] = useState<Enterprise | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    try {
      setLoading(true);
      const res: any = await getMyEnterprise();
      setEnterprise(res.data);
    } catch {
      setEnterprise(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [user]);

  const handleSave = async (section: string) => {
    if (!enterprise) return;
    try {
      const values = form.getFieldsValue();
      const payload: Record<string, unknown> = {};

      if (section === 'basic') {
        payload.name = values.name;
        payload.credit_code = values.credit_code;
        payload.basic_info = {
          legal_person: values.legal_person,
          industry: values.industry,
          address: values.address,
          founded_date: values.founded_date,
          employee_count: values.employee_count,
        };
      } else if (section === 'operation') {
        payload.operation_data = {
          revenue: values.revenue,
          rd_investment: values.rd_investment,
          rd_ratio: values.rd_ratio,
          net_profit: values.net_profit,
        };
      } else if (section === 'certification') {
        payload.certifications = {
          high_tech: values.high_tech,
          specialized: values.specialized,
          tech_sme: values.tech_sme,
        };
        payload.ai_compliance = {
          algorithm_filing: values.algorithm_filing,
          data_security: values.data_security,
          llm_filing: values.llm_filing,
        };
      }

      const res: any = await updateEnterprise(enterprise.id, payload);
      setEnterprise(res.data);
      setEditing(null);
      message.success('保存成功');
    } catch {
      message.error('保存失败');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', paddingTop: 100 }}><Spin size="large" /></div>;
  }

  if (!enterprise) {
    return <Empty description="未找到企业信息，请先完成注册" />;
  }

  const bi = (enterprise.basic_info || {}) as Record<string, any>;
  const od = (enterprise.operation_data || {}) as Record<string, any>;
  const cert = (enterprise.certifications || {}) as Record<string, any>;
  const ai = (enterprise.ai_compliance || {}) as Record<string, any>;

  const jsonbFields = ['basic_info', 'operation_data', 'certifications', 'intellectual_property', 'ai_compliance', 'general_compliance', 'opc_info'];
  const filled = jsonbFields.filter((f) => (enterprise as any)[f] != null).length;
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
        if (section === 'basic') {
          form.setFieldsValue({ name: enterprise.name, credit_code: enterprise.credit_code, legal_person: bi.legal_person, industry: bi.industry, address: bi.address, founded_date: bi.founded_date, employee_count: bi.employee_count });
        } else if (section === 'operation') {
          form.setFieldsValue({ revenue: od.revenue, rd_investment: od.rd_investment, rd_ratio: od.rd_ratio, net_profit: od.net_profit });
        } else if (section === 'certification') {
          form.setFieldsValue({ high_tech: cert.high_tech, specialized: cert.specialized, tech_sme: cert.tech_sme, algorithm_filing: ai.algorithm_filing, data_security: ai.data_security, llm_filing: ai.llm_filing });
        }
      }}>编辑</Button>
    )
  );

  return (
    <>
      <Breadcrumb items={[{ title: '首页' }, { title: '企业画像' }]} />
      <Typography.Title level={4} style={{ marginTop: 16 }}>企业画像</Typography.Title>

      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span>画像完整度</span>
          <Progress
            percent={completeness}
            style={{ flex: 1, maxWidth: 300 }}
            strokeColor={completeness >= 80 ? '#52c41a' : completeness >= 60 ? '#faad14' : '#ff4d4f'}
          />
          <Typography.Text type="secondary">{filled}/{jsonbFields.length} 模块已填写</Typography.Text>
        </div>
      </Card>

      <Form form={form} layout="vertical">
        <Card title="基础信息" extra={renderActions('basic')} style={{ marginBottom: 16 }}>
          {editing === 'basic' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Form.Item label="企业名称" name="name"><Input /></Form.Item>
              <Form.Item label="统一社会信用代码" name="credit_code"><Input /></Form.Item>
              <Form.Item label="法人代表" name="legal_person"><Input /></Form.Item>
              <Form.Item label="所属行业" name="industry"><Input /></Form.Item>
              <Form.Item label="注册地址" name="address"><Input /></Form.Item>
              <Form.Item label="成立日期" name="founded_date"><Input placeholder="例：2020-01-01" /></Form.Item>
              <Form.Item label="员工人数" name="employee_count"><InputNumber style={{ width: '100%' }} /></Form.Item>
            </div>
          ) : (
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="企业名称">{enterprise.name || '-'}</Descriptions.Item>
              <Descriptions.Item label="信用代码">{enterprise.credit_code || '-'}</Descriptions.Item>
              <Descriptions.Item label="法人代表">{bi.legal_person || '-'}</Descriptions.Item>
              <Descriptions.Item label="所属行业">{bi.industry || '-'}</Descriptions.Item>
              <Descriptions.Item label="注册地址">{bi.address || '-'}</Descriptions.Item>
              <Descriptions.Item label="成立日期">{bi.founded_date || '-'}</Descriptions.Item>
              <Descriptions.Item label="员工人数">{bi.employee_count || '-'}</Descriptions.Item>
            </Descriptions>
          )}
        </Card>

        <Card title="经营数据" extra={renderActions('operation')} style={{ marginBottom: 16 }}>
          {editing === 'operation' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Form.Item label="年营收 (万元)" name="revenue"><InputNumber style={{ width: '100%' }} /></Form.Item>
              <Form.Item label="研发投入 (万元)" name="rd_investment"><InputNumber style={{ width: '100%' }} /></Form.Item>
              <Form.Item label="研发占比 (%)" name="rd_ratio"><InputNumber style={{ width: '100%' }} max={100} /></Form.Item>
              <Form.Item label="净利润 (万元)" name="net_profit"><InputNumber style={{ width: '100%' }} /></Form.Item>
            </div>
          ) : (
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="年营收">{od.revenue ? `${od.revenue} 万元` : '-'}</Descriptions.Item>
              <Descriptions.Item label="研发投入">{od.rd_investment ? `${od.rd_investment} 万元` : '-'}</Descriptions.Item>
              <Descriptions.Item label="研发占比">{od.rd_ratio ? `${od.rd_ratio}%` : '-'}</Descriptions.Item>
              <Descriptions.Item label="净利润">{od.net_profit ? `${od.net_profit} 万元` : '-'}</Descriptions.Item>
            </Descriptions>
          )}
        </Card>

        <Card title="资质认定与 AI 合规" extra={renderActions('certification')}>
          {editing === 'certification' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Form.Item label="高新技术企业" name="high_tech"><Input placeholder="是/否/申请中" /></Form.Item>
              <Form.Item label="专精特新" name="specialized"><Input placeholder="是/否/申请中" /></Form.Item>
              <Form.Item label="科小入库" name="tech_sme"><Input placeholder="是/否/申请中" /></Form.Item>
              <Form.Item label="算法备案" name="algorithm_filing"><Input placeholder="已完成/未完成" /></Form.Item>
              <Form.Item label="数据安全评估" name="data_security"><Input placeholder="已完成/未完成" /></Form.Item>
              <Form.Item label="大模型备案" name="llm_filing"><Input placeholder="已完成/未完成/不涉及" /></Form.Item>
            </div>
          ) : (
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="高新技术企业">{cert.high_tech || '-'}</Descriptions.Item>
              <Descriptions.Item label="专精特新">{cert.specialized || '-'}</Descriptions.Item>
              <Descriptions.Item label="科小入库">{cert.tech_sme || '-'}</Descriptions.Item>
              <Descriptions.Item label="算法备案">{ai.algorithm_filing || '-'}</Descriptions.Item>
              <Descriptions.Item label="数据安全评估">{ai.data_security || '-'}</Descriptions.Item>
              <Descriptions.Item label="大模型备案">{ai.llm_filing || '-'}</Descriptions.Item>
            </Descriptions>
          )}
        </Card>
      </Form>
    </>
  );
};

export default EnterpriseProfilePage;
