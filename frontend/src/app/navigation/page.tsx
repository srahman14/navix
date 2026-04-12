import MapComponent from "@/components/map";
import NavigationSidebar from "@/components/navigation-sidebar";
import React from "react";

const page = () => {
  return (
    <main className="flex flex-col flex-1 items-center justify-center bg-zinc-50 dark:bg-black font-mono">
      <div className="h-screen w-full flex flex-col md:flex-row">
        {/* Left Navigation Sidebar */}
        <NavigationSidebar />

        {/* Right Map Area */}
        <div className="flex-1 bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center">
          <p className="text-zinc-500 dark:text-zinc-400"></p>
          <MapComponent />
        </div>
      </div>
    </main>
  );
};

export default page;
