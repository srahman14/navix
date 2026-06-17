import { useEffect, useState } from "react";
import { useNavigationStore } from "@/store/navigation-store";
import type { FeatureCollection, LineString } from "geojson";
import { RouteInfo } from "@/types";
import toast from "react-hot-toast";
import { decodePolyline } from "@/lib/polyline";
import { distance } from "framer-motion";
import { routeService } from "../services/routeService";
import type { Order } from "@/types";

export const useRoute = (selectedOrder: Order | null) => {
  const {
    getOrdersForVehicle,
    getCachedRoute,
    fetchAndCacheRoute,
    setRouteInfo,
    setLoadingRoute,
    setRouteError,
    getBestRoute,
    routeCache,
    vehicles,
  
  } = useNavigationStore();

  const [routeData, setRouteData] =
    useState<FeatureCollection<LineString> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [routeInfo, setLocalRouteInfo] = useState<RouteInfo[]>([]);

  // console.log("selectedOrder", selectedOrder);

  useEffect(() => {
    if (!selectedOrder || !selectedOrder.vehicle_id) {
      setRouteData(null);
      // toast.error("This order has no vehicle attached to it. Add a vehicle to see a route");
      return;
    }

    // Get the vehicle related to the selected order
    const vehicle = vehicles.find((v) => v.db_id === selectedOrder.vehicle_id);

    if (!vehicle) return;

    // Debugging
    console.log("fetching for: ", {
      selectedOrder,
      vehicle,
    });

    const loadRoute = async () => {
      try {
        setLoadingRoute(true);
        setError(null);
        setRouteError(null);

        // Debugging
        console.log("selectedOrder", selectedOrder);
        console.log("vehicle_id", selectedOrder.vehicle_id);
        console.log("routeCache", routeCache);

        // Check if route is in cache bestRoute
        let cachedRoutes = getCachedRoute(selectedOrder.vehicle_id!);

        if (!cachedRoutes) {
          const orders = getOrdersForVehicle(selectedOrder.vehicle_id!);
          const orderHash = orders.map((o) => o.id).join("|");

          await fetchAndCacheRoute(
            selectedOrder.vehicle_id!,
            orders,
            orderHash,
          );

          // re-read after fetch
          cachedRoutes = getCachedRoute(selectedOrder.vehicle_id!);
        }

        if (!cachedRoutes || !cachedRoutes.routes.length) {
          throw new Error("No cached routes found");
        }

        toast.success("Fetched route from cache");

        // Scoring engine sorts routes - first is best by default
        const bestRoute = getBestRoute(selectedOrder.vehicle_id!);
        if (!bestRoute) throw new Error("No route found");

        const coords = decodePolyline(bestRoute?.geometry.encoded);

        const geojson: FeatureCollection<LineString> = {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: coords,
              },
              properties: {
                distance: bestRoute?.summary.distance,
                duration: bestRoute?.summary.duration,
              },
            },
          ],
        };

        setRouteData(geojson);

        setRouteInfo(
          cachedRoutes.routes.map((r) => ({
            distance: r.summary.distance,
            duration: r.summary.duration,
            score: r.score,
            metrics: r.metrics
          })),
        );
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Route fetch failed";

        setError(message);
        setRouteError(message);
        toast.error(message);
      } finally {
        setLoadingRoute(false);
      }
    };

    loadRoute();
  }, [selectedOrder]);

  return {
    routeData,
    routeInfo,
    error,
  };
};
