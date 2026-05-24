from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime


class AIAgentBase(BaseModel):
    name: str
    code: str
    agent_type: str
    description: Optional[str] = None
    status: str = "idle"
    model_provider: str = "openai"
    model_name: Optional[str] = None
    requires_approval: bool = True


class AIAgentCreate(AIAgentBase):
    pass


class AIAgentResponse(AIAgentBase):
    id: UUID
    confidence_score: float
    risk_level: str
    current_task: Optional[str]
    last_recommendation: Optional[str]
    last_run_at: Optional[datetime]
    total_runs: int
    success_rate: float
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class AIRecommendationBase(BaseModel):
    agent_id: UUID
    title: str
    description: Optional[str] = None
    category: str
    priority: str = "medium"
    confidence: float = 0.0
    risk_level: str = "low"
    impact_area: Optional[str] = None
    estimated_savings: Optional[float] = None


class AIRecommendationCreate(AIRecommendationBase):
    pass


class AIRecommendationResponse(AIRecommendationBase):
    id: UUID
    status: str
    approved_by: Optional[str]
    approved_at: Optional[datetime]
    source_data: Optional[str]
    explainability: Optional[str]
    model_used: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
