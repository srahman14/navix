export type VehicleStatus = "active" | "idle" | "pending";
export type OrderPriority = "high" | "medium" | "low";

export interface Vehicle {
  id: string;
  status: "active" | "pending" | "idle";
  orders: number;
  load: string;
  startLocation: [number, number];
  orderId?: string;
};

export interface Order {
  id: string;
  priority: "high" | "medium" | "low";
  weight: string;
  location: [number, number];
};