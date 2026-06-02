"use client";

import React, { useState } from "react";
import { X, Search, CarFront, Trash2 } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { useNavigationStore } from "@/store/navigation-store";
import type { Vehicle } from "@/types";

interface VehicleCardProps {
  vehicle: Vehicle;
  onSelect: (vehicle: Vehicle) => void;
  onDelete: (id: string) => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onSelect,
  onDelete,
}) => {
  return (
    <div
      onClick={() => onSelect(vehicle)}
      className="relative p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer border border-zinc-200 dark:border-zinc-700"
    >
      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(vehicle.id);
        }}
        className="absolute top-2 right-2 p-1 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        title="Delete vehicle"
      >
        <X size={16} />
      </button>

      {/* Vehicle Icon and ID */}
      <div className="flex items-center gap-3 mb-3 pr-6">
        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <CarFront size={24} className="text-blue-600 dark:text-blue-300" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm text-zinc-900 dark:text-white">
            {vehicle.id}
          </p>
        </div>
      </div>

      {/* Status Badge */}
      <div className="mb-3">
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full ${
            vehicle.status === "active"
              ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
              : vehicle.status === "pending"
                ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"
                : "bg-zinc-300 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
          }`}
        >
          {vehicle.status}
        </span>
      </div>

      {/* Load Information */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-zinc-600 dark:text-zinc-400">Load</span>
          <span className="text-xs font-semibold text-zinc-900 dark:text-white">
            {vehicle.load.toFixed(0)} kg
          </span>
        </div>
        <div className="w-full h-2 bg-zinc-300 dark:bg-zinc-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 dark:bg-blue-600 transition-all"
            style={{ width: `${Math.min((vehicle.load / 1000) * 100, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Orders Info */}
      <div className="mt-3 text-xs text-zinc-600 dark:text-zinc-400">
        <p>Orders: {vehicle.orders}</p>
        {vehicle.orderId && <p>Order: {vehicle.orderId}</p>}
      </div>
    </div>
  );
};

const ActiveVehiclesModal: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const isModalOpen = useNavigationStore((state) => state.isModalOpen);
  const modalType = useNavigationStore((state) => state.modalType);
  const vehicles = useNavigationStore((state) => state.vehicles);
  const closeModal = useNavigationStore((state) => state.closeModal);
  const setSelectedVehicle = useNavigationStore(
    (state) => state.setSelectedVehicle
  );
  const deleteVehicle = useNavigationStore((state) => state.deleteVehicle);

  const isOpen = isModalOpen && modalType === "active-vehicles";

  // Filter vehicles based on search query
  const filteredVehicles = vehicles.filter((vehicle) =>
    vehicle.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    // TODO: Open edit vehicle modal in Phase 3
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={closeModal}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 z-40" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] gap-4 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 rounded-lg max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-lg font-semibold text-zinc-900 dark:text-white">
              Active Vehicles
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 dark:ring-offset-zinc-950 dark:text-zinc-400">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>
            </Dialog.Close>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search vehicles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
            />
          </div>

          {/* Vehicles Grid */}
          {filteredVehicles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-zinc-400 dark:text-zinc-500 mb-2">
                <CarFront size={40} />
              </div>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                {vehicles.length === 0
                  ? "No vehicles available."
                  : "No vehicles match your search."}
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-1">
                {vehicles.length === 0
                  ? "Add a vehicle to get started."
                  : "Try a different search term."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[calc(90vh-280px)] overflow-y-auto">
              {filteredVehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  onSelect={handleSelectVehicle}
                  onDelete={deleteVehicle}
                />
              ))}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ActiveVehiclesModal;
