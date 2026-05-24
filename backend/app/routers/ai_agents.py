from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from uuid import UUID
from math import ceil

from app.database import get_db
from app.models.ai_agent import AIAgent, AIRecommendation
from app.schemas.ai_agent import (
    AIAgentCreate, AIAgentResponse,
    AIRecommendationCreate, AIRecommendationResponse,
)
from app.schemas.common import PaginatedResponse

router = APIRouter(prefix="/api", tags=["AI Agents"])


@router.get("/ai-agents", response_model=PaginatedResponse[AIAgentResponse])
def list_ai_agents(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: str = Query(None),
    agent_type: str = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(AIAgent)
    if status:
        query = query.filter(AIAgent.status == status)
    if agent_type:
        query = query.filter(AIAgent.agent_type == agent_type)
    total = query.count()
    items = query.order_by(AIAgent.name).offset((page - 1) * page_size).limit(page_size).all()
    return PaginatedResponse(
        items=items, total=total, page=page, page_size=page_size,
        total_pages=ceil(total / page_size) if total > 0 else 1,
    )


@router.get("/ai-agents/{agent_id}", response_model=AIAgentResponse)
def get_ai_agent(agent_id: UUID, db: Session = Depends(get_db)):
    agent = db.query(AIAgent).filter(AIAgent.id == agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="AI Agent not found")
    return agent


@router.post("/ai-agents", response_model=AIAgentResponse, status_code=201)
def create_ai_agent(agent: AIAgentCreate, db: Session = Depends(get_db)):
    db_agent = AIAgent(**agent.model_dump())
    db.add(db_agent)
    db.commit()
    db.refresh(db_agent)
    return db_agent


@router.get("/ai-recommendations", response_model=PaginatedResponse[AIRecommendationResponse])
def list_ai_recommendations(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    agent_id: UUID = Query(None),
    status: str = Query(None),
    priority: str = Query(None),
    category: str = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(AIRecommendation)
    if agent_id:
        query = query.filter(AIRecommendation.agent_id == agent_id)
    if status:
        query = query.filter(AIRecommendation.status == status)
    if priority:
        query = query.filter(AIRecommendation.priority == priority)
    if category:
        query = query.filter(AIRecommendation.category == category)
    total = query.count()
    items = query.order_by(AIRecommendation.created_at.desc()).offset((page - 1) * page_size).limit(page_size).all()
    return PaginatedResponse(
        items=items, total=total, page=page, page_size=page_size,
        total_pages=ceil(total / page_size) if total > 0 else 1,
    )


@router.post("/ai-recommendations", response_model=AIRecommendationResponse, status_code=201)
def create_ai_recommendation(rec: AIRecommendationCreate, db: Session = Depends(get_db)):
    db_rec = AIRecommendation(**rec.model_dump())
    db.add(db_rec)
    db.commit()
    db.refresh(db_rec)
    return db_rec
