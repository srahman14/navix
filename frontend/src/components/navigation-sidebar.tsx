"use client";

import { useNavigationStore } from "@/store/navigation-store";
import { useSidebarStore } from "@/store/sidebar-store";
import { Order, Vehicle } from "@/types";
import { motion } from "framer-motion";
import React from "react";
import ActiveOrdersModal from "./ActiveOrdersModal";
import ActiveVehiclesModal from "./ActiveVehiclesModal";
import { AddOrderModal } from "./AddOrderModal";
import { AddVehicleModal } from "./AddVehicleModal";
import { OrdersSection } from "./OrdersSection";
import { SidebarHeader } from "./SidebarHeader";
import { VehiclesSection } from "./VehiclesSection";
import RouteDecisionModal from "./RouteDecisionModal";

const NavigationSidebar: React.FC = () => {
  const { isOpen, toggleSidebar } = useSidebarStore();
  const isModalOpen = useNavigationStore((state) => state.isModalOpen);
  const modalType = useNavigationStore((state) => state.modalType);
  const closeModal = useNavigationStore((state) => state.closeModal);
  const openModal = useNavigationStore((state) => state.openModal);
  const vehicles = useNavigationStore((state) => state.vehicles);
  const orders = useNavigationStore((state) => state.orders);
  const addVehicle = useNavigationStore((state) => state.addVehicle);
  const addOrder = useNavigationStore((state) => state.addOrder);
  const updateVehicle = useNavigationStore((state) => state.updateVehicle);
  const updateOrder = useNavigationStore((state) => state.updateOrder);
  const editMode = useNavigationStore((state) => state.editingMode);
  const setEditMode = useNavigationStore((state) => state.setEditingMode);
  const addVehicleToDB = useNavigationStore((state) => state.addVehicleToDB);
  const addOrderToDB = useNavigationStore((state) => state.addOrderToDB);
  const routeCache = useNavigationStore((state) => state.routeCache);
  const assignOrderToVehicle = useNavigationStore((state) => state.assignOrderToVehicle);
  const selectedOrder = useNavigationStore((state) => state.selectedOrder);
  const generateRouteDecisionReport = useNavigationStore((state) => state.generateRouteDecisionReport);
  

  console.log("route caches", {
    routeCache
  })
    // console.log("Optimized Order Seq", 
    //   useNavigationStore.getState().getOptimizedOrderSequence(
    //     useNavigationStore.getState().selectedVehicle?.db_id
    //   )
    // )
  

  const handleAddVehicle = async (vehicle: Vehicle) => {
    await addVehicleToDB(vehicle);
    closeModal();
  };

  const handleUpdateVehicle = (vehicle: Vehicle) => {
    updateVehicle(vehicle);
    closeModal();  
  }

  const handleAddOrder = async (order: Order) => {
    await addOrderToDB(order);
    closeModal();
  };

  const handleGenerateReport = () => {
    if (!selectedOrder?.vehicle_id) return;



    openModal("report");
    generateRouteDecisionReport(selectedOrder.vehicle_id);
  };

  console.log(vehicles)
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
              <button onClick={() => handleGenerateReport()} className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
                Generate Report
              </button>
              <button className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 font-semibold rounded-lg transition-colors">
                View Reports
              </button>
              {/* <button className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 font-semibold rounded-lg transition-colors">
                Get route
              </button> */}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Add Vehicle Modal */}
      {modalType === "vehicle" && (
        <AddVehicleModal
          open={isModalOpen}
          onOpenChange={(open) => {
            if (editMode) setEditMode(false);
            if (!open) closeModal();
          }}
          orders={orders}
          onSubmitVehicle={handleAddVehicle}
        />
      )}

      {/* Add Order Modal */}
      {modalType === "order" && (
        <AddOrderModal
          open={isModalOpen}
          onOpenChange={(open) => {
            if (!open) closeModal();
          }}
          vehicles={vehicles}
          onSubmitOrder={handleAddOrder}
        />
      )}

      {/* Add Order Modal */}
      {modalType === "report" && (
        <RouteDecisionModal
          open={isModalOpen}
          onOpenChange={(open) => {
            if (!open) closeModal();
          }}
        />
      )}

      {/* Active Vehicles Modal */}
      <ActiveVehiclesModal />

      {/* Active Orders Modal */}
      <ActiveOrdersModal />
    </>
  );
};

export default NavigationSidebar;
