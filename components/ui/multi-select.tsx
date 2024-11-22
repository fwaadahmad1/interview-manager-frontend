import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Button } from "./button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import React from "react";

export interface IMultiSelect {
  options: { label: string; value: string }[];
  defaultSelectedOptions?: { label: string; value: string }[];
  value: string[];
  onChange: (value: string[]) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  placeholder?: string;
  searchable?: boolean;
  asyncSearchCallback?: (input: string) => void;
  loading?: boolean;
  className?: React.HTMLAttributes<HTMLButtonElement>["className"];
}

export default function MultiSelect({
  options,
  defaultSelectedOptions = [],
  value,
  onChange,
  open,
  setOpen,
  placeholder,
  searchable = false,
  asyncSearchCallback,
  loading = false,
  className,
}: IMultiSelect) {
  const [selectedOptions, setSelectedOptions] = React.useState<
    { label: string; value: string }[]
  >(defaultSelectedOptions);

  const Selected = () => {
    return (
      <div className="flex flex-wrap gap-2">
        {value.map((v) => (
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
                  onChange(value.filter((val) => val !== v));
                }}
              />
            </span>
          </>
        ))}
      </div>
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "z-10 flex h-auto w-full justify-between overflow-hidden text-ellipsis",
            className,
          )}
        >
          <span className="overflow-hidden text-ellipsis">
            {value && value.length > 0
              ? Selected()
              : placeholder
                ? placeholder
                : "Select..."}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          {searchable && (
            <>
              <CommandInput
                placeholder={`Search ${placeholder}...`}
                onValueChange={(e) => {
                  asyncSearchCallback?.(e);
                }}
              />
              <CommandEmpty>
                {loading ? "Loading..." : `No ${placeholder} found.`}
              </CommandEmpty>
            </>
          )}
          <CommandList>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt.value}
                  value={opt.value}
                  keywords={[opt.label]}
                  onSelect={(currentValue) => {
                    const newValue = value?.includes(currentValue)
                      ? value.filter((v) => v !== currentValue)
                      : [...(value ?? []), currentValue];
                    setOpen(false);
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
