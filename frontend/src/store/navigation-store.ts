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

type LocationData = {
  locality: string;
  region: string;
  country: string;
  display_name: string;
  road: string,
  state: string,
  postcode: string,
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
  editingVehicleId: string | null;
  editingOrderId: string | null;

  // Routing
  routes: RouteData[];
  selectedRouteIndex: number;
  routeInfo: RouteInfo[] | null;
  // Route Cache - Pre-computed routes stored by vehicleId
  routeCache: { [vehicleId: string]: RouteData[] };
  // Location Cache - Reverse geocoding results stored by location key
  locationCache: { [key: string]: LocationData[] };
  // UI State
  isLoadingRoute: boolean;
  routeError: string | null;

  // Actions
  // Vehicles
  setVehicles: (vehicles: Vehicle[]) => void;
  addVehicle: (vehicle: Vehicle) => void;
  deleteVehicle: (id: string) => void;
  updateVehicle: (id: string, vehicle: Vehicle) => void;
  // Orders
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  deleteOrder: (id: string) => void;
  updateOrder: (id: string, order: Order) => void;
  // Selection
  setSelectedVehicle: (vehicle: Vehicle | null) => void;
  setSelectedOrder: (order: Order | null) => void;

  // Modal
  openModal: (type: "vehicle" | "order" | "active-vehicles" | "active-orders") => void;
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
  fetchAndCacheRoute: (vehicleId: string, vehicle: Vehicle, order: Order) => Promise<void>;
  getCachedRoute: (vehicleId: string) => RouteData[] | null;
  clearRouteCache: (vehicleId: string) => void;

  // Location caching
  setCachedLocation: (key: string, locations: LocationData[]) => void;
  getCachedLocation: (key: string) => LocationData[] | null;
  clearLocationCache: (key?: string) => void;
};

export const useNavigationStore = create<NavigationStore>((set, get) => ({
  // Initial State
  vehicles: [],
  orders: [],
  selectedVehicle: null,
  selectedOrder: null,
  isModalOpen: false,
  modalType: null,
  editingVehicleId: null,
  editingOrderId: null,
  routes: [],
  selectedRouteIndex: 0,
  routeInfo: null,
  routeCache: {},
  locationCache: {},
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

  updateVehicle: (id, updatedVehicle) => {
    set((state) => ({
      vehicles: state.vehicles.map((v) => (v.id === id ? updatedVehicle : v)),
      selectedVehicle: state.selectedVehicle?.id === id ? updatedVehicle : state.selectedVehicle,
    }));
    toast.success("Vehicle updated");
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

  updateOrder: (id, updatedOrder) =>
    set((state) => ({
      orders: state.orders.map((o) => (o.id === id ? updatedOrder : o)),
      selectedOrder: state.selectedOrder?.id === id ? updatedOrder : state.selectedOrder,
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
        error instanceof Error ? error.message : "Failed to fh route";
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
}));
