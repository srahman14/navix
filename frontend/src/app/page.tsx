"use client";

import { ModeToggle } from "@/components/theme-toggler";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, LogOut, MoveRight, User } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "../../hooks/useUser";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const { user, loading } = useUser();

  return (
    <main className="relative flex flex-col flex-1 items-center justify-center bg-zinc-50 dark:bg-black font-mono overflow-hidden">
      {/* GRID BACKGROUND */}
      <div className="absolute inset-0 opacity-[0.2] dark:opacity-[0.2] pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      <div className="flex flex-col max-w-3xl container items-center justify-center">
        <div>
          <header className="flex items-center justify-center">
            <img
              src={"/logo_4.png"}
              className="w-100 bg-black dark:bg-none rounded-2xl"
            />
          </header>
        </div>
        <div className="flex justify-center mt-4 space-x-2 items-center">
          {user && !loading && (
            <Button onClick={() => supabase.auth.signOut()} variant={"outline"} className="cursor-pointer">
            <LogOut />
          </Button>
          )}

          <ModeToggle />

          <Button className="cursor-pointer" variant={"outline"}>
            <Link href={"https://github.com/srahman14/navix"}>
              <span className="flex items-center justify-content-center space-x-2">
                <Image
                  className="bg-black border-none rounded-2xl"
                  src={"/icons/light/GitHub_Invertocat_White.svg"}
                  width={20}
                  height={20}
                  alt="github logo"
                />
                <p className="font-mono text-xl tracking-wide font-black">github</p>
              </span>
            </Link>
          </Button>
          {user && !loading && (
          <Button className="cursor-pointer" variant={"outline"}>
            <Link href={"/navigation"}>
              <span className="flex items-center justify-content-center space-x-2">
                <p className="font-mono text-xl tracking-wide font-black">use now</p>
                <ArrowUpRight />
              </span>
            </Link>
          </Button>
          )}

          
        </div>
              {user && !loading ?   (
              <div className="inline-flex justify-baseline items-baseline space-x-3 ">
                <p className="mt-8 text-xs cursor-default font-semibold text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors tracking-tight">
                  Logged in: {user?.email}
                </p>
              </div>
            ) : (
              <Link
                href={"/auth/login"}
                className="inline-flex text-xs mt-8 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
              >
                please log in to access the dashboard
                <span className="ml-1 items-center space-x-1">
                  <ArrowUpRight size={16} />
                </span>
              </Link>
            )}
      </div>
    </main>
  );
}
