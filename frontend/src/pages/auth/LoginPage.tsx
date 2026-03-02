import React from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { MobileOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '@/services/authApi';
import { useAuthStore } from '@/stores/authStore';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const authLogin = useAuthStore((s) => s.login);

  const onFinish = async (values: { phone: string; password: string }) => {
    try {
      const res: any = await login(values.phone, values.password);
      authLogin(res.data.access_token, res.data.user);
      message.success('登录成功');
      navigate('/');
    } catch {
      message.error('登录失败，请检查手机号和密码');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f0f2f5' }}>
      <Card style={{ width: 400 }}>
        <Typography.Title level={3} style={{ textAlign: 'center', marginBottom: 32 }}>政策罗盘</Typography.Title>
        <Form onFinish={onFinish} size="large">
          <Form.Item name="phone" rules={[{ required: true, message: '请输入手机号' }]}>
            <Input prefix={<MobileOutlined />} placeholder="手机号" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>登录</Button>
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Link to="/register">注册账号</Link>
            <Link to="/forgot-password">忘记密码</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
