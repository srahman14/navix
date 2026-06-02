"use client";

import { useNavigationStore } from "@/store/navigation-store";
import { Circle, ChevronDown, ChevronUp, ClockFading, Loader2, Route, Van } from "lucide-react";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistance, formatDuration } from "@/lib/format";
import { getLocation } from "@/lib/api";

export const RouteInfo: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const routeInfo = useNavigationStore((state) => state.routeInfo);
  const loading = useNavigationStore((state) => state.isLoadingRoute);
  const errorMessage = useNavigationStore((state) => state.routeError)
  const getOrderById = useNavigationStore((state) => state.getOrderById);
  const getCachedLocation = useNavigationStore((state) => state.getCachedLocation);
  const setCachedLocation = useNavigationStore((state) => state.setCachedLocation);
  const selectedVehicle = useNavigationStore(
    (state) => state.selectedVehicle
  );
  const vehicleOrder = getOrderById(selectedVehicle?.orderId);
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
 

  useEffect(() => {
    if (!selectedVehicle?.startLocation || !vehicleOrder?.location) {
      setStartLocation("");
      setEndLocation("");
      return; 
    }
    
    // Create cache key from vehicle ID and order ID
    const cacheKey = `${selectedVehicle.id}-${vehicleOrder.id}`;
    
    // Check if location is already cached
    const cachedLocation = getCachedLocation(cacheKey);
    if (cachedLocation && cachedLocation.length >= 2) {
      setStartLocation(cachedLocation[0].road + ", " + cachedLocation[0].state + ", " + cachedLocation[0].locality + ", " +  cachedLocation[0].postcode + ", " + cachedLocation[0].country);
      setEndLocation(cachedLocation[1].road + ", " + cachedLocation[1].state + ", " + cachedLocation[1].locality + ", " +  cachedLocation[1].postcode + ", " + cachedLocation[1].country);
      return;
    }
    
    const handleFetchingLocation = async () => { 
      try {
        const data = await getLocation(
          [selectedVehicle?.startLocation, vehicleOrder?.location]
        )

        if (data && Array.isArray(data) && data.length >= 2) {
          // Cache the location data
          setCachedLocation(cacheKey, data);
          
          const startLocation = data[0].road + ", " + data[0].state + ", " + data[0].locality + ", " +  data[0].postcode + ", " + data[0].country; 
          const endLocation = data[1].road + ", " + data[1].state + ", " + data[1].locality + ", " +  data[1].postcode + ", " + data[1].country; 

          setStartLocation(startLocation)
          setEndLocation(endLocation)
        }
      } catch (error) {
        console.error("Failed to fetch location:", error);
        setStartLocation("Locaton not found");
        setEndLocation("Locaton not found");
      }
    }
    handleFetchingLocation();
  }, [selectedVehicle, vehicleOrder, getCachedLocation, setCachedLocation])

  return (
    <motion.div 
      className="fixed top-4 right-4 z-40 w-full max-w-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg"
      layout
      transition={{ type: "tween", duration: 0.3 }}
    >
      {/* Collapsible Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-4 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors border-b border-zinc-200 dark:border-zinc-700 ${isOpen ? "bg-zinc-100 dark:bg-zinc-800" : ""}`}
      >
        <div className="flex items-center gap-3">
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Van className="animate-pulse" size={20} />}
          <h1 className="text-md font-bold text-zinc-900 dark:text-white uppercase tracking-tight">
            Route Information
          </h1>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: "tween", duration: 0.3 }}
        >
          {isOpen ? (
            <ChevronUp size={20} className="text-zinc-600 dark:text-zinc-400" />
          ) : (
            <ChevronDown size={20} className="text-zinc-600 dark:text-zinc-400" />
          )}
        </motion.div>
      </button>

      {/* Collapsible Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "tween", duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-3">
              {/* Location Information */}
              <div className="flex flex-col justify-center items-start space-y-2">
                <span className="flex justify-start items-center gap-2 w-full">
                  <Circle className="fill-green-500 text-green-500 size-2 animate-pulse shrink-0" /> 
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 wrap-break-word">{startLocation || "Start location..."}</p>
                </span>
                <span className="flex justify-start items-center gap-2 w-full">
                  <Circle className="fill-red-500 text-red-500 size-2 animate-pulse shrink-0" /> 
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 wrap-break-word">{endLocation || "End location..."}</p>
                </span>
              </div>

              {/* Route Options */}
              {routeInfo && Array.isArray(routeInfo) && routeInfo.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {routeInfo.map((route, index) => (
                    <div key={index} className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg">
                      <span className="flex items-center justify-between mb-2">
                        <p className="text-md text-zinc-600 dark:text-zinc-400 uppercase font-semibold">
                          Route Option {index + 1}
                        </p>
                        <Route size={16} className="text-zinc-500 dark:text-zinc-400" />
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-xs text-zinc-600 dark:text-zinc-400">Distance</p>
                          <p className="text-lg font-bold text-zinc-900 dark:text-white">
                            {formatDistance(route.distance)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-600 dark:text-zinc-400">Duration</p>
                          <p className="text-lg font-bold text-zinc-900 dark:text-white">
                            {formatDuration(route.duration)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg">
                    <span className="flex items-center justify-between mb-2">
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 uppercase">
                        Distance
                      </p>
                      <Route size={16} />
                    </span>
                    <p className="text-lg font-bold text-zinc-900 dark:text-white">-</p>
                  </div>
                  <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg">
                    <span className="flex items-center justify-between mb-2">
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 uppercase">
                        Duration
                      </p>
                      <ClockFading size={16} />
                    </span>
                    <p className="text-lg font-bold text-zinc-900 dark:text-white">-</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RouteInfo;
