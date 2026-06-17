import { Order, RouteData, Vehicle } from "@/types";
import React from "react";

export const getRoute = async (coordinates: any, profile: string = "driving-car") => {
  if (!coordinates || coordinates.length < 2) {
    throw new Error("Invalid coordinates");
  }

  const response = await fetch("http://localhost:8080/api/v1/route", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      coordinates: coordinates,
      profile: profile,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("API Error: " + data.message)
    throw new Error(data.message || "Failed to fetch route");
  }

  if (!data.content?.routes.length) {
    throw new Error("No routes returned from backend");
  }

  return data.content;
};

export const getLocation = async (coordinates: any) => {
  if (!coordinates || coordinates.length < 2) {
    throw new Error("Invalid coordinates");
  }

  const response = await fetch("http://localhost:8080/api/v1/geocode", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      coordinates: coordinates,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("API Error: " + data.message)
    throw new Error(data.message || "Failed to fetch location");
  }

  return data.content;
};

export const getRouteScore = async (
  routes: RouteData,
  vehicle: Vehicle,
  orders: Order[],
  scoringMode: string
) => {
  const response = await fetch(
    "http://localhost:8080/api/v1/score",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        routes,
        vehicle,
        orders,
        scoringMode: scoringMode ?? "relative",
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data.content;
};