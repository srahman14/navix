"use client";

import MapComponent from "@/components/map";
import NavigationSidebar from "@/components/navigation-sidebar";
import { RouteInfo } from "@/components/RouteInfo";
import { supabase } from "@/lib/supabaseClient";
import { useNavigationStore } from "@/store/navigation-store";
import React, { useEffect } from "react";
import { fetchVehicles } from "../../../services/vehicleService";
import { fetchOrders } from "../../../services/orderService";

const NavigationPage = () => {
  const vehicles = useNavigationStore((state) => state.vehicles);
  const orders = useNavigationStore((state) => state.orders);
  const setVehicles = useNavigationStore((state) => state.setVehicles);
  const setOrders = useNavigationStore((state) => state.setOrders);

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const vehiclesFromDB = await fetchVehicles(user.id);

      setVehicles(vehiclesFromDB);
    };

    load();
  }, [setVehicles]);

  useEffect(() => {
    const load = async () => {
      const {
        data: { user } 
      } = await supabase.auth.getUser();
      if (!user) return;

      const ordersFromDB = await fetchOrders(user.id);

      setOrders(ordersFromDB);
    }
    load();
  }, [setOrders])

  return (
    <main className="flex flex-col flex-1 items-center justify-center bg-zinc-50 dark:bg-black font-mono">
      <div className="h-screen w-full flex flex-col md:flex-row">
        {/* Left Navigation Sidebar */}
        <NavigationSidebar />

        {/* Right Map Area */}
        <div className="flex-1 bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center relative">
          <p className="text-zinc-500 dark:text-zinc-400"></p>
          <MapComponent vehicles={vehicles} orders={orders} />
          <RouteInfo />
        </div>
      </div>
    </main>
  );
};

export default NavigationPage;
