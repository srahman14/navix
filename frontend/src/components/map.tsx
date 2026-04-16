"use client";

import React, { useCallback, useMemo, useState } from "react";
import Map, { Source, Layer } from "@vis.gl/react-maplibre";
import type { FeatureCollection, Point, LineString } from "geojson";
import "maplibre-gl/dist/maplibre-gl.css";
import { useTheme } from "next-themes";

const MapComponent = () => {
  const [points, setPoints] = useState<Array<{
    type: string;
    geometry: {
      type: string;
      coordinates: [number, number];
    };
  }>>([]);
  const [viewState, setViewState] = useState({
    longitude: -0.1277,
    latitude: 51.5072,
    zoom: 10,
  });
  const { resolvedTheme } = useTheme();

  const handleClick = (e: { lngLat: { lng: any; lat: any; }; }) => {
    const { lng, lat } = e.lngLat;

    setPoints((prev) => [
      ...prev,
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [lng, lat],
        },
      },
    ]);
  };

  const geoJsonPoints: FeatureCollection<Point> = {
    type: "FeatureCollection",
    features: points as any,
  };

  const route: FeatureCollection<LineString> = {
    type: "FeatureCollection",
    features: [{
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: points.map((p) => p.geometry.coordinates),
      },
      properties: {},
    }],
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
        onClick={handleClick}
      >
        <Source id="points" type="geojson" data={geoJsonPoints}>
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
              "line-color": "#3b82f6",
              "line-width": 4,
            }}
          />
        </Source>
      </Map>
    </div>
  );
};

export default MapComponent;
