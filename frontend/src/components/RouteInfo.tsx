"use client";

import React from "react";
import { useNavigationStore } from "@/store/navigation-store";
import { Loader2, Van } from "lucide-react";

export const RouteInfo: React.FC = () => {
  const routeInfo = useNavigationStore((state) => state.routeInfo);
  const loading = useNavigationStore((state) => state.isLoadingRoute);
  const errorMessage = useNavigationStore((state) => state.routeError)

  const formatDistance = (distance: number | null) => {
    if (distance === null) return "-";
    return `${(distance / 1000).toFixed(2)} km`;
  };

  const formatDuration = (duration: number | null) => {
    if (duration === null) return "-";
    const minutes = Math.floor(duration / 60);
    return `${minutes} min`;
  };

  return (
    <div className="p-4 space-y-3 border-b border-zinc-200 dark:border-zinc-800">
      <div className="flex justify-between items-center ">
        <h1 className="text-md font-bold text-zinc-900 dark:text-white uppercase tracking-tight">
          Route Information
        </h1>
        {loading ? <Loader2 className="animate-spin"/> : <Van className="animate-pulse" />}
      </div>
      {routeInfo && Array.isArray(routeInfo) && routeInfo.length > 0 ? (
        <div className="space-y-2">
          {routeInfo.map((route, index) => (
            <div key={index} className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg">
              <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase mb-2">
                Route Option {index + 1}
              </p>
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
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg">
            <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase">
              Route Distance
            </p>
            <p className="text-xl font-bold text-zinc-900 dark:text-white mt-1">-</p>
          </div>
          <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg">
            <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase">
              Route Duration
            </p>
            <p className="text-xl font-bold text-zinc-900 dark:text-white mt-1">-</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteInfo;
