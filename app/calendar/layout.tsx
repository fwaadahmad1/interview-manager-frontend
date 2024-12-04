"use client";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { CalendarSidebar } from "@/features/calendar/calendar-side-bar";
import CalendarTopBar from "@/features/calendar/calendar-top-bar";
import { useEffect } from "react";
import { useCalendarStore } from "@/stores/useCalendarStore";
import { TimeUnit } from "@/lib/dateTimeUtils";
import { usePathname, useRouter } from "next/navigation";

export default function CalendarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { setView } = useCalendarStore();
  const path = usePathname().split("/").filter(Boolean);
  const router = useRouter();

  useEffect(() => {
    const view = path[path.length - 1] as TimeUnit;
    setView(view || "month");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const unsubscribe = useCalendarStore.subscribe((state) => {
      router.replace(`/calendar/${state.view}`);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, [router]);

  return (
    <div className="flex flex-col">
      <SidebarProvider className="relative">
        <div className="gra fixed top-0 z-50 flex h-16 w-full items-center bg-neutral-800 px-4 shadow-md">
          <CalendarTopBar />
        </div>
        <CalendarSidebar />
        <SidebarInset>
          <div className="flex flex-1 flex-col">
            <div className="h-16"></div>
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
