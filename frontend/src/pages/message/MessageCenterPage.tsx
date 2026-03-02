import React, { useEffect, useState } from 'react';
import { Card, Typography, Breadcrumb, Button, List, Tag, Empty, Spin, message as antMessage } from 'antd';
import { listMessages, markAllRead } from '@/services/messageApi';
import { useMessageStore } from '@/stores/messageStore';
import type { Message } from '@/types';

const typeMap: Record<string, { label: string; color: string }> = {
  policy_alert: { label: '政策提醒', color: 'blue' },
  match_notify: { label: '匹配通知', color: 'green' },
  progress: { label: '申报进度', color: 'orange' },
  collaboration: { label: '协同邀请', color: 'purple' },
  system: { label: '系统通知', color: 'default' },
};

const MessageCenterPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const setUnreadCount = useMessageStore((s) => s.setUnreadCount);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res: any = await listMessages();
      const list = Array.isArray(res.data) ? res.data : [];
      setMessages(list);
      setUnreadCount(list.filter((m: Message) => !m.is_read).length);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleMarkAll = async () => {
    try {
      await markAllRead();
      antMessage.success('已全部标为已读');
      setUnreadCount(0);
      setMessages((prev) => prev.map((m) => ({ ...m, is_read: true })));
    } catch {
      antMessage.error('操作失败');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', paddingTop: 100 }}><Spin size="large" /></div>;

  return (
    <>
      <Breadcrumb items={[{ title: '首页' }, { title: '消息中心' }]} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
        <Typography.Title level={4} style={{ margin: 0 }}>消息中心</Typography.Title>
        <Button onClick={handleMarkAll} disabled={messages.every((m) => m.is_read)}>全部已读</Button>
      </div>
      <Card style={{ marginTop: 16 }}>
        {messages.length > 0 ? (
          <List
            dataSource={messages}
            renderItem={(item) => {
              const t = typeMap[item.msg_type] || { label: item.msg_type, color: 'default' };
              return (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <span>
                        <Tag color={t.color}>{t.label}</Tag>
                        <span style={{ fontWeight: item.is_read ? 'normal' : 'bold' }}>{item.title}</span>
                      </span>
                    }
                    description={item.content || ''}
                  />
                  <Typography.Text type="secondary">{item.created_at?.slice(0, 16).replace('T', ' ')}</Typography.Text>
                </List.Item>
              );
            }}
          />
        ) : (
          <Empty description="暂无消息" />
        )}
      </Card>
    </>
  );
};

export default MessageCenterPage;
