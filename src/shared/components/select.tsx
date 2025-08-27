import { useId } from "react"

import { Label } from "@/shared/components/ui/label"
import {
  Select as UISelect,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import { Input } from "./ui/input";
import { Loader2 } from "lucide-react";
import { cn } from "../utils/utils";

type SelectProps = React.ComponentProps<typeof UISelect> & {
  label: string;
  error?: string;
  placeholder?: string;
  onSearch?: (value: string) => void;
  searchPlaceholder?: string;
  isLoadingList?: boolean;
  className?: string;
  isLoadingNextPage?: boolean;
}

export default function Select({ 
  label, 
  required, 
  children, 
  placeholder = 'Selecionar', 
  error, 
  onSearch,
  searchPlaceholder = "Pesquisar",
  isLoadingList = false,
  isLoadingNextPage = false,
  className,
  ...props 
}: SelectProps) {
  const id = useId()
  return (
    <div className={cn("*:not-first:mt-2", className)}>
      {label && <Label htmlFor={id}>{label}{required && <span className="text-destructive">*</span>}</Label>}

      <UISelect  
        {...props}
        aria-invalid={!!error}
      >
        <SelectTrigger 
          id={id}
          className={error ? "border-destructive ring-destructive/20 ring-2" : ""}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        
        <SelectContent>
          {onSearch && (
            <Input 
              placeholder={searchPlaceholder} 
              onChange={(e) => onSearch(e.target.value)} 
              className="mb-2"  
              onKeyDown={(e) => {
                e.stopPropagation();
              }}
            />
          )}
          {isLoadingList ? (
            <Loader2 className="animate-spin" />
          ) : (
            children
          )}
          {isLoadingNextPage && (
            <Loader2 className="animate-spin" />
          )}
        </SelectContent>
      </UISelect>
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
