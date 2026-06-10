"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import Map, { Source, Layer } from "@vis.gl/react-maplibre";
import type { MapRef } from "@vis.gl/react-maplibre";
import type { FeatureCollection, Point, LineString } from "geojson";
import "maplibre-gl/dist/maplibre-gl.css";
import { useTheme } from "next-themes";
import { getRoute } from "@/lib/api";
import type { Vehicle, Order, RouteInfo } from "@/types";
import { useNavigationStore } from "@/store/navigation-store";
import { toast } from "react-hot-toast";
import { registerMapIcons, MAP_ICONS, reloadMapIcons } from "@/lib/map-icons";
import { decodePolyline } from "@/lib/polyline"
import { useRoute } from "../../hooks/useRoute";

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

  const { resolvedTheme } = useTheme();
  // Animation state
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Map reference
  const mapRef = useRef<MapRef | null>(null);
  
  useEffect(() => {
    const map = mapRef.current?.getMap();
    
    if (!map || !resolvedTheme) return;
    
    reloadMapIcons(map, resolvedTheme);
  }, [resolvedTheme])
  
  const {
    selectedOrder,
    isLoadingRoute,
  } = useNavigationStore();
  
  // todo: check selected order is not null
  const { routeData, error } = useRoute(selectedOrder);
  const cacheRoute = useNavigationStore((state) => state.routeCache);


//   const routeKey = useMemo(() => {
//   if (!selectedVehicle) return null;

//   return `${selectedVehicle.id}-${selectedVehicle.startLocation.join(",")}`;
// }, [selectedVehicle]);

  // Extract route coordinates from routeData
  useEffect(() => {
    if (!routeData || routeData.features.length === 0) return;

    const coordinates = routeData.features[0].geometry.coordinates;

    // slight delay ensures map source clears first
    requestAnimationFrame(() => {
      setRouteCoordinates(
        coordinates.map((coord) => [coord[0], coord[1]] as [number, number])
      );
      setCurrentStep(0);
      setIsAnimating(true);
    });
  }, [routeData]);
  

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
        toast.error(error)
      )}
      <Map
        {...viewState}
        ref={mapRef}
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
              "icon-size": 0.07,
              "icon-allow-overlap": true,
              "symbol-z-order": "source"
            }}
          />
        </Source>

        {/* Orders Source */}
        <Source id="orders" type="geojson" data={orderPoints}>
          <Layer
            type="symbol"
            layout={{
              "icon-image": MAP_ICONS.ORDER,
              "icon-size": 0.07,
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