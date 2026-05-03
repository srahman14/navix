import { create } from "zustand";
import type { Vehicle, Order } from "@/types";

type RouteData = {
  geometry: {
    decoded: [number, number];
  };
  summary: {
    distance: number;
    duration: number;
  };
};

type RouteInfo = {
  distance: number | null;
  duration: number | null;
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
  routeInfo: RouteInfo | null;
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
  setRouteInfo: (info: RouteInfo | null) => void;

  // Helpers
  getOrderById: (orderId?: string) => Order | undefined;
  getTotalVehicles: () => number;
  getTotalOrders: () => number;
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
  isLoadingRoute: false,
  routeError: null,

  // Vehicle Actions
  setVehicles: (vehicles) => set({ vehicles }),

  addVehicle: (vehicle) =>
    set((state) => ({
      vehicles: [...state.vehicles, vehicle],
      
    })),

  deleteVehicle: (id) =>
    set((state) => ({
      vehicles: state.vehicles.filter((v) => v.id !== id),
    })),
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

}));
