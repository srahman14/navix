import { ModeToggle } from "@/components/theme-toggler";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col flex-1 items-center justify-center bg-zinc-50 dark:bg-black font-mono">
      <div className="max-w-3xl container items-center justify-center">
        <div>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">navix</h1>
            <ModeToggle />
          </div>
          <h2>advanced route optimization</h2>
          <p>
            navix is a personal project to replicate real world application of
            software specifically in the vehicle routing problem.
          </p>
          <p>this project simulates a mini logisitics optimization engine </p>
        </div>
        <div className="flex mt-4 space-x-2 items-center">
          <Button className="cursor-pointer" variant={"default"}>
            <Link href={"/navigation"}>
              <span className="flex items-center justify-content-center space-x-2">
                <p>use now</p>
                <MoveRight />
              </span>
            </Link>
          </Button>
          <Button className="cursor-pointer" variant={"default"}>
            <Link href={"https://github.com/srahman14/navix"}>
              <span className="flex items-center justify-content-center space-x-2">
                <Image
                  className="bg-black rounded-2xl"
                  src={"/Github_Invertocat_White.svg"}
                  width={20}
                  height={20}
                  alt="github logo"
                />
                <p>github</p>
              </span>
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
