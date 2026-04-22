"use client";

import MapComponent from "@/components/map";
import NavigationSidebar from "@/components/navigation-sidebar";
import React, { useState } from "react";

type Vehicle = {
  id: string;
  status: "active" | "idle";
  orders: number;
  load: string;
  startLocation: [number, number]; // [lng, lat]
  orderId?: string; // Optional order association
};

type Order = {
  id: string;
  priority: "high" | "medium" | "low";
  weight: string;
  location: [number, number]; // [lng, lat]
};

const NavigationPage = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  return (
    <main className="flex flex-col flex-1 items-center justify-center bg-zinc-50 dark:bg-black font-mono">
      <div className="h-screen w-full flex flex-col md:flex-row">
        {/* Left Navigation Sidebar */}
        <NavigationSidebar vehicles={vehicles} orders={orders} setVehicles={setVehicles} setOrders={setOrders} />

        {/* Right Map Area */}
        <div className="flex-1 bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center">
          <p className="text-zinc-500 dark:text-zinc-400"></p>
          <MapComponent vehicles={vehicles} orders={orders} />
        </div>
      </div>
    </main>
  );
};

export default NavigationPage;
