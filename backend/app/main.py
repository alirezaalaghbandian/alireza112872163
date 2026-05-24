from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine, Base, SessionLocal
from app.routers import auth, plants, maintenance, erp, ai_agents, documents, knowledge_graph, audit, kpis
from app.seed import seed_database

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Enterprise-grade Industrial AI Operating System connecting traditional factories to modern AI-native operations.",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(plants.router)
app.include_router(maintenance.router)
app.include_router(erp.router)
app.include_router(ai_agents.router)
app.include_router(documents.router)
app.include_router(knowledge_graph.router)
app.include_router(audit.router)
app.include_router(kpis.router)


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()


@app.get("/api/health")
def health_check():
    return {"status": "healthy", "version": settings.APP_VERSION, "app": settings.APP_NAME}
