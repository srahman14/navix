"use client";

import { ModeToggle } from "@/components/theme-toggler";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, MoveRight } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
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
      <div className="max-w-3xl container items-center justify-center">
        <div>
          <header className="flex items-center justify-center">
            <img
              src={"/logo_4.png"}
              className="w-100 bg-black dark:bg-none rounded-2xl"
            />
          </header>
        </div>
        <div className="flex justify-center mt-4 space-x-2 items-center">
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
          <Button className="cursor-pointer" variant={"outline"}>
            <Link href={"/navigation"}>
              <span className="flex items-center justify-content-center space-x-2">
                <p className="font-mono text-xl tracking-wide font-black">use now</p>
                <ArrowUpRight />
              </span>
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
