"use client";

import React from "react";
import { motion } from "framer-motion";
import { useSidebarStore } from "@/store/sidebar-store";
import { useNavigationStore } from "@/store/navigation-store";
import { SidebarHeader } from "./SidebarHeader";
import { VehiclesSection } from "./VehiclesSection";
import { OrdersSection } from "./OrdersSection";
import { AddModal } from "./AddModal";

const NavigationSidebar: React.FC = () => {
  const { isOpen, toggleSidebar } = useSidebarStore();
  const isModalOpen = useNavigationStore((state) => state.isModalOpen);
  const modalType = useNavigationStore((state) => state.modalType);
  const closeModal = useNavigationStore((state) => state.closeModal);
  const vehicles = useNavigationStore((state) => state.vehicles);
  const orders = useNavigationStore((state) => state.orders);
  const addVehicle = useNavigationStore((state) => state.addVehicle);
  const addOrder = useNavigationStore((state) => state.addOrder);

  const handleAddVehicle = (vehicle: any) => {
    addVehicle(vehicle);
    closeModal();
  };

  const handleAddOrder = (order: any) => {
    addOrder(order);
    closeModal();
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
            <VehiclesSection />

            {/* Pending Orders Section */}
            <OrdersSection />

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
        open={isModalOpen}
        onOpenChange={(open) => {
          if (!open) closeModal();
        }}
        type={modalType}
        orders={orders}
        onSubmitVehicle={handleAddVehicle}
        onSubmitOrder={handleAddOrder}
      />
    </>
  );
};

export default NavigationSidebar;
