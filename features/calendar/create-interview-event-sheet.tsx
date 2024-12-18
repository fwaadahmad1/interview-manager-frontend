import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { useCreateEventStore } from "@/stores/useCreateEventStore";
import { Plus } from "lucide-react";
import CreateInterviewEventPage from "./create-interview-event-page";

export default function CreateInterviewEventSheet() {
  const { open, setOpen } = useCreateEventStore();
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <SidebarMenuButton
          variant="default"
          className="h-full w-full rounded-2xl bg-primary px-4 text-primary-foreground hover:bg-primary/80 hover:text-white"
        >
          <Plus />
          <span>New Event</span>
        </SidebarMenuButton>
      </SheetTrigger>
      <SheetContent className="w-[50%] !max-w-none p-0">
        <CreateInterviewEventPage />
      </SheetContent>
    </Sheet>
  );
}
