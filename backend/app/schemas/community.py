from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CommunityUserInfo(BaseModel):
    id: str
    name: str
    avatar_url: Optional[str] = None
    role: str
    verified: bool = False


class CommunityCommentResponse(BaseModel):
    id: str
    post_id: str
    user: CommunityUserInfo
    body: str
    likes_count: int = 0
    created_at: datetime


class CommunityPostSummary(BaseModel):
    id: str
    user: CommunityUserInfo
    title: str
    body: str
    category: str
    created_at: datetime
    comment_count: int = 0
    likes_count: int = 0
    is_pinned: bool = False
    is_reviewed: bool = False
    liked_by_current_user: bool = False


class CommunityPostDetail(BaseModel):
    id: str
    user: CommunityUserInfo
    title: str
    body: str
    category: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    comment_count: int = 0
    likes_count: int = 0
    is_pinned: bool = False
    is_reviewed: bool = False
    liked_by_current_user: bool = False
    comments: list[CommunityCommentResponse] = []


class CommunityPostCreate(BaseModel):
    title: str
    body: str
    category: str


class CommunityCommentCreate(BaseModel):
    body: str


class LikeToggleResponse(BaseModel):
    liked: bool
    likes_count: int


class PaginatedCommunityPostsResponse(BaseModel):
    items: list[CommunityPostSummary]
    total: int
    page: int
    page_size: int
    total_pages: int
