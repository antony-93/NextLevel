import { useId } from "react"

import { Checkbox as CheckboxPrimitive } from "@/shared/components/ui/checkbox"
import { Label } from "@/shared/components/ui/label"
import { cn } from "../utils/utils"

type CheckboxProps = React.ComponentProps<typeof CheckboxPrimitive> & {
  label: string
  className?: string
}

export default function Checkbox({ label, className, ...props }: CheckboxProps) {
  const id = useId()
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <CheckboxPrimitive id={id} {...props} />

      <Label htmlFor={id}>{label}</Label>
    </div>
  )
}
