from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime


class KnowledgeGraphNodeBase(BaseModel):
    entity_type: str
    entity_id: str
    name: str
    properties: Optional[str] = None
    status: str = "active"
    importance: float = 0.5


class KnowledgeGraphNodeCreate(KnowledgeGraphNodeBase):
    pass


class KnowledgeGraphNodeResponse(KnowledgeGraphNodeBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class KnowledgeGraphEdgeBase(BaseModel):
    source_node_id: UUID
    target_node_id: UUID
    relationship_type: str
    properties: Optional[str] = None
    weight: float = 1.0


class KnowledgeGraphEdgeCreate(KnowledgeGraphEdgeBase):
    pass


class KnowledgeGraphEdgeResponse(KnowledgeGraphEdgeBase):
    id: UUID
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
