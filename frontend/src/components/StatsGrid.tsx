"use client";

import { useNavigationStore } from "@/store/navigation-store";
import { ChartNoAxesColumnIncreasing } from "lucide-react";
import React from "react";

interface StatsGridProps {
  totalOrders?: number;
  totalVehicles?: number;
  totalCost?: string;
  status?: string;
}

export const StatsGrid: React.FC<StatsGridProps> = () => {
  const totalOrders = useNavigationStore((state) => state.getTotalOrders());
  const totalVehicles = useNavigationStore((state) => state.getTotalVehicles());
  const totalCost = 0;
  const status = "Optimal";


  return (
    <div className="p-4 space-y-3 border-b border-zinc-200 dark:border-zinc-800">
      <span className="flex items-center justify-between">
        <h1 className="text-md font-bold text-zinc-900 dark:text-white uppercase tracking-tight">overview</h1>
        <ChartNoAxesColumnIncreasing />
      </span>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg">
          <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-tight">
            Total Orders
          </p>
          <p className="text-xl font-bold text-zinc-900 dark:text-white mt-1">
            {totalOrders}
          </p>
        </div>
        <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg">
          <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-tight">
            Vehicles
          </p>
          <p className="text-xl font-bold text-zinc-900 dark:text-white mt-1">
            {totalVehicles}
          </p>
        </div>
        <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg">
          <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-tight">
            Total Cost
          </p>
          <p className="text-lg font-bold text-zinc-900 dark:text-white mt-1">
            {totalCost}
          </p>
        </div>
        <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg">
          <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-tight">
            Status
          </p>
          <p className="text-sm font-bold text-green-600 dark:text-green-400 mt-1">
            {status}
          </p>
        </div>
      </div>
    </div>
  );
};

