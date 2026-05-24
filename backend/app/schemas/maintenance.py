from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime


class MaintenanceEventBase(BaseModel):
    machine_id: UUID
    plant_id: UUID
    title: str
    description: Optional[str] = None
    event_type: str
    priority: str = "medium"
    status: str = "open"
    assigned_to: Optional[str] = None
    reported_by: Optional[str] = None
    scheduled_date: Optional[datetime] = None
    cost_estimate: float = 0.0


class MaintenanceEventCreate(MaintenanceEventBase):
    pass


class MaintenanceEventResponse(MaintenanceEventBase):
    id: UUID
    started_at: Optional[datetime]
    completed_at: Optional[datetime]
    downtime_hours: float
    actual_cost: float
    parts_used: Optional[str]
    root_cause: Optional[str]
    resolution: Optional[str]
    is_ai_predicted: bool
    ai_confidence: Optional[float]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
