// TODO: 
// - add normalization - normalize distances & durations first 
// - compute score using normalized distance & duration 
export const computeScoreRoutes = async (routes) => {
    // Handle single route for backward compatibility
    const routeArray = Array.isArray(routes) ? routes : [routes];

    for (const route in routes) {
        if (!route.summary || route.summary.distance === undefined || route.summary.duration === undefined) {
            throw new Error("All routes must have summaries with distances and durations")
        } 
    }

    return routeArray.map((route, index) => {
        // Score of Route
        const score = 0
        // Weights 
        const distanceWeight = 0.5
        const durationWeight = 0.5
        // Distance & Duration from Route 
        const distance = route.summary.distance;
        const duration = route.summary.duration;
        
        score = (distanceWeight * distance) + (durationWeight * duration)
        
    });
}