"use client";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { formatDate, formatDateRange } from "@/lib/dateTimeUtils";
import { useCalendarStore } from "@/stores/useCalendarStore";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CalendarTopControls() {
  const { selectedDate, nextView, previousView, today } = useCalendarStore();

  return (
    <>
      <Button
        variant="ghost"
        onClick={today}
        className="rounded-full border border-primary text-white hover:bg-red-500/40 hover:text-white"
      >
        Today
      </Button>

      <div className="text-white">
        <Button
          variant="ghost"
          className="aspect-square w-8 rounded-full p-0 hover:bg-red-500/40 hover:text-white"
          onClick={previousView}
        >
          <ChevronLeft />
        </Button>
        <Button
          variant="ghost"
          className="aspect-square w-8 rounded-full p-0 hover:bg-red-500/40 hover:text-white"
          onClick={nextView}
        >
          <ChevronRight />
        </Button>
      </div>

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="text-lg text-white">
              {selectedDate instanceof Date
                ? formatDate(selectedDate, "DD MMMM yyyy")
                : formatDateRange(selectedDate)}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
}
