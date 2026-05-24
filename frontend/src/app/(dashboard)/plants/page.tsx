"use client";

import { useEffect, useState } from "react";
import { Factory, MapPin, Activity } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { type Plant, api } from "@/lib/api";

export default function PlantsPage() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPlants().then((r) => { setPlants(r.items); setLoading(false); }).catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Plants" description="Overview of all industrial facilities across the holding" />

      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-xl border border-white/5 bg-white/[0.02]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {plants.map((plant) => (
            <div
              key={plant.id}
              className="group rounded-xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/20 hover:shadow-lg hover:shadow-cyan-500/5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10">
                    <Factory className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{plant.name}</h3>
                    <p className="text-xs text-white/30">{plant.code}</p>
                  </div>
                </div>
                <StatusBadge status={plant.status} />
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{plant.location || "—"}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <Activity className="h-3 w-3" />
                  <span>Capacity: {plant.capacity || "—"}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-white/30 uppercase">Health Score</p>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/5">
                      <div
                        className={`h-full rounded-full ${
                          plant.health_score >= 90
                            ? "bg-emerald-500"
                            : plant.health_score >= 75
                            ? "bg-cyan-500"
                            : "bg-amber-500"
                        }`}
                        style={{ width: `${plant.health_score}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-white/50">
                      {plant.health_score}%
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-white/30 uppercase">Type</p>
                  <p className="mt-0.5 text-xs capitalize text-white/60">{plant.plant_type}</p>
                </div>
              </div>

              {plant.manager_name && (
                <div className="mt-3 border-t border-white/5 pt-3">
                  <p className="text-[10px] text-white/30">
                    Manager: <span className="text-white/50">{plant.manager_name}</span>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
