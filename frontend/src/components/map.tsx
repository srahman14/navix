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
import { renderToStaticMarkup } from "react-dom/server";

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

  // Convert vehicles to GeoJSON points (all vehicles, not just those with orders)
  const vehiclePoints: FeatureCollection<Point> = {
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
  };

  // Convert orders to GeoJSON points
  const orderPoints: FeatureCollection<Point> = {
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
  };

  const mapStyle =
    resolvedTheme === "dark"
      ? "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
      : "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

  const routeColour = resolvedTheme === "dark" ? "#fff" : "#2b2b2a"
  const vehicleColour = resolvedTheme === "dark" ? "#" : "#"
  
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
          const map = event.target;

          if (map.hasImage("truck")) return;
          if (map.hasImage("box")) return;

          map.loadImage("/frontal-truck.png").then((image) => {
            map.addImage("truck", image.data);
          });

          map.loadImage("/box.png").then((image) => {
            map.addImage("box", image.data);
          });
        }}
      >
        {/* Vehicles Source */}
        <Source id="vehicles" type="geojson" data={vehiclePoints}>
          <Layer
            type="symbol"
            layout={{
              "icon-image": "truck",
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
              "icon-image": "box",
              "icon-size": 0.04,
              "icon-allow-overlap": true,
            }}
          />
        </Source>

        {/* OpenRouteService Route */}
        {routeData && (
          <Source id="route" type="geojson" data={routeData}>
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
