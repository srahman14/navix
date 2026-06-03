export const computeScoreRoutes = async (routes) => {
    // Handle single route for backward compatibility
    const routeArray = Array.isArray(routes) ? routes : [routes];

    for (const route of routes) {
        if (!route.summary || route.summary.distance === undefined || route.summary.duration === undefined) {
            throw new Error("All routes must have summaries with distances and durations")
        } 
    }

    // Prepocessing distances and durations 
    const distances = routeArray.map(r => r.summary.distance)
    const durations = routeArray.map(r => r.summary.duration)

    // Normalization helper
    const normalize = (value, min, max) => {
        if (max === min) return 0;
        return (value - min) / (max - min);
    }

    // Min & Max distances/durations
    const minDistance = Math.min(...distances);
    const maxDistance = Math.max(...distances);
    const minDuration = Math.min(...durations);
    const maxDuration = Math.max(...durations);

    return routeArray.map((route) => {
        // Normalized distance & duration for current route
        const normDistance = normalize(route.summary.distance, minDistance, maxDistance);
        const normDuration = normalize(route.summary.duration, minDuration, maxDuration);
        // weights for now set to 0.5 (for current v1)
        // will be configurable for future with user preference, VRP policy, optimization tuning
        const distanceWeight = 0.5;
        const durationWeight = 0.5;
        // Score of Route (WSM)
        // Lower score = more optimal route 
        const score = 
            distanceWeight * normDistance +
            durationWeight * normDuration;

        return {
            ...route,
            score
        }
        
    });
}