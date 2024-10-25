import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import CalendarTopControls from "./calendar-top-controls";
import CalendarViewSelect from "./calendar-view-select";

export default function CalendarTopBar() {
  return (
    <header className="flex w-full flex-row items-center justify-between">
      <div className="flex flex-row items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <CalendarTopControls />
      </div>

      <CalendarViewSelect />
    </header>
  );
}
