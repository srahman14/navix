// Service shuold take bestRoute, vehicle, orders, scoringMode as inputs
// output -> report generator

// compute capacity
// build summary sentence
// return formatted report object

export const generateRouteReport = async (
  routes,
  vehicle,
  orders,
  scoringMode = "absolute"
) => {
  if (!routes || !Array.isArray(routes) || routes.length === 0) {
    throw new Error("Routes are required");
  }

  const bestRoute = routes[0];

  if (!bestRoute?.summary) {
    throw new Error("Best route summary missing");
  }

  const totalWeight = orders.reduce((sum, o) => sum + o.weight, 0);

  const capacityUsedPercent =
    vehicle.capacity > 0
      ? (totalWeight / vehicle.capacity) * 100
      : 0;

  const summary =
    capacityUsedPercent >= 90
      ? "Selected route minimizes distance and duration while operating near vehicle capacity."
      : "Selected route minimizes distance and duration while remaining within safe capacity limits.";

  return {
    vehicleId: vehicle.id,
    vehicleType: vehicle.type,
    ordersAssigned: orders.length,

    totalDistance: bestRoute.summary.distance,
    totalDuration: bestRoute.summary.duration,

    score: bestRoute.score,          
    bestRouteIndex: 0,               

    capacityUsedPercent,
    scoringMode,
    generatedAt: new Date().toISOString(),

    recommendation:
      capacityUsedPercent >= 90
        ? "High capacity utilization detected"
        : "Optimal route selected",

    summary,
  };
};