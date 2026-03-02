import React from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import AppRouter from '@/router';

const App: React.FC = () => (
  <ConfigProvider locale={zhCN} theme={{ token: { colorPrimary: '#1677ff' } }}>
    <AppRouter />
  </ConfigProvider>
);

export default App;
