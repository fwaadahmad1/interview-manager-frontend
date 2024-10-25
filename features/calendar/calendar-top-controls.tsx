'use client';
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
      <Button variant="outline" onClick={today}>
        Today
      </Button>

      <div>
        <Button
          variant="ghost"
          className="aspect-square w-8 rounded-full p-0"
          onClick={previousView}
        >
          <ChevronLeft />
        </Button>
        <Button
          variant="ghost"
          className="aspect-square w-8 rounded-full p-0"
          onClick={nextView}
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
    </>
  );
}
