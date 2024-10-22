import { getDaysMatrix, getMonthIndexForDate } from "@/lib/dateTimeUtils";
import Day from "./Day";
import { Fragment } from "react";
import { cn } from "@/lib/utils";

export interface IMonth {
  month_index?: number;
  className?: React.ComponentProps<"div">["className"];
}

export default function Month({
  month_index = getMonthIndexForDate(),
  className,
}: IMonth) {
  const daysMatrix = getDaysMatrix(month_index);
  return (
    <div className={cn("h-full grid grid-cols-7 grid-rows-5", className)}>
      {daysMatrix.map((week, idx) => (
        <Fragment key={idx}>
          {week.map((day, idx) => (
            <Day key={idx} value={day} />
          ))}
        </Fragment>
      ))}
    </div>
  );
}
