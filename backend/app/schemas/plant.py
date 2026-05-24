from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime


class PlantBase(BaseModel):
    name: str
    code: str
    plant_type: str
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    capacity: Optional[str] = None
    status: str = "operational"
    health_score: float = 85.0
    energy_rating: Optional[str] = None
    year_established: Optional[int] = None
    manager_name: Optional[str] = None
    description: Optional[str] = None


class PlantCreate(PlantBase):
    pass


class PlantUpdate(BaseModel):
    name: Optional[str] = None
    plant_type: Optional[str] = None
    location: Optional[str] = None
    status: Optional[str] = None
    health_score: Optional[float] = None
    manager_name: Optional[str] = None
    description: Optional[str] = None


class PlantResponse(PlantBase):
    id: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ProductionLineBase(BaseModel):
    plant_id: UUID
    name: str
    code: str
    line_type: str
    status: str = "running"
    capacity_tons_per_day: Optional[float] = None
    current_output: Optional[float] = None
    efficiency: float = 85.0
    product_type: Optional[str] = None
    description: Optional[str] = None


class ProductionLineCreate(ProductionLineBase):
    pass


class ProductionLineResponse(ProductionLineBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class MachineBase(BaseModel):
    production_line_id: UUID
    name: str
    code: str
    machine_type: str
    manufacturer: Optional[str] = None
    model: Optional[str] = None
    serial_number: Optional[str] = None
    status: str = "running"
    health_score: float = 90.0
    power_rating_kw: Optional[float] = None
    criticality: str = "medium"
    description: Optional[str] = None


class MachineCreate(MachineBase):
    pass


class MachineResponse(MachineBase):
    id: UUID
    operating_hours: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class SensorBase(BaseModel):
    machine_id: UUID
    name: str
    code: str
    sensor_type: str
    unit: str
    min_value: Optional[float] = None
    max_value: Optional[float] = None
    warning_threshold: Optional[float] = None
    critical_threshold: Optional[float] = None


class SensorCreate(SensorBase):
    pass


class SensorResponse(SensorBase):
    id: UUID
    current_value: Optional[float]
    status: str
    last_reading_at: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True


class SensorReadingBase(BaseModel):
    sensor_id: UUID
    value: float
    quality: str = "good"
    timestamp: datetime


class SensorReadingCreate(SensorReadingBase):
    pass


class SensorReadingResponse(SensorReadingBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
