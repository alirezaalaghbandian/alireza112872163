from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime


class AuditLogBase(BaseModel):
    action: str
    resource_type: str
    resource_id: Optional[str] = None
    description: Optional[str] = None
    severity: str = "info"


class AuditLogCreate(AuditLogBase):
    user_id: Optional[UUID] = None
    user_email: Optional[str] = None
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    old_values: Optional[str] = None
    new_values: Optional[str] = None


class AuditLogResponse(AuditLogBase):
    id: UUID
    user_id: Optional[UUID]
    user_email: Optional[str]
    ip_address: Optional[str]
    old_values: Optional[str]
    new_values: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
