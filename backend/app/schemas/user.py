from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: Optional[str] = None


class UserBase(BaseModel):
    email: str
    full_name: str
    title: Optional[str] = None
    department: Optional[str] = None
    phone: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: UUID
    is_active: bool
    is_superuser: bool
    last_login: Optional[datetime]
    created_at: datetime
    roles: list["RoleResponse"] = []

    class Config:
        from_attributes = True


class RoleBase(BaseModel):
    name: str
    display_name: str
    description: Optional[str] = None


class RoleResponse(RoleBase):
    id: UUID
    is_system: bool
    created_at: datetime

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    email: str
    password: str
