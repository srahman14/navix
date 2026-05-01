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
        }),
    });

    if (response.status !== 200) {
        throw new Error("Failed to fetch data from OSR " + response.statusText);
    }

    const data = await response.json();

    // Extract the main route 
    const route = data.routes?.[0];
    if (!route) {
        throw new Error("No route found in OSR response");
    }

    const decodedCoordinates = convertPolylineToCoordinates(route.geometry);

    // Returning structured response
    return {
        bbox: data.bbox,
        metadata: data.metadata,
        routes: {
            summary: route.summary,
            segments: route.segments,
            bbox: route.bbox,
            way_points: route.way_points,
        },
        geometry: {
            decoded: decodedCoordinates
        }
    }; 
}
