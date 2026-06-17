// Pass in routes - i.e. routeCache - if it's a multi-route - will have more than one route which connects all orders 
// if it's only two coordinates - will have alterantive routes
export const computeScoreRoute = async (routes, vehicle, orders, scoringMode = "relative") => {
    // Handle single route for backward compatibility
    const routeArray = Array.isArray(routes) ? routes : [routes];

    if (!routeArray.length) {
        throw new Error("No routes provided");
    }

    for (const route of routeArray) {
        if (!route.summary || route.summary.distance === null || route.summary.duration === null) {
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

    // For Absolute Mode
    const computeAbsolute = (route) => {
        const vehicleCap = vehicle?.capacity ?? 1;

        const totalWeight = orders.reduce(
            (sum, o) => sum + (o.weight ?? 0),
            0
        );

        const capacityPenalty =
            vehicleCap > 0
                ? Math.max(0, (totalWeight - vehicleCap) / vehicleCap)
                : 1;

        // raw scaling (simple but effective v1)
        const distanceScore = route.summary.distance / 10000;
        const durationScore = route.summary.duration / 3600;

        const score =
            0.4 * distanceScore +
            0.4 * durationScore +
            0.2 * capacityPenalty;

        return {
            ...route,
            score,
            metrics: {
                distanceScore,
                durationScore,
                capacityPenalty,
            }
        };
    };

    const computeRelative = (route) => {
        const minDistance = Math.min(...distances);
        const maxDistance = Math.max(...distances);
        const minDuration = Math.min(...durations);
        const maxDuration = Math.max(...durations);

        const distanceScore = normalize(route.summary.distance, minDistance, maxDistance);
        const durationScore = normalize(route.summary.duration, minDuration, maxDuration);

        const vehicleCap = vehicle?.capacity ?? 1;

        const totalWeight = orders.reduce(
            (sum, o) => sum + (o.weight ?? 0),
            0
        );

        const capacityPenalty =
            vehicleCap > 0
                ? Math.max(0, (totalWeight - vehicleCap) / vehicleCap)
                : 1;

        const score =
            0.4 * distanceScore +
            0.4 * durationScore +
            0.2 * capacityPenalty;

        return {
            ...route,
            score,
            metrics: {
                distanceScore,
                durationScore,
                capacityPenalty,
            }
        };
    };

    const scored = routeArray.map(route => 
        scoringMode === "absolute"
            ? computeAbsolute(route)
            : computeRelative(route)
    );

    // multi-stop (1 route) -> return single object (absolute scoring)
    if (scored.length === 1) {
        return scored[0];
    } 

    // alternative routes -> ranked list (relative scoring)
    return scored.sort((a, b) => a.score - b.score);

}