import { useId } from "react"

import { Input as UIInput } from "@/shared/components/ui/input"
import { Label as UILabel } from "@/shared/components/ui/label"

type InputProps = React.ComponentProps<typeof UIInput> & {
  label?: string;
  error?: string;
}

function Input({ label, required, error, ...props }: InputProps) {
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

export { Input }