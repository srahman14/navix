"use client";

import React, { useCallback, useMemo, useState, useEffect } from "react";
import Map, { Source, Layer } from "@vis.gl/react-maplibre";
import type { FeatureCollection, Point, LineString } from "geojson";
import "maplibre-gl/dist/maplibre-gl.css";
import { useTheme } from "next-themes";
import { getRoute } from "@/lib/api";

interface Vehicle {
  id: string;
  status: "active" | "idle";
  orders: number;
  load: string;
  startLocation: [number, number];
  orderId?: string;
}

interface Order {
  id: string;
  priority: "high" | "medium" | "low";
  weight: string;
  location: [number, number];
}

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();

  // Fetch route from OpenRouteService
  useEffect(() => {
    const fetchRoute = async () => {
      try {
        setLoading(true);
        setError(null);

        // Test coordinates - realistic London street locations
        const startCoords = [-0.1606, 51.4769]; // [lon, lat] Elephant & Castle
        const endCoords = [-0.0759, 51.5173]; // Tower of London

        const coords = [
          [-0.1606, 51.4769],
          [-0.0759, 51.5173],
        ];

        const routeData = await getRoute(coords);

        if (routeData?.routes && routeData.geometry) {
          console.log("ROUTE COORDINATES")
          const routeCoordinates = routeData.geometry.decoded;

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
                  distance: routeData.routes.summary?.distance,
                  duration: routeData.routes.summary?.duration,
                },
              },
            ],
          };
          setRouteData(routeFeature);
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
        setLoading(false);
      }
    };

    fetchRoute();
  }, []);

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

  return (
    <div className="w-full h-screen relative">
      {loading && (
        <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 p-3 rounded shadow z-10">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Loading route...
          </p>
        </div>
      )}
      {error && (
        <div className="absolute top-4 left-4 bg-red-100 dark:bg-red-900 p-3 rounded shadow z-10">
          <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
        </div>
      )}
      <Map
        {...viewState}
        onMove={(e) => setViewState(e.viewState)}
        style={{ width: "100%", height: "100%" }}
        mapStyle={mapStyle}
      >
        {/* Vehicles Source */}
        <Source id="vehicles" type="geojson" data={vehiclePoints}>
          <Layer
            type="circle"
            paint={{
              "circle-radius": 6,
              "circle-color": "#3b82f6",
            }}
          />
        </Source>

        {/* Orders Source */}
        <Source id="orders" type="geojson" data={orderPoints}>
          <Layer
            type="circle"
            paint={{
              "circle-radius": 6,
              "circle-color": "#ef4444",
            }}
          />
        </Source>

        {/* OpenRouteService Route */}
        {routeData && (
          <Source id="route" type="geojson" data={routeData}>
            <Layer
              type="line"
              paint={{
                "line-color": "#10b981",
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
