"use client";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import CalendarTopControls from "./calendar-top-controls";
import CalendarViewSelect from "./calendar-view-select";
import { NavUser } from "@/components/nav-user";
import useGlobalStore from "@/stores/useGlobalStore";
import Image from "next/image";

export default function CalendarTopBar() {
  const { currentUser } = useGlobalStore();

  return (
    <header className="left-0 flex w-full flex-row items-center justify-between bg-transparent">
      <div className="flex flex-row items-center gap-2">
        <SidebarTrigger className="-ml-1 text-white hover:bg-red-500/40 hover:text-white" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Image
          src={"/rocket-logo-white.svg"}
          width={250}
          height={40}
          alt=""
          className="mr-4"
        />
        <CalendarTopControls />
      </div>
      <div className="flex flex-row items-center gap-2">
        <CalendarViewSelect className="min-w-min rounded-full border-primary bg-transparent text-white hover:bg-red-500/40 hover:text-white" />
        <NavUser
          user={{
            name: currentUser?.name || "",
            email: currentUser?.email || "",
            avatar: "",
          }}
        />
      </div>
    </header>
  );
}
