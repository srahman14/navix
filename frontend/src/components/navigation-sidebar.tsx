"use client";

import React from "react";
import { motion } from "framer-motion";
import { ModeToggle } from "./theme-toggler";
import { Columns2 } from "lucide-react";
import { Button } from "./ui/button";
import { useSidebarStore } from "@/store/sidebar-store";

const MockVehicleDate = [
  { id: "TRUCK-1", status: "active", orders: 4, load: "85%" },
  { id: "TRUCK-2", status: "active", orders: 3, load: "72%" },
  { id: "VAN-1", status: "idle", orders: 0, load: "0%" },
  { id: "TRUCK-3", status: "active", orders: 5, load: "92%" },
  { id: "VAN-2", status: "active", orders: 2, load: "45%" },
];

const MockOrderData = [
  { id: "ORD-001", priority: "high", weight: "15 kg" },
  { id: "ORD-002", priority: "medium", weight: "8 kg" },
  { id: "ORD-003", priority: "high", weight: "22 kg" },
  { id: "ORD-004", priority: "low", weight: "5 kg" },
];

const NavigationSidebar = () => {
  const { isOpen, toggleSidebar } = useSidebarStore();

  return (
    <motion.div
      animate={{ width: isOpen ? "384px" : "60px" }}
      transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
      className="bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden h-screen"
    >
      {/* Header - Open State */}
      {isOpen && (
        <div className="flex justify-between items-start p-4 border-b border-zinc-200 dark:border-zinc-800 flex-shrink-0">
          <motion.div
            animate={{ opacity: isOpen ? 1 : 0 }}
            transition={{ duration: 0.2, delay: isOpen ? 0.1 : 0 }}
          >
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
              Navix
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Route Optimization
            </p>
          </motion.div>

          <div className="flex items-center justify-center space-x-2 flex-shrink-0">
            <motion.div
              animate={{ opacity: isOpen ? 1 : 0 }}
              transition={{ duration: 0.2, delay: isOpen ? 0.1 : 0 }}
            >
              <ModeToggle />
            </motion.div>

            {/* Toggle Sidebar at Top */}
            <Button variant="outline" size="icon" onClick={toggleSidebar}>
              <Columns2 className="h-[1.2rem] w-[1.2rem] transition-all" />
            </Button>
          </div>
        </div>
      )}

      {/* Header - Closed State */}
      {!isOpen && (
        <div className="flex items-center justify-center p-4 flex-shrink-0">
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <Columns2 className="h-[1.2rem] w-[1.2rem] transition-all" />
          </Button>
        </div>
      )}

      {/* Scrollable Content Container */}
      <motion.div
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="flex-1 overflow-hidden"
      >
        <div className="overflow-y-auto h-full">
          {/* Search and Filter Section */}
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
            <input
              type="text"
              placeholder="Search orders..."
              className="w-full px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
            />
          </div>

          {/* Stats Overview */}
          <div className="p-4 space-y-3 border-b border-zinc-200 dark:border-zinc-800">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg">
                <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase">
                  Total Orders
                </p>
                <p className="text-xl font-bold text-zinc-900 dark:text-white mt-1">
                  24
                </p>
              </div>
              <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg">
                <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase">
                  Vehicles
                </p>
                <p className="text-xl font-bold text-zinc-900 dark:text-white mt-1">
                  6
                </p>
              </div>
              <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg">
                <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase">
                  Total Cost
                </p>
                <p className="text-lg font-bold text-zinc-900 dark:text-white mt-1">
                  $2,450
                </p>
              </div>
              <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg">
                <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase">
                  Status
                </p>
                <p className="text-sm font-bold text-green-600 dark:text-green-400 mt-1">
                  Optimal
                </p>
              </div>
            </div>
          </div>

          {/* Active Vehicles Section */}
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-3">
              Active Vehicles
            </h2>
            <div className="space-y-2">
              {MockVehicleDate.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-zinc-900 dark:text-white text-sm">
                      {vehicle.id}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        vehicle.status === "active"
                          ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                          : "bg-zinc-300 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                      }`}
                    >
                      {vehicle.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400 mb-2">
                    <span>Orders: {vehicle.orders}</span>
                    <span>Load: {vehicle.load}</span>
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
          </div>

          {/* Pending Orders Section */}
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-3">
              Pending Orders
            </h2>
            <div className="space-y-2">
              {MockOrderData.map((order) => (
                <div
                  key={order.id}
                  className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-zinc-900 dark:text-white text-sm">
                      {order.id}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        order.priority === "high"
                          ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                          : order.priority === "medium"
                            ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"
                            : "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                      }`}
                    >
                      {order.priority}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    Weight: {order.weight}
                  </p>
                </div>
              ))}
            </div>
          </div>

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
  );
};

export default NavigationSidebar;
