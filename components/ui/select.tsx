import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";
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

export interface ISelect {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  placeholder?: string;
  searchable?: boolean;
}

export default function Select({
  options,
  value,
  onChange,
  open,
  setOpen,
  placeholder,
  searchable = false,
}: ISelect) {
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="flex justify-between overflow-hidden text-ellipsis"
        >
          <span className="overflow-hidden text-ellipsis">
            {value
              ? options.find((opt) => opt.value === value)?.label
              : placeholder
                ? placeholder
                : "Select..."}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          {searchable && (
            <>
              <CommandInput placeholder={`Search ${placeholder}...`} />
              <CommandEmpty>No {placeholder} found.</CommandEmpty>
            </>
          )}
          <CommandList>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt.value}
                  value={opt.label}
                  onSelect={() => {
                    onChange(opt.value === value ? "" : opt.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === opt.value ? "opacity-100" : "opacity-0",
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
