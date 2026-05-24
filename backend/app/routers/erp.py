from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from uuid import UUID
from math import ceil

from app.database import get_db
from app.models.erp import InventoryItem, ProcurementOrder, FinancialRecord, Contract, HRRecord
from app.schemas.erp import (
    InventoryItemCreate, InventoryItemResponse,
    ProcurementOrderCreate, ProcurementOrderResponse,
    FinancialRecordCreate, FinancialRecordResponse,
    ContractCreate, ContractResponse,
    HRRecordCreate, HRRecordResponse,
)
from app.schemas.common import PaginatedResponse

router = APIRouter(prefix="/api", tags=["ERP"])


# --- Inventory ---
@router.get("/inventory", response_model=PaginatedResponse[InventoryItemResponse])
def list_inventory(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    plant_id: UUID = Query(None),
    category: str = Query(None),
    status: str = Query(None),
    search: str = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(InventoryItem)
    if plant_id:
        query = query.filter(InventoryItem.plant_id == plant_id)
    if category:
        query = query.filter(InventoryItem.category == category)
    if status:
        query = query.filter(InventoryItem.status == status)
    if search:
        query = query.filter(or_(InventoryItem.name.ilike(f"%{search}%"), InventoryItem.code.ilike(f"%{search}%")))
    total = query.count()
    items = query.order_by(InventoryItem.name).offset((page - 1) * page_size).limit(page_size).all()
    return PaginatedResponse(
        items=items, total=total, page=page, page_size=page_size,
        total_pages=ceil(total / page_size) if total > 0 else 1,
    )


@router.post("/inventory", response_model=InventoryItemResponse, status_code=201)
def create_inventory_item(item: InventoryItemCreate, db: Session = Depends(get_db)):
    db_item = InventoryItem(**item.model_dump(), total_value=item.quantity * item.unit_cost)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


# --- Procurement ---
@router.get("/procurement", response_model=PaginatedResponse[ProcurementOrderResponse])
def list_procurement_orders(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    plant_id: UUID = Query(None),
    status: str = Query(None),
    priority: str = Query(None),
    search: str = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(ProcurementOrder)
    if plant_id:
        query = query.filter(ProcurementOrder.plant_id == plant_id)
    if status:
        query = query.filter(ProcurementOrder.status == status)
    if priority:
        query = query.filter(ProcurementOrder.priority == priority)
    if search:
        query = query.filter(or_(
            ProcurementOrder.title.ilike(f"%{search}%"),
            ProcurementOrder.order_number.ilike(f"%{search}%"),
        ))
    total = query.count()
    items = query.order_by(ProcurementOrder.created_at.desc()).offset((page - 1) * page_size).limit(page_size).all()
    return PaginatedResponse(
        items=items, total=total, page=page, page_size=page_size,
        total_pages=ceil(total / page_size) if total > 0 else 1,
    )


@router.post("/procurement", response_model=ProcurementOrderResponse, status_code=201)
def create_procurement_order(order: ProcurementOrderCreate, db: Session = Depends(get_db)):
    db_order = ProcurementOrder(**order.model_dump())
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order


# --- Finance ---
@router.get("/finance", response_model=PaginatedResponse[FinancialRecordResponse])
def list_financial_records(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    plant_id: UUID = Query(None),
    record_type: str = Query(None),
    category: str = Query(None),
    fiscal_year: int = Query(None),
    search: str = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(FinancialRecord)
    if plant_id:
        query = query.filter(FinancialRecord.plant_id == plant_id)
    if record_type:
        query = query.filter(FinancialRecord.record_type == record_type)
    if category:
        query = query.filter(FinancialRecord.category == category)
    if fiscal_year:
        query = query.filter(FinancialRecord.fiscal_year == fiscal_year)
    if search:
        query = query.filter(FinancialRecord.description.ilike(f"%{search}%"))
    total = query.count()
    items = query.order_by(FinancialRecord.created_at.desc()).offset((page - 1) * page_size).limit(page_size).all()
    return PaginatedResponse(
        items=items, total=total, page=page, page_size=page_size,
        total_pages=ceil(total / page_size) if total > 0 else 1,
    )


@router.post("/finance", response_model=FinancialRecordResponse, status_code=201)
def create_financial_record(record: FinancialRecordCreate, db: Session = Depends(get_db)):
    db_record = FinancialRecord(**record.model_dump())
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record


# --- Contracts ---
@router.get("/contracts", response_model=PaginatedResponse[ContractResponse])
def list_contracts(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: str = Query(None),
    contract_type: str = Query(None),
    search: str = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(Contract)
    if status:
        query = query.filter(Contract.status == status)
    if contract_type:
        query = query.filter(Contract.contract_type == contract_type)
    if search:
        query = query.filter(or_(
            Contract.title.ilike(f"%{search}%"),
            Contract.contract_number.ilike(f"%{search}%"),
        ))
    total = query.count()
    items = query.order_by(Contract.created_at.desc()).offset((page - 1) * page_size).limit(page_size).all()
    return PaginatedResponse(
        items=items, total=total, page=page, page_size=page_size,
        total_pages=ceil(total / page_size) if total > 0 else 1,
    )


@router.post("/contracts", response_model=ContractResponse, status_code=201)
def create_contract(contract: ContractCreate, db: Session = Depends(get_db)):
    db_contract = Contract(**contract.model_dump())
    db.add(db_contract)
    db.commit()
    db.refresh(db_contract)
    return db_contract


# --- HR ---
@router.get("/hr", response_model=PaginatedResponse[HRRecordResponse])
def list_hr_records(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    plant_id: UUID = Query(None),
    department: str = Query(None),
    status: str = Query(None),
    search: str = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(HRRecord)
    if plant_id:
        query = query.filter(HRRecord.plant_id == plant_id)
    if department:
        query = query.filter(HRRecord.department == department)
    if status:
        query = query.filter(HRRecord.status == status)
    if search:
        query = query.filter(or_(
            HRRecord.full_name.ilike(f"%{search}%"),
            HRRecord.employee_id.ilike(f"%{search}%"),
        ))
    total = query.count()
    items = query.order_by(HRRecord.full_name).offset((page - 1) * page_size).limit(page_size).all()
    return PaginatedResponse(
        items=items, total=total, page=page, page_size=page_size,
        total_pages=ceil(total / page_size) if total > 0 else 1,
    )


@router.post("/hr", response_model=HRRecordResponse, status_code=201)
def create_hr_record(record: HRRecordCreate, db: Session = Depends(get_db)):
    db_record = HRRecord(**record.model_dump())
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record
