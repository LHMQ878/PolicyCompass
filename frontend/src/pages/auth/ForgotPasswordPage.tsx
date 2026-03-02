import React from 'react';
import { Card, Typography, Result, Button } from 'antd';
import { Link } from 'react-router-dom';

const ForgotPasswordPage: React.FC = () => (
  <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f0f2f5' }}>
    <Card style={{ width: 400 }}>
      <Result status="info" title="忘记密码" subTitle="短信验证重置密码功能即将上线" extra={<Link to="/login"><Button type="primary">返回登录</Button></Link>} />
    </Card>
  </div>
);

export default ForgotPasswordPage;
