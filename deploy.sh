#!/bin/bash

# PolicyCompass 一键部署脚本
# 适用于腾讯云服务器（端口已调整避免冲突）

set -e

echo "=========================================="
echo "PolicyCompass 部署脚本"
echo "=========================================="

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo -e "${RED}错误: Docker 未安装${NC}"
    exit 1
fi

# 检查 docker-compose 是否安装
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}错误: docker-compose 未安装${NC}"
    exit 1
fi

# 配置环境变量
echo -e "${YELLOW}步骤 1/6: 配置环境变量${NC}"
if [ ! -f .env ]; then
    echo -e "${YELLOW}未找到 .env 文件，请输入配置信息：${NC}"
    
    read -p "数据库 URL (格式: postgresql+asyncpg://user:password@host:port/dbname): " DATABASE_URL
    read -p "JWT Secret Key (留空自动生成): " SECRET_KEY
    read -p "通义千问 API Key: " QWEN_API_KEY
    read -p "域名 (留空使用 localhost): " DOMAIN
    
    # 生成随机 SECRET_KEY
    if [ -z "$SECRET_KEY" ]; then
        SECRET_KEY=$(openssl rand -hex 32)
        echo -e "${GREEN}已自动生成 SECRET_KEY${NC}"
    fi
    
    # 创建 .env 文件
    cat > .env << EOF
# PostgreSQL (使用阿里云数据库)
DATABASE_URL=${DATABASE_URL}

# JWT
SECRET_KEY=${SECRET_KEY}
ACCESS_TOKEN_EXPIRE_MINUTES=60

# Qwen (通义千问)
QWEN_API_KEY=${QWEN_API_KEY}
QWEN_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
QWEN_MODEL=qwen-plus

# File uploads
UPLOAD_DIR=./uploads

# Domain
DOMAIN=${DOMAIN:-localhost}
EOF
    echo -e "${GREEN}.env 文件已创建${NC}"
else
    echo -e "${GREEN}.env 文件已存在，跳过配置${NC}"
fi

# 停止旧容器
echo -e "${YELLOW}步骤 2/6: 停止旧容器（如果存在）${NC}"
docker-compose -f docker-compose.prod.yml down 2>/dev/null || true

# 清理未使用的 Docker 资源（可选）
read -p "是否清理未使用的 Docker 镜像和容器？(y/N): " CLEANUP
if [ "$CLEANUP" = "y" ] || [ "$CLEANUP" = "Y" ]; then
    echo -e "${YELLOW}清理 Docker 资源...${NC}"
    docker system prune -f
    echo -e "${GREEN}清理完成${NC}"
fi

# 构建镜像
echo -e "${YELLOW}步骤 3/6: 构建 Docker 镜像${NC}"
docker-compose -f docker-compose.prod.yml build --no-cache

# 运行数据库迁移
echo -e "${YELLOW}步骤 4/6: 运行数据库迁移${NC}"
docker-compose -f docker-compose.prod.yml run --rm backend alembic upgrade head

# 启动服务
echo -e "${YELLOW}步骤 5/6: 启动服务${NC}"
docker-compose -f docker-compose.prod.yml up -d

# 等待服务启动
echo -e "${YELLOW}步骤 6/6: 等待服务启动...${NC}"
sleep 10

# 检查服务状态
echo -e "${YELLOW}检查服务状态...${NC}"
docker-compose -f docker-compose.prod.yml ps

# 健康检查
echo -e "${YELLOW}执行健康检查...${NC}"
if curl -f http://localhost:8001/health &> /dev/null; then
    echo -e "${GREEN}✓ 后端服务运行正常${NC}"
else
    echo -e "${RED}✗ 后端服务健康检查失败${NC}"
fi

if curl -f http://localhost:3002 &> /dev/null; then
    echo -e "${GREEN}✓ 前端服务运行正常${NC}"
else
    echo -e "${RED}✗ 前端服务健康检查失败${NC}"
fi

if curl -f http://localhost:8090 &> /dev/null; then
    echo -e "${GREEN}✓ Caddy 代理运行正常${NC}"
else
    echo -e "${RED}✗ Caddy 代理健康检查失败${NC}"
fi

echo ""
echo "=========================================="
echo -e "${GREEN}部署完成！${NC}"
echo "=========================================="
echo ""
echo "服务访问地址："
echo "  - 主入口 (Caddy):  http://localhost:8090"
echo "  - 前端直连:        http://localhost:3002"
echo "  - 后端 API:        http://localhost:8001"
echo ""
echo "端口说明（已避免冲突）："
echo "  - 8090:  Caddy HTTP (原 80，避开 8080 冲突)"
echo "  - 8453:  Caddy HTTPS (原 443)"
echo "  - 3002:  前端服务 (原 3000)"
echo "  - 8001:  后端 API (原 8000)"
echo ""
echo "常用命令："
echo "  查看日志:   docker-compose -f docker-compose.prod.yml logs -f"
echo "  停止服务:   docker-compose -f docker-compose.prod.yml down"
echo "  重启服务:   docker-compose -f docker-compose.prod.yml restart"
echo "  查看状态:   docker-compose -f docker-compose.prod.yml ps"
echo ""
echo "注意事项："
echo "  1. 请确保阿里云数据库可以从此服务器访问"
echo "  2. 如需外网访问，请在腾讯云安全组开放 8090 端口"
echo "  3. 生产环境建议配置域名和 HTTPS"
echo ""
