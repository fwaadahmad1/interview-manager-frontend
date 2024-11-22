import useDebounce from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import { Command, CommandGroup, CommandItem, CommandList } from "./command";
import { Input } from "./input";
import { Popover, PopoverAnchor, PopoverContent } from "./popover";
import React from "react";

export interface ITypeAheadSelect {
  options: { label: string; value: string }[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  placeholder?: string;
  searchCallback: (input: string) => void;
  clearOptions: () => void;
}

export default function TypeAheadSelect({
  options,
  value,
  onChange,
  open,
  setOpen,
  placeholder,
  searchCallback,
  clearOptions,
}: ITypeAheadSelect) {
  const [selectedOptions, setSelectedOptions] = React.useState<
    { label: string; value: string }[]
  >([]);
  const interviewSearchCallback = React.useCallback(
    (input: string) => searchCallback(input),
    [searchCallback],
  );

  const [interviewerSearch, setInterviewerSearch] = useDebounce<string>(
    interviewSearchCallback,
  );

  const Selected = () => {
    return (
      <div className="flex flex-wrap gap-2">
        {Array.isArray(value) &&
          value.map((v) => (
            <>
              <span
                key={v}
                className="flex flex-row items-center gap-2 rounded-full border border-primary px-4 py-1"
              >
                {selectedOptions.find((opt) => opt.value === v)?.label}
                <X
                  className="h-6 w-6 rounded-full p-1 hover:bg-black/20"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedOptions((prev) =>
                      prev.filter((opt) => opt.value !== v),
                    );
                    onChange(value.filter((val) => val !== v));
                  }}
                />
              </span>
            </>
          ))}

        {!Array.isArray(value) && (
          <>
            <span className="flex flex-row items-center gap-2 rounded-full px-4 py-1">
              {selectedOptions.find((opt) => opt.value === value)?.label}
            </span>
          </>
        )}
      </div>
    );
  };

  return (
    <Popover open={open}>
      <PopoverAnchor asChild>
        <div
          aria-expanded={open}
          className="flex w-full flex-col rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        >
          <span className="overflow-hidden text-ellipsis">{Selected()}</span>
          <Input
            className="h-auto border-none p-0 shadow-none focus:border-none focus-visible:outline-none focus-visible:ring-0"
            value={interviewerSearch}
            placeholder={placeholder}
            onChange={(e) => setInterviewerSearch(e.target.value)}
          />
        </div>
      </PopoverAnchor>
      <PopoverContent className="p-0">
        <Command>
          <CommandList className="">
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt.value}
                  value={opt.value}
                  onSelect={(currentValue: string) => {
                    const newValue = Array.isArray(value)
                      ? value?.includes(currentValue)
                        ? value.filter((v) => v !== currentValue)
                        : [...(value ?? []), currentValue]
                      : currentValue;
                    setOpen(false);
                    setInterviewerSearch("");
                    setSelectedOptions((prev) => {
                      const newOption = options.find(
                        (opt) => opt.value === currentValue,
                      );
                      if (newOption) {
                        return [...prev, newOption];
                      }
                      return prev;
                    });
                    onChange(newValue);
                    clearOptions();
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value && value.includes(opt.value)
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {opt.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
