import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { CalendarSidebar } from "@/features/calendar/calendar-side-bar";
import CalendarTopBar from "@/features/calendar/calendar-top-bar";

export default async function CalendarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <CalendarSidebar />
      <SidebarInset>
        <div className="sticky top-0 flex h-16 items-center border-b bg-background px-4">
          <CalendarTopBar />
        </div>
        <div className="flex flex-1 flex-col gap-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
