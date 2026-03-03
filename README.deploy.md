# PolicyCompass 部署文档

## 服务器环境

- 操作系统: Ubuntu
- CPU: 8核
- 内存: 30GB
- Docker: 已安装
- Docker Compose: 已安装

## 端口分配（避免冲突）

原项目端口 → 新端口（生产环境）

- 80 → 8080 (Caddy HTTP)
- 443 → 8443 (Caddy HTTPS)
- 3000 → 3002 (前端)
- 8000 → 8001 (后端)
- 5432 → 使用阿里云数据库（不占用本地端口）

## 快速部署

### 1. 准备工作

确保已安装：
- Docker
- Docker Compose
- curl (用于健康检查)

### 2. 配置数据库

在阿里云 RDS 控制台：
1. 创建 PostgreSQL 数据库实例
2. 创建数据库: `policycompass`
3. 配置白名单，允许服务器 IP 访问
4. 记录连接信息：主机地址、端口、用户名、密码

### 3. 执行部署

```bash
# 克隆代码（如果还没有）
# git clone <repository-url>
# cd <project-directory>

# 赋予执行权限
chmod +x deploy.sh

# 运行部署脚本
./deploy.sh
```

按提示输入：
- 数据库 URL: `postgresql+asyncpg://用户名:密码@数据库地址:5432/policycompass`
- JWT Secret Key: 留空自动生成
- 通义千问 API Key: 你的 API Key
- 域名: 留空或输入域名

### 4. 验证部署

```bash
# 检查容器状态
docker-compose -f docker-compose.prod.yml ps

# 查看日志
docker-compose -f docker-compose.prod.yml logs -f

# 测试后端健康检查
curl http://localhost:8001/health

# 测试前端
curl http://localhost:3002

# 测试 Caddy 代理
curl http://localhost:8080
```

## 常用命令

```bash
# 查看服务状态
docker-compose -f docker-compose.prod.yml ps

# 查看实时日志
docker-compose -f docker-compose.prod.yml logs -f

# 查看特定服务日志
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend

# 重启服务
docker-compose -f docker-compose.prod.yml restart

# 停止服务
docker-compose -f docker-compose.prod.yml down

# 重新构建并启动
docker-compose -f docker-compose.prod.yml up -d --build

# 进入容器
docker-compose -f docker-compose.prod.yml exec backend bash
docker-compose -f docker-compose.prod.yml exec frontend sh
```

## 数据库迁移

```bash
# 查看当前迁移状态
docker-compose -f docker-compose.prod.yml exec backend alembic current

# 升级到最新版本
docker-compose -f docker-compose.prod.yml exec backend alembic upgrade head

# 回滚一个版本
docker-compose -f docker-compose.prod.yml exec backend alembic downgrade -1

# 查看迁移历史
docker-compose -f docker-compose.prod.yml exec backend alembic history
```

## 配置外网访问

### 方式一：使用 Caddy 代理（推荐）

1. 在腾讯云安全组开放端口 8080
2. 访问: `http://服务器公网IP:8080`

### 方式二：配置域名和 HTTPS

1. 将域名解析到服务器 IP
2. 修改 `.env` 文件，设置 `DOMAIN=your-domain.com`
3. 修改 `docker/Caddyfile.prod`，启用自动 HTTPS：

```
{DOMAIN} {
    reverse_proxy frontend:80
    
    handle /api/* {
        reverse_proxy backend:8000
    }
}
```

4. 在腾讯云安全组开放 8080 和 8443 端口
5. 重启服务

## 监控和维护

### 查看资源使用

```bash
# 查看容器资源使用
docker stats

# 查看磁盘使用
docker system df

# 查看服务器资源
free -h
df -h
```

### 清理资源

```bash
# 清理未使用的镜像
docker image prune -a

# 清理未使用的容器
docker container prune

# 清理未使用的卷
docker volume prune

# 清理所有未使用资源
docker system prune -a
```

### 备份

```bash
# 备份上传文件
tar -czf uploads-backup-$(date +%Y%m%d).tar.gz uploads/

# 备份环境配置
cp .env .env.backup
```

## 故障排查

### 服务无法启动

```bash
# 查看详细日志
docker-compose -f docker-compose.prod.yml logs

# 检查端口占用
netstat -tuln | grep -E ':(8080|8443|8001|3002)'

# 检查容器状态
docker-compose -f docker-compose.prod.yml ps
```

### 数据库连接失败

1. 检查 `.env` 中的 `DATABASE_URL` 是否正确
2. 确认阿里云 RDS 白名单已添加服务器 IP
3. 测试数据库连接：

```bash
docker-compose -f docker-compose.prod.yml exec backend python -c "
from app.core.database import engine
import asyncio
asyncio.run(engine.connect())
print('数据库连接成功')
"
```

### 前端无法访问后端

1. 检查 Caddy 配置是否正确
2. 确认后端服务正常运行
3. 查看 Caddy 日志：

```bash
docker-compose -f docker-compose.prod.yml logs caddy
```

## 性能优化

### 限制容器资源

编辑 `docker-compose.prod.yml`，添加资源限制：

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

### 启用日志轮转

编辑 `docker-compose.prod.yml`，添加日志配置：

```yaml
services:
  backend:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

## 安全建议

1. 定期更新 Docker 镜像
2. 使用强密码和复杂的 SECRET_KEY
3. 配置防火墙，只开放必要端口
4. 启用 HTTPS
5. 定期备份数据
6. 监控异常访问日志

## 联系支持

如遇问题，请查看：
- 项目文档: `docs/prd.md`
- 日志文件: `docker-compose -f docker-compose.prod.yml logs`
