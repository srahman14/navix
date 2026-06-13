import { mapOrderFromDB } from "@/lib/mapper";
import { supabase } from "@/lib/supabaseClient";
import type { Order } from "@/types";

export const createOrder = async (order: Order, userId: string) => {
    const { data, error } = await supabase 
        .from("orders")
        .insert([
            {
                user_id: userId,
                name: order.id,
                priority: order.priority,
                weight: order.weight,
                lat: order.location[1],
                lng: order.location[0],
                vehicle_id: order.vehicle_id,
            }
        ])
        .select()
        .single();

    if (error) throw error;

    return data;
};

export const fetchOrders = async (userId: string) => {
    const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", userId);

    if (error) throw error;

    return (data ?? []).map(mapOrderFromDB);
}

export const updateOrderInDB = async (order: Order) => {
    const { data, error } = await supabase
        .from("orders")
        .update({
                name: order.id,
                priority: order.priority,
                weight: order.weight,
                lat: order.location[1],
                lng: order.location[0],
                vehicle_id: order.vehicle_id,
        })
        .eq("id", order.db_id)
        .select()
        .single();

    if (error) throw error;

    return mapOrderFromDB(data);
}

export const deleteOrder = async (orderId: string) => {
    const { error } = await supabase
        .from("orders")
        .delete()
        .eq("id", orderId);

        if (error) throw error;

        return orderId;
}

