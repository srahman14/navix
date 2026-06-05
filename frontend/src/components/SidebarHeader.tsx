"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Columns2, User } from "lucide-react";
import { Button } from "./ui/button";
import { ModeToggle } from "./theme-toggler";
import { StatsGrid } from "./StatsGrid";
import Link from "next/link";
import { useUser } from "../../hooks/useUser";

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
  const { user, loading } = useUser();

  return (
    <>
      {/* Header - Open State */}
      {isOpen && (
        <div className="flex justify-between items-start p-4 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
          <motion.div
            animate={{ opacity: isOpen ? 1 : 0 }}
            transition={{ duration: 0.2, delay: isOpen ? 0.1 : 0 }}
          >
            <Link
              href={"/"}
              className="text-2xl font-bold text-zinc-900 dark:text-white cursor-pointer hover:text-zinc-700 hover:dark:text-zinc-200 tracking-tighter"
            >
              navix
            </Link>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              route optimization
            </p>

            {user && !loading && (
              <div className="inline-flex justify-baseline items-baseline space-x-3 ">
                <p className="mt-8 text-xs cursor-default font-semibold text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors tracking-tight">
                  Logged in: {user?.email}
                </p>
              </div> 
            )}
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
            <Columns2 className="h-[1.2rem] w-[1.2rem] transition-all cursor-pointer" />
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
