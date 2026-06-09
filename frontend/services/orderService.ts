import { supabase } from "@/lib/supabaseClient";
import type { Order } from "@/types";

export const createOrder = async (order: Order, userId: string) => {
    const { data, error } = await supabase 
        .from("orders")
        .insert([
            {
                user_id: userId,
                priority: order.priority,
                weight: order.weight,
                lat: order.location[1],
                lng: order.location[0],
                vehicle_id: null,
            }
        ])
        .select()
        .single();

    if (error) throw error;

    return data;
};