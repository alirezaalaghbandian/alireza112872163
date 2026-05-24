from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime


class DocumentBase(BaseModel):
    title: str
    document_type: str
    category: str
    content: Optional[str] = None
    summary: Optional[str] = None
    plant_id: Optional[UUID] = None
    author: Optional[str] = None
    department: Optional[str] = None
    tags: Optional[str] = None
    classification: str = "internal"
    version: Optional[str] = None


class DocumentCreate(DocumentBase):
    pass


class DocumentResponse(DocumentBase):
    id: UUID
    file_url: Optional[str]
    file_size: Optional[int]
    mime_type: Optional[str]
    is_archived: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
