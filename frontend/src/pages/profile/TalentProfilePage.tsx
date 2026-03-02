import React, { useEffect, useState } from 'react';
import { Card, Typography, Breadcrumb, Progress, Descriptions, Form, Input, InputNumber, Button, Space, Spin, Empty, message } from 'antd';
import { EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { getMyTalent, updateTalent } from '@/services/talentApi';
import type { Talent } from '@/types';

const TalentProfilePage: React.FC = () => {
  const [talent, setTalent] = useState<Talent | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    try {
      setLoading(true);
      const res: any = await getMyTalent();
      setTalent(res.data);
    } catch {
      setTalent(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async (section: string) => {
    if (!talent) return;
    try {
      const values = form.getFieldsValue();
      const payload: Record<string, unknown> = {};

      if (section === 'basic') {
        payload.name = values.name;
        payload.basic_info = {
          gender: values.gender,
          birth_date: values.birth_date,
          phone: values.phone,
          city: values.city,
          is_opc: values.is_opc,
          opc_stage: values.opc_stage,
          ai_direction: values.ai_direction,
        };
      } else if (section === 'education') {
        payload.education = {
          degree: values.degree,
          school: values.school,
          major: values.major,
          graduation_year: values.graduation_year,
        };
      } else if (section === 'career') {
        payload.work_experience = {
          current_company: values.current_company,
          position: values.position,
          years: values.years,
          industry: values.industry,
        };
        payload.achievements = {
          patents: values.patents,
          papers: values.papers,
          awards: values.awards,
        };
        payload.talent_titles = {
          titles: values.titles,
        };
      }

      const res: any = await updateTalent(talent.id, payload);
      setTalent(res.data);
      setEditing(null);
      message.success('保存成功');
    } catch {
      message.error('保存失败');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', paddingTop: 100 }}><Spin size="large" /></div>;
  }

  if (!talent) {
    return <Empty description="未找到人才档案，请先完成注册" />;
  }

  const bi = (talent.basic_info || {}) as Record<string, any>;
  const edu = (talent.education || {}) as Record<string, any>;
  const work = (talent.work_experience || {}) as Record<string, any>;
  const ach = (talent.achievements || {}) as Record<string, any>;
  const titles = (talent.talent_titles || {}) as Record<string, any>;

  const jsonbFields = ['basic_info', 'education', 'work_experience', 'professional_skills', 'achievements', 'talent_titles', 'social_insurance', 'opc_info'];
  const filled = jsonbFields.filter((f) => (talent as any)[f] != null).length;
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
          form.setFieldsValue({ name: talent.name, gender: bi.gender, birth_date: bi.birth_date, phone: bi.phone, city: bi.city, is_opc: bi.is_opc, opc_stage: bi.opc_stage, ai_direction: bi.ai_direction });
        } else if (section === 'education') {
          form.setFieldsValue({ degree: edu.degree, school: edu.school, major: edu.major, graduation_year: edu.graduation_year });
        } else if (section === 'career') {
          form.setFieldsValue({ current_company: work.current_company, position: work.position, years: work.years, industry: work.industry, patents: ach.patents, papers: ach.papers, awards: ach.awards, titles: titles.titles });
        }
      }}>编辑</Button>
    )
  );

  return (
    <>
      <Breadcrumb items={[{ title: '首页' }, { title: '人才画像' }]} />
      <Typography.Title level={4} style={{ marginTop: 16 }}>人才画像</Typography.Title>

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
              <Form.Item label="姓名" name="name"><Input /></Form.Item>
              <Form.Item label="性别" name="gender"><Input placeholder="男/女" /></Form.Item>
              <Form.Item label="出生日期" name="birth_date"><Input placeholder="例：1990-01-01" /></Form.Item>
              <Form.Item label="手机号" name="phone"><Input /></Form.Item>
              <Form.Item label="所在城市" name="city"><Input /></Form.Item>
              <Form.Item label="是否 OPC 创业者" name="is_opc"><Input placeholder="是/否" /></Form.Item>
              <Form.Item label="创业阶段" name="opc_stage"><Input placeholder="概念期/初创期/成长期" /></Form.Item>
              <Form.Item label="AI 方向" name="ai_direction"><Input placeholder="例：大模型/计算机视觉/NLP" /></Form.Item>
            </div>
          ) : (
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="姓名">{talent.name || '-'}</Descriptions.Item>
              <Descriptions.Item label="性别">{bi.gender || '-'}</Descriptions.Item>
              <Descriptions.Item label="出生日期">{bi.birth_date || '-'}</Descriptions.Item>
              <Descriptions.Item label="手机号">{bi.phone || '-'}</Descriptions.Item>
              <Descriptions.Item label="所在城市">{bi.city || '-'}</Descriptions.Item>
              <Descriptions.Item label="OPC 创业者">{bi.is_opc || '-'}</Descriptions.Item>
              <Descriptions.Item label="创业阶段">{bi.opc_stage || '-'}</Descriptions.Item>
              <Descriptions.Item label="AI 方向">{bi.ai_direction || '-'}</Descriptions.Item>
            </Descriptions>
          )}
        </Card>

        <Card title="教育背景" extra={renderActions('education')} style={{ marginBottom: 16 }}>
          {editing === 'education' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Form.Item label="最高学历" name="degree"><Input placeholder="博士/硕士/本科" /></Form.Item>
              <Form.Item label="毕业院校" name="school"><Input /></Form.Item>
              <Form.Item label="专业" name="major"><Input /></Form.Item>
              <Form.Item label="毕业年份" name="graduation_year"><InputNumber style={{ width: '100%' }} /></Form.Item>
            </div>
          ) : (
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="最高学历">{edu.degree || '-'}</Descriptions.Item>
              <Descriptions.Item label="毕业院校">{edu.school || '-'}</Descriptions.Item>
              <Descriptions.Item label="专业">{edu.major || '-'}</Descriptions.Item>
              <Descriptions.Item label="毕业年份">{edu.graduation_year || '-'}</Descriptions.Item>
            </Descriptions>
          )}
        </Card>

        <Card title="职业信息与成果" extra={renderActions('career')}>
          {editing === 'career' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Form.Item label="当前单位" name="current_company"><Input /></Form.Item>
              <Form.Item label="职位" name="position"><Input /></Form.Item>
              <Form.Item label="工作年限" name="years"><InputNumber style={{ width: '100%' }} /></Form.Item>
              <Form.Item label="所属行业" name="industry"><Input /></Form.Item>
              <Form.Item label="专利数量" name="patents"><InputNumber style={{ width: '100%' }} /></Form.Item>
              <Form.Item label="论文数量" name="papers"><InputNumber style={{ width: '100%' }} /></Form.Item>
              <Form.Item label="获奖情况" name="awards"><Input /></Form.Item>
              <Form.Item label="人才称号" name="titles"><Input placeholder="例：省级高层次人才" /></Form.Item>
            </div>
          ) : (
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="当前单位">{work.current_company || '-'}</Descriptions.Item>
              <Descriptions.Item label="职位">{work.position || '-'}</Descriptions.Item>
              <Descriptions.Item label="工作年限">{work.years || '-'}</Descriptions.Item>
              <Descriptions.Item label="所属行业">{work.industry || '-'}</Descriptions.Item>
              <Descriptions.Item label="专利数量">{ach.patents || '-'}</Descriptions.Item>
              <Descriptions.Item label="论文数量">{ach.papers || '-'}</Descriptions.Item>
              <Descriptions.Item label="获奖情况">{ach.awards || '-'}</Descriptions.Item>
              <Descriptions.Item label="人才称号">{titles.titles || '-'}</Descriptions.Item>
            </Descriptions>
          )}
        </Card>
      </Form>
    </>
  );
};

export default TalentProfilePage;
