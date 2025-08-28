import { useId } from "react"

import { Input as UIInput } from "@/shared/components/ui/input"
import { Label as UILabel } from "@/shared/components/ui/label"
import { useDebouncedCallback } from "../hooks/UseDebounce";
import { Search } from "lucide-react";
import { cn } from "../utils/utils";

type InputProps = React.ComponentProps<typeof UIInput> & {
  label?: string;
  error?: string;
}

export function Input({ label, required, error, ...props }: InputProps) {
  const id = useId()

  return (
    <div className="*:not-first:mt-2">
      {label && <UILabel htmlFor={id}>{label}{required && <span className="text-destructive">*</span>}</UILabel>}
      <UIInput
        id={id}
        required={required}
        aria-label={label}
        aria-invalid={!!error}
        {...props}
      />
      {
        error &&
        <p
          className="text-destructive mt-2 ml-0.5 text-sm"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      }
    </div>
  )
}

type SearchInputProps = Omit<React.ComponentProps<typeof Input>, "onChange"> & {
  icon?: React.ReactNode;
  onChange?: (value: string) => void;
}

export function SearchInput({ icon, onChange, className, ...props }: SearchInputProps) {
  const handleSearch = useDebouncedCallback((value: string) => {
    onChange?.(value);
  }, 300);

  return (
    <div className={cn("relative w-full", className)}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
      <Input
        placeholder="Pesquisar"
        className="w-full pl-10 min-h-[44px]"
        {...props}
        onChange={(e) => handleSearch(e.target.value)}
        onKeyDown={(e) => {
          e.stopPropagation();
        }}
      />
    </div>
  )
}