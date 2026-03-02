from fastapi import APIRouter

from app.api.v1 import (
    applications,
    auth,
    chat,
    collaboration,
    enterprises,
    insights,
    matching,
    materials,
    messages,
    parks,
    policies,
    talents,
    users,
)

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(auth.router, prefix="/auth", tags=["认证"])
api_router.include_router(users.router, prefix="/users", tags=["用户"])
api_router.include_router(enterprises.router, prefix="/enterprises", tags=["企业画像"])
api_router.include_router(talents.router, prefix="/talents", tags=["人才画像"])
api_router.include_router(parks.router, prefix="/parks", tags=["园区"])
api_router.include_router(policies.router, prefix="/policies", tags=["政策"])
api_router.include_router(matching.router, prefix="/matching", tags=["智能匹配"])
api_router.include_router(materials.router, prefix="/materials", tags=["素材管理"])
api_router.include_router(applications.router, prefix="/applications", tags=["申报"])
api_router.include_router(collaboration.router, prefix="/collaboration", tags=["产业协同"])
api_router.include_router(insights.router, prefix="/insights", tags=["产业洞察"])
api_router.include_router(chat.router, prefix="/chat", tags=["AI对话"])
api_router.include_router(messages.router, prefix="/messages", tags=["消息中心"])
