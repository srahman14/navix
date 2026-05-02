import { create } from "zustand";

type Vehicle = {
  id: string;
  status: "active" | "pending" | "idle";
  orders: number;
  load: string;
  startLocation: [number, number];
  orderId?: string;
};

type Order = {
  id: string;
  priority: "high" | "medium" | "low";
  weight: string;
  location: [number, number];
};

type RouteData = {
  geometry: {
    decoded: [number, number];
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

  // Routing
  routes: RouteData[];
  selectedRouteIndex: number;
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

  setSelectedVehicle: (vehicle: Vehicle) => void;

  setRoutes: (routes: RouteData[]) => void;
  setSelectedRouteIndex: (index: number) => void;

  setLoadingRoute: (loading: boolean) => void;
  setRouteError: (error: string | null) => void;

  // Helpers
  getOrderById: (orderId?: string) => Order | undefined;
};

export const useNavigationStore = create<NavigationStore>((set, get) => ({
  // Initial State
  vehicles: [],
  orders: [],
  selectedVehicle: null,
  routes: [],
  selectedRouteIndex: 0,
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

  // Helper
  getOrderById: (orderId) => {
    return get().orders.find((o) => o.id === orderId);
  },
}));
