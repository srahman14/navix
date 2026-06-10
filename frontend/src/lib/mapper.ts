import { Order, Vehicle } from "@/types";

export const mapVehicleFromDB = (dbVehicle: any): Vehicle => ({
  id: dbVehicle.name,
  db_id: dbVehicle.id,
  status: dbVehicle.status,
  type: dbVehicle.type,
  load: dbVehicle.load,
  capacity: dbVehicle.capacity,
  startLocation: [
    dbVehicle.start_lng,
    dbVehicle.start_lat,
  ],
});

export const mapOrderFromDB = (dbOrder: any): Order => ({
    id: dbOrder.name,
    priority: dbOrder.priority,
    weight: dbOrder.weight,
    location: [
        dbOrder.lng,
        dbOrder.lat,
    ],
    vehicle_id: dbOrder.vehicle_id,
});