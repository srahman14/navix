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
            }
        ])
        .select()
        .single();

        if (error) throw error;

        return data;
}
