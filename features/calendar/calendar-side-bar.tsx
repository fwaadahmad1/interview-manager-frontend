"use client";
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import CalendarSidebarFilter from "./calendar-side-bar-filter";
import CreateInterviewEventSheet from "./create-interview-event-sheet";
import DatePicker from "./date-picker";

export function CalendarSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props} containerClassName="bg-neutral-800 shadow-xl">
      <SidebarHeader className="h-18">
        <SidebarMenu className="h-full">
          <SidebarMenuItem className="h-full w-full my-2">
            <CreateInterviewEventSheet />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarSeparator className="mx-0" />
        <SidebarGroup className="px-0">
          <SidebarGroupContent>
            <DatePicker />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="mx-0" />

        <SidebarGroup className="px-0">
          <SidebarGroupContent>
            <CalendarSidebarFilter />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
