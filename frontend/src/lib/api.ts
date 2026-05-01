import React from "react";

export const getRoute = async (coordinates: any) => {
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
    }),
  });

  const data = await response.json();

  if (response.status != 200) {
    console.error("Error: " + data.status + ", " + data.statusText)
    throw new Error(data.message || "Failed to fetch route");
  }

  return data.content;
};
