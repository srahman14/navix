"use client";

import { ModeToggle } from "@/components/theme-toggler";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col flex-1 items-center justify-center bg-zinc-50 dark:bg-black font-mono">
      <div className="max-w-3xl container items-center justify-center">
        <div>
          <header className="flex items-center justify-center">
              <img src={'/logo_4.png'} className="w-100 bg-black dark:bg-none rounded-2xl"/> 
          </header>
        </div>
        <div className="flex justify-center mt-4 space-x-2 items-center">
            <ModeToggle />

          <Button className="cursor-pointer" variant={"outline"}>
            <Link href={"https://github.com/srahman14/navix"}>
              <span className="flex items-center justify-content-center space-x-2">
                <Image
                  className="bg-black border-none rounded-2xl"
                  src={'/icons/light/GitHub_Invertocat_White.svg'}
                  width={20}
                  height={20}
                  alt="github logo"
                />
                <p>github</p>
              </span>
            </Link>
          </Button>
          <Button className="cursor-pointer" variant={"outline"}>
            <Link href={"/navigation"}>
              <span className="flex items-center justify-content-center space-x-2">
                <p>use now</p>
                <MoveRight />
              </span>
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
