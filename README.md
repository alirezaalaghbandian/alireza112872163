# LINK Industrial Intelligence Platform

**لینک؛ سامانه هوشمند اتصال صنعت سنتی به صنعت مدرن**

> Enterprise-grade Industrial AI Operating System connecting traditional factories to modern AI-native operations.

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js_16-000000?logo=nextdotjs&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)

---

## What is LINK?

LINK is the foundation for an **Autonomous Enterprise Operating System** designed for industrial holdings operating in glass, cement, petrochemical, agriculture, logistics, maintenance, finance, HR, contracts, and AI transformation.

It enables management to **monitor, analyze, and optimize** all aspects of industrial operations through a unified, AI-ready platform.

### Key Capabilities

- **Executive Command Center** — Board-level real-time dashboards with KPIs, risk heatmaps, and AI recommendations
- **Industrial Digital Twin** — Visual representation of plants, production lines, machines, and sensor data
- **ERP Intelligence** — Procurement, inventory, finance, HR, and contract management
- **AI Agents Control Room** — 10 autonomous AI agents for production, maintenance, finance, energy, and more
- **Corporate Memory** — Document library with semantic search readiness (RAG pipeline architecture)
- **Knowledge Graph** — Entity-relationship mapping across the industrial ecosystem
- **Cybersecurity & Governance** — Role-based access, audit logs, AI governance rules
- **Industrial Realism** — Real-world data for glass, cement, and petrochemical plants

---

## Architecture Decisions

### Why FastAPI (Backend)?
- **Superior OpenAPI documentation** — Auto-generated interactive API docs at `/api/docs`
- **Native async support** — Ideal for real-time sensor data and AI agent communication
- **Pydantic v2 integration** — Type-safe data validation matching industrial data pipeline needs
- **Python AI ecosystem** — Direct access to OpenAI, Anthropic, LangChain, scikit-learn, and industrial ML libraries
- **Performance** — ASGI framework with uvicorn, competitive with Node.js for I/O workloads

### Why Next.js 16 (Frontend)?
- **Server Components** — Efficient server-side rendering for data-heavy dashboards
- **App Router** — File-system based routing matching the module structure
- **TypeScript first** — End-to-end type safety
- **React 19** — Latest React features for complex UI state management

### Database Design Philosophy
- **Multi-plant, multi-company** support from day one
- **UUID primary keys** for distributed system compatibility
- **Audit trail** on all critical entities
- **Time-series ready** sensor readings table (prepared for TimescaleDB extension)
- **Knowledge graph** tables for entity-relationship mapping
- **pgvector placeholder** for RAG/semantic search integration

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Recharts, Lucide Icons |
| Backend | FastAPI, Python 3.12, SQLAlchemy 2.0, Alembic, Pydantic v2 |
| Database | PostgreSQL 16 |
| Cache | Redis 7 |
| Infrastructure | Docker Compose |
| Auth | JWT (python-jose + passlib/bcrypt) |

---

## Quick Start

### Option A: Docker Compose (Recommended)

```bash
# Clone and start all services
git clone <repo-url> && cd link-platform
docker compose up --build

# Services:
#   Frontend: http://localhost:3000
#   Backend API: http://localhost:8000
#   API Docs: http://localhost:8000/api/docs
#   PostgreSQL: localhost:5432
#   Redis: localhost:6379
```

### Option B: Local Development

#### Prerequisites
- Python 3.11+
- Node.js 20+
- PostgreSQL 14+
- Redis (optional)

#### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or: venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Set up environment
cp .env.example .env
# Edit .env with your database credentials

# Start the backend (auto-creates tables and seeds data)
uvicorn app.main:app --reload --port 8000
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local

# Start development server
npm run dev
```

---

## Environment Variables

### Backend (.env)

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql://link_user:link_password@localhost:5432/link_platform` | PostgreSQL connection string |
| `REDIS_URL` | `redis://localhost:6379/0` | Redis connection string |
| `SECRET_KEY` | `change-this-...` | JWT signing key (CHANGE IN PRODUCTION) |
| `CORS_ORIGINS` | `http://localhost:3000` | Allowed CORS origins |
| `OPENAI_API_KEY` | — | OpenAI API key (optional) |
| `ANTHROPIC_API_KEY` | — | Anthropic API key (optional) |
| `OPENROUTER_API_KEY` | — | OpenRouter API key (optional) |

### Frontend (.env.local)

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Backend API URL |

---

## Folder Structure

```
link-platform/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application entry point
│   │   ├── config.py            # Environment configuration (Pydantic Settings)
│   │   ├── database.py          # SQLAlchemy engine and session
│   │   ├── seed.py              # Realistic industrial seed data
│   │   ├── models/              # SQLAlchemy ORM models
│   │   │   ├── user.py          # Users, Roles, UserRoles
│   │   │   ├── plant.py         # Plants, ProductionLines, Machines, Sensors
│   │   │   ├── maintenance.py   # MaintenanceEvents
│   │   │   ├── erp.py           # Inventory, Procurement, Finance, Contracts, HR
│   │   │   ├── ai_agent.py      # AIAgents, AIRecommendations, AIAgentTasks
│   │   │   ├── document.py      # Documents (Corporate Memory)
│   │   │   ├── knowledge_graph.py # KG Nodes and Edges
│   │   │   └── audit.py         # AuditLogs
│   │   ├── schemas/             # Pydantic request/response schemas
│   │   ├── routers/             # FastAPI route handlers
│   │   │   ├── auth.py          # Authentication (login, me)
│   │   │   ├── plants.py        # Plants, Lines, Machines, Sensors CRUD
│   │   │   ├── maintenance.py   # Maintenance events
│   │   │   ├── erp.py           # ERP modules (Inventory, Procurement, Finance, HR)
│   │   │   ├── ai_agents.py     # AI Agents and Recommendations
│   │   │   ├── documents.py     # Document management
│   │   │   ├── knowledge_graph.py # Knowledge graph nodes/edges
│   │   │   ├── audit.py         # Audit logs
│   │   │   └── kpis.py          # Executive KPI summary
│   │   └── services/
│   │       └── auth.py          # JWT authentication service
│   ├── alembic/                 # Database migrations
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx       # Root layout (dark theme)
│   │   │   ├── page.tsx         # Redirect to /dashboard
│   │   │   └── (dashboard)/     # Dashboard layout group
│   │   │       ├── layout.tsx   # Sidebar + Topbar layout
│   │   │       ├── dashboard/   # Executive Command Center
│   │   │       ├── plants/      # Plants overview
│   │   │       ├── digital-twin/ # Digital Twin module
│   │   │       ├── erp/         # ERP Intelligence
│   │   │       │   ├── procurement/
│   │   │       │   ├── inventory/
│   │   │       │   ├── finance/
│   │   │       │   └── hr/
│   │   │       ├── maintenance/ # Maintenance & Reliability
│   │   │       ├── ai-agents/   # AI Agents Control Room
│   │   │       ├── corporate-memory/ # Corporate Memory
│   │   │       ├── knowledge-graph/  # Knowledge Graph
│   │   │       ├── cybersecurity/    # Security & Governance
│   │   │       └── settings/    # Platform Settings
│   │   ├── components/
│   │   │   ├── layout/          # Sidebar, Topbar
│   │   │   ├── shared/          # KPICard, PageHeader, StatusBadge, DataTableShell
│   │   │   └── ui/             # shadcn/ui components
│   │   └── lib/
│   │       ├── api.ts           # API client with types
│   │       └── utils.ts         # Utility functions
│   ├── Dockerfile
│   └── .env.example
├── docker-compose.yml
└── README.md
```

---

## Database Schema

### Core Entities (20 tables)

| Table | Description |
|-------|-------------|
| `users` | Platform users with authentication |
| `roles` | System roles (Chairman, CEO, CFO, Plant Manager, etc.) |
| `user_roles` | Many-to-many user-role assignments with plant scoping |
| `plants` | Industrial facilities (glass, cement, petrochemical, agriculture) |
| `production_lines` | Production lines within plants |
| `machines` | Individual machines/assets with health scoring |
| `sensors` | Sensor definitions with thresholds |
| `sensor_readings` | Time-series sensor data |
| `maintenance_events` | Work orders (preventive, corrective, predictive) |
| `inventory_items` | Raw materials, spare parts, consumables |
| `procurement_orders` | Purchase orders with risk tracking |
| `financial_records` | Revenue, expenses, budgets by plant/period |
| `contracts` | Supply, service, and construction contracts |
| `hr_records` | Employee records with skills and performance |
| `projects` | Capital and operational projects |
| `ai_agents` | AI agent registry with model provider abstraction |
| `ai_recommendations` | Agent-generated recommendations with approval workflow |
| `ai_agent_tasks` | Agent task queue and execution history |
| `documents` | Corporate memory documents |
| `knowledge_graph_nodes` | Entity nodes (plant, machine, supplier, risk, etc.) |
| `knowledge_graph_edges` | Entity relationships |
| `audit_logs` | Complete audit trail |

---

## API Endpoints

### Authentication
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/login` | Login with email/password |
| GET | `/api/auth/me` | Get current user |

### Plants & Assets
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/plants` | List plants (paginated, filterable) |
| POST | `/api/plants` | Create plant |
| GET | `/api/plants/{id}` | Get plant details |
| PUT | `/api/plants/{id}` | Update plant |
| GET | `/api/production-lines` | List production lines |
| GET | `/api/machines` | List machines |
| GET | `/api/sensors` | List sensors |
| GET | `/api/sensor-readings` | Get sensor time-series data |

### Maintenance
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/maintenance-events` | List maintenance events |
| POST | `/api/maintenance-events` | Create maintenance event |

### ERP
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/procurement` | List procurement orders |
| GET | `/api/inventory` | List inventory items |
| GET | `/api/finance` | List financial records |
| GET | `/api/contracts` | List contracts |
| GET | `/api/hr` | List HR records |

### AI
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/ai-agents` | List AI agents |
| GET | `/api/ai-recommendations` | List recommendations |
| GET | `/api/kpis/executive-summary` | Executive dashboard KPIs |

### Knowledge & Governance
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/documents` | List documents |
| GET | `/api/knowledge-graph/nodes` | List KG nodes |
| GET | `/api/knowledge-graph/edges` | List KG edges |
| GET | `/api/audit-logs` | List audit logs |

All list endpoints support: **pagination** (`page`, `page_size`), **search**, **filtering**, and **sorting**.

Full interactive API documentation: **http://localhost:8000/api/docs**

---

## Frontend Routes

| Route | Module |
|-------|--------|
| `/dashboard` | Executive Command Center |
| `/plants` | Plants Overview |
| `/digital-twin` | Industrial Digital Twin |
| `/erp/procurement` | Procurement Management |
| `/erp/inventory` | Inventory Management |
| `/erp/finance` | Financial Analytics |
| `/erp/hr` | Human Resources |
| `/maintenance` | Maintenance & Reliability |
| `/ai-agents` | AI Agents Control Room |
| `/corporate-memory` | Corporate Memory / Knowledge Base |
| `/knowledge-graph` | Knowledge Graph Explorer |
| `/cybersecurity` | Security & Governance |
| `/settings` | Platform Settings |

---

## Seed Data

The platform comes pre-loaded with realistic industrial data:

### Plants
- Qazvin Glass Plant (Float Glass, Patterned Glass, Mirror Coating)
- Isfahan Float Glass Facility
- Tehran Cement Works (Clinker, Cement Mill)
- Bandar Abbas Petrochemical Unit (Ethylene, Polyethylene)
- Shiraz Agriculture Processing
- Tabriz Logistics Center

### AI Agents (10)
- CEO Advisor, CFO Analyst, Production Optimization
- Maintenance Reliability, Procurement Risk, HR Workforce
- Legal Contract, Energy Optimization, Glass Furnace Expert
- Data Quality

### Also includes
- 18 machines with realistic specifications
- 20+ sensors with real-time simulated data
- 12 maintenance events (including AI-predicted)
- 12 inventory items, 7 procurement orders
- 54 financial records across 6 months
- 7 contracts, 14 HR records
- 12 corporate memory documents
- 34 knowledge graph nodes with 29 relationships
- 8 audit log entries

---

## Testing

```bash
# Backend
cd backend
pip install pytest httpx
pytest

# Frontend
cd frontend
npm run lint
npm run build
```

---

## Deployment

### Production Recommendations

1. **Database**: Use managed PostgreSQL (AWS RDS, Azure Database, etc.)
2. **Cache**: Managed Redis (ElastiCache, Azure Cache)
3. **Backend**: Deploy on Kubernetes or ECS with 2+ replicas
4. **Frontend**: Deploy on Vercel, or as a static export behind CDN
5. **Secrets**: Use Vault, AWS Secrets Manager, or Azure Key Vault
6. **Monitoring**: Add Prometheus + Grafana for metrics
7. **Logging**: Centralize with ELK or CloudWatch

### Security Notes
- Change `SECRET_KEY` in production
- Enable HTTPS everywhere
- Configure proper CORS origins
- Implement rate limiting
- Enable database encryption at rest
- Use network segmentation for OT/IT separation
- Implement zero-trust architecture for SCADA/PLC access

---

## AI Integration Roadmap

The platform architecture supports future AI integration:

1. **Model Provider Abstraction** — Switch between OpenAI, Anthropic, Gemini, local Llama, or OpenRouter
2. **RAG Pipeline** — pgvector for embeddings, document chunking, semantic search
3. **Agent Task Queue** — Async task execution with approval workflow
4. **Prompt Templates** — Configurable system prompts per agent
5. **Explainability** — Every recommendation includes confidence, source data, and explanation
6. **Human-in-the-loop** — All AI actions require human approval

---

## Industrial Integration Roadmap

1. **OPC-UA / SCADA** — Connect to PLC/DCS systems via OPC-UA protocol
2. **Historian Integration** — Connect to OSIsoft PI or AVEVA Historian
3. **ERP Integration** — SAP RFC/BAPI or Oracle REST API connectors
4. **MES/MOM** — Manufacturing Execution System integration
5. **IoT Gateway** — MQTT broker for edge sensor data
6. **Digital Twin 3D** — Three.js or Unity WebGL visualization

---

## Known Limitations

1. **No real AI API calls** — AI agents show simulated data; real LLM integration requires API keys
2. **No file upload** — Document management shows metadata only; no actual file storage
3. **No WebSocket** — Sensor data is fetched via REST; real-time streaming requires WebSocket/SSE implementation
4. **No i18n** — RTL/Persian support is architecturally ready but not implemented
5. **No E2E tests** — Test infrastructure is set up but comprehensive tests are not written
6. **Simplified auth** — JWT-based auth without refresh tokens, 2FA, or SSO
7. **No RBAC enforcement** — Roles are defined but not enforced on API endpoints
8. **No Alembic migrations generated** — Schema is created via `create_all`; run `alembic revision --autogenerate` to create initial migration

---

## License

Proprietary — LINK Industrial Holding

---

## Estimated Production-Readiness Score: 42/100

### What's Complete
- Full database schema (enterprise-grade, 20+ tables)
- Complete REST API with CRUD, pagination, filtering, sorting
- OpenAPI documentation
- Polished dark industrial UI with 13 pages
- Realistic seed data
- Docker Compose infrastructure
- JWT authentication
- AI agent architecture with provider abstraction

### What Would Need for Production
- Real AI API integration and agent execution engine
- WebSocket for real-time sensor streaming
- Comprehensive RBAC enforcement
- File upload and storage (S3)
- Full i18n (Persian/English)
- E2E and integration tests
- CI/CD pipeline
- Monitoring and alerting
- OPC-UA/SCADA integration
- Production hardening (rate limiting, HTTPS, secrets management)
