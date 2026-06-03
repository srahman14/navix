import { formatDistance, formatDuration } from "../utils/format.js";

export const getMetricsFromRoutes = async (routes) => {
    // Handle single route for backward compatibility
    const routeArray = Array.isArray(routes) ? routes : [routes];
    
    // Get current time
    const startDate = new Date();
    
    return routeArray.map(route => {
        if (!route.summary || route.summary.distance === undefined || route.summary.duration === undefined) {
            throw new Error("Route must have summary with distance and duration");
        }
        
        const distance = route.summary.distance;
        const duration = route.summary.duration;
        
        // Calculate arrival time (duration is in seconds)
        const arrivalDate = new Date(startDate.getTime() + duration * 1000);
        
        return {
            distance: distance,
            duration: duration,
            startTime: startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
            arrivalTime: arrivalDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        };
    });
}