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
  asyncSearchCallback?: (input: string) => void;
  loading?: boolean;
  className?: React.HTMLAttributes<HTMLButtonElement>["className"];
  disabled?: boolean;
}

export default function Select({
  options,
  value,
  onChange,
  open,
  setOpen,
  placeholder,
  searchable = false,
  asyncSearchCallback,
  loading = false,
  className,
  disabled,
}: ISelect) {
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "flex justify-between overflow-hidden text-ellipsis",
            className,
          )}
          disabled={disabled}
        >
          <span className="overflow-hidden text-ellipsis">
            {value
              ? options.find((opt) => opt.value === value)?.label
              : placeholder
                ? "Select " + placeholder
                : "Select..."}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
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
