"use client";

import React from "react";

interface StatsGridProps {
  totalOrders?: number;
  totalVehicles?: number;
  totalCost?: string;
  status?: string;
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  totalOrders = 24,
  totalVehicles = 6,
  totalCost = "$2,450",
  status = "Optimal",
}) => {
  return (
    <div className="p-4 space-y-3 border-b border-zinc-200 dark:border-zinc-800">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg">
          <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase">
            Total Orders
          </p>
          <p className="text-xl font-bold text-zinc-900 dark:text-white mt-1">
            {totalOrders}
          </p>
        </div>
        <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg">
          <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase">
            Vehicles
          </p>
          <p className="text-xl font-bold text-zinc-900 dark:text-white mt-1">
            {totalVehicles}
          </p>
        </div>
        <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg">
          <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase">
            Total Cost
          </p>
          <p className="text-lg font-bold text-zinc-900 dark:text-white mt-1">
            {totalCost}
          </p>
        </div>
        <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg">
          <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase">
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

