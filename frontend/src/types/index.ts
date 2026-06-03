export type VehicleStatus = "active" | "idle" | "pending";
export type OrderPriority = "high" | "medium" | "low";

export interface Vehicle {
  id: string;
  status: "active" | "pending" | "idle";
  orders: number;
  load: number;
  startLocation: [number, number];
  orderId?: string;
};

export interface Order {
  id: string;
  priority: "high" | "medium" | "low";
  weight: number;
  location: [number, number];
};

export interface RouteInfo {
  distance: number | null;
  duration: number | null;
};

// TODO: add a type for Route