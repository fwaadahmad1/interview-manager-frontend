import { cn } from "@/lib/utils";

export interface IDay {
  value: number;
  className?: string;
}

export default function Day({ value, className }: IDay) {
  return (
    <div className={cn("flex flex-col border border-gray-200", className)}>
      <header className="flex flex-col items-center">
        <p className={`my-1 p-1 text-center text-sm`}>{value}</p>
      </header>
      <div className="flex-1 cursor-pointer">
        {/* {dayEvents.map((evt, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedEvent(evt)}
            className={`bg-${evt.label}-200 mb-1 mr-3 truncate rounded p-1 text-sm text-gray-600`}
          >
            {evt.title}
          </div>
        ))} */}
      </div>
    </div>
  );
}
