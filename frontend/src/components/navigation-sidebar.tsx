"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useSidebarStore } from "@/store/sidebar-store";
import { SidebarHeader } from "./SidebarHeader";
import { VehiclesSection } from "./VehiclesSection";
import { OrdersSection } from "./OrdersSection";
import { AddModal } from "./AddModal";

interface Vehicle {
  id: string;
  status: "active" | "idle";
  orders: number;
  load: string;
  startLocation: [number, number];
  orderId?: string;
}

interface Order {
  id: string;
  priority: "high" | "medium" | "low";
  weight: string;
  location: [number, number];
}

interface NavigationSidebarProps {
  vehicles: Vehicle[];
  orders: Order[];
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  vehicles,
  orders,
  setVehicles,
  setOrders,
}) => {
  const { isOpen, toggleSidebar } = useSidebarStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"vehicle" | "order" | null>(null);

  const handleOpenModal = (type: "vehicle" | "order") => {
    setModalType(type);
    setModalOpen(true);
  };

  const handleAddVehicle = (vehicle: Vehicle) => {
    setVehicles((prev) => [...prev, vehicle]);
  };

  const handleAddOrder = (order: Order) => {
    setOrders((prev) => [...prev, order]);
  };

  const handleDeleteVehicle = (vehicleId: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== vehicleId));
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  return (
    <>
      <motion.div
        animate={{ width: isOpen ? "384px" : "60px" }}
        transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
        className="bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden h-screen"
      >
        {/* Header with Search and Stats */}
        <SidebarHeader isOpen={isOpen} onToggleSidebar={toggleSidebar} />

        {/* Scrollable Content Container */}
        <motion.div
          animate={{ opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 overflow-hidden"
        >
          <div className="overflow-y-auto h-full">
            {/* Active Vehicles Section */}
            <VehiclesSection
              vehicles={vehicles}
              onAddVehicle={() => handleOpenModal("vehicle")}
              onDeleteVehicle={handleDeleteVehicle}
            />

            {/* Pending Orders Section */}
            <OrdersSection
              orders={orders}
              onAddOrder={() => handleOpenModal("order")}
              onDeleteOrder={handleDeleteOrder}
            />

            {/* Action Buttons Footer */}
            <div className="p-4 space-y-2 border-t border-zinc-200 dark:border-zinc-800">
              <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
                Optimize Route
              </button>
              <button className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 font-semibold rounded-lg transition-colors">
                View Reports
              </button>
              <button className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 font-semibold rounded-lg transition-colors">
                Get route
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Add Modal */}
      <AddModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        type={modalType}
        orders={orders}
        onSubmitVehicle={handleAddVehicle}
        onSubmitOrder={handleAddOrder}
      />
    </>
  );
};

export default NavigationSidebar;
