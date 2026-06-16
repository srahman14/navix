// TODO: need to store routes in database for persistence

import { ENV_VARS } from "../config/envVars.js";
import { convertPolylineToCoordinates } from "../utils/polyline.js";

// Supported ORS profiles
const ORS_PROFILES = {
    "driving-car": "https://api.openrouteservice.org/v2/directions/driving-car",
    "driving-hgv": "https://api.openrouteservice.org/v2/directions/driving-hgv",
    "cycling-regular": "https://api.openrouteservice.org/v2/directions/cycling-regular",
    "cycling-mountain": "https://api.openrouteservice.org/v2/directions/cycling-mountain",
    "foot-walking": "https://api.openrouteservice.org/v2/directions/foot-walking",
};

export const fetchFromORS = async (profile = "driving-car", coordinates) => {
    // Validate profile
    if (!ORS_PROFILES[profile]) {
        throw new Error(`Invalid profile: ${profile}. Supported profiles: ${Object.keys(ORS_PROFILES).join(", ")}`);
    }

    const url = ORS_PROFILES[profile];

    // Default - takes a list of coordinates
    const body = {
        coordinates,
        elevation: false,
    }

    // Return alternative routes given when given only two coordinates 
    if (coordinates.length === 2) {
        body.alternative_routes = {
            target_count: 3,
            weight_factor: 1.4,
            share_factor: 0.6,
        }
    }

    // Debugging
    console.log("ORS request coords:", coordinates);
    console.log("Waypoint count:", coordinates.length);

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": ENV_VARS.ORS_API_KEY, 
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(errorText);
        throw new Error(`Failed to fetch data from ORS ${errorText}`); 
    }

    const data = await response.json();

    // Extract the main route 
    const route = data.routes?.[0];
    if (!route) {
        throw new Error("No route found in OSR response");
    }

    const routes = data.routes.map((route) => {
        const decoded = convertPolylineToCoordinates(route.geometry);

        return {
            summary: route.summary,
            segments: route.segments,
            bbox: route.bbox,
            way_points: route.way_points,
            geometry: {
                encoded: route.geometry,
            },
        };
    })
    
    // Returning structured response
    return {
        bbox: data.bbox,
        metadata: data.metadata,
        routes
    }; 
}
