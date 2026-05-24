from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from uuid import UUID
from math import ceil

from app.database import get_db
from app.models.maintenance import MaintenanceEvent
from app.schemas.maintenance import MaintenanceEventCreate, MaintenanceEventResponse
from app.schemas.common import PaginatedResponse

router = APIRouter(prefix="/api", tags=["Maintenance"])


@router.get("/maintenance-events", response_model=PaginatedResponse[MaintenanceEventResponse])
def list_maintenance_events(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    plant_id: UUID = Query(None),
    machine_id: UUID = Query(None),
    status: str = Query(None),
    event_type: str = Query(None),
    priority: str = Query(None),
    search: str = Query(None),
    sort_by: str = Query("created_at"),
    sort_order: str = Query("desc"),
    db: Session = Depends(get_db),
):
    query = db.query(MaintenanceEvent)
    if plant_id:
        query = query.filter(MaintenanceEvent.plant_id == plant_id)
    if machine_id:
        query = query.filter(MaintenanceEvent.machine_id == machine_id)
    if status:
        query = query.filter(MaintenanceEvent.status == status)
    if event_type:
        query = query.filter(MaintenanceEvent.event_type == event_type)
    if priority:
        query = query.filter(MaintenanceEvent.priority == priority)
    if search:
        query = query.filter(or_(
            MaintenanceEvent.title.ilike(f"%{search}%"),
            MaintenanceEvent.description.ilike(f"%{search}%"),
        ))
    total = query.count()
    sort_col = getattr(MaintenanceEvent, sort_by, MaintenanceEvent.created_at)
    query = query.order_by(sort_col.desc() if sort_order == "desc" else sort_col.asc())
    items = query.offset((page - 1) * page_size).limit(page_size).all()
    return PaginatedResponse(
        items=items, total=total, page=page, page_size=page_size,
        total_pages=ceil(total / page_size) if total > 0 else 1,
    )


@router.post("/maintenance-events", response_model=MaintenanceEventResponse, status_code=201)
def create_maintenance_event(event: MaintenanceEventCreate, db: Session = Depends(get_db)):
    db_event = MaintenanceEvent(**event.model_dump())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event


@router.get("/maintenance-events/{event_id}", response_model=MaintenanceEventResponse)
def get_maintenance_event(event_id: UUID, db: Session = Depends(get_db)):
    event = db.query(MaintenanceEvent).filter(MaintenanceEvent.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Maintenance event not found")
    return event
