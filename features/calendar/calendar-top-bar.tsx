"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { formatDate, formatDateRange } from "@/lib/dateTimeUtils";
import { useCalendarStore } from "@/stores/useCalendarStore";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CalendarViewSelect from "./calendar-view-select";

export default function CalendarTopBar() {
  const { selectedDate } = useCalendarStore();

  return (
    <header className="flex flex-row items-center justify-between w-full">
      <div className="flex flex-row items-center gap-2">
        <SidebarTrigger className="-ml-1" />

        <Separator orientation="vertical" className="mr-2 h-4" />
        <Button variant="outline">Today</Button>

        <div>
          <Button
            variant="ghost"
            className="aspect-square w-8 rounded-full p-0"
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="ghost"
            className="aspect-square w-8 rounded-full p-0"
          >
            <ChevronRight />
          </Button>
        </div>

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-lg">
                {selectedDate instanceof Date
                  ? formatDate(selectedDate, "DD MMMM yyyy")
                  : formatDateRange(selectedDate)}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <CalendarViewSelect />
    </header>
  );
}
