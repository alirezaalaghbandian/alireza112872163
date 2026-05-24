"use client";

import { useEffect, useState } from "react";
import {
  Cpu,
  Thermometer,
  Clock,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import {
  type Plant,
  type ProductionLine,
  type Machine,
  type Sensor,
  api,
} from "@/lib/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const tempTrend = Array.from({ length: 48 }, (_, i) => ({
  time: `${Math.floor(i / 2)}:${i % 2 === 0 ? "00" : "30"}`,
  crown: 1540 + Math.random() * 40,
  bottom: 1280 + Math.random() * 30,
  exhaust: 620 + Math.random() * 50,
}));

export default function DigitalTwinPage() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [lines, setLines] = useState<ProductionLine[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getPlants(),
      api.getProductionLines(),
      api.getMachines("page_size=50"),
      api.getSensors("page_size=50"),
    ]).then(([p, l, m, s]) => {
      setPlants(p.items);
      setLines(l.items);
      setMachines(m.items);
      setSensors(s.items);
      if (p.items.length > 0) setSelectedPlant(p.items[0].id);
      setLoading(false);
    }).catch(console.error);
  }, []);

  const plantLines = lines.filter((l) => l.plant_id === selectedPlant);
  const selectedPlantData = plants.find((p) => p.id === selectedPlant);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Industrial Digital Twin" description="Loading..." />
        <div className="h-96 animate-pulse rounded-xl border border-white/5 bg-white/[0.02]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Industrial Digital Twin"
        description="Real-time digital representation of plants, lines, and assets"
      />

      {/* Plant Selector */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {plants.map((plant) => (
          <button
            key={plant.id}
            onClick={() => setSelectedPlant(plant.id)}
            className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm transition-all whitespace-nowrap ${
              selectedPlant === plant.id
                ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-400"
                : "border-white/5 bg-white/[0.02] text-white/50 hover:border-white/10 hover:text-white/70"
            }`}
          >
            <Cpu className="h-4 w-4" />
            {plant.name}
          </button>
        ))}
      </div>

      {selectedPlantData && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Plant Overview */}
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-sm">
            <h3 className="text-sm font-semibold text-white">Plant Status</h3>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-white/40">Status</span>
                <StatusBadge status={selectedPlantData.status} />
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/40">Health Score</span>
                <span className="font-mono text-white/70">{selectedPlantData.health_score}%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/40">Capacity</span>
                <span className="text-white/70">{selectedPlantData.capacity}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/40">Production Lines</span>
                <span className="font-mono text-white/70">{plantLines.length}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/40">Manager</span>
                <span className="text-white/70">{selectedPlantData.manager_name}</span>
              </div>
            </div>
          </div>

          {/* Temperature Trends */}
          <div className="col-span-2 rounded-xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">Temperature Trends</h3>
                <p className="text-xs text-white/30">Last 24 hours sensor data</p>
              </div>
              <Thermometer className="h-4 w-4 text-red-400" />
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={tempTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} tickLine={false} axisLine={false} interval={5} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: 11 }} />
                <Line type="monotone" dataKey="crown" stroke="#ef4444" strokeWidth={2} dot={false} name="Crown Temp" />
                <Line type="monotone" dataKey="bottom" stroke="#f59e0b" strokeWidth={2} dot={false} name="Bottom Temp" />
                <Line type="monotone" dataKey="exhaust" stroke="#06b6d4" strokeWidth={2} dot={false} name="Exhaust Temp" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Production Lines & Machine Hierarchy */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-white">Production Lines & Machine Hierarchy</h3>
        {plantLines.map((line) => {
          const lineMachines = machines.filter(
            (m) => m.production_line_id === line.id
          );
          return (
            <div
              key={line.id}
              className="rounded-xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
                  <div>
                    <h4 className="text-sm font-semibold text-white">{line.name}</h4>
                    <p className="text-xs text-white/30">{line.code} — {line.product_type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-[10px] text-white/30 uppercase">Output</p>
                    <p className="text-sm font-mono text-white/70">
                      {line.current_output}/{line.capacity_tons_per_day} t/d
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-white/30 uppercase">Efficiency</p>
                    <p className="text-sm font-mono text-cyan-400">{line.efficiency}%</p>
                  </div>
                  <StatusBadge status={line.status} />
                </div>
              </div>

              {lineMachines.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                  {lineMachines.map((machine) => {
                    const machineSensors = sensors.filter(
                      (s) => s.machine_id === machine.id
                    );
                    return (
                      <div
                        key={machine.id}
                        className="rounded-lg border border-white/5 bg-white/[0.03] p-3 transition-all hover:border-white/10"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="truncate text-xs font-medium text-white/80">
                              {machine.name}
                            </p>
                            <p className="text-[10px] text-white/30">{machine.code}</p>
                          </div>
                          <StatusBadge status={machine.status} />
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-[10px] text-white/30">Health</span>
                          <span
                            className={`text-xs font-mono ${
                              machine.health_score >= 85
                                ? "text-emerald-400"
                                : machine.health_score >= 70
                                ? "text-amber-400"
                                : "text-red-400"
                            }`}
                          >
                            {machine.health_score}%
                          </span>
                        </div>
                        <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/5">
                          <div
                            className={`h-full rounded-full ${
                              machine.health_score >= 85
                                ? "bg-emerald-500"
                                : machine.health_score >= 70
                                ? "bg-amber-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${machine.health_score}%` }}
                          />
                        </div>
                        {machineSensors.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {machineSensors.slice(0, 2).map((sensor) => (
                              <div
                                key={sensor.id}
                                className="flex items-center justify-between text-[10px]"
                              >
                                <span className="truncate text-white/30">
                                  {sensor.sensor_type}
                                </span>
                                <span className="font-mono text-white/50">
                                  {sensor.current_value?.toFixed(1)} {sensor.unit}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="mt-2 flex items-center justify-between text-[10px]">
                          <span className="text-white/20">
                            <Clock className="mr-1 inline h-2.5 w-2.5" />
                            {machine.operating_hours.toLocaleString()}h
                          </span>
                          <Badge variant="outline" className="border-white/10 text-[9px] text-white/30">
                            {machine.criticality}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
