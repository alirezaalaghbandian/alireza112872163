from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from uuid import UUID
from math import ceil

from app.database import get_db
from app.models.audit import AuditLog
from app.schemas.audit import AuditLogCreate, AuditLogResponse
from app.schemas.common import PaginatedResponse

router = APIRouter(prefix="/api", tags=["Audit"])


@router.get("/audit-logs", response_model=PaginatedResponse[AuditLogResponse])
def list_audit_logs(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    user_id: UUID = Query(None),
    action: str = Query(None),
    resource_type: str = Query(None),
    severity: str = Query(None),
    search: str = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(AuditLog)
    if user_id:
        query = query.filter(AuditLog.user_id == user_id)
    if action:
        query = query.filter(AuditLog.action == action)
    if resource_type:
        query = query.filter(AuditLog.resource_type == resource_type)
    if severity:
        query = query.filter(AuditLog.severity == severity)
    if search:
        query = query.filter(AuditLog.description.ilike(f"%{search}%"))
    total = query.count()
    items = query.order_by(AuditLog.created_at.desc()).offset((page - 1) * page_size).limit(page_size).all()
    return PaginatedResponse(
        items=items, total=total, page=page, page_size=page_size,
        total_pages=ceil(total / page_size) if total > 0 else 1,
    )


@router.post("/audit-logs", response_model=AuditLogResponse, status_code=201)
def create_audit_log(log: AuditLogCreate, db: Session = Depends(get_db)):
    db_log = AuditLog(**log.model_dump())
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log
