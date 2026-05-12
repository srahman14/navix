import { create } from "zustand";
import type { Vehicle, Order, RouteInfo } from "@/types";
import toast from "react-hot-toast";
import { getRoute } from "@/lib/api";

type RouteData = {
  geometry: {
    decoded: [number, number][];
  };
  summary: {
    distance: number;
    duration: number;
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
  modalType: "vehicle" | "order" | null;

  // Routing
  routes: RouteData[];
  selectedRouteIndex: number;
  routeInfo: RouteInfo[] | null;
  // Route Cache - Pre-computed routes stored by vehicleId
  routeCache: { [vehicleId: string]: RouteData[] };
  // UI State
  isLoadingRoute: boolean;
  routeError: string | null;

  // Actions
  // Vehicles
  setVehicles: (vehicles: Vehicle[]) => void;
  addVehicle: (vehicle: Vehicle) => void;
  deleteVehicle: (id: string) => void;
  // Orders
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  deleteOrder: (id: string) => void;
  // Selection
  setSelectedVehicle: (vehicle: Vehicle | null) => void;
  setSelectedOrder: (order: Order | null) => void;

  // Modal
  openModal: (type: "vehicle" | "order") => void;
  closeModal: () => void;

  setRoutes: (routes: RouteData[]) => void;
  setSelectedRouteIndex: (index: number) => void;

  setLoadingRoute: (loading: boolean) => void;
  setRouteError: (error: string | null) => void;
  setRouteInfo: (info: RouteInfo[] | null) => void;

  // Helpers
  getOrderById: (orderId?: string) => Order | undefined;
  getTotalVehicles: () => number;
  getTotalOrders: () => number;

  // Route caching
  fetchAndCacheRoute: (vehicleId: string, vehicle: Vehicle, order: Order) => Promise<void>;
  getCachedRoute: (vehicleId: string) => RouteData[] | null;
  clearRouteCache: (vehicleId: string) => void;
};

export const useNavigationStore = create<NavigationStore>((set, get) => ({
  // Initial State
  vehicles: [],
  orders: [],
  selectedVehicle: null,
  selectedOrder: null,
  isModalOpen: false,
  modalType: null,
  routes: [],
  selectedRouteIndex: 0,
  routeInfo: null,
  routeCache: {},
  isLoadingRoute: false,
  routeError: null,

  // Vehicle Actions
  setVehicles: (vehicles) => set({ vehicles }),

  addVehicle: (vehicle) => {
    try {
      set((state) => ({
        vehicles: [...state.vehicles, vehicle],
        
      }))
      toast.success("Added vehicle...");
    } catch (err) {
      toast.error("Failed to add vehicle. Try again.");
    }
    },

  deleteVehicle: (id) => {
    // Clear cached routes for this vehicle
    set((state) => {
      const { [id]: _, ...remainingCache } = state.routeCache;
      return {
        vehicles: state.vehicles.filter((v) => v.id !== id),
        routeCache: remainingCache,
      };
    });
    toast.success("Vehicle removed from cache");
  },
  // Order Actions
  setOrders: (orders) => set({ orders }),

  addOrder: (order) =>
    set((state) => ({
      orders: [...state.orders, order],
    })),

  deleteOrder: (id) =>
    set((state) => ({
      orders: state.orders.filter((o) => o.id !== id),
    })),

  // Selection
  setSelectedVehicle: (vehicle) => set({ selectedVehicle: vehicle }),

  setSelectedOrder: (order) => set({ selectedOrder: order }),

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

  getTotalVehicles: () => {
    return get().vehicles.length;
  },

  getTotalOrders: () => {
    return get().orders.length;
  },

  // Route caching
  fetchAndCacheRoute: async (vehicleId, vehicle, order) => {
    try {
      set({ isLoadingRoute: true, routeError: null });

      // Build coordinates array: [vehicle start location, order location]
      const coordinates = [vehicle.startLocation, order.location];

      // Fetch routes from API
      const routeData = await getRoute(coordinates);

      // Cache the routes by vehicle ID
      set((state) => ({
        routeCache: {
          ...state.routeCache,
          [vehicleId]: routeData.routes || [],
        },
        isLoadingRoute: false,
      }));

      toast.success("Route cached for vehicle");
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

  getCachedRoute: (vehicleId) => {
    // Validate that the selected vehicle has an order attached
    const state = get();
    const selectedVehicle = state.selectedVehicle;

    if (!selectedVehicle || !selectedVehicle.orderId) {
      return null;
    }

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

}));
