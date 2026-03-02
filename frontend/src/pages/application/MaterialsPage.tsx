import React, { useEffect, useState } from 'react';
import { Card, Typography, Breadcrumb, Button, Table, Upload, Tag, Empty, Spin, message, Popconfirm } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { listMaterials, uploadMaterial, deleteMaterial } from '@/services/materialApi';

interface MaterialItem {
  id: string;
  file_name: string;
  category: string;
  file_size: number | null;
  status: string;
  created_at: string;
}

const categoryMap: Record<string, string> = {
  license: '证照', finance: '财务', qualification: '资质',
  ip: '知识产权', personnel: '人员', project: '项目', other: '其他',
};

const MaterialsPage: React.FC = () => {
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res: any = await listMaterials();
      setMaterials(Array.isArray(res.data) ? res.data : []);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleUpload = async (info: any) => {
    const formData = new FormData();
    formData.append('file', info.file);
    try {
      await uploadMaterial(formData);
      message.success('上传成功');
      fetchData();
    } catch {
      message.error('上传失败');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMaterial(id);
      message.success('删除成功');
      fetchData();
    } catch {
      message.error('删除失败');
    }
  };

  const columns = [
    { title: '文件名', dataIndex: 'file_name', key: 'file_name', ellipsis: true },
    {
      title: '分类', dataIndex: 'category', key: 'category', width: 100,
      render: (v: string) => categoryMap[v] || v,
    },
    {
      title: '大小', dataIndex: 'file_size', key: 'file_size', width: 100,
      render: (v: number | null) => v ? `${(v / 1024).toFixed(1)} KB` : '-',
    },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 80,
      render: (v: string) => <Tag color={v === 'active' ? 'green' : 'default'}>{v === 'active' ? '有效' : v}</Tag>,
    },
    { title: '上传时间', dataIndex: 'created_at', key: 'created_at', width: 170, render: (v: string) => v?.slice(0, 16).replace('T', ' ') },
    {
      title: '操作', key: 'action', width: 80,
      render: (_: unknown, record: MaterialItem) => (
        <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record.id)}>
          <Button type="link" danger icon={<DeleteOutlined />} size="small" />
        </Popconfirm>
      ),
    },
  ];

  if (loading) return <div style={{ textAlign: 'center', paddingTop: 100 }}><Spin size="large" /></div>;

  return (
    <>
      <Breadcrumb items={[{ title: '首页' }, { title: '素材管理' }]} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
        <Typography.Title level={4} style={{ margin: 0 }}>素材库</Typography.Title>
        <Upload customRequest={handleUpload} showUploadList={false}>
          <Button type="primary" icon={<UploadOutlined />}>上传素材</Button>
        </Upload>
      </div>
      <Card style={{ marginTop: 16 }}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={materials}
          locale={{ emptyText: <Empty description="暂无素材，请上传证照、财务、资质等文件" /> }}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </>
  );
};

export default MaterialsPage;
