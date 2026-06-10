import { Vehicle } from "@/types";
import { Truck, X } from "lucide-react";

interface VehicleCardProps {
  vehicle: Vehicle;
  onSelect: (vehicle: Vehicle) => void;
  onDelete: (id: string) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onSelect,
  onDelete,
}) => {
  return (
    <div
      onClick={() => onSelect(vehicle)}
      className="relative p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer border border-zinc-200 dark:border-zinc-700"
    >
      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(vehicle.id);
        }}
        className="absolute top-2 right-2 p-1 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        title="Delete vehicle"
      >
        <X size={16} />
      </button>

      {/* Vehicle Icon and ID */}
      <div className="flex items-center gap-3 mb-3 pr-6">
        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <Truck size={24} className="text-blue-600 dark:text-blue-300" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm text-zinc-900 dark:text-white">
            {vehicle.id}
          </p>
        </div>
      </div>

      {/* Status Badge */}
      <div className="mb-3">
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full ${
            vehicle.status === "active"
              ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
              : vehicle.status === "pending"
                ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"
                : "bg-zinc-300 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
          }`}
        >
          {vehicle.status}
        </span>
      </div>

      {/* Load Information */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-zinc-600 dark:text-zinc-400">Load</span>
          <span className="text-xs font-semibold text-zinc-900 dark:text-white">
            {vehicle.load.toFixed(0)} kg
          </span>
        </div>
        <div className="w-full h-2 bg-zinc-300 dark:bg-zinc-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 dark:bg-blue-600 transition-all"
            style={{ width: `${Math.min((vehicle.load / 1000) * 100, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Orders Info */}
      {/* <div className="mt-3 text-xs text-zinc-600 dark:text-zinc-400">
        <p>Orders: {vehicle.orders}</p>
        {vehicle.orderId && <p>Order: {vehicle.orderId}</p>}
      </div> */}
    </div>
  );
};