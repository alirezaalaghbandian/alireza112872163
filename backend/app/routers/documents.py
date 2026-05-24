from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from uuid import UUID
from math import ceil

from app.database import get_db
from app.models.document import Document
from app.schemas.document import DocumentCreate, DocumentResponse
from app.schemas.common import PaginatedResponse

router = APIRouter(prefix="/api", tags=["Documents"])


@router.get("/documents", response_model=PaginatedResponse[DocumentResponse])
def list_documents(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    document_type: str = Query(None),
    category: str = Query(None),
    classification: str = Query(None),
    plant_id: UUID = Query(None),
    search: str = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(Document).filter(Document.is_archived.is_(False))
    if document_type:
        query = query.filter(Document.document_type == document_type)
    if category:
        query = query.filter(Document.category == category)
    if classification:
        query = query.filter(Document.classification == classification)
    if plant_id:
        query = query.filter(Document.plant_id == plant_id)
    if search:
        query = query.filter(or_(
            Document.title.ilike(f"%{search}%"),
            Document.content.ilike(f"%{search}%"),
            Document.tags.ilike(f"%{search}%"),
        ))
    total = query.count()
    items = query.order_by(Document.created_at.desc()).offset((page - 1) * page_size).limit(page_size).all()
    return PaginatedResponse(
        items=items, total=total, page=page, page_size=page_size,
        total_pages=ceil(total / page_size) if total > 0 else 1,
    )


@router.get("/documents/{document_id}", response_model=DocumentResponse)
def get_document(document_id: UUID, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc


@router.post("/documents", response_model=DocumentResponse, status_code=201)
def create_document(doc: DocumentCreate, db: Session = Depends(get_db)):
    db_doc = Document(**doc.model_dump())
    db.add(db_doc)
    db.commit()
    db.refresh(db_doc)
    return db_doc
