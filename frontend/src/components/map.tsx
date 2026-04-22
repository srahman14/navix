"use client";

import React, { useCallback, useMemo, useState } from "react";
import Map, { Source, Layer } from "@vis.gl/react-maplibre";
import type { FeatureCollection, Point, LineString } from "geojson";
import "maplibre-gl/dist/maplibre-gl.css";
import { useTheme } from "next-themes";

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
    longitude: -0.1277,
    latitude: 51.5072,
    zoom: 10,
  });
  const { resolvedTheme } = useTheme();

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

  // Route connecting vehicles with orders to their corresponding orders
  const route: FeatureCollection<LineString> = {
    type: "FeatureCollection",
    features: vehiclesWithOrders
      .map((vehicle) => {
        const order = orders.find((o) => o.id === vehicle.orderId);
        if (!order) return null;
        return {
          type: "Feature" as const,
          geometry: {
            type: "LineString" as const,
            coordinates: [vehicle.startLocation, order.location],
          },
          properties: {},
        };
      })
      .filter((feature): feature is GeoJSON.Feature<LineString> => feature !== null),
  };

  const mapStyle =
    resolvedTheme === "dark"
      ? "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
      : "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

  return (
    <div className="w-full h-screen">
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

        {/* Route */}
        <Source id="route" type="geojson" data={route}>
          <Layer
            type="line"
            paint={{
              "line-color": "#ffffff",
              "line-width": 2,
            }}
          />
        </Source>
      </Map>
    </div>
  );
};

export default MapComponent;
