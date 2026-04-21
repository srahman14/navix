"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useSidebarStore } from "@/store/sidebar-store";
import { SidebarHeader } from "./SidebarHeader";
import { VehiclesSection } from "./VehiclesSection";
import { OrdersSection } from "./OrdersSection";
import { AddModal } from "./AddModal";

const MockVehicleData = [
  // { id: "TRUCK-1", status: "active" as const, orders: 4, load: "85%" },
  // { id: "TRUCK-2", status: "active" as const, orders: 3, load: "72%" },
  // { id: "VAN-1", status: "idle" as const, orders: 0, load: "0%" },
  // { id: "TRUCK-3", status: "active" as const, orders: 5, load: "92%" },
  // { id: "VAN-2", status: "active" as const, orders: 2, load: "45%" },
];

const MockOrderData = [
  // { id: "ORD-001", priority: "high" as const, weight: "15 kg" },
  // { id: "ORD-002", priority: "medium" as const, weight: "8 kg" },
  // { id: "ORD-003", priority: "high" as const, weight: "22 kg" },
  // { id: "ORD-004", priority: "low" as const, weight: "5 kg" },
];

interface NavigationSidebarProps {
  setPoints: React.Dispatch<React.SetStateAction<Array<{
    id: string;
    type: "order" | "vehicle";
    coordinates: [number, number];
  }>>>;
}

const NavigationSidebar: React.FC<NavigationSidebarProps> = ({ setPoints }) => {
  const { isOpen, toggleSidebar } = useSidebarStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"vehicle" | "order" | null>(null);

  const handleOpenModal = (type: "vehicle" | "order") => {
    setModalType(type);
    setModalOpen(true);
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
              vehicles={MockVehicleData}
              onAddVehicle={() => handleOpenModal("vehicle")}
            />

            {/* Pending Orders Section */}
            <OrdersSection
              orders={MockOrderData}
              onAddOrder={() => handleOpenModal("order")}
            />

            {/* Action Buttons Footer */}
            <div className="p-4 space-y-2 border-t border-zinc-200 dark:border-zinc-800">
              <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
                Optimize Route
              </button>
              <button className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 font-semibold rounded-lg transition-colors">
                View Reports
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
        onSubmit={setPoints}
      />
    </>
  );
};

export default NavigationSidebar;
