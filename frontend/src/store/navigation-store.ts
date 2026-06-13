import { create } from "zustand";
import type { Vehicle, Order, RouteInfo } from "@/types";
import toast from "react-hot-toast";
import { getRoute } from "@/lib/api";
import { supabase } from "@/lib/supabaseClient";
import {
  createVehicle,
  deleteVehicle,
  updateVehicleInDB,
} from "../../services/vehicleService";
import {
  createOrder,
  deleteOrder,
  updateOrderInDB,
} from "../../services/orderService";
import { mapOrderFromDB, mapVehicleFromDB } from "@/lib/mapper";

type RouteData = {
  geometry: {
    encoded: string;
  };
  summary: {
    distance: number;
    duration: number;
  };
};

type LocationData = {
  locality: string;
  region: string;
  country: string;
  display_name: string;
  road: string;
  state: string;
  postcode: string;
  coordinates: {
    lat: number;
    lng: number;
  };
};

type NavigationStore = {
  // Core
  vehicles: Vehicle[];
  orders: Order[];

  // Currently selected
  selectedVehicle: Vehicle | null;
  selectedOrder: Order | null;

  // Modal State
  isModalOpen: boolean;
  modalType: "vehicle" | "order" | "active-vehicles" | "active-orders" | null;
  editingMode: true | false;
  editingVehicleId: string | null;
  editingOrderId: string | null;

  // Routing
  routes: RouteData[];
  selectedRouteIndex: number;
  routeInfo: RouteInfo[] | null;
  // Route Cache - vehicleId holds both orderHash and computed routes
  routeCache: {
    [vehicleId: string]: {
      orderHash: string;
      routes: RouteData[];
    };
  };
  // Location Cache - Reverse geocoding results stored by location key
  locationCache: { [key: string]: LocationData[] };
  // UI State
  isLoadingRoute: boolean;
  routeError: string | null;

  // Actions
  // Vehicles
  setVehicles: (vehicles: Vehicle[]) => void;
  addVehicle: (vehicle: Vehicle) => void;
  // For DB
  // Add vehicle to DB
  addVehicleToDB: (vehicle: Vehicle) => Promise<void>;
  setEditingVehicleId: (id: string | null) => void;
  setEditingMode: (editing: boolean) => void;
  deleteVehicle: (id: string) => void;
  updateVehicle: (vehicle: Vehicle) => void;
  // Orders
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  setEditingOrderId: (id: string | null) => void;
  addOrderToDB: (order: Order) => Promise<void>;
  deleteOrder: (id: string) => void;
  updateOrder: (order: Order) => void;

  // Selection
  setSelectedVehicle: (vehicle: Vehicle | null) => void;
  setSelectedOrder: (order: Order | null) => void;

  // Modal
  openModal: (
    type: "vehicle" | "order" | "active-vehicles" | "active-orders",
  ) => void;
  closeModal: () => void;

  setRoutes: (routes: RouteData[]) => void;
  setSelectedRouteIndex: (index: number) => void;

  setLoadingRoute: (loading: boolean) => void;
  setRouteError: (error: string | null) => void;
  setRouteInfo: (info: RouteInfo[] | null) => void;

  // Helpers
  getOrderById: (orderId?: string) => Order | undefined;
  getVehicleById: (vehicleId: string) => Vehicle | undefined;
  getTotalVehicles: () => number;
  getTotalOrders: () => number;

  // Route caching
  // vehicleDbId -> references vehicle
  // orders -> references all orders
  // orderHash -> hash of an order
  fetchAndCacheRoute: (
    vehicleDbId: string,
    orders: Order[],
    orderHash: string,
  ) => Promise<void>;
  getCachedRoute: (vehicleId: string) => {
    orderHash: string;
    routes: RouteData[];
  };
  clearRouteCache: (vehicleId: string) => void;

  // Location caching
  setCachedLocation: (key: string, locations: LocationData[]) => void;
  getCachedLocation: (key: string) => LocationData[] | null;
  clearLocationCache: (key?: string) => void;

  // Route Invalidation Helpers
  invalidateVehicleRoute: (vehileId: string) => void;
  invalidateOrderRoutes: (
    oldVehicleId: string | null,
    newVehicleId: string | null,
  ) => void;
};

export const useNavigationStore = create<NavigationStore>((set, get) => ({
  // Initial State
  vehicles: [],
  orders: [],
  selectedVehicle: null,
  selectedOrder: null,
  isModalOpen: false,
  modalType: null,
  editingMode: false,
  editingVehicleId: null,
  editingOrderId: null,
  routes: [],
  selectedRouteIndex: 0,
  routeInfo: null,
  routeCache: {} as Record<
    string,
    {
      orderHash: string;
      routes: RouteData[];
    }
  >,
  locationCache: {},
  isLoadingRoute: false,
  routeError: null,

  // Vehicle Actions
  setVehicles: (vehicles) => set({ vehicles }),

  addVehicle: (vehicle) => {
    try {
      set((state) => ({
        vehicles: [...state.vehicles, vehicle],
      }));
      toast.success("Added vehicle...");
    } catch (err) {
      console.error("Error adding vehicle:", err);
      toast.error("Failed to add vehicle. Try again.");
    }
  },

  addVehicleToDB: async (vehicle) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Not authenticated");
      return;
    }

    try {
      const dbVehicle = await createVehicle(vehicle, user.id);
      const mappedVehicle = mapVehicleFromDB(dbVehicle);

      set((state) => ({
        vehicles: [
          ...state.vehicles,
          {
            ...mappedVehicle,
            db_id: dbVehicle.id,
          },
        ],
      }));

      toast.success("Vehicle saved to database");
    } catch (err) {
      toast.error("Failed to save vehicle");
      throw err;
    }
  },

  setEditingVehicleId: (id) => set({ editingVehicleId: id }),

  setEditingOrderId: (id) => set({ editingOrderId: id }),

  setEditingMode: (editing) => set({ editingMode: editing }),

  deleteVehicle: async (vehicleId) => {
    try {
      // Call vehicle.service to delete vehicle in Supabase
      await deleteVehicle(vehicleId);

      set((state) => ({
        vehicles: state.vehicles.filter((v) => v.id !== vehicleId),

        // clear selection safely
        selectedVehicle:
          state.selectedVehicle?.id === vehicleId
            ? null
            : state.selectedVehicle,

        // Unassign orders locally
        orders: state.orders.map((o) =>
          o.vehicle_id === vehicleId ? { ...o, vehicle_id: null } : o,
        ),
      }));

      // Invalidate route for vehicle
      get().invalidateVehicleRoute(vehicleId);

      toast.success("Vehicle deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete vehicle");
    }
  },

  updateVehicle: async (vehicle: Vehicle) => {
    try {
      // Update vehicle in Supabase using vehicle.service
      const updated = await updateVehicleInDB(vehicle);

      set((state) => ({
        vehicles: state.vehicles.map((v) =>
          v.id === updated.id ? updated : v,
        ),

        selectedVehicle:
          state.selectedVehicle?.id === updated.id
            ? updated
            : state.selectedVehicle,
      }));

      // invalidate route for vehicle
      get().invalidateVehicleRoute(updated.id);

      console.log("Vehicle updated -> route invalidation needed");

      toast.success("Vehicle updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update vehicle");
    }
  },

  // Order Actions
  setOrders: (orders) => set({ orders }),

  addOrder: (order) =>
    set((state) => ({
      orders: [...state.orders, order],
    })),

  addOrderToDB: async (order) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    try {
      const dbOrder = await createOrder(order, user.id);
      const mappedOrder = mapOrderFromDB(dbOrder);

      set((state) => ({
        orders: [...state.orders, mappedOrder],
      }));

      if (mappedOrder.vehicle_id) {
        // invalidate route for vehicle that order is added to
        get().invalidateVehicleRoute(mappedOrder.vehicle_id);
      }

      toast.success("Order saved to database");
    } catch (err) {
      console.error("Error saving order:", err);
      toast.error("Failed to save order");
      throw err;
    }
  },

  deleteOrder: async (orderId) => {
    try {
      const order = get().orders.find((o) => o.id === orderId);

      await deleteOrder(orderId);

      set((state) => ({
        orders: state.orders.filter((v) => v.id !== orderId),
        selectedOrder:
          state.selectedOrder?.id === orderId ? null : state.selectedOrder,
      }));

      if (order?.vehicle_id) {
        // invalidate route for vehicle that order is deleted from
        get().invalidateVehicleRoute(order.vehicle_id);
      }

      toast.success("Order deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete Order");
    }
  },

  updateOrder: async (order: Order) => {
    try {
      const prevOrder = get().orders.find((o) => o.id === order.id);

      // Update order in Supabase using order.service
      const updated = await updateOrderInDB(order);

      set((state) => ({
        orders: state.orders.map((o) => (o.id === updated.id ? updated : o)),

        // clear selected order safely
        selectedOrder:
          state.selectedOrder?.id === updated.id
            ? updated
            : state.selectedOrder,
      }));

      // hook point
      const vehicleChanged = prevOrder?.vehicle_id !== updated.vehicle_id;
      const locationChanged =
        prevOrder?.location[0] !== updated.location[0] ||
        prevOrder?.location[1] !== updated.location[1];
         
      if (vehicleChanged || locationChanged) {
        // invalidate route for vehicle if the vehicle has changed for the order
        // or the order location has changed
        get().invalidateOrderRoutes(
          prevOrder?.vehicle_id ?? null,
          updated.vehicle_id,
        );
      }

      toast.success("Order updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update Order");
    }
  },

  // Selection
  setSelectedVehicle: (vehicle) => {
    set({ selectedVehicle: vehicle });
  },

  setSelectedOrder: (order) => {
    set({ selectedOrder: order });
    console.log({ order });
  },

  // Modal
  openModal: (type) =>
    set({
      isModalOpen: true,
      modalType: type,
    }),

  closeModal: () =>
    set({
      isModalOpen: false,
      modalType: null,
    }),

  // Routes
  setRoutes: (routes) =>
    set({
      routes,
      // reset on new fetch
      selectedRouteIndex: 0,
    }),

  setSelectedRouteIndex: (index) => set({ selectedRouteIndex: index }),

  // UI State
  setLoadingRoute: (loading) => set({ isLoadingRoute: loading }),

  setRouteError: (error) => set({ routeError: error }),

  setRouteInfo: (info) => set({ routeInfo: info }),

  // Helpers
  getOrderById: (orderId) => {
    return get().orders.find((o) => o.id === orderId);
  },

  getVehicleById: (vehicleId) => {
    return get().vehicles.find((v) => v.id === vehicleId);
  },

  getTotalVehicles: () => {
    return get().vehicles.length;
  },

  getTotalOrders: () => {
    return get().orders.length;
  },

  // Route caching
  fetchAndCacheRoute: async (vehicleId, orders, orderHash) => {
    try {
      set({ isLoadingRoute: true, routeError: null });

      const state = get();

      // Check if vehicleId is already in cache
      const cached = state.routeCache[vehicleId];

      // Return cache if route unchanged
      if (cached?.orderHash === orderHash) {
        set({ isLoadingRoute: false });
        return;
      }

      // Get vehicle from vehicleId
      const vehicle = state.vehicles.find((v) => v.id === vehicleId);
      if (!vehicle) throw new Error("Vehicle not found");

      // Build coordiantes (vehicle + all orders)
      const coordinates = [
        vehicle.startLocation,
        ...orders.map((o) => o.location),
      ];

      // Fetch routes from API
      const routeData = await getRoute(coordinates);

      // Cache the routes by vehicle ID

      set((state) => ({
        routeCache: {
          ...state.routeCache,
          [vehicleId]: {
            orderHash,
            routes: routeData.routes || [],
          },
        },
        isLoadingRoute: false,
      }));

      toast.success("Route cached");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch route";
      set({
        routeError: errorMessage,
        isLoadingRoute: false,
      });
      toast.error(errorMessage);
    }
  },

  getCachedRoute: (vehicleId: string) => {
    // Validate that the selected vehicle has an order attached
    const state = get();

    // console.log("Cache lookup", vehicleId, state.routeCache[vehicleId]);

    // Return cached routes for this vehicle, or null if not found
    return state.routeCache[vehicleId] || null;
  },

  clearRouteCache: (vehicleId) => {
    set((state) => {
      const { [vehicleId]: _, ...remainingCache } = state.routeCache;
      return {
        routeCache: remainingCache,
      };
    });
  },

  // Location caching
  setCachedLocation: (key, locations) => {
    set((state) => ({
      locationCache: {
        ...state.locationCache,
        [key]: locations,
      },
    }));
  },

  getCachedLocation: (key) => {
    const state = get();
    return state.locationCache[key] || null;
  },

  clearLocationCache: (key) => {
    set((state) => {
      if (key) {
        const { [key]: _, ...remainingCache } = state.locationCache;
        return { locationCache: remainingCache };
      }
      return { locationCache: {} };
    });
  },

  invalidateVehicleRoute: (vehicleId: string) => {
    set((state) => {
      const { [vehicleId]: _, ...remainingCache } = state.routeCache;

      return {
        routeCache: remainingCache,
      };
    });

    console.log(`Invalidated route cache for vehicle ${vehicleId}`);
    toast.success(`Route cache removed for vehicle ${vehicleId}`);
  },

  invalidateOrderRoutes: (oldVehicleId, newVehicleId) => {
    const { invalidateVehicleRoute } = get();

    if (oldVehicleId) {
      invalidateVehicleRoute(oldVehicleId);
    }

    if (newVehicleId && newVehicleId !== oldVehicleId) {
      invalidateVehicleRoute(newVehicleId);
    }
  },

  // Helpers
  validateAssignment: (orderId: string, vehicleId: string | null) => {
    const state = get();

    if (vehicleId) {
      const vehicleExists = state.vehicles.some((v) => v.id === vehicleId);

      if (!vehicleExists) {
        console.warn("Invalid vehicle assignment blocked");
        return false;
      }
    }

    const orderExists = state.orders.some((o) => o.id === orderId);

    if (!orderExists) {
      console.warn("Invalid order update blocked");
      return false;
    }

    return true;
  },

  generateOrderHash: (orders: Order[]) => {
    return orders
      .map((o) => `${o.id}-${o.location.join(",")}-${o.weight}-${o.vehicle_id}`)
      .sort()
      .join("|");
  },
}));
