"use client";

import React, { useCallback, useMemo, useState, useEffect } from "react";
import Map, { Source, Layer } from "@vis.gl/react-maplibre";
import type { FeatureCollection, Point, LineString } from "geojson";
import "maplibre-gl/dist/maplibre-gl.css";
import { useTheme } from "next-themes";
import { getRoute } from "@/lib/api";
import type { Vehicle, Order, RouteInfo } from "@/types";
import { useNavigationStore } from "@/store/navigation-store";
import { toast } from "react-hot-toast";
import { registerMapIcons, MAP_ICONS } from "@/lib/map-icons";

interface MapComponentProps {
  vehicles: Vehicle[];
  orders: Order[];
}

const MapComponent: React.FC<MapComponentProps> = ({ vehicles, orders }) => {
  const [viewState, setViewState] = useState({
    longitude: -0.1182,
    latitude: 51.4971,
    zoom: 13,
  });
  const [routeData, setRouteData] =
    useState<FeatureCollection<LineString> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();

  // Animation state
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    console.log(resolvedTheme)
  }, [resolvedTheme])
  
  // Extract route coordinates from routeData
  useEffect(() => {
    if (routeData && routeData.features.length > 0) {
      const coordinates = routeData.features[0].geometry.coordinates;
      setRouteCoordinates(coordinates.map(coord => [coord[0], coord[1]] as [number, number]));
      setCurrentStep(0);
      setIsAnimating(true);
    } else {
      setRouteCoordinates([]);
      setIsAnimating(false);
    }
  }, [routeData]);

  const {
    selectedVehicle,
    getOrderById,
    setRoutes,
    setLoadingRoute,
    setRouteError,
    setRouteInfo,
    isLoadingRoute,
    getCachedRoute,
  } = useNavigationStore();


  // Fetch route from cache or API
  useEffect(() => {
    if (!selectedVehicle) return;

    const order = getOrderById(selectedVehicle.orderId);
    if (!order) return;

    const handleRoute = async () => {
      try {
        setLoadingRoute(true);
        setRouteError(null);

        // First, try to get cached route
        const cachedRoutes = getCachedRoute(selectedVehicle.id);

        if (cachedRoutes && cachedRoutes.length > 0) {
          // Use cached routes
          toast.success("Fetched from cache");
          const firstRoute = cachedRoutes[0];
          const routeCoordinates = firstRoute.geometry.decoded;

          const routeFeature: FeatureCollection<LineString> = {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                geometry: {
                  type: "LineString",
                  coordinates: routeCoordinates,
                },
                properties: {
                  distance: firstRoute.summary?.distance,
                  duration: firstRoute.summary?.duration,
                },
              },
            ],
          };
          setRouteData(routeFeature);

          // Extract route infos from all cached alternatives
          const routeInfos = cachedRoutes.map((route: any) => ({
            distance: route.summary?.distance || null,
            duration: route.summary?.duration || null,
          }));
          setRouteInfo(routeInfos);
          setLoadingRoute(false);
          return;
        }

        // If not cached, fetch from API
        const routeData = await getRoute([
          selectedVehicle.startLocation,
          order.location,
        ]);

        console.log({ routeData });
        if (routeData?.routes && routeData.routes.length > 0) {
          // Use the first route from the alternatives for visualization
          const firstRoute = routeData.routes[0];
          const routeCoordinates = firstRoute.geometry.decoded;

          const routeFeature: FeatureCollection<LineString> = {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                geometry: {
                  type: "LineString",
                  coordinates: routeCoordinates,
                },
                properties: {
                  distance: firstRoute.summary?.distance,
                  duration: firstRoute.summary?.duration,
                },
              },
            ],
          };
          setRouteData(routeFeature);

          // Extract route infos from all alternatives
          const routeInfos = routeData.routes.map((route: any) => ({
            distance: route.summary?.distance || null,
            duration: route.summary?.duration || null,
          }));
          setRouteInfo(routeInfos);
          setLoadingRoute(false);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch route";
        setError(errorMessage);
        console.error("Route fetch error:", err);

        // Fallback to basic line with updated coordinates
        const startCoords = [-0.1606, 51.4769];
        const endCoords = [-0.0759, 51.5173];

        const basicRoute: FeatureCollection<LineString> = {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: [startCoords, endCoords],
              },
              properties: {},
            },
          ],
        };
        setRouteData(basicRoute);
      } finally {
        setLoadingRoute(false);
      }
    };

    handleRoute();
  }, [selectedVehicle, setRouteInfo, getOrderById, getCachedRoute]);

  // Filter vehicles that have orders attached
  const vehiclesWithOrders = vehicles.filter((v) => v.orderId);

  // Animation loop - moves route line from vehicle coordintes to order coordinates
  useEffect(() => {
    if (routeCoordinates.length === 0 || !isAnimating) {
      return;
    }

    // Update position every 5ms
    const animationInterval = setInterval(() => {
      setCurrentStep((prevStep) => {
        const nextStep = prevStep + 1;
        // Stop animation when reaching the end
        if (nextStep >= routeCoordinates.length) {
          setIsAnimating(false);
          return prevStep;
        }
        return nextStep;
      });
    }, 2.5); 

    return () => clearInterval(animationInterval);
  }, [routeCoordinates, isAnimating]);

  // Convert vehicles to GeoJSON points (all vehicles, not just those with orders)
  const vehiclePoints = useMemo<FeatureCollection<Point>>(
    () => ({
      type: "FeatureCollection",
      features: vehicles.map((vehicle) => ({
        type: "Feature" as const,
        geometry: {
          type: "Point" as const,
          coordinates: vehicle.startLocation,
        },
        properties: {
          id: vehicle.id,
          status: vehicle.status,
          orderId: vehicle.orderId,
        },
      })),
    }),
    [vehicles]
  );

  // Convert orders to GeoJSON points
  const orderPoints = useMemo<FeatureCollection<Point>>(
    () => ({
      type: "FeatureCollection",
      features: orders.map((order) => ({
        type: "Feature" as const,
        geometry: {
          type: "Point" as const,
          coordinates: order.location,
        },
        properties: {
          id: order.id,
          priority: order.priority,
        },
      })),
    }),
    [orders]
  );

  // Create animated route that progressively draws from start to current step
  const animatedRouteData = useMemo<FeatureCollection<LineString>>(
    () => ({
      type: "FeatureCollection",
      features:
        routeCoordinates.length > 0
          ? [
              {
                type: "Feature" as const,
                geometry: {
                  type: "LineString" as const,
                  coordinates: routeCoordinates.slice(0, currentStep + 1),
                },
                properties: {},
              },
            ]
          : [],
    }),
    [routeCoordinates, currentStep]
  ); 

  const mapStyle =
    resolvedTheme === "dark"
      ? "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
      : "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

  const routeColour = resolvedTheme === "dark" ? "#fff" : "#2b2b2a"
  
  return (
    <div className="w-full h-screen">
      {error && !isLoadingRoute && (
        <div className="absolute top-4 left-4 bg-red-100 dark:bg-red-900 p-3 rounded shadow z-10">
          <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
        </div>
      )}
      <Map
        {...viewState}
        onMove={(e) => setViewState(e.viewState)}
        style={{ width: "100%", height: "100%" }}
        mapStyle={mapStyle}
        onLoad={(event) => {
          registerMapIcons(
            event.target,
            resolvedTheme || "light"
          );
        }}
      >
        {/* Vehicles Source */}
        <Source id="vehicles" type="geojson" data={vehiclePoints}>
          <Layer
            type="symbol"
            layout={{
              "icon-image": MAP_ICONS.TRUCK,
              "icon-size": 0.05,
              "icon-allow-overlap": true,
            }}
          />
        </Source>

        {/* Orders Source */}
        <Source id="orders" type="geojson" data={orderPoints}>
          <Layer
            type="symbol"
            layout={{
              "icon-image": MAP_ICONS.ORDER,
              "icon-size": 0.04,
              "icon-allow-overlap": true,
            }}
          />
        </Source>

        {/* Animated Route - progressively drawn from vehicle to order */}
        {routeCoordinates.length > 0 && (
          <Source id="route" type="geojson" data={animatedRouteData}>
            <Layer
              type="line"
              paint={{
                "line-color": routeColour,
                "line-width": 3,
              }}
            />
          </Source>
        )}
      </Map>
    </div>
  );
};

export default MapComponent;
