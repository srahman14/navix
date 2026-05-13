"use client";

import React from "react";
import { Logs, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigationStore } from "@/store/navigation-store";

interface Order {
  id: string;
  priority: "high" | "medium" | "low";
  weight: string;
}

export const OrdersSection: React.FC = () => {
  const orders = useNavigationStore((state) => state.orders);
  const setSelectedOrder = useNavigationStore(
    (state) => state.setSelectedOrder
  );
  const deleteOrder = useNavigationStore((state) => state.deleteOrder);
  const openModal = useNavigationStore((state) => state.openModal);

  return (
    <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
      <nav className="flex items-center justify-between mb-3">
        <h2 className="text-md font-bold text-zinc-900 dark:text-white uppercase tracking-tight">
          Pending Orders
        </h2>

        <Button variant={"ghost"} onClick={() => openModal("order")}>
          <Plus />
          <p>Add Order</p>
        </Button>
      </nav>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="text-zinc-400 dark:text-zinc-500 mb-2">
            <Logs size={32} />
          </div>
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            No pending orders.
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-1">
            Create an order to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
              onClick={() => setSelectedOrder(order)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-zinc-900 dark:text-white text-sm">
                  {order.id}
                </span>
                <div className="flex items-center gap-2">
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
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteOrder(order.id);
                    }}
                    className="text-zinc-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400 transition-colors"
                    title="Delete order"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Weight: {order.weight} kg / {Math.floor(order.weight * 2.20462)} lbs
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
