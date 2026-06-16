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
  distance: number | null;
  duration: number | null;
};

// TODO: add a type for Route