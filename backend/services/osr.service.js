import { ENV_VARS } from "../config/envVars.js";
import { convertPolylineToCoordinates } from "../utils/polyline.js";

export const fetchFromOSR = async (url, coordinates) => {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": ENV_VARS.OSR_API_KEY, 
        },
        body: JSON.stringify({
            coordinates: coordinates,
            alternative_routes: {
                target_count: 3,
                weight_factor: 1.4,
                share_factor: 0.6,
            },
            elevation: false
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to fetch data from OSR " + response.statusText);
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
                decoded,
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
