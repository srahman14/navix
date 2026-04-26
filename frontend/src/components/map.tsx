"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  const [routeCoords, setRouteCoords] = useState<Array<{
    vehicleId: string;
    coordinates: [number, number][];
  }>>([]);

  // Filter vehicles that have orders attached
  const vehiclesWithOrders = vehicles.filter((v) => v.orderId);
  
const fetchRoute = async (start: [number, number], end: [number, number]) => {
  const res = await fetch("/api/route", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ start, end }),
  });

  const data = await res.json();
  return data;
};
const handleFetchRoute = async () => {
  if (vehicles.length === 0 || orders.length === 0) {
    alert("Add at least one vehicle and one order");
    return;
  }

  const vehicle = vehicles[0];
  const order = orders[0];

  try {
    const data = await fetchRoute(
      vehicle.startLocation,
      order.location
    );

    console.log({data})
    const coords = data.features[0].geometry.coordinates;

    setRouteCoords(coords);
  } catch (err) {
    console.error("Route fetch failed:", err);
  }
};

  // Fetch routes for all vehicles with orders
  // useEffect(() => {
  //   const fetchRoutesForVehicles = async () => {
  //     const routes = await Promise.all(
  //       vehiclesWithOrders.map(async (vehicle) => {
  //         const order = orders.find((o) => o.id === vehicle.orderId);
  //         if (!order) return null;
          
  //         try {
  //           const routeData = await fetchRoute(vehicle.startLocation, order.location);
            
  //           // Extract coordinates from OpenRouteService response
  //           if (routeData.features && routeData.features[0]) {
  //             const coordinates = routeData.features[0].geometry.coordinates;
  //             return {
  //               vehicleId: vehicle.id,
  //               coordinates: coordinates as [number, number][],
  //             };
  //           }
  //         } catch (error) {
  //           console.error(`Failed to fetch route for vehicle ${vehicle.id}:`, error);
  //         }
  //         return null;
  //       })
  //     );
      
  //     setRouteCoords(routes.filter((route): route is NonNullable<typeof route> => route !== null));
  //   };

  //   if (vehiclesWithOrders.length > 0) {
  //     fetchRoutesForVehicles();
  //   }
  // }, [vehiclesWithOrders, orders]);

//   useEffect(() => {
//   const getRoute = async () => {
//     if (vehicles.length === 0 || orders.length === 0) return;

//     const vehicle = vehicles[0];
//     const order = orders[0];

//     try {
//       const routeData = await fetchRoute(
//         vehicle.startLocation,
//         order.location
//       );

//       const coordinates =
//         routeData.features[0].geometry.coordinates;

//       setRouteCoords(coordinates);
//     } catch (error) {
//       console.error("Route fetch failed:", error);
//     }
//   };

//   getRoute();
// }, [vehicles, orders]);

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

  // Route with actual directions from OpenRouteService
  const route: FeatureCollection<LineString> = {
    type: "FeatureCollection",
    features: routeCoords.map((route) => ({
      type: "Feature" as const,
      geometry: {
        type: "LineString" as const,
        coordinates: route.coordinates,
      },
      properties: {
        vehicleId: route.vehicleId,
      },
    })),
  };

  const mapStyle =
    resolvedTheme === "dark"
      ? "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
      : "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

  return (
    <div className="w-full h-screen">
      <button onClick={handleFetchRoute}>
        Get route
      </button>
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
