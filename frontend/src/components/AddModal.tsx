"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

interface AddModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "vehicle" | "order" | null;
  onSubmit: React.Dispatch<React.SetStateAction<Array<{
    id: string;
    type: "order" | "vehicle";
    coordinates: [number, number];
  }>>>;
}

const generateId = (type: string): string => {
  const timestamp = Date.now();
  if (type === "vehicle") {
    const prefixes = ["TRUCK", "VAN"];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    return `${prefix}-${Math.floor(Math.random() * 1000)}`;
  } else {
    return `ORD-${timestamp.toString().slice(-6)}`;
  }
};

export const AddModal: React.FC<AddModalProps> = ({ open, onOpenChange, type, onSubmit }) => {
  const [formData, setFormData] = useState({
    id: "",
    type: "",
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    if (open && type) {
      const newId = generateId(type);
      setFormData({
        id: newId,
        type: type === "vehicle" ? "Vehicle" : "Order",
        latitude: "",
        longitude: "",
      });
    }
  }, [open, type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!type) return;

    const lat = parseFloat(formData.latitude);
    const lng = parseFloat(formData.longitude);

    if (isNaN(lat) || isNaN(lng)) {
      alert("Invalid coordinates");
      return;
    }

    onSubmit((prev) => [
      ...prev,
      {
        id: formData.id,
        type: type,
        coordinates: [lng, lat], // IMPORTANT: [lng, lat]
      },
    ]);

    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 z-40" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 rounded-lg">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-lg font-semibold text-zinc-900 dark:text-white">
              Add {type === "vehicle" ? "Vehicle" : "Order"}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 dark:ring-offset-zinc-950 dark:text-zinc-400">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ID Field - Read Only */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                ID
              </label>
              <input
                type="text"
                value={formData.id}
                readOnly
                className="w-full px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-600 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white cursor-not-allowed opacity-75"
              />
            </div>

            {/* Type Field - Read Only */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Type
              </label>
              <input
                type="text"
                value={formData.type}
                readOnly
                className="w-full px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-600 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white cursor-not-allowed opacity-75"
              />
            </div>

            {/* Latitude Field - Editable */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Latitude
              </label>
              <input
                type="number"
                step="0.000001"
                placeholder="e.g., 40.7128"
                value={formData.latitude}
                onChange={(e) =>
                  setFormData({ ...formData, latitude: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
              />
            </div>

            {/* Longitude Field - Editable */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Longitude
              </label>
              <input
                type="number"
                step="0.000001"
                placeholder="e.g., -74.0060"
                value={formData.longitude}
                onChange={(e) =>
                  setFormData({ ...formData, longitude: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Add {type === "vehicle" ? "Vehicle" : "Order"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AddModal;

