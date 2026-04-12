"use client";

import React, { useCallback, useMemo, useState } from "react";
import Map from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useTheme } from "next-themes";

const MapComponent = () => {
  const { theme } = useTheme();

  const mapStyle =
    theme === "dark"
      ? "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
      : "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

  return (
    <div className="w-full h-screen">
      <Map
        initialViewState={{
          longitude: 51.5072,
          latitude: 0.1276,
          zoom: 3.5,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle={mapStyle}
      />
    </div>
  );
};

export default MapComponent;
