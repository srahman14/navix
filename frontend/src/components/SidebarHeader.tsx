"use client";

import React from "react";
import { motion } from "framer-motion";
import { Columns2 } from "lucide-react";
import { Button } from "./ui/button";
import { ModeToggle } from "./theme-toggler";
import { StatsGrid } from "./StatsGrid";

interface SidebarHeaderProps {
  isOpen: boolean;
  onToggleSidebar: () => void;
  onSearchChange?: (value: string) => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  isOpen,
  onToggleSidebar,
  onSearchChange,
}) => {
  return (
    <>
      {/* Header - Open State */}
      {isOpen && (
        <div className="flex justify-between items-start p-4 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
          <motion.div
            animate={{ opacity: isOpen ? 1 : 0 }}
            transition={{ duration: 0.2, delay: isOpen ? 0.1 : 0 }}
          >
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
              Navix
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Route Optimization
            </p>
          </motion.div>

          <div className="flex items-center justify-center space-x-2 shrink-0">
            <motion.div
              animate={{ opacity: isOpen ? 1 : 0 }}
              transition={{ duration: 0.2, delay: isOpen ? 0.1 : 0 }}
            >
              <ModeToggle />
            </motion.div>

            {/* Toggle Sidebar at Top */}
            <Button variant="outline" size="icon" onClick={onToggleSidebar}>
              <Columns2 className="h-[1.2rem] w-[1.2rem] transition-all" />
            </Button>
          </div>
        </div>
      )}

      {/* Header - Closed State */}
      {!isOpen && (
        <div className="flex items-center justify-center p-4 shrink-0">
          <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
            <Columns2 className="h-[1.2rem] w-[1.2rem] transition-all" />
          </Button>
        </div>
      )}

      {/* Search and Stats Section - Only visible when open */}
      {isOpen && (
        <>
          {/* Search Bar */}
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
            <input
              type="text"
              placeholder="Search orders..."
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
            />
          </div>

          {/* Stats Grid */}
          <StatsGrid />
        </>
      )}
    </>
  );
};
