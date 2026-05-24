"""Seed data for the LINK Industrial Intelligence Platform."""
import uuid
from datetime import datetime, timedelta
import random

from sqlalchemy.orm import Session

from app.models.user import User, Role, UserRole
from app.models.plant import Plant, ProductionLine, Machine, Sensor, SensorReading
from app.models.maintenance import MaintenanceEvent
from app.models.erp import InventoryItem, ProcurementOrder, FinancialRecord, Contract, HRRecord
from app.models.ai_agent import AIAgent, AIRecommendation
from app.models.document import Document
from app.models.knowledge_graph import KnowledgeGraphNode, KnowledgeGraphEdge
from app.models.audit import AuditLog
from app.services.auth import get_password_hash


def seed_database(db: Session):
    """Populate database with realistic industrial data."""
    if db.query(Plant).count() > 0:
        print("Database already seeded. Skipping.")
        return

    print("Seeding database...")

    # --- Roles ---
    roles_data = [
        ("chairman", "Chairman", "Board Chairman with full oversight"),
        ("ceo", "CEO", "Chief Executive Officer"),
        ("cfo", "CFO", "Chief Financial Officer"),
        ("plant_manager", "Plant Manager", "Plant operations manager"),
        ("production_manager", "Production Manager", "Production line manager"),
        ("maintenance_manager", "Maintenance Manager", "Maintenance and reliability manager"),
        ("hr_manager", "HR Manager", "Human resources manager"),
        ("procurement_manager", "Procurement Manager", "Procurement and supply chain manager"),
        ("data_scientist", "Data Scientist", "Data science and analytics"),
        ("ai_operator", "AI Agent Operator", "AI agent operations and monitoring"),
        ("external_auditor", "External Auditor", "External audit and compliance"),
        ("admin", "System Administrator", "System administration and configuration"),
    ]
    roles = {}
    for name, display, desc in roles_data:
        role = Role(name=name, display_name=display, description=desc, is_system=True)
        db.add(role)
        roles[name] = role

    # --- Users ---
    admin_user = User(
        email="admin@link-platform.ir",
        hashed_password=get_password_hash("admin123"),
        full_name="System Administrator",
        title="IT Director",
        department="IT",
        is_active=True,
        is_superuser=True,
    )
    db.add(admin_user)

    ceo_user = User(
        email="ceo@link-platform.ir",
        hashed_password=get_password_hash("ceo123"),
        full_name="Mohammad Rezaei",
        title="Chief Executive Officer",
        department="Executive",
        is_active=True,
    )
    db.add(ceo_user)

    cfo_user = User(
        email="cfo@link-platform.ir",
        hashed_password=get_password_hash("cfo123"),
        full_name="Ali Mohammadi",
        title="Chief Financial Officer",
        department="Finance",
        is_active=True,
    )
    db.add(cfo_user)
    db.flush()

    db.add(UserRole(user_id=admin_user.id, role_id=roles["admin"].id))
    db.add(UserRole(user_id=ceo_user.id, role_id=roles["ceo"].id))
    db.add(UserRole(user_id=cfo_user.id, role_id=roles["cfo"].id))

    # --- Plants ---
    plants_data = [
        ("Qazvin Glass Plant", "QGP-001", "glass", "Qazvin Industrial Zone, Iran", 36.27, 50.00, "600 tons/day", 1998, "Ahmad Karimi"),
        ("Isfahan Float Glass Facility", "IGF-002", "glass", "Isfahan Industrial Zone, Iran", 32.65, 51.67, "450 tons/day", 2005, "Reza Ahmadi"),
        ("Tehran Cement Works", "TCW-003", "cement", "Tehran Province, Iran", 35.68, 51.39, "5000 tons/day", 1985, "Hassan Moradi"),
        ("Bandar Abbas Petrochemical Unit", "BPC-004", "petrochemical", "Bandar Abbas Special Economic Zone", 27.18, 56.27, "200,000 tons/year", 2010, "Mehdi Hosseini"),
        ("Shiraz Agriculture Processing", "SAP-005", "agriculture", "Shiraz Industrial Park, Fars Province", 29.59, 52.58, "50 tons/day", 2015, "Fateme Nazari"),
        ("Tabriz Logistics Center", "TLC-006", "logistics", "Tabriz Free Trade Zone", 38.08, 46.29, "1000 containers/day", 2018, "Saeed Bahrami"),
    ]
    plants = {}
    for name, code, ptype, loc, lat, lng, cap, year, mgr in plants_data:
        health = round(random.uniform(72, 96), 1)
        plant = Plant(
            name=name, code=code, plant_type=ptype, location=loc,
            latitude=lat, longitude=lng, capacity=cap,
            status="operational", health_score=health,
            year_established=year, manager_name=mgr,
            description=f"{name} - Part of LINK Industrial Holding",
        )
        db.add(plant)
        plants[code] = plant
    db.flush()

    # --- Production Lines ---
    lines_data = [
        (plants["QGP-001"].id, "Float Glass Line 1", "FGL-001", "float_glass", 350, 312, 89.1, "Clear Float Glass 3-19mm"),
        (plants["QGP-001"].id, "Patterned Glass Line", "PGL-002", "patterned_glass", 150, 128, 85.3, "Patterned & Figured Glass"),
        (plants["QGP-001"].id, "Mirror Coating Line", "MCL-003", "coating", 100, 88, 88.0, "Mirror & Coated Glass"),
        (plants["IGF-002"].id, "Float Line Isfahan", "FLI-001", "float_glass", 450, 410, 91.1, "Float Glass 2-25mm"),
        (plants["TCW-003"].id, "Clinker Line 1", "CL1-001", "clinker", 3000, 2780, 92.7, "Portland Clinker"),
        (plants["TCW-003"].id, "Cement Mill Line", "CML-001", "cement_mill", 2000, 1850, 92.5, "Type II Portland Cement"),
        (plants["BPC-004"].id, "Ethylene Unit", "ETU-001", "petrochemical", 500, 475, 95.0, "Ethylene"),
        (plants["BPC-004"].id, "Polyethylene Unit", "PEU-001", "petrochemical", 300, 280, 93.3, "HDPE/LDPE"),
        (plants["SAP-005"].id, "Grain Processing", "GPR-001", "agriculture", 50, 42, 84.0, "Processed Grain"),
    ]
    lines = {}
    for pid, name, code, ltype, cap, output, eff, product in lines_data:
        line = ProductionLine(
            plant_id=pid, name=name, code=code, line_type=ltype,
            capacity_tons_per_day=cap, current_output=output,
            efficiency=eff, product_type=product, status="running",
        )
        db.add(line)
        lines[code] = line
    db.flush()

    # --- Machines ---
    machines_data = [
        (lines["FGL-001"].id, "Furnace A - Main Melting", "MCH-FA01", "furnace", "Fives", "EndPort 600", 45000, "critical"),
        (lines["FGL-001"].id, "Tin Bath Unit", "MCH-TB01", "tin_bath", "Pilkington", "TB-600", 12000, "critical"),
        (lines["FGL-001"].id, "Annealing Lehr 1", "MCH-AL01", "lehr", "Grenzebach", "LEHR-450", 8500, "high"),
        (lines["FGL-001"].id, "Cutting Table A", "MCH-CT01", "cutting_table", "Bottero", "CT-363", 4200, "high"),
        (lines["FGL-001"].id, "Batch House System", "MCH-BH01", "batch_house", "Zippe", "BH-500", 2200, "high"),
        (lines["FGL-001"].id, "Packaging Line 1", "MCH-PK01", "packaging", "Bottero", "PK-100", 1500, "medium"),
        (lines["PGL-002"].id, "Pattern Roller Unit", "MCH-PR01", "roller", "Pilkington", "PR-200", 6000, "high"),
        (lines["CL1-001"].id, "Rotary Kiln", "MCH-RK01", "kiln", "FLSmidth", "RK-5000", 35000, "critical"),
        (lines["CL1-001"].id, "Raw Mill", "MCH-RM01", "mill", "Loesche", "LM-56.4", 15000, "high"),
        (lines["CML-001"].id, "Cement Ball Mill", "MCH-BM01", "mill", "ThyssenKrupp", "BM-4.6x14", 18000, "high"),
        (lines["ETU-001"].id, "Steam Cracker", "MCH-SC01", "cracker", "Linde", "SC-500", 22000, "critical"),
        (lines["ETU-001"].id, "Compressor Train", "MCH-CP01", "compressor", "Siemens", "STC-GV", 8000, "critical"),
        (lines["GPR-001"].id, "Grain Dryer", "MCH-GD01", "dryer", "Bühler", "Eco-Dry", 3000, "medium"),
        (lines["FGL-001"].id, "Main Transformer", "MCH-TR01", "transformer", "Siemens", "GEAFOL", 1200, "critical"),
        (lines["FGL-001"].id, "Cooling Fan Array", "MCH-CF01", "fan", "Howden", "CF-400", 5500, "medium"),
        (lines["FGL-001"].id, "Conveyor System 1", "MCH-CV01", "conveyor", "Siemens", "CV-200", 4000, "low"),
        (lines["FGL-001"].id, "Boiler Unit 1", "MCH-BL01", "boiler", "Babcock", "BL-50", 9000, "high"),
        (lines["FGL-001"].id, "Main Pump Station", "MCH-PS01", "pump", "KSB", "Etanorm", 6000, "medium"),
    ]
    machines = {}
    statuses = ["running"] * 12 + ["warning"] * 3 + ["idle"] * 2 + ["critical"]
    for i, (lid, name, code, mtype, mfr, model, hours, crit) in enumerate(machines_data):
        st = statuses[i % len(statuses)]
        health = round(random.uniform(60 if st == "critical" else 70, 98), 1)
        machine = Machine(
            production_line_id=lid, name=name, code=code, machine_type=mtype,
            manufacturer=mfr, model=model, operating_hours=hours,
            status=st, health_score=health, criticality=crit,
            power_rating_kw=round(random.uniform(50, 5000), 0),
        )
        db.add(machine)
        machines[code] = machine
    db.flush()

    # --- Sensors ---
    sensor_configs = [
        ("MCH-FA01", [
            ("Furnace Crown Temperature", "SEN-FA01-T1", "temperature", "°C", 800, 1650, 1580, 1620),
            ("Furnace Bottom Temperature", "SEN-FA01-T2", "temperature", "°C", 600, 1400, 1300, 1380),
            ("Combustion Air Pressure", "SEN-FA01-P1", "pressure", "mbar", 0, 50, 40, 48),
            ("Glass Level", "SEN-FA01-L1", "level", "mm", 0, 500, 420, 480),
            ("Furnace Power Consumption", "SEN-FA01-E1", "power", "kW", 0, 50000, 42000, 48000),
            ("Exhaust Gas Temperature", "SEN-FA01-T3", "temperature", "°C", 200, 800, 650, 750),
            ("Vibration - Main Structure", "SEN-FA01-V1", "vibration", "mm/s", 0, 20, 12, 18),
        ]),
        ("MCH-TB01", [
            ("Tin Bath Temperature", "SEN-TB01-T1", "temperature", "°C", 600, 1100, 1000, 1080),
            ("Tin Level", "SEN-TB01-L1", "level", "mm", 0, 100, 75, 90),
            ("Atmosphere H2 Concentration", "SEN-TB01-G1", "gas", "%", 0, 10, 7, 9),
        ]),
        ("MCH-AL01", [
            ("Lehr Entry Temperature", "SEN-AL01-T1", "temperature", "°C", 400, 650, 580, 630),
            ("Lehr Exit Temperature", "SEN-AL01-T2", "temperature", "°C", 20, 100, 70, 90),
            ("Lehr Speed", "SEN-AL01-S1", "flow", "m/min", 0, 30, 22, 28),
        ]),
        ("MCH-RK01", [
            ("Kiln Shell Temperature", "SEN-RK01-T1", "temperature", "°C", 200, 400, 340, 380),
            ("Kiln Feed Rate", "SEN-RK01-F1", "flow", "t/h", 0, 500, 400, 470),
            ("Kiln Drive Current", "SEN-RK01-A1", "power", "A", 0, 1200, 900, 1100),
        ]),
        ("MCH-SC01", [
            ("Cracker Outlet Temperature", "SEN-SC01-T1", "temperature", "°C", 700, 900, 830, 880),
            ("Feed Rate", "SEN-SC01-F1", "flow", "t/h", 0, 100, 75, 95),
        ]),
    ]
    sensors = {}
    for machine_code, sensor_list in sensor_configs:
        for sname, scode, stype, unit, smin, smax, warn, crit in sensor_list:
            current = round(random.uniform(smin + (smax - smin) * 0.4, smax * 0.95), 2)
            sensor = Sensor(
                machine_id=machines[machine_code].id, name=sname, code=scode,
                sensor_type=stype, unit=unit, min_value=smin, max_value=smax,
                warning_threshold=warn, critical_threshold=crit,
                current_value=current, status="active",
                last_reading_at=datetime.utcnow(),
            )
            db.add(sensor)
            sensors[scode] = sensor
    db.flush()

    # --- Sensor Readings (last 24 hours, every 15 min for key sensors) ---
    now = datetime.utcnow()
    for scode in ["SEN-FA01-T1", "SEN-FA01-E1", "SEN-TB01-T1", "SEN-RK01-T1"]:
        sensor = sensors[scode]
        base = float(sensor.current_value or 1000)
        for i in range(96):
            ts = now - timedelta(minutes=15 * (96 - i))
            val = base + random.uniform(-base * 0.03, base * 0.03)
            db.add(SensorReading(
                sensor_id=sensor.id, value=round(val, 2),
                quality="good", timestamp=ts,
            ))

    # --- Maintenance Events ---
    maint_data = [
        ("MCH-FA01", plants["QGP-001"].id, "Furnace Crown Refractory Inspection", "preventive", "high", "scheduled", False),
        ("MCH-FA01", plants["QGP-001"].id, "Burner Nozzle Replacement - Zone 3", "corrective", "critical", "in_progress", False),
        ("MCH-FA01", plants["QGP-001"].id, "Predicted Refractory Wear - Crown Section B", "predictive", "high", "open", True),
        ("MCH-TB01", plants["QGP-001"].id, "Tin Bath Roller Alignment Check", "preventive", "medium", "completed", False),
        ("MCH-AL01", plants["QGP-001"].id, "Lehr Heating Element Replacement", "corrective", "high", "in_progress", False),
        ("MCH-CT01", plants["QGP-001"].id, "Cutting Table Calibration", "preventive", "low", "open", False),
        ("MCH-BH01", plants["QGP-001"].id, "Batch House Conveyor Belt Replacement", "corrective", "medium", "completed", False),
        ("MCH-RK01", plants["TCW-003"].id, "Kiln Lining Inspection", "preventive", "critical", "scheduled", False),
        ("MCH-BM01", plants["TCW-003"].id, "Ball Mill Liner Wear Analysis", "predictive", "medium", "open", True),
        ("MCH-SC01", plants["BPC-004"].id, "Cracker Tube Inspection", "preventive", "critical", "scheduled", False),
        ("MCH-CP01", plants["BPC-004"].id, "Compressor Vibration Analysis", "predictive", "high", "open", True),
        ("MCH-GD01", plants["SAP-005"].id, "Grain Dryer Burner Maintenance", "preventive", "medium", "completed", False),
    ]
    for mcode, pid, title, etype, prio, stat, ai_pred in maint_data:
        db.add(MaintenanceEvent(
            machine_id=machines[mcode].id, plant_id=pid, title=title,
            event_type=etype, priority=prio, status=stat,
            assigned_to="Maintenance Team",
            scheduled_date=now + timedelta(days=random.randint(1, 30)),
            downtime_hours=round(random.uniform(0.5, 24), 1),
            cost_estimate=round(random.uniform(5000000, 500000000), 0),
            is_ai_predicted=ai_pred,
            ai_confidence=round(random.uniform(0.7, 0.95), 2) if ai_pred else None,
            description=f"Maintenance work order for {title}",
        ))

    # --- Inventory ---
    inv_data = [
        (plants["QGP-001"].id, "Soda Ash (Na2CO3)", "INV-SA01", "raw_material", "tons", 450, 100, 1000, 3500000),
        (plants["QGP-001"].id, "Silica Sand (SiO2)", "INV-SS01", "raw_material", "tons", 1200, 300, 3000, 1200000),
        (plants["QGP-001"].id, "Dolomite", "INV-DL01", "raw_material", "tons", 280, 80, 600, 850000),
        (plants["QGP-001"].id, "Limestone", "INV-LS01", "raw_material", "tons", 520, 150, 1200, 450000),
        (plants["QGP-001"].id, "Refractory Bricks AZS", "INV-RB01", "spare_part", "pieces", 45, 20, 200, 85000000),
        (plants["QGP-001"].id, "Burner Nozzles", "INV-BN01", "spare_part", "pieces", 12, 5, 30, 15000000),
        (plants["QGP-001"].id, "Cutting Wheels", "INV-CW01", "consumable", "pieces", 85, 30, 200, 2500000),
        (plants["TCW-003"].id, "Clinker", "INV-CK01", "raw_material", "tons", 8500, 2000, 15000, 280000),
        (plants["TCW-003"].id, "Gypsum", "INV-GY01", "raw_material", "tons", 650, 200, 1500, 320000),
        (plants["BPC-004"].id, "Naphtha Feed", "INV-NF01", "raw_material", "tons", 3200, 1000, 8000, 15000000),
        (plants["BPC-004"].id, "Catalyst Pellets", "INV-CP01", "consumable", "kg", 450, 100, 1000, 45000000),
        (plants["SAP-005"].id, "Wheat Grain", "INV-WG01", "raw_material", "tons", 120, 30, 500, 18000000),
    ]
    for pid, name, code, cat, unit, qty, mins, maxs, cost in inv_data:
        st = "low_stock" if qty < mins * 1.5 else "in_stock"
        db.add(InventoryItem(
            plant_id=pid, name=name, code=code, category=cat, unit=unit,
            quantity=qty, min_stock=mins, max_stock=maxs,
            unit_cost=cost, total_value=qty * cost, status=st,
            supplier="Industrial Supplies Co.",
        ))

    # --- Procurement Orders ---
    proc_data = [
        (plants["QGP-001"].id, "PO-2026-001", "Soda Ash Bulk Order Q2", "Iranian Soda Ash Co.", "raw_material", 4200000000, "approved", "high", "medium"),
        (plants["QGP-001"].id, "PO-2026-002", "AZS Refractory Bricks", "RHI Magnesita", "spare_part", 12500000000, "ordered", "critical", "high"),
        (plants["QGP-001"].id, "PO-2026-003", "Furnace Burner Nozzles", "Sorg GmbH", "spare_part", 3800000000, "in_transit", "high", "medium"),
        (plants["TCW-003"].id, "PO-2026-004", "Ball Mill Liners", "Metso Outotec", "spare_part", 8500000000, "pending_approval", "medium", "low"),
        (plants["BPC-004"].id, "PO-2026-005", "Catalyst Replacement Batch", "BASF Catalysts", "consumable", 22000000000, "ordered", "critical", "high"),
        (plants["QGP-001"].id, "PO-2026-006", "Silica Sand Supply Contract", "Qazvin Mining Co.", "raw_material", 1800000000, "approved", "medium", "low"),
        (plants["SAP-005"].id, "PO-2026-007", "Grain Dryer Spare Parts Kit", "Bühler Service", "spare_part", 950000000, "draft", "low", "low"),
    ]
    for pid, onum, title, supplier, cat, amt, stat, prio, risk in proc_data:
        db.add(ProcurementOrder(
            plant_id=pid, order_number=onum, title=title, supplier=supplier,
            category=cat, total_amount=amt, status=stat, priority=prio,
            risk_level=risk, requested_by="Procurement Dept",
            expected_delivery=now + timedelta(days=random.randint(7, 90)),
        ))

    # --- Financial Records ---
    for month in range(1, 7):
        for pcode, pname in [("QGP-001", "Qazvin Glass"), ("TCW-003", "Tehran Cement"), ("BPC-004", "Petrochemical")]:
            db.add(FinancialRecord(
                plant_id=plants[pcode].id, record_type="revenue", category="sales",
                description=f"{pname} - Monthly Sales Revenue",
                amount=round(random.uniform(25e9, 55e9), 0),
                fiscal_year=2026, fiscal_month=month,
                cost_center=pcode, status="recorded",
            ))
            db.add(FinancialRecord(
                plant_id=plants[pcode].id, record_type="expense", category="operations",
                description=f"{pname} - Operating Expenses",
                amount=round(random.uniform(18e9, 38e9), 0),
                fiscal_year=2026, fiscal_month=month,
                cost_center=pcode, status="recorded",
            ))
            db.add(FinancialRecord(
                plant_id=plants[pcode].id, record_type="expense", category="energy",
                description=f"{pname} - Energy Costs",
                amount=round(random.uniform(3e9, 12e9), 0),
                fiscal_year=2026, fiscal_month=month,
                cost_center=pcode, status="recorded",
            ))

    # --- Contracts ---
    contracts_data = [
        ("CNT-2026-001", "Annual Soda Ash Supply Agreement", "supply", "Iranian Soda Ash Co.", 42e9, "active"),
        ("CNT-2026-002", "Furnace Rebuild Project", "construction", "Fives Group", 185e9, "active"),
        ("CNT-2026-003", "IT Infrastructure Maintenance", "service", "Tech Solutions Iran", 8.5e9, "active"),
        ("CNT-2026-004", "Annual Audit Services", "consulting", "Audit Partners", 3.2e9, "active"),
        ("CNT-2026-005", "Warehouse Lease Agreement", "lease", "Qazvin Industrial Zone Authority", 1.5e9, "active"),
        ("CNT-2026-006", "AI Platform Development", "consulting", "Industrial AI Solutions", 15e9, "draft"),
        ("CNT-2026-007", "Cement Distribution Contract", "service", "TransIran Logistics", 12e9, "active"),
    ]
    for cnum, title, ctype, counter, val, stat in contracts_data:
        db.add(Contract(
            contract_number=cnum, title=title, contract_type=ctype,
            counterparty=counter, total_value=val, status=stat,
            start_date=datetime(2026, 1, 1),
            end_date=datetime(2026, 12, 31),
            responsible_person="Contracts Department",
        ))

    # --- HR Records ---
    hr_data = [
        (plants["QGP-001"].id, "EMP-001", "Ahmad Karimi", "Management", "Plant Manager", "full_time", 92),
        (plants["QGP-001"].id, "EMP-002", "Reza Habibi", "Production", "Production Supervisor", "full_time", 88),
        (plants["QGP-001"].id, "EMP-003", "Mohammad Taheri", "Maintenance", "Maintenance Engineer", "full_time", 85),
        (plants["QGP-001"].id, "EMP-004", "Sara Hosseini", "Quality", "Quality Inspector", "full_time", 90),
        (plants["QGP-001"].id, "EMP-005", "Ali Rahimi", "Operations", "Furnace Operator", "full_time", 87),
        (plants["QGP-001"].id, "EMP-006", "Maryam Kazemi", "Finance", "Cost Accountant", "full_time", 91),
        (plants["TCW-003"].id, "EMP-007", "Hassan Moradi", "Management", "Plant Manager", "full_time", 89),
        (plants["TCW-003"].id, "EMP-008", "Amir Jafari", "Production", "Kiln Operator", "full_time", 84),
        (plants["BPC-004"].id, "EMP-009", "Mehdi Hosseini", "Management", "Plant Manager", "full_time", 93),
        (plants["BPC-004"].id, "EMP-010", "Zahra Akbari", "Engineering", "Process Engineer", "full_time", 88),
        (plants["SAP-005"].id, "EMP-011", "Fateme Nazari", "Management", "Plant Manager", "full_time", 86),
        (None, "EMP-012", "Nima Salehi", "IT", "Data Scientist", "full_time", 94),
        (None, "EMP-013", "Parisa Farahani", "HR", "HR Director", "full_time", 90),
        (None, "EMP-014", "Babak Noori", "Procurement", "Procurement Manager", "full_time", 87),
    ]
    for pid, eid, name, dept, pos, etype, perf in hr_data:
        db.add(HRRecord(
            plant_id=pid, employee_id=eid, full_name=name,
            department=dept, position=pos, employment_type=etype,
            hire_date=datetime(random.randint(2010, 2024), random.randint(1, 12), 1),
            status="active", performance_score=perf,
            skills=f"{dept}, Industrial Operations, Safety",
            salary_grade=random.choice(["A", "B", "C", "D"]),
        ))

    # --- AI Agents ---
    agents_data = [
        ("CEO Advisor Agent", "AGT-CEO", "executive", "running", "Analyzing quarterly performance trends across all plants",
         "Consider consolidating logistics operations between Qazvin and Isfahan plants to reduce overhead by 12%",
         "openai", "gpt-4o", 0.87, "medium", 156, 89.5),
        ("CFO Analyst Agent", "AGT-CFO", "finance", "running", "Forecasting Q3 cash flow requirements",
         "Cash exposure risk detected: Petrochemical unit has 45-day receivables vs 30-day payables. Recommend adjusting payment terms.",
         "anthropic", "claude-3.5-sonnet", 0.91, "low", 234, 92.1),
        ("Production Optimization Agent", "AGT-PROD", "production", "running", "Optimizing furnace pull rate based on demand forecast",
         "Increase Float Line 1 pull rate to 340 t/d. Current glass quality allows 5% increase without yield loss.",
         "openai", "gpt-4o", 0.84, "low", 189, 87.3),
        ("Maintenance Reliability Agent", "AGT-MAINT", "maintenance", "running", "Analyzing vibration patterns on Furnace A structure",
         "ALERT: Refractory wear pattern in Crown Section B suggests replacement needed within 45 days. Schedule hot repair.",
         "anthropic", "claude-3.5-sonnet", 0.92, "high", 312, 94.2),
        ("Procurement Risk Agent", "AGT-PROC", "procurement", "idle", "Monitoring supplier delivery performance",
         "RHI Magnesita delivery for AZS bricks delayed 12 days. Activate backup supplier quotation from Vesuvius.",
         "openai", "gpt-4o", 0.78, "medium", 98, 82.4),
        ("HR Workforce Agent", "AGT-HR", "hr", "idle", "Analyzing workforce skill gaps for AI transformation",
         "3 critical skill gaps identified: PLC programming (5 positions), data analytics (3 positions), AI operations (2 positions)",
         "openai", "gpt-4o", 0.73, "low", 67, 79.8),
        ("Legal Contract Agent", "AGT-LEGAL", "legal", "idle", "Reviewing contract renewal clauses",
         "Contract CNT-2026-002 (Furnace Rebuild) has a penalty clause that activates in 30 days if milestone 3 is not met.",
         "anthropic", "claude-3.5-sonnet", 0.88, "medium", 45, 91.0),
        ("Energy Optimization Agent", "AGT-ENERGY", "energy", "running", "Real-time energy consumption optimization",
         "Switch Furnace A to regenerative mode during off-peak hours (22:00-06:00) to save 8% on energy costs.",
         "openai", "gpt-4o", 0.89, "low", 278, 90.5),
        ("Glass Furnace Expert Agent", "AGT-FURNACE", "domain_expert", "running", "Monitoring furnace glass quality parameters",
         "Batch composition adjustment needed: Increase soda ash by 0.3% to compensate for incoming sand silica content variation.",
         "anthropic", "claude-3.5-sonnet", 0.94, "medium", 445, 95.8),
        ("Data Quality Agent", "AGT-DQ", "data_governance", "running", "Scanning sensor data for anomalies",
         "3 sensors showing data quality issues: SEN-FA01-V1 (intermittent), SEN-TB01-G1 (drift detected), SEN-AL01-S1 (calibration needed)",
         "openai", "gpt-4o", 0.82, "low", 567, 88.9),
    ]
    agents = {}
    for name, code, atype, stat, task, rec, provider, model, conf, risk, runs, success in agents_data:
        agent = AIAgent(
            name=name, code=code, agent_type=atype, status=stat,
            current_task=task, last_recommendation=rec,
            model_provider=provider, model_name=model,
            confidence_score=conf, risk_level=risk,
            total_runs=runs, success_rate=success,
            requires_approval=True, is_active=True,
            last_run_at=now - timedelta(minutes=random.randint(5, 120)),
            description=f"AI-powered {atype} analysis and recommendation agent",
        )
        db.add(agent)
        agents[code] = agent
    db.flush()

    # --- AI Recommendations ---
    recs_data = [
        (agents["AGT-PROD"].id, "Increase Float Line 1 Pull Rate", "production", "high", 0.84, "low", "Production", 850000000),
        (agents["AGT-MAINT"].id, "Schedule Furnace A Crown Hot Repair", "maintenance", "critical", 0.92, "high", "Maintenance", 2500000000),
        (agents["AGT-ENERGY"].id, "Off-Peak Furnace Regenerative Mode", "energy", "medium", 0.89, "low", "Energy", 1200000000),
        (agents["AGT-CFO"].id, "Adjust Petrochemical Payment Terms", "finance", "high", 0.91, "medium", "Finance", 3500000000),
        (agents["AGT-PROC"].id, "Activate Backup Refractory Supplier", "procurement", "high", 0.78, "medium", "Supply Chain", 0),
        (agents["AGT-FURNACE"].id, "Adjust Batch Composition - Soda Ash +0.3%", "production", "medium", 0.94, "low", "Quality", 450000000),
        (agents["AGT-DQ"].id, "Recalibrate 3 Sensors Showing Drift", "data_quality", "medium", 0.82, "low", "Operations", 0),
        (agents["AGT-HR"].id, "Hire 5 PLC Programmers for Digital Transformation", "hr", "medium", 0.73, "low", "HR", 0),
    ]
    for aid, title, cat, prio, conf, risk, area, savings in recs_data:
        db.add(AIRecommendation(
            agent_id=aid, title=title, category=cat, priority=prio,
            confidence=conf, risk_level=risk, impact_area=area,
            estimated_savings=savings, status="pending",
            explainability=f"Based on analysis of historical data and current operational patterns.",
            model_used="gpt-4o / claude-3.5-sonnet",
        ))

    # --- Documents ---
    docs_data = [
        ("Monthly Production Report - May 2026", "report", "production", "Monthly production metrics across all plants including yield, downtime, and quality KPIs."),
        ("Board Meeting Minutes - Q1 2026", "meeting_notes", "executive", "Key decisions from Q1 board meeting including capex approvals and AI transformation roadmap."),
        ("Furnace A Refractory Inspection Report", "technical_report", "maintenance", "Detailed inspection of Furnace A crown refractory with thermal imaging and wear analysis."),
        ("AI Transformation Strategy 2026-2028", "report", "strategy", "Three-year roadmap for implementing AI across all industrial operations."),
        ("Safety Incident Report - March 2026", "report", "safety", "Incident investigation report for minor gas leak in Petrochemical Unit."),
        ("Energy Audit Report 2025", "technical_report", "energy", "Annual energy audit across all plants with efficiency recommendations."),
        ("Glass Quality Standards Manual v3.2", "manual", "quality", "Updated quality standards for float glass production including ISO compliance."),
        ("Maintenance SOP - Furnace Hot Repair", "procedure", "maintenance", "Standard operating procedure for conducting furnace crown hot repairs."),
        ("IT Security Policy 2026", "policy", "cybersecurity", "Updated cybersecurity policy covering OT/IT convergence and zero trust architecture."),
        ("Lesson Learned: Kiln Brick Failure 2025", "lesson_learned", "maintenance", "Root cause analysis and preventive measures for kiln lining failure."),
        ("Procurement Policy & Guidelines", "policy", "procurement", "Guidelines for vendor selection, evaluation, and contract management."),
        ("HR Digital Skills Assessment Report", "report", "hr", "Assessment of current workforce digital readiness and training needs."),
    ]
    for title, dtype, cat, content in docs_data:
        db.add(Document(
            title=title, document_type=dtype, category=cat,
            content=content, summary=content[:100],
            author="LINK Platform", department=cat.title(),
            tags=f"{cat},{dtype}",
            classification="internal", version="1.0",
        ))

    # --- Knowledge Graph Nodes ---
    kg_nodes = []
    node_map = {}

    entity_list = [
        ("plant", "QGP-001", "Qazvin Glass Plant"),
        ("plant", "IGF-002", "Isfahan Float Glass Facility"),
        ("plant", "TCW-003", "Tehran Cement Works"),
        ("plant", "BPC-004", "Bandar Abbas Petrochemical"),
        ("plant", "SAP-005", "Shiraz Agriculture Processing"),
        ("line", "FGL-001", "Float Glass Line 1"),
        ("line", "PGL-002", "Patterned Glass Line"),
        ("line", "CL1-001", "Clinker Line 1"),
        ("line", "ETU-001", "Ethylene Unit"),
        ("machine", "MCH-FA01", "Furnace A - Main Melting"),
        ("machine", "MCH-TB01", "Tin Bath Unit"),
        ("machine", "MCH-AL01", "Annealing Lehr 1"),
        ("machine", "MCH-RK01", "Rotary Kiln"),
        ("machine", "MCH-SC01", "Steam Cracker"),
        ("sensor", "SEN-FA01-T1", "Furnace Crown Temperature"),
        ("sensor", "SEN-FA01-E1", "Furnace Power Consumption"),
        ("sensor", "SEN-RK01-T1", "Kiln Shell Temperature"),
        ("product", "PRD-001", "Clear Float Glass"),
        ("product", "PRD-002", "Patterned Glass"),
        ("product", "PRD-003", "Portland Cement"),
        ("product", "PRD-004", "Ethylene"),
        ("supplier", "SUP-001", "Iranian Soda Ash Co."),
        ("supplier", "SUP-002", "RHI Magnesita"),
        ("supplier", "SUP-003", "Fives Group"),
        ("customer", "CUS-001", "Tehran Construction Co."),
        ("customer", "CUS-002", "Isfahan Auto Glass"),
        ("employee", "EMP-001", "Ahmad Karimi"),
        ("employee", "EMP-005", "Ali Rahimi"),
        ("ai_agent", "AGT-PROD", "Production Optimization Agent"),
        ("ai_agent", "AGT-MAINT", "Maintenance Reliability Agent"),
        ("ai_agent", "AGT-FURNACE", "Glass Furnace Expert Agent"),
        ("risk", "RSK-001", "Refractory Wear Risk"),
        ("risk", "RSK-002", "Supply Chain Disruption Risk"),
        ("risk", "RSK-003", "Energy Cost Overrun Risk"),
    ]
    for etype, eid, ename in entity_list:
        node = KnowledgeGraphNode(
            entity_type=etype, entity_id=eid, name=ename,
            importance=round(random.uniform(0.4, 1.0), 2),
        )
        db.add(node)
        kg_nodes.append(node)
        node_map[eid] = node
    db.flush()

    # --- Knowledge Graph Edges ---
    edges = [
        ("QGP-001", "FGL-001", "contains"),
        ("QGP-001", "PGL-002", "contains"),
        ("TCW-003", "CL1-001", "contains"),
        ("BPC-004", "ETU-001", "contains"),
        ("FGL-001", "MCH-FA01", "contains"),
        ("FGL-001", "MCH-TB01", "contains"),
        ("FGL-001", "MCH-AL01", "contains"),
        ("CL1-001", "MCH-RK01", "contains"),
        ("ETU-001", "MCH-SC01", "contains"),
        ("MCH-FA01", "SEN-FA01-T1", "monitors"),
        ("MCH-FA01", "SEN-FA01-E1", "monitors"),
        ("MCH-RK01", "SEN-RK01-T1", "monitors"),
        ("FGL-001", "PRD-001", "produces"),
        ("PGL-002", "PRD-002", "produces"),
        ("CL1-001", "PRD-003", "produces"),
        ("ETU-001", "PRD-004", "produces"),
        ("SUP-001", "QGP-001", "supplies"),
        ("SUP-002", "QGP-001", "supplies"),
        ("SUP-003", "QGP-001", "supplies"),
        ("CUS-001", "PRD-003", "consumes"),
        ("CUS-002", "PRD-001", "consumes"),
        ("EMP-001", "QGP-001", "manages"),
        ("EMP-005", "MCH-FA01", "operates_on"),
        ("AGT-PROD", "FGL-001", "monitors"),
        ("AGT-MAINT", "MCH-FA01", "monitors"),
        ("AGT-FURNACE", "MCH-FA01", "monitors"),
        ("RSK-001", "MCH-FA01", "depends_on"),
        ("RSK-002", "SUP-002", "depends_on"),
        ("RSK-003", "QGP-001", "depends_on"),
    ]
    for src_id, tgt_id, rel in edges:
        if src_id in node_map and tgt_id in node_map:
            db.add(KnowledgeGraphEdge(
                source_node_id=node_map[src_id].id,
                target_node_id=node_map[tgt_id].id,
                relationship_type=rel,
                weight=round(random.uniform(0.5, 1.0), 2),
            ))

    # --- Audit Logs ---
    audit_data = [
        (admin_user.id, "admin@link-platform.ir", "login", "user", "System Administrator logged in", "info"),
        (ceo_user.id, "ceo@link-platform.ir", "read", "dashboard", "CEO accessed executive dashboard", "info"),
        (ceo_user.id, "ceo@link-platform.ir", "export", "report", "CEO exported monthly production report", "info"),
        (admin_user.id, "admin@link-platform.ir", "create", "user", "Created new user account", "info"),
        (cfo_user.id, "cfo@link-platform.ir", "approve", "procurement", "CFO approved procurement order PO-2026-001", "info"),
        (None, "system", "update", "sensor", "Automated sensor calibration completed", "info"),
        (None, "system", "create", "ai_recommendation", "AI agent generated new maintenance recommendation", "info"),
        (admin_user.id, "admin@link-platform.ir", "update", "security_policy", "Updated cybersecurity policy", "warning"),
    ]
    for uid, email, action, rtype, desc, sev in audit_data:
        db.add(AuditLog(
            user_id=uid, user_email=email, action=action,
            resource_type=rtype, description=desc, severity=sev,
            ip_address="192.168.1.100",
            created_at=now - timedelta(hours=random.randint(1, 72)),
        ))

    db.commit()
    print("Database seeded successfully with realistic industrial data.")
