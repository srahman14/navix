export type VehicleStatus = "active" | "idle" | "pending";
export type OrderPriority = "high" | "medium" | "low";

export type Vehicle = {
  id: string;
  status: "active" | "pending" | "idle";
  orders: number;
  load: number;
  startLocation: [number, number];
  orderId?: string;
};

export type Order = {
  id: string;
  priority: "high" | "medium" | "low";
  weight: number;
  location: [number, number];
};

export type RouteInfo = {
  distance: number | null;
  duration: number | null;
};

export type RouteReport = {
  vehicleId: string;
  vehicleType: string;
  ordersAssigned: number;

  totalDistance: number;
  totalDuration: number;

  routeScore: number;
  capacityUsedPercent: number;

  scoringMode: string;
  generatedAt: string;

  summary: string;
};

export type RouteExplanation = {
  bestRouteIndex: number;
  explanation: string;

  routeBreakdown: {
    index: number;
    score: number;
    deltaFromBest: number;

    keyFactors: {
      distanceScore: number;
      durationScore: number;
      capacityPenalty: number;
    };

    reason: string;
  }[];
}