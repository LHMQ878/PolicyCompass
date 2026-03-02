import React from 'react';
import { Form, Input, Button, Card, Typography, Radio, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '@/services/authApi';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = async (values: { phone: string; password: string; role: string }) => {
    try {
      await register(values.phone, values.password, values.role);
      message.success('注册成功，请登录');
      navigate('/login');
    } catch {
      message.error('注册失败');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f0f2f5' }}>
      <Card style={{ width: 480 }}>
        <Typography.Title level={3} style={{ textAlign: 'center', marginBottom: 32 }}>注册账号</Typography.Title>
        <Form onFinish={onFinish} size="large" layout="vertical">
          <Form.Item name="role" label="选择角色" rules={[{ required: true, message: '请选择角色' }]}>
            <Radio.Group>
              <Radio.Button value="talent">科技人才</Radio.Button>
              <Radio.Button value="tech_enterprise">科技企业</Radio.Button>
              <Radio.Button value="transform_enterprise">转型企业</Radio.Button>
              <Radio.Button value="park">园区运营方</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="phone" label="手机号" rules={[{ required: true, message: '请输入手机号' }]}>
            <Input placeholder="手机号" />
          </Form.Item>
          <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password placeholder="密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>注册</Button>
          </Form.Item>
          <div style={{ textAlign: 'center' }}><Link to="/login">已有账号？去登录</Link></div>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterPage;
