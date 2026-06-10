import { useEffect, useState } from "react";
import { useNavigationStore } from "@/store/navigation-store"
import type { FeatureCollection, LineString } from "geojson";
import { RouteInfo } from "@/types";
import toast from "react-hot-toast";
import { decodePolyline } from "@/lib/polyline";
import { distance } from "framer-motion";
import { routeService } from "../services/routeService";
import type { Order } from "@/types"

export const useRoute = (selectedOrder: Order | null) => {
    const { 
        getVehicleById,
        getCachedRoute,
        setRoutes,
        setRouteInfo,
        setLoadingRoute,
        setRouteError,
        routeCache,
        vehicles
    } = useNavigationStore();

    const [routeData, setRouteData] = useState<FeatureCollection<LineString> | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [routeInfo, setLocalRouteInfo] = useState<RouteInfo[]>([]);

    // console.log("selectedOrder", selectedOrder);

    useEffect(() => {
        if (!selectedOrder || !selectedOrder.vehicle_id) {
            toast.error("This order has no vehicle attached to it. Add a vehicle to see a route");
            return;
        };

        const vehicle = vehicles.find(
            (v) => v.db_id === selectedOrder.vehicle_id
        )
        if (!vehicle) return;

        console.log("fetching for: ", {
            selectedOrder,
            vehicle
        })            

        const loadRoute = async () => {
            try {
                setLoadingRoute(true);
                setError(null)
                setRouteError(null);

                console.log("selectedOrder", selectedOrder);
                console.log("vehicle_id", selectedOrder.vehicle_id);
                console.log("routeCache", routeCache);
                // Check if route is in cache first
                const cachedRoutes = getCachedRoute(selectedOrder.id);
                
                if (cachedRoutes?.length) {
                    toast.success("Fetched route from cache");

                    const first = cachedRoutes[0];

                    const coords = decodePolyline(first.geometry.encoded);

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
                                    distance: first.summary.distance,
                                    duration: first.summary.duration,
                                },
                            },
                        ],
                    };

                    setRouteData(geojson);

                    setRouteInfo(
                        cachedRoutes.map((r) => ({
                        distance: r.summary.distance,
                        duration: r.summary.duration,
                        }))
                    );

                    return;
                }

                // Fetch routes from API
                const response = await routeService.fetchRoute(
                    vehicle.startLocation,
                    selectedOrder.location
                );

                if (!response?.routes?.length) return;
            
                const first = response.routes[0];
                
                const coords = decodePolyline(first.geometry.encoded);

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
                            distance: first.summary.distance,
                            duration: first.summary.duration,
                        },
                        },
                    ],
                };

                setRouteData(geojson);

                setRouteInfo(
                    // TODO: add type for route
                    response.routes.map((r: any) => ({
                    distance: r.summary.distance,
                    duration: r.summary.duration,
                    }))
                );
                
                // Cache the route
                setRoutes(response.routes);
            } catch (err) {
                const message = err instanceof Error ? err.message : "Route fetch failed";

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
    }
}