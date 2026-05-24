from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from uuid import UUID
from math import ceil

from app.database import get_db
from app.models.knowledge_graph import KnowledgeGraphNode, KnowledgeGraphEdge
from app.schemas.knowledge_graph import (
    KnowledgeGraphNodeCreate, KnowledgeGraphNodeResponse,
    KnowledgeGraphEdgeCreate, KnowledgeGraphEdgeResponse,
)
from app.schemas.common import PaginatedResponse

router = APIRouter(prefix="/api", tags=["Knowledge Graph"])


@router.get("/knowledge-graph/nodes", response_model=PaginatedResponse[KnowledgeGraphNodeResponse])
def list_kg_nodes(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
    entity_type: str = Query(None),
    search: str = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(KnowledgeGraphNode)
    if entity_type:
        query = query.filter(KnowledgeGraphNode.entity_type == entity_type)
    if search:
        query = query.filter(KnowledgeGraphNode.name.ilike(f"%{search}%"))
    total = query.count()
    items = query.order_by(KnowledgeGraphNode.entity_type, KnowledgeGraphNode.name).offset((page - 1) * page_size).limit(page_size).all()
    return PaginatedResponse(
        items=items, total=total, page=page, page_size=page_size,
        total_pages=ceil(total / page_size) if total > 0 else 1,
    )


@router.post("/knowledge-graph/nodes", response_model=KnowledgeGraphNodeResponse, status_code=201)
def create_kg_node(node: KnowledgeGraphNodeCreate, db: Session = Depends(get_db)):
    db_node = KnowledgeGraphNode(**node.model_dump())
    db.add(db_node)
    db.commit()
    db.refresh(db_node)
    return db_node


@router.get("/knowledge-graph/edges", response_model=PaginatedResponse[KnowledgeGraphEdgeResponse])
def list_kg_edges(
    page: int = Query(1, ge=1),
    page_size: int = Query(100, ge=1, le=500),
    source_node_id: UUID = Query(None),
    target_node_id: UUID = Query(None),
    relationship_type: str = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(KnowledgeGraphEdge).filter(KnowledgeGraphEdge.is_active.is_(True))
    if source_node_id:
        query = query.filter(KnowledgeGraphEdge.source_node_id == source_node_id)
    if target_node_id:
        query = query.filter(KnowledgeGraphEdge.target_node_id == target_node_id)
    if relationship_type:
        query = query.filter(KnowledgeGraphEdge.relationship_type == relationship_type)
    total = query.count()
    items = query.order_by(KnowledgeGraphEdge.created_at.desc()).offset((page - 1) * page_size).limit(page_size).all()
    return PaginatedResponse(
        items=items, total=total, page=page, page_size=page_size,
        total_pages=ceil(total / page_size) if total > 0 else 1,
    )


@router.post("/knowledge-graph/edges", response_model=KnowledgeGraphEdgeResponse, status_code=201)
def create_kg_edge(edge: KnowledgeGraphEdgeCreate, db: Session = Depends(get_db)):
    db_edge = KnowledgeGraphEdge(**edge.model_dump())
    db.add(db_edge)
    db.commit()
    db.refresh(db_edge)
    return db_edge
