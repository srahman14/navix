"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import type { Order } from "@/types";
import { useNavigationStore } from "@/store/navigation-store";
import type { Vehicle } from "@/types";
import { mapVehicleFromDB } from "@/lib/mapper";

interface AddOrderModalProps {
  open: boolean;
  vehicles: Vehicle[];
  onOpenChange: (open: boolean) => void;
  onSubmitOrder: (order: Order) => void;
}

const generateOrderId = (): string => {
  const timestamp = Date.now();
  return `ORD-${timestamp.toString().slice(-6)}`;
};
export const AddOrderModal: React.FC<AddOrderModalProps> = ({
  open,
  vehicles,
  onOpenChange,
  onSubmitOrder,
}) => {
  const [formData, setFormData] = useState<{
    id: string;
    priority: "high" | "medium" | "low";
    weight: number;
    latitude: string;
    longitude: string;
    selectedVehicleId?: string;
  }>({
    id: "",
    priority: "low",
    weight: 0,
    latitude: "",
    longitude: "",
    selectedVehicleId: "",
  });

  useEffect(() => {
    if (open) {
      setFormData({
        id: generateOrderId(),
        priority: "low",
        weight: 0,
        latitude: "",
        longitude: "",
        selectedVehicleId: "",
      });
    }
  }, [open]);

  const addOrderToDB = useNavigationStore((state) => state.addOrderToDB);
  const editMode = useNavigationStore((state) => state.editingMode);
  const setEditingMode = useNavigationStore((state) => state.setEditingMode);
  const updateOrder = useNavigationStore((state) => state.updateOrder);
  const editingOrderId = useNavigationStore((state) => state.editingOrderId);
  const setEditingVehicleId = useNavigationStore((state) => state.setEditingVehicleId);
  const getOrderById = useNavigationStore((state) => state.getOrderById);
  const orderToEdit = (editingOrderId != null) ? getOrderById(editingOrderId) : null; 

    useEffect(() => {
      if (open) {
        if (editMode && orderToEdit) {
          setFormData({
            id: orderToEdit.id,
            priority: orderToEdit.priority,
            weight: orderToEdit.weight,
            latitude: (orderToEdit.location[1]).toString(),
            longitude: (orderToEdit.location[0]).toString(),
            selectedVehicleId: orderToEdit?.vehicle_id ?? "",
          })
          return;
        };
  
        setFormData({
          id: generateOrderId(),
          priority: "low",
          weight: 0,
          latitude: "",
          longitude: "",
          selectedVehicleId: "",
        });
      }
    }, [open, editMode, orderToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const lat = parseFloat(formData.latitude);
    const lng = parseFloat(formData.longitude);

    if (isNaN(lat) || isNaN(lng)) {
      alert("Invalid coordinates");
      return;
    }

    if (formData.weight <= 0) {
      alert("Weight must be greater than 0");
      return;
    }

    const newOrder: Order = {
      id: formData.id,
      priority: formData.priority,
      weight: formData.weight,
      location: [lng, lat],
      vehicle_id: formData.selectedVehicleId || null,
    };

    console.log("Creating order", newOrder);

    if (editMode && editingOrderId != null) {
      const updatedOrder: Order = {
        ...orderToEdit, 
        id: formData.id,
        priority: formData.priority,
        weight: formData.weight,
        location: [lng, lat],
        vehicle_id: formData.selectedVehicleId || null,
      };

      updateOrder(updatedOrder)
      setEditingMode(false);
      setEditingVehicleId(null);
      onOpenChange(false);
    } else {
      onSubmitOrder(newOrder);
    }

    // Pre-fetch and cache route if vehicle has a valid order
    // if (formData.selectedVehicleId) {
    //   const selectedVehicle = vehicles.find((v) => v.db_id === formData.selectedVehicleId);
    //   if (selectedVehicle && newOrder.vehicle_id) {
    //     console.log("Caching the route from Order Modal", {
    //       selectedVehicle,
    //       newOrder
    //     })
    //     const { fetchAndCacheRoute } = useNavigationStore.getState();
        
    //     fetchAndCacheRoute(newOrder.id, selectedVehicle, newOrder);
    //   }
    // }
    // onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 z-40" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 rounded-lg">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-lg font-semibold text-zinc-900 dark:text-white">
              {editMode ? "Edit Order" : "Add Order"}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 dark:ring-offset-zinc-950 dark:text-zinc-400">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ID Field - Read Only */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                ID
              </label>
              <input
                type="text"
                value={formData.id}
                readOnly
                className="w-full px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-600 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white cursor-not-allowed opacity-75"
              />
            </div>

            {/* Priority Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priority: e.target.value as "high" | "medium" | "low",
                  })
                }
                className="w-full px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Weight Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Weight
              </label>
              <input
                type="number"
                placeholder="e.g., 50"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
              />
            </div>

            {/* Assign Vehicle - Optional */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Assign Vehicle (Optional)
              </label>
              <select
                value={formData.selectedVehicleId}
                onChange={(e) =>
                  setFormData({ ...formData, selectedVehicleId: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
              >
                <option value="">None</option>
                {vehicles.map((vehicle: any) => (
                  <option key={vehicle.db_id} value={vehicle.db_id}>
                    {vehicle.id} - {vehicle.status}
                  </option>
                ))}
              </select>
            </div>

            {/* Latitude Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Latitude
              </label>
              <input
                type="number"
                step="0.000001"
                placeholder="e.g., 51.5074"
                value={formData.latitude}
                onChange={(e) =>
                  setFormData({ ...formData, latitude: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
              />
            </div>

            {/* Longitude Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Longitude
              </label>
              <input
                type="number"
                step="0.000001"
                placeholder="e.g., -0.1278"
                value={formData.longitude}
                onChange={(e) =>
                  setFormData({ ...formData, longitude: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
               {editMode ? "Edit Order" : "Add Order"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AddOrderModal;
