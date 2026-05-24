const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface Plant {
  id: string;
  name: string;
  code: string;
  plant_type: string;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  capacity: string | null;
  status: string;
  health_score: number;
  energy_rating: string | null;
  year_established: number | null;
  manager_name: string | null;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductionLine {
  id: string;
  plant_id: string;
  name: string;
  code: string;
  line_type: string;
  status: string;
  capacity_tons_per_day: number | null;
  current_output: number | null;
  efficiency: number;
  product_type: string | null;
  created_at: string;
  updated_at: string;
}

export interface Machine {
  id: string;
  production_line_id: string;
  name: string;
  code: string;
  machine_type: string;
  manufacturer: string | null;
  model: string | null;
  status: string;
  health_score: number;
  operating_hours: number;
  power_rating_kw: number | null;
  criticality: string;
  created_at: string;
}

export interface Sensor {
  id: string;
  machine_id: string;
  name: string;
  code: string;
  sensor_type: string;
  unit: string;
  min_value: number | null;
  max_value: number | null;
  warning_threshold: number | null;
  critical_threshold: number | null;
  current_value: number | null;
  status: string;
  last_reading_at: string | null;
}

export interface SensorReading {
  id: string;
  sensor_id: string;
  value: number;
  quality: string;
  timestamp: string;
}

export interface MaintenanceEvent {
  id: string;
  machine_id: string;
  plant_id: string;
  title: string;
  description: string | null;
  event_type: string;
  priority: string;
  status: string;
  assigned_to: string | null;
  scheduled_date: string | null;
  downtime_hours: number;
  cost_estimate: number;
  actual_cost: number;
  is_ai_predicted: boolean;
  ai_confidence: number | null;
  created_at: string;
}

export interface AIAgent {
  id: string;
  name: string;
  code: string;
  agent_type: string;
  description: string | null;
  status: string;
  model_provider: string;
  model_name: string | null;
  confidence_score: number;
  risk_level: string;
  current_task: string | null;
  last_recommendation: string | null;
  last_run_at: string | null;
  total_runs: number;
  success_rate: number;
  is_active: boolean;
  created_at: string;
}

export interface AIRecommendation {
  id: string;
  agent_id: string;
  title: string;
  description: string | null;
  category: string;
  priority: string;
  confidence: number;
  risk_level: string;
  impact_area: string | null;
  estimated_savings: number | null;
  status: string;
  explainability: string | null;
  created_at: string;
}

export interface Document {
  id: string;
  title: string;
  document_type: string;
  category: string;
  content: string | null;
  summary: string | null;
  author: string | null;
  department: string | null;
  tags: string | null;
  classification: string;
  version: string | null;
  is_archived: boolean;
  created_at: string;
}

export interface KGNode {
  id: string;
  entity_type: string;
  entity_id: string;
  name: string;
  properties: string | null;
  status: string;
  importance: number;
  created_at: string;
}

export interface KGEdge {
  id: string;
  source_node_id: string;
  target_node_id: string;
  relationship_type: string;
  weight: number;
  is_active: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  user_email: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  description: string | null;
  severity: string;
  ip_address: string | null;
  created_at: string;
}

export interface InventoryItem {
  id: string;
  plant_id: string;
  name: string;
  code: string;
  category: string;
  unit: string;
  quantity: number;
  min_stock: number;
  max_stock: number | null;
  unit_cost: number;
  total_value: number;
  status: string;
  supplier: string | null;
  created_at: string;
}

export interface ProcurementOrder {
  id: string;
  plant_id: string;
  order_number: string;
  title: string;
  supplier: string;
  category: string;
  total_amount: number;
  currency: string;
  status: string;
  priority: string;
  risk_level: string;
  expected_delivery: string | null;
  created_at: string;
}

export interface FinancialRecord {
  id: string;
  plant_id: string | null;
  record_type: string;
  category: string;
  description: string;
  amount: number;
  currency: string;
  fiscal_year: number;
  fiscal_month: number;
  cost_center: string | null;
  status: string;
  created_at: string;
}

export interface Contract {
  id: string;
  contract_number: string;
  title: string;
  contract_type: string;
  counterparty: string;
  total_value: number;
  currency: string;
  start_date: string | null;
  end_date: string | null;
  status: string;
  risk_level: string;
  created_at: string;
}

export interface HRRecord {
  id: string;
  employee_id: string;
  full_name: string;
  department: string;
  position: string;
  employment_type: string;
  status: string;
  performance_score: number | null;
  salary_grade: string | null;
  hire_date: string | null;
  created_at: string;
}

export interface ExecutiveSummary {
  production: {
    total_plants: number;
    operational_plants: number;
    avg_health_score: number;
    total_machines: number;
    machines_running: number;
    machines_warning: number;
    machines_critical: number;
    production_today_tons: number;
    production_target_tons: number;
    yield_percent: number;
  };
  energy: {
    total_consumption_mwh: number;
    energy_per_ton: number;
    peak_demand_kw: number;
    energy_cost_today: number;
    trend: string;
  };
  maintenance: {
    open_work_orders: number;
    critical_alerts: number;
    avg_downtime_hours: number;
    maintenance_backlog: number;
    mtbf_hours: number;
    mttr_hours: number;
    predictive_alerts: number;
  };
  finance: {
    monthly_revenue: number;
    monthly_expenses: number;
    cash_exposure: number;
    budget_variance_percent: number;
    procurement_pending_value: number;
  };
  procurement: {
    pending_orders: number;
    low_stock_items: number;
    delayed_deliveries: number;
    risk_level: string;
  };
  ai: {
    active_agents: number;
    pending_recommendations: number;
    total_savings_potential: number;
    recommendations_implemented: number;
  };
  risk_heatmap: Array<{
    area: string;
    risk: string;
    score: number;
  }>;
}

async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export const api = {
  getExecutiveSummary: () => fetchApi<ExecutiveSummary>("/api/kpis/executive-summary"),
  getPlants: (params?: string) => fetchApi<PaginatedResponse<Plant>>(`/api/plants${params ? `?${params}` : ""}`),
  getPlant: (id: string) => fetchApi<Plant>(`/api/plants/${id}`),
  getProductionLines: (params?: string) => fetchApi<PaginatedResponse<ProductionLine>>(`/api/production-lines${params ? `?${params}` : ""}`),
  getMachines: (params?: string) => fetchApi<PaginatedResponse<Machine>>(`/api/machines${params ? `?${params}` : ""}`),
  getSensors: (params?: string) => fetchApi<PaginatedResponse<Sensor>>(`/api/sensors${params ? `?${params}` : ""}`),
  getSensorReadings: (sensorId: string) => fetchApi<PaginatedResponse<SensorReading>>(`/api/sensor-readings?sensor_id=${sensorId}`),
  getMaintenanceEvents: (params?: string) => fetchApi<PaginatedResponse<MaintenanceEvent>>(`/api/maintenance-events${params ? `?${params}` : ""}`),
  getAIAgents: () => fetchApi<PaginatedResponse<AIAgent>>("/api/ai-agents"),
  getAIRecommendations: (params?: string) => fetchApi<PaginatedResponse<AIRecommendation>>(`/api/ai-recommendations${params ? `?${params}` : ""}`),
  getDocuments: (params?: string) => fetchApi<PaginatedResponse<Document>>(`/api/documents${params ? `?${params}` : ""}`),
  getKGNodes: (params?: string) => fetchApi<PaginatedResponse<KGNode>>(`/api/knowledge-graph/nodes${params ? `?${params}` : ""}`),
  getKGEdges: (params?: string) => fetchApi<PaginatedResponse<KGEdge>>(`/api/knowledge-graph/edges${params ? `?${params}` : ""}`),
  getAuditLogs: (params?: string) => fetchApi<PaginatedResponse<AuditLog>>(`/api/audit-logs${params ? `?${params}` : ""}`),
  getInventory: (params?: string) => fetchApi<PaginatedResponse<InventoryItem>>(`/api/inventory${params ? `?${params}` : ""}`),
  getProcurement: (params?: string) => fetchApi<PaginatedResponse<ProcurementOrder>>(`/api/procurement${params ? `?${params}` : ""}`),
  getFinance: (params?: string) => fetchApi<PaginatedResponse<FinancialRecord>>(`/api/finance${params ? `?${params}` : ""}`),
  getContracts: (params?: string) => fetchApi<PaginatedResponse<Contract>>(`/api/contracts${params ? `?${params}` : ""}`),
  getHR: (params?: string) => fetchApi<PaginatedResponse<HRRecord>>(`/api/hr${params ? `?${params}` : ""}`),
  health: () => fetchApi<{ status: string }>("/api/health"),
};
