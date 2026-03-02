# PolicyCompass - AI 政策罗盘

AI 产业的"政策芯片"。面向科技人才、科技企业、转型企业、园区运营方，通过画像识别、政策匹配、卡点诊断、成长导航与材料智能生成，形成"可查、可算、可办、可协同"的政策服务闭环。

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | Vite + React 18 + TypeScript + Ant Design 5 + Zustand + React Router v6 |
| 后端 | FastAPI + SQLAlchemy 2.0 (async) + Pydantic v2 + Alembic |
| 数据库 | PostgreSQL 16（阿里云 RDS），JSONB 存储半结构化画像 |
| 大模型 | 通义千问（Qwen）via OpenAI 兼容接口 |
| 部署 | Docker + Docker Compose + Caddy (自动 HTTPS) |

## 项目结构

```
PolicyCompass/
├── backend/                    # FastAPI 后端
│   ├── app/
│   │   ├── agents/             # AI Agent 实现（5 大智能体）
│   │   ├── api/v1/             # RESTful API 路由（13 个模块）
│   │   ├── core/               # 配置、数据库、认证
│   │   ├── models/             # SQLAlchemy 数据模型（12 张表）
│   │   ├── schemas/            # Pydantic 请求/响应模型
│   │   ├── services/           # 业务逻辑服务
│   │   └── main.py             # FastAPI 应用入口
│   ├── alembic/                # 数据库迁移
│   └── requirements.txt
├── frontend/                   # React 前端
│   ├── src/
│   │   ├── components/         # 通用组件（ProtectedRoute, RoleGuard）
│   │   ├── layouts/            # 布局组件（MainLayout, AuthLayout）
│   │   ├── pages/              # 页面组件（21 个页面，全部接入真实数据）
│   │   ├── router/             # 路由配置（懒加载 + 代码分割）
│   │   ├── services/           # API 调用封装（12 个服务模块）
│   │   ├── stores/             # Zustand 状态管理
│   │   └── types/              # TypeScript 类型定义
│   └── package.json
├── docker/                     # Docker 配置
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   ├── nginx.conf
│   └── Caddyfile
├── scripts/                    # 工具脚本
│   ├── create_db.py            # 创建数据库
│   ├── show_db.py              # 查看所有表数据概况
│   └── show_policies.py        # 查看政策表数据
├── docker-compose.yml          # 生产部署
├── docker-compose.dev.yml      # 开发部署
├── docs/prd.md                 # 产品需求文档
└── .env.example                # 环境变量模板
```

## 快速开始

### 环境要求

- Python 3.12+
- Node.js 20+
- PostgreSQL 16（或阿里云 RDS）

### 1. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env，填入实际的数据库连接串和 API Key
```

### 2. 后端启动

```bash
cd backend
pip install -r requirements.txt

# 运行数据库迁移
python -m alembic upgrade head

# 启动开发服务器
python -m uvicorn app.main:app --reload --port 8000
```

API 文档：http://localhost:8000/docs

#### 数据库迁移说明

迁移**不需要每次启动都执行**，仅在以下场景需要：

- **模型变更**：新增/删除/修改了 `backend/app/models/` 下的数据模型（加表、加字段、改类型等）
- **新环境部署**：在全新机器上初始化数据库结构

如果只改了 API 路由、业务逻辑、前端代码或 Pydantic Schema，无需迁移。

```bash
# 模型改了后，生成迁移脚本
python -m alembic revision --autogenerate -m "描述改了什么"

# 执行迁移，应用到数据库（只会跑尚未执行的迁移，不会重复）
python -m alembic upgrade head
```

Alembic 通过数据库中的 `alembic_version` 表跟踪版本，`upgrade head` 会自动跳过已执行的迁移。

### 3. 前端启动

```bash
cd frontend
npm install
npm run dev
```

访问：http://localhost:3000

### 4. Docker 部署

```bash
# 开发模式（热重载）
docker compose -f docker-compose.dev.yml up

# 生产模式（含 Caddy HTTPS）
docker compose up -d
```

### 5. 工具脚本

```bash
# 查看所有表数据概况
python scripts/show_db.py

# 查看政策表数据
python scripts/show_policies.py
```

## 功能模块

### 用户中心
- 手机号 + 密码注册/登录，注册时自动创建对应角色画像
- 四种角色：科技人才、科技企业、转型企业、园区运营方
- JWT Token 认证，用户信息持久化存储

### 画像中心（已接入真实数据，支持在线编辑）
- **人才画像**：基础信息（含 OPC 创业者标识）、教育背景、职业信息与成果
- **企业画像**：基础信息、经营数据、资质认定与 AI 合规
- **园区画像**：基础信息、产业定位与入驻情况、OPC 社区与招商需求
- 画像完整度自动计算，按模块填写比例显示进度条

### 政策中心（已接入真实数据）
- 政策库浏览，支持关键词搜索 + 层级筛选 + 分页
- 政策详情页
- 政策收藏（Favorite 表持久化）

### 智能匹配（已接入真实数据）
- 匹配结果列表，按匹配度排序，统计完全/高度/部分匹配数量
- 预估总额汇总
- 卡点分析入口

### 申报中心（已接入真实数据）
- 素材管理：文件上传、列表展示、删除，支持分类和大小显示
- 申报记录全流程追踪

### 园区工作台（已接入真实数据）
- 智能招商：产业链图谱 + 招引目标
- 政策推送：匹配用户列表
- 产业洞察：产业地图 + 趋势分析

### 协同申报（已接入真实数据）
- 推荐合作伙伴
- 联合申报机会识别

### 消息中心（已接入真实数据）
- 消息列表，按类型标签分类（政策提醒/匹配通知/申报进度/协同邀请/系统通知）
- 未读加粗，支持全部已读

## API 概览

所有接口以 `/api/v1` 为前缀，需 JWT Bearer Token 认证（`/auth/*` 除外）。

| 模块 | 前缀 | 关键端点 |
|------|------|----------|
| 认证 | `/auth` | 登录（返回 token + 用户信息）、注册（自动创建画像）、刷新、密码重置 |
| 用户 | `/users` | `GET /me` 当前用户信息 |
| 企业 | `/enterprises` | `GET /mine` 我的企业、CRUD、素材上传、完整度查询 |
| 人才 | `/talents` | `GET /mine` 我的档案、CRUD |
| 园区 | `/parks` | `GET /mine` 我的园区、CRUD、政策发布、推送 |
| 政策 | `/policies` | 列表筛选分页、详情、创建（园区/管理员）、收藏/取消收藏 |
| 匹配 | `/matching` | 匹配计算、结果查询、卡点分析、成长路径 |
| 素材 | `/materials` | 列表、上传、详情、删除、预审（AI/专家） |
| 申报 | `/applications` | 列表、创建、详情、反馈、进度查询 |
| 协同 | `/collaboration` | 合作机会、连接请求 |
| 洞察 | `/insights` | 产业图谱、招商目标、趋势、报告 |
| 对话 | `/chat` | AI 对话消息、会话管理 |
| 消息 | `/messages` | 消息列表（筛选/分页）、全部已读 |

## 数据模型

12 张数据表：

| 表名 | 说明 |
|------|------|
| users | 用户账号（手机号 + 角色） |
| enterprises | 企业画像（JSONB 多维度数据） |
| talents | 人才画像 |
| parks | 园区画像 |
| policies | 政策库 |
| materials | 素材/证照文件 |
| match_results | 政策匹配结果 |
| applications | 申报记录 |
| messages | 站内消息 |
| favorites | 政策收藏（用户-政策唯一约束） |
| chat_sessions | AI 对话会话 |
| chat_messages | 对话消息记录 |

## 五大 AI 智能体

| Agent | 职责 | 状态 |
|-------|------|------|
| 交互导航 Agent | 意图识别、路由分发、上下文管理 | 待实现 |
| 政策计算 Agent | 条件解析、匹配计算、卡点分析、成长规划 | 待实现 |
| 材料工厂 Agent | 清单生成、素材匹配、自动填充、AI 预审 | 待实现 |
| 产业协同 Agent | 隐性标签抽取、合作方推荐、协同组网 | 待实现 |
| 产业洞察 Agent | 产业图谱、招商建议、趋势预测 | 待实现 |

## 开发进度

### 已完成（M0 - 骨架搭建 + 页面联调）

- [x] 前后端项目初始化与技术栈集成
- [x] 12 张数据库表 + Alembic 迁移
- [x] 13 个 API 路由模块（30+ 已实现端点）
- [x] 21 个前端页面，全部接入真实 API 数据
- [x] JWT 认证 + 注册登录（自动创建画像）
- [x] 四种角色画像页面（可编辑表单 + 完整度计算）
- [x] 政策库列表（搜索 + 筛选 + 分页）
- [x] 素材管理（上传 + 删除 + 列表）
- [x] 消息中心（分类标签 + 全部已读）
- [x] Docker 生产 / 开发部署配置
- [x] 数据库查看工具脚本

### 待实现

- [ ] M1：短信验证码、OCR 证照识别、画像联动自动更新
- [ ] M2：政策匹配引擎、逻辑锁、卡点分析、成长导航
- [ ] M3：材料工厂（模板 + AI 填充 + 预审循环）
- [ ] M4：园区智能招商、政策推送执行、产业洞察引擎
- [ ] M5：五大 AI Agent 完整实现、协同申报引擎

## License

Private - All Rights Reserved
