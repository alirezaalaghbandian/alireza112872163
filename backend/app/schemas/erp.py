from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime


class InventoryItemBase(BaseModel):
    plant_id: UUID
    name: str
    code: str
    category: str
    unit: str
    quantity: float = 0.0
    min_stock: float = 0.0
    max_stock: Optional[float] = None
    unit_cost: float = 0.0
    location: Optional[str] = None
    supplier: Optional[str] = None
    status: str = "in_stock"


class InventoryItemCreate(InventoryItemBase):
    pass


class InventoryItemResponse(InventoryItemBase):
    id: UUID
    total_value: float
    last_restock_date: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ProcurementOrderBase(BaseModel):
    plant_id: UUID
    order_number: str
    title: str
    supplier: str
    category: str
    total_amount: float = 0.0
    currency: str = "IRR"
    status: str = "draft"
    priority: str = "medium"
    requested_by: Optional[str] = None
    expected_delivery: Optional[datetime] = None
    notes: Optional[str] = None
    risk_level: str = "low"


class ProcurementOrderCreate(ProcurementOrderBase):
    pass


class ProcurementOrderResponse(ProcurementOrderBase):
    id: UUID
    approved_by: Optional[str]
    order_date: Optional[datetime]
    actual_delivery: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class FinancialRecordBase(BaseModel):
    plant_id: Optional[UUID] = None
    record_type: str
    category: str
    description: str
    amount: float
    currency: str = "IRR"
    fiscal_year: int
    fiscal_month: int
    cost_center: Optional[str] = None
    project_code: Optional[str] = None
    status: str = "recorded"


class FinancialRecordCreate(FinancialRecordBase):
    pass


class FinancialRecordResponse(FinancialRecordBase):
    id: UUID
    approved_by: Optional[str]
    notes: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class ContractBase(BaseModel):
    plant_id: Optional[UUID] = None
    contract_number: str
    title: str
    contract_type: str
    counterparty: str
    total_value: float = 0.0
    currency: str = "IRR"
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    status: str = "draft"
    risk_level: str = "low"
    responsible_person: Optional[str] = None
    description: Optional[str] = None


class ContractCreate(ContractBase):
    pass


class ContractResponse(ContractBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class HRRecordBase(BaseModel):
    plant_id: Optional[UUID] = None
    employee_id: str
    full_name: str
    department: str
    position: str
    employment_type: str = "full_time"
    hire_date: Optional[datetime] = None
    status: str = "active"
    skills: Optional[str] = None
    performance_score: Optional[float] = None
    salary_grade: Optional[str] = None


class HRRecordCreate(HRRecordBase):
    pass


class HRRecordResponse(HRRecordBase):
    id: UUID
    certifications: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
