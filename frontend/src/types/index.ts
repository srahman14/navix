export type VehicleStatus = "active" | "idle" | "pending";
export type OrderPriority = "high" | "medium" | "low";

// TODO: remove orderID from vehicle
export interface Vehicle {
  // id -> UI ID (TRUCK-123, VAN-065 etc. -> readable ID)
  id: string;
  // db_id -> UUID generated in Supabase
  db_id?: string;
  status: "active" | "pending" | "idle";
  type: "car" | "truck" | "van";
  // orders: number;
  load: number;
  capacity: number;
  startLocation: [number, number];
  orderId?: string;
};

// TODO: only allow orders to add vehicleIDs
export interface Order {
  id: string;
  // db_id -> UUID auto-gen in supabase
  db_id?: string;
  priority: "high" | "medium" | "low";
  weight: number;
  location: [number, number];
  vehicle_id: string | null;
};

export interface RouteInfo {
  distance: number;
  duration: number;
  score?: number;
  metrics?: RouteMetrics;
};

export interface RouteData {
  geometry: {
    encoded: string;
  };
  summary: {
    distance: number;
    duration: number;
  };
};

export interface RouteMetrics {
  distanceScore: number;
  durationScore: number;
  capacityPenalty: number;
}

export type ScoredRoute = RouteData & {
  score: number;
  metrics: RouteMetrics;
} 

// For report generator
// export interface RouteReport {
//   vehicleId: string;
//   vehicleType: string;
//   ordersAssigned: number;

//   totalDistance: number;
//   totalDuration: number;

//   routeScore: number;
//   capacityUsedPercent: number;

//   scoringMode: string;
//   generatedAt: string;

//   summary: string;
// }

// For report generator
export interface RouteDecisionReport {
  vehicleId: string,
  vehicleType: string,
  ordersAssigned: number,
  totalDistance: number,
  totalDuration: number,
  capacityUsedPercent: number,
  scoringMode: string,
  summary: string;
  recommendation: string;
  bestRouteIndex: number;
  score?: number;
  generatedAt: Date,
}

// For explaination engine
export interface RouteBreakdown {
  index: number;
  score: number;
  deltaFromBest: number;

  keyFactors: {
    distanceScore: number;
    durationScore: number;
    capacityPenalty: number;
  };

  reason: string;
}

export interface RouteExplanation {
  bestRouteIndex: number;
  explanation: string;
  routeBreakdown: RouteBreakdown[];
  scoringMode: string;
  generatedAt: string;
}

// Decision Engine
export interface RouteDecision {
  report: RouteDecisionReport;
  explanation: RouteExplanation;
  generatedAt: string;
}