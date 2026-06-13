import { mapVehicleFromDB } from "@/lib/mapper";
import { supabase } from "@/lib/supabaseClient";
import type { Vehicle } from "@/types";

export const createVehicle = async (vehicle: Vehicle, userId: string) => {
  const { data, error } = await supabase
    .from("vehicles")
    .insert([
      {
        user_id: userId,
        name: vehicle.id, // vehicle.id is the actual name for the vehicle
        status: vehicle.status,
        load: vehicle.load,
        // Add the lat and lng in the opposite order since the database expects lng first
        start_lat: vehicle.startLocation[1],
        start_lng: vehicle.startLocation[0],
        type: vehicle.type,
        capacity: vehicle.capacity,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return data;
};

export const fetchVehicles = async (userId: string) => {
  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("user_id", userId);

  if (error) throw error;

  return (data ?? []).map(mapVehicleFromDB);
};

export const updateVehicleInDB = async (vehicle: Vehicle) => {
  const { data, error } = await supabase
    .from("vehicles")
    .update({
      name: vehicle.id,
      status: vehicle.status,
      type: vehicle.type,
      load: vehicle.load,
      capacity: vehicle.capacity,
      start_lat: vehicle.startLocation[1],
      start_lng: vehicle.startLocation[0],
    })
    .eq("id", vehicle.db_id)
    .select()
    .single();

  if (error) throw error;

  return mapVehicleFromDB(data);
};

export const deleteVehicle = async (vehicleId: string) => {
  // Unassign all orders linked to this vehicle first 
  const { error: updateError } = await supabase
    .from("orders")
    .update({ vehicle_id: null })
    .eq("vehicle_id", vehicleId);

  if (updateError) throw updateError;
  
  // Delete vehicle 
  const { error: deleteError } = await supabase
        .from("vehicles")
        .delete()
        .eq("id", vehicleId);
    
        if (deleteError) throw deleteError;
    
        return vehicleId;
};