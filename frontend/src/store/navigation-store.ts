import { create } from "zustand";
import type {
  Vehicle,
  Order,
  RouteInfo,
  RouteData,
  ScoredRoute,
  RouteDecisionReport,
  RouteExplanation,
  RouteDecision,
} from "@/types";
import toast from "react-hot-toast";
import {
  getRoute,
  getRouteDecision,
  getRouteDecisionReport,
  getRouteExplanation,
  getRouteScore,
} from "@/lib/api";
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
import { euclideanDistance } from "@/lib/distance";

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

type RouteCache = {
  [vehicleId: string]: {
    orderHash: string;
    routes: ScoredRoute[];
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
  modalType:
    | "vehicle"
    | "order"
    | "active-vehicles"
    | "active-orders"
    | "report"
    | null;
  editingMode: true | false;
  editingVehicleId: string | null;
  editingOrderId: string | null;

  // Routing
  routes: RouteData[];
  selectedRouteIndex: number;
  routeInfo: RouteInfo[] | null;
  // Route Cache - vehicleId holds both orderHash and computed routes
  // Future -> add primaryRoute and alternatives - more semantically clear
  // i.e. replace routes -> primaryRoute: RouteData;
  // add -> 'alternatives?: routeData[];'
  routeCache: RouteCache;
  // Location Cache - Reverse geocoding results stored by location key
  locationCache: { [key: string]: LocationData[] };
  // UI State
  isLoadingRoute: boolean;
  routeError: string | null;

  // Route Report
  // routeDecisionReport: RouteDecisionReport | null;
  isGeneratingReport: boolean;
  reportError: string | null;

  // Route Report Explaination (v1)
  routeExplanation: RouteExplanation | null;
  isGeneratingExplanation: boolean;
  explanationError: string | null;

  // Route Decision Engine (Report Generator + Explanation Engine)
  routeDecision: RouteDecision | null;

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
    type: "vehicle" | "order" | "active-vehicles" | "active-orders" | "report",
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
    routes: ScoredRoute[];
  } | null;
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

  // Assigment methods
  assignOrderToVehicle: (orderId: string, vehicleId: string) => void;

  unassignOrderFromVehicle: (orderId: string) => void;

  reassignOrderToVehicle: (orderId: string, newVehicleId: string) => void;

  autoAssignOrderToVehicle: (orderIds: string) => void;

  getOrdersForVehicle: (vehicleId: string) => Order[];
  getBestRoute: (vehicleId: string) => ScoredRoute | null;
  getOptimizedOrderSequence: (VehicleId: string | undefined) => Order[];

  // Route Report
  generateRouteDecision: (VehicleId: string) => Promise<void>;

  // Route Report Explaination
  generateRouteExplanation: (vehicleId: string) => Promise<void>;
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
      routes: ScoredRoute[];
    }
  >,
  locationCache: {},
  isLoadingRoute: false,
  routeError: null,
  // Related to Report Generator
  // routeDecisionReport: null,
  isGeneratingReport: false,
  reportError: null,
  // Related to Explanation Engine (v1)
  routeExplanation: null,
  isGeneratingExplanation: false,
  explanationError: null,
  // Related to Decision Engine (v1)
  routeDecision: null,

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
        vehicles: state.vehicles.filter((v) => v.db_id !== vehicleId),

        // clear selection safely
        selectedVehicle:
          state.selectedVehicle?.db_id === vehicleId
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
      // Create vehicle without any vehicle linked - assignment functions are only responsible for linking vehicles
      const requestedVehicleId = order.vehicle_id;

      const dbOrder = await createOrder(
        {
          ...order,
          vehicle_id: null,
        },
        user.id,
      );

      const mappedOrder = mapOrderFromDB(dbOrder);

      set((state) => ({
        orders: [
          ...state.orders,
          {
            ...mappedOrder,
            // db_id: dbOrder.id,
          },
        ],
      }));

      if (mappedOrder.vehicle_id) {
        // invalidate route for vehicle that order is added to
        get().invalidateVehicleRoute(mappedOrder.vehicle_id);
      }

      // Assign order to vehicle
      if (requestedVehicleId) {
        // Assign order to vehicle with it's corresponding vehicle linked
        get().assignOrderToVehicle(mappedOrder.db_id!, requestedVehicleId);
      } else {
        // Else - auto assign it to any available vehicle
        get().autoAssignOrderToVehicle(mappedOrder.db_id!);
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
      const order = get().orders.find((o) => o.db_id === orderId);

      await deleteOrder(orderId);

      set((state) => ({
        orders: state.orders.filter((v) => v.db_id !== orderId),
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

  // TODO: use reassignOrderToVehicle in this method
  updateOrder: async (order: Order) => {
    try {
      const prevOrder = get().orders.find((o) => o.db_id === order.db_id);

      // Update order in Supabase using order.service
      // TODO: must check if vehicle changed first - if so have to use reassignOrderToVehicle, else can use updateOrderInDB -> this is because non-assignment updates -> safe to update directly - such as priority, weight and location, but for vehicle - must use engine for this
      if (!order.db_id) {
        throw new Error("Order missing db_id");
      }
      const updated = await updateOrderInDB(order);

      set((state) => ({
        orders: state.orders.map((o) => (o.id === updated.id ? updated : o)),

        // clear selected order safely
        selectedOrder:
          state.selectedOrder?.id === updated.id
            ? updated
            : state.selectedOrder,
      }));

      // Verify if vehicle or Location has changed
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
      const vehicle = state.vehicles.find((v) => v.db_id === vehicleId);
      if (!vehicle) throw new Error("Vehicle not found");

      // Build coordiantes (vehicle + all orders)
      const coordinates = [
        vehicle.startLocation,
        ...orders.map((o) => o.location),
      ];

      // Debugging
      // console.log("Sending coordinates:", coordinates);

      // Fetch routes from API
      const routeData = await getRoute(coordinates);
      // Fetch score of routes from scoring engine
      const scoringMode = orders.length === 1 ? "absolute" : "relative";

      const scored = await getRouteScore(
        routeData.routes,
        vehicle,
        orders,
        scoringMode,
      );

      if (!scored || (Array.isArray(scored) && scored.length === 0)) {
        throw new Error("Scoring returned empty result");
      }

      // Cache the routes by vehicle ID
      set((state) => ({
        routeCache: {
          ...state.routeCache,
          [vehicleId]: {
            orderHash,
            routes: Array.isArray(scored) ? scored : [scored],
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

  // Assigment methods
  assignOrderToVehicle: async (orderId: string, vehicleId: string) => {
    // update order.vehicle_id
    // persist in supabase
    // update local state
    // invalidate old + new vehilce routes
    // trigger recompute hook

    try {
      const state = get();

      // Get order
      const order = state.orders.find((o) => o.db_id === orderId);
      if (!order) throw new Error("Order not found");

      // Get old vehicle (assigned to order) - used to invalidate old route
      const prevVehicled = order.vehicle_id;

      // Update DB -> assigning new vehicle to order
      const updated = await updateOrderInDB({
        ...order,
        vehicle_id: vehicleId,
      });

      // Update local state
      set((state) => ({
        orders: state.orders.map((o) => (o.id === updated.id ? updated : o)),
      }));

      // Invalidate affected routes
      get().invalidateOrderRoutes(prevVehicled, vehicleId);

      // Recompute route for new vehicle
      const newVehicleOrders = get().getOptimizedOrderSequence(vehicleId);
      const vehicle = state.vehicles.find((v) => v.db_id === vehicleId);

      if (vehicle) {
        const orderHash = newVehicleOrders.map((o) => o.id).join("|");

        await get().fetchAndCacheRoute(vehicleId, newVehicleOrders, orderHash);
      }

      toast.success("Order assigned to vehicle");
    } catch (err) {
      console.log("assignOrderToVehicle error:", JSON.stringify(err, null, 2));
      console.log("raw error:", err);

      if (err instanceof Error) {
        console.log(err.message);
      }

      toast.error("Failed to assign order");
    }
  },

  unassignOrderFromVehicle: async (orderId) => {
    // set order.vehicle_id to null
    // update database
    // invalidate previous vehilce route
    // recompute if need

    try {
      const state = get();

      const order = state.orders.find((o) => o.db_id === orderId);
      if (!order) throw new Error("Order not found");

      const prevVehicleId = order.vehicle_id;

      if (!prevVehicleId) return;

      // Update Order in DB
      const updated = await updateOrderInDB({
        ...order,
        vehicle_id: null,
      });

      // Update state
      set((state) => ({
        orders: state.orders.map((o) => (o.id === updated.id ? updated : o)),
      }));

      // Invalidate old vehicle route
      get().invalidateVehicleRoute(prevVehicleId);

      // Recompute old vehicle route
      const oldOrders = get().getOptimizedOrderSequence(prevVehicleId);
      const vehicle = state.vehicles.find((v) => v.id === prevVehicleId);

      if (vehicle) {
        const orderHash = oldOrders.map((o) => o.id).join("|");

        await get().fetchAndCacheRoute(prevVehicleId, oldOrders, orderHash);
      }

      toast.success("Order unassigned");
    } catch (err) {
      console.error(err);
      toast.error("Failed to unassign order");
    }
  },

  reassignOrderToVehicle: (orderId, newVehicleId) => {
    // read previous vehicle
    // assign new vehicle
    // invalidate both vehicles
    // trigger recompute for both
    get().assignOrderToVehicle(orderId, newVehicleId);
  },

  // auto assigns one order to a vehicle
  autoAssignOrderToVehicle: (orderId) => {
    // todo:
    // - batch update supabase
    // - update state in one pass
    // - invalidate vehicle once
    // - compute one route for whole batch

    // currently - just choose vehicle with the least number of orders
    try {
      const state = get();

      const vehicles = state.vehicles;

      if (vehicles.length === 0) {
        throw new Error("No vehicles available");
      }

      // pick least loaded vehicle
      const sorted = [...vehicles].sort(
        (a, b) =>
          get().getOrdersForVehicle(a.db_id!).length -
          get().getOrdersForVehicle(b.db_id!).length,
      );

      const targetVehicle = sorted[0];

      if (!targetVehicle.db_id) {
        throw new Error("Vehicle missing db_id");
      }

      get().assignOrderToVehicle(orderId, targetVehicle.db_id);
    } catch (err) {
      console.error(err);
      toast.error("Failed to auto-assign order");
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

  // replaced by getOptimizedOrderSequence
  getOrdersForVehicle: (vehicleId: string) => {
    // assumes vehicle.db_id not vehicle.id
    return get().orders.filter((o) => o.vehicle_id === vehicleId);
  },

  // Best Route Helper
  getBestRoute: (vehicleId: string) => {
    const state = get();
    const cache = state.routeCache[vehicleId];

    if (!cache || !cache.routes.length) return null;

    return cache.routes[0];
  },

  // Distance Helper
  getOptimizedOrderSequence: (vehicleId) => {
    const state = get();

    const vehicle = state.vehicles.find((v) => v.db_id === vehicleId);

    if (!vehicle) return [];

    const orders = state.orders.filter((o) => o.vehicle_id === vehicleId);

    if (orders.length <= 1) return orders;

    const remaining = [...orders];
    const ordered: Order[] = [];

    let currentLocation = vehicle.startLocation;

    while (remaining.length > 0) {
      let closestIndex = 0;
      let minDistance = Infinity;

      for (let i = 0; i < remaining.length; i++) {
        const distance = euclideanDistance(
          currentLocation,
          remaining[i].location,
        );

        if (distance && distance < minDistance) {
          minDistance = distance;
          closestIndex = i;
        }
      }

      const nextOrder = remaining.splice(closestIndex, 1)[0];
      ordered.push(nextOrder);
      currentLocation = nextOrder.location;
    }

    return ordered;
  },

  generateRouteDecision: async (vehicleId) => {
    try {
      set({
        isGeneratingReport: true,
        reportError: null,
      });

      const state = get();

      const cached = state.routeCache[vehicleId];
      if (!cached) {
        throw new Error("No cached route found");
      }

      const vehicle = state.vehicles.find((v) => v.db_id === vehicleId);

      if (!vehicle) {
        throw new Error("Vehicle not found");
      }

      const orders = state.orders.filter((o) => o.vehicle_id === vehicleId);

      const scoringMode = orders.length === 1 ? "absolute" : "relative";

      // Debugging
      console.log("REPORT PAYLOAD (Decision Engine) ", {
        routes: cached.routes,
        vehicle,
        orders,
        scoringMode,
      });

      const decision = await getRouteDecision(
        cached.routes,
        vehicle,
        orders,
        scoringMode,
      );

      set({
        routeDecision: decision,
        isGeneratingReport: false,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to generate route decision";

      set({
        reportError: message,
        isGeneratingReport: false,
      });
    }
  },

  generateRouteExplanation: async (vehicleId) => {
    try {
      set({
        isGeneratingExplanation: true,
        explanationError: null,
      });

      const state = get();

      const cached = state.routeCache[vehicleId];
      if (!cached) {
        throw new Error("No cached route found");
      }

      const vehicle = state.vehicles.find((v) => v.db_id === vehicleId);

      if (!vehicle) {
        throw new Error("Vehicle not found");
      }

      const orders = state.orders.filter((o) => o.vehicle_id === vehicleId);

      const scoringMode = orders.length === 1 ? "absolute" : "relative";

      // Debugging
      // console.log("REPORT PAYLOAD", {
      //   routes: cached.routes,
      //   vehicle,
      //   orders,
      //   scoringMode,
      // });

      const explanation = await getRouteExplanation(
        cached.routes,
        vehicle,
        orders,
        scoringMode,
      );

      set({
        routeExplanation: explanation,
        isGeneratingExplanation: false,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to generate explanation";

      set({
        explanationError: message,
        isGeneratingExplanation: false,
      });
    }
  },
}));
