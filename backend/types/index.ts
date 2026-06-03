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