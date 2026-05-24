from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from uuid import UUID
from math import ceil

from app.database import get_db
from app.models.plant import Plant, ProductionLine, Machine, Sensor, SensorReading
from app.schemas.plant import (
    PlantCreate, PlantUpdate, PlantResponse,
    ProductionLineCreate, ProductionLineResponse,
    MachineCreate, MachineResponse,
    SensorCreate, SensorResponse,
    SensorReadingCreate, SensorReadingResponse,
)
from app.schemas.common import PaginatedResponse

router = APIRouter(prefix="/api", tags=["Plants & Assets"])


@router.get("/plants", response_model=PaginatedResponse[PlantResponse])
def list_plants(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: str = Query(None),
    status: str = Query(None),
    plant_type: str = Query(None),
    sort_by: str = Query("name"),
    sort_order: str = Query("asc"),
    db: Session = Depends(get_db),
):
    query = db.query(Plant).filter(Plant.is_active.is_(True))
    if search:
        query = query.filter(or_(Plant.name.ilike(f"%{search}%"), Plant.code.ilike(f"%{search}%")))
    if status:
        query = query.filter(Plant.status == status)
    if plant_type:
        query = query.filter(Plant.plant_type == plant_type)

    total = query.count()
    sort_col = getattr(Plant, sort_by, Plant.name)
    query = query.order_by(sort_col.asc() if sort_order == "asc" else sort_col.desc())
    items = query.offset((page - 1) * page_size).limit(page_size).all()

    return PaginatedResponse(
        items=items, total=total, page=page, page_size=page_size,
        total_pages=ceil(total / page_size) if total > 0 else 1,
    )


@router.post("/plants", response_model=PlantResponse, status_code=201)
def create_plant(plant: PlantCreate, db: Session = Depends(get_db)):
    db_plant = Plant(**plant.model_dump())
    db.add(db_plant)
    db.commit()
    db.refresh(db_plant)
    return db_plant


@router.get("/plants/{plant_id}", response_model=PlantResponse)
def get_plant(plant_id: UUID, db: Session = Depends(get_db)):
    plant = db.query(Plant).filter(Plant.id == plant_id).first()
    if not plant:
        raise HTTPException(status_code=404, detail="Plant not found")
    return plant


@router.put("/plants/{plant_id}", response_model=PlantResponse)
def update_plant(plant_id: UUID, plant_update: PlantUpdate, db: Session = Depends(get_db)):
    plant = db.query(Plant).filter(Plant.id == plant_id).first()
    if not plant:
        raise HTTPException(status_code=404, detail="Plant not found")
    for field, value in plant_update.model_dump(exclude_unset=True).items():
        setattr(plant, field, value)
    db.commit()
    db.refresh(plant)
    return plant


@router.get("/production-lines", response_model=PaginatedResponse[ProductionLineResponse])
def list_production_lines(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    plant_id: UUID = Query(None),
    status: str = Query(None),
    search: str = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(ProductionLine)
    if plant_id:
        query = query.filter(ProductionLine.plant_id == plant_id)
    if status:
        query = query.filter(ProductionLine.status == status)
    if search:
        query = query.filter(ProductionLine.name.ilike(f"%{search}%"))
    total = query.count()
    items = query.order_by(ProductionLine.name).offset((page - 1) * page_size).limit(page_size).all()
    return PaginatedResponse(
        items=items, total=total, page=page, page_size=page_size,
        total_pages=ceil(total / page_size) if total > 0 else 1,
    )


@router.post("/production-lines", response_model=ProductionLineResponse, status_code=201)
def create_production_line(line: ProductionLineCreate, db: Session = Depends(get_db)):
    db_line = ProductionLine(**line.model_dump())
    db.add(db_line)
    db.commit()
    db.refresh(db_line)
    return db_line


@router.get("/machines", response_model=PaginatedResponse[MachineResponse])
def list_machines(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
    production_line_id: UUID = Query(None),
    status: str = Query(None),
    machine_type: str = Query(None),
    search: str = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(Machine)
    if production_line_id:
        query = query.filter(Machine.production_line_id == production_line_id)
    if status:
        query = query.filter(Machine.status == status)
    if machine_type:
        query = query.filter(Machine.machine_type == machine_type)
    if search:
        query = query.filter(or_(Machine.name.ilike(f"%{search}%"), Machine.code.ilike(f"%{search}%")))
    total = query.count()
    items = query.order_by(Machine.name).offset((page - 1) * page_size).limit(page_size).all()
    return PaginatedResponse(
        items=items, total=total, page=page, page_size=page_size,
        total_pages=ceil(total / page_size) if total > 0 else 1,
    )


@router.post("/machines", response_model=MachineResponse, status_code=201)
def create_machine(machine: MachineCreate, db: Session = Depends(get_db)):
    db_machine = Machine(**machine.model_dump())
    db.add(db_machine)
    db.commit()
    db.refresh(db_machine)
    return db_machine


@router.get("/sensors", response_model=PaginatedResponse[SensorResponse])
def list_sensors(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
    machine_id: UUID = Query(None),
    sensor_type: str = Query(None),
    status: str = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(Sensor)
    if machine_id:
        query = query.filter(Sensor.machine_id == machine_id)
    if sensor_type:
        query = query.filter(Sensor.sensor_type == sensor_type)
    if status:
        query = query.filter(Sensor.status == status)
    total = query.count()
    items = query.order_by(Sensor.name).offset((page - 1) * page_size).limit(page_size).all()
    return PaginatedResponse(
        items=items, total=total, page=page, page_size=page_size,
        total_pages=ceil(total / page_size) if total > 0 else 1,
    )


@router.post("/sensors", response_model=SensorResponse, status_code=201)
def create_sensor(sensor: SensorCreate, db: Session = Depends(get_db)):
    db_sensor = Sensor(**sensor.model_dump())
    db.add(db_sensor)
    db.commit()
    db.refresh(db_sensor)
    return db_sensor


@router.get("/sensor-readings", response_model=PaginatedResponse[SensorReadingResponse])
def list_sensor_readings(
    sensor_id: UUID = Query(...),
    page: int = Query(1, ge=1),
    page_size: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
):
    query = db.query(SensorReading).filter(SensorReading.sensor_id == sensor_id)
    total = query.count()
    items = query.order_by(SensorReading.timestamp.desc()).offset((page - 1) * page_size).limit(page_size).all()
    return PaginatedResponse(
        items=items, total=total, page=page, page_size=page_size,
        total_pages=ceil(total / page_size) if total > 0 else 1,
    )


@router.post("/sensor-readings", response_model=SensorReadingResponse, status_code=201)
def create_sensor_reading(reading: SensorReadingCreate, db: Session = Depends(get_db)):
    db_reading = SensorReading(**reading.model_dump())
    db.add(db_reading)
    db.commit()
    db.refresh(db_reading)
    return db_reading
