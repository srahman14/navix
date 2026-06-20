// This service -> provides clarity with comparisons between the different routes 
// score deltas
// normalized metrics

export const generateRouteExplanation = async (
  routes,
  vehicle,
  orders,
  scoringMode = "absolute"
) => {
  if (!routes || !Array.isArray(routes) || routes.length === 0) {
    throw new Error("Routes are required");
  }

  // Ensure routes are sorted (safety guard)
  const sortedRoutes = [...routes].sort((a, b) => a.score - b.score);

  // Best route is the first route by default (routes are sorted from best to worst)
  const bestRoute = sortedRoutes[0];

  if (!bestRoute || !bestRoute.summary) {
    throw new Error("Best route summary missing");
  }

  const bestScore = bestRoute.score;

  const totalWeight = orders.reduce((sum, o) => sum + o.weight, 0);

  const capacityUsedPercent =
    vehicle.capacity > 0
      ? (totalWeight / vehicle.capacity) * 100
      : 0;

  // Helper: generate human reasoning
  const explainRoute = (route, index) => {
    // Difference in the score between route and the best route 
    const scoreDelta = route.score - bestScore;

    // Difference in the distance between route and the best route
    const distanceDelta =
      route.metrics?.distanceScore - bestRoute.metrics?.distanceScore;

    // Difference in the duration between route and the best route
    const durationDelta =
      route.metrics?.durationScore - bestRoute.metrics?.durationScore;

    let reason = "";

    if (index === 0) {
      reason = "Optimal balance of distance and duration.";
    } else {
      const parts = [];

      if (distanceDelta > 0) {
        parts.push("higher distance cost");
      }

      if (durationDelta > 0) {
        parts.push("increased travel time");
      }

      if (scoreDelta > 0.01) {
        parts.push("overall less optimal trade-off");
      }

      reason =
        parts.length > 0
          ? `Worse due to ${parts.join(", ")}.`
          : "Slightly less optimal route.";
    }

    return {
      index,
      score: route.score,
      deltaFromBest: scoreDelta,

      keyFactors: {
        distanceScore: route.metrics?.distanceScore ?? 0,
        durationScore: route.metrics?.durationScore ?? 0,
        capacityPenalty: route.metrics?.capacityPenalty ?? 0,
      },

      reason,
    };
  };

  // Compute the explaination by going through each route 
  const routeBreakdown = sortedRoutes.map((route, index) =>
    explainRoute(route, index)
  );

  // Global explanation (top-level narrative)
  // Fixed to 'route 1' as of now since all routes are sorted (best to worst)
  let explanation = `Route 1 is selected as the optimal path`;

  if (capacityUsedPercent >= 90) {
    explanation +=
      " despite high vehicle utilization, due to superior routing efficiency.";
  } else {
    explanation += " based on lowest combined cost of distance and duration.";
  }

  return {
    bestRouteIndex: 0,
    explanation,

    routeBreakdown,

    scoringMode,
    generatedAt: new Date().toISOString(),
  };
};
