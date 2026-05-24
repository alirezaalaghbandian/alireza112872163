from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.plant import Plant, Machine
from app.models.maintenance import MaintenanceEvent
from app.models.erp import ProcurementOrder, InventoryItem
from app.models.ai_agent import AIAgent, AIRecommendation

router = APIRouter(prefix="/api", tags=["KPIs"])


@router.get("/kpis/executive-summary")
def get_executive_summary(db: Session = Depends(get_db)):
    total_plants = db.query(func.count(Plant.id)).scalar() or 0
    operational_plants = db.query(func.count(Plant.id)).filter(Plant.status == "operational").scalar() or 0
    avg_health = db.query(func.avg(Plant.health_score)).scalar() or 0

    total_machines = db.query(func.count(Machine.id)).scalar() or 0
    machines_running = db.query(func.count(Machine.id)).filter(Machine.status == "running").scalar() or 0
    machines_warning = db.query(func.count(Machine.id)).filter(Machine.status == "warning").scalar() or 0
    machines_critical = db.query(func.count(Machine.id)).filter(Machine.status == "critical").scalar() or 0

    open_maintenance = db.query(func.count(MaintenanceEvent.id)).filter(
        MaintenanceEvent.status.in_(["open", "in_progress"])
    ).scalar() or 0
    critical_maintenance = db.query(func.count(MaintenanceEvent.id)).filter(
        MaintenanceEvent.priority == "critical",
        MaintenanceEvent.status.in_(["open", "in_progress"]),
    ).scalar() or 0

    pending_procurement = db.query(func.count(ProcurementOrder.id)).filter(
        ProcurementOrder.status.in_(["draft", "pending_approval", "ordered"])
    ).scalar() or 0
    procurement_value = db.query(func.sum(ProcurementOrder.total_amount)).filter(
        ProcurementOrder.status.in_(["ordered", "in_transit"])
    ).scalar() or 0

    low_stock_items = db.query(func.count(InventoryItem.id)).filter(
        InventoryItem.status.in_(["low_stock", "out_of_stock"])
    ).scalar() or 0

    active_agents = db.query(func.count(AIAgent.id)).filter(AIAgent.status == "running").scalar() or 0
    pending_recommendations = db.query(func.count(AIRecommendation.id)).filter(
        AIRecommendation.status == "pending"
    ).scalar() or 0

    return {
        "production": {
            "total_plants": total_plants,
            "operational_plants": operational_plants,
            "avg_health_score": round(float(avg_health), 1),
            "total_machines": total_machines,
            "machines_running": machines_running,
            "machines_warning": machines_warning,
            "machines_critical": machines_critical,
            "production_today_tons": 847.5,
            "production_target_tons": 900.0,
            "yield_percent": 94.2,
        },
        "energy": {
            "total_consumption_mwh": 156.8,
            "energy_per_ton": 0.185,
            "peak_demand_kw": 42500,
            "energy_cost_today": 2850000000,
            "trend": "decreasing",
        },
        "maintenance": {
            "open_work_orders": open_maintenance,
            "critical_alerts": critical_maintenance,
            "avg_downtime_hours": 2.3,
            "maintenance_backlog": open_maintenance,
            "mtbf_hours": 720,
            "mttr_hours": 4.5,
            "predictive_alerts": 3,
        },
        "finance": {
            "monthly_revenue": 185000000000,
            "monthly_expenses": 142000000000,
            "cash_exposure": 28500000000,
            "budget_variance_percent": -3.2,
            "procurement_pending_value": float(procurement_value),
        },
        "procurement": {
            "pending_orders": pending_procurement,
            "low_stock_items": low_stock_items,
            "delayed_deliveries": 2,
            "risk_level": "medium",
        },
        "ai": {
            "active_agents": active_agents,
            "pending_recommendations": pending_recommendations,
            "total_savings_potential": 4500000000,
            "recommendations_implemented": 12,
        },
        "risk_heatmap": [
            {"area": "Furnace A Temperature", "risk": "high", "score": 78},
            {"area": "Refractory Wear", "risk": "high", "score": 72},
            {"area": "Procurement Delays", "risk": "medium", "score": 55},
            {"area": "Energy Cost Overrun", "risk": "medium", "score": 48},
            {"area": "Inventory Shortage", "risk": "low", "score": 32},
            {"area": "HR Workforce Gap", "risk": "low", "score": 25},
        ],
    }
