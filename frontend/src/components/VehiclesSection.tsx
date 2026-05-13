"use client";

import React from "react";
import { CarFront, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigationStore } from "@/store/navigation-store";
import type { Vehicle } from "@/types";

export const VehiclesSection: React.FC = () => {
  const vehicles = useNavigationStore((state) => state.vehicles);
  const setSelectedVehicle = useNavigationStore(
    (state) => state.setSelectedVehicle
  );
  const deleteVehicle = useNavigationStore((state) => state.deleteVehicle);
  const openModal = useNavigationStore((state) => state.openModal);

  return (
    <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
      <nav className="flex items-center justify-between mb-3">
        <h1 className="text-md font-bold text-zinc-900 dark:text-white uppercase tracking-tight">
          Active Vehicles
        </h1>

        <Button variant={"ghost"} onClick={() => openModal("vehicle")}>
          <Plus />
          <p>Add Vehicle</p>
        </Button>
      </nav>

      {vehicles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="text-zinc-400 dark:text-zinc-500 mb-2">
            <CarFront size={32} />
          </div>
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            No vehicles added.
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-1">
            Add a vehicle to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
              onClick={() => setSelectedVehicle(vehicle)}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-zinc-900 dark:text-white text-sm">
                  {vehicle.id}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      vehicle.status === "active"
                        ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                        : "bg-zinc-300 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    {vehicle.status}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteVehicle(vehicle.id);
                    }}
                    className="text-zinc-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400 transition-colors"
                    title="Delete vehicle"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-start justify-start text-xs text-zinc-600 dark:text-zinc-400 mb-3 mt-2">
                <span>Related order/s: {vehicle.orderId ? vehicle.orderId : "No Order"}</span>
                <span>Orders: {vehicle.orders}</span>
                <span>Load: {vehicle.load} kg / {Math.floor(vehicle.load * 2.20462)} lbs</span>
              </div>
              <div className="w-full h-2 bg-zinc-300 dark:bg-zinc-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 dark:bg-blue-600"
                  style={{ width: vehicle.load }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
