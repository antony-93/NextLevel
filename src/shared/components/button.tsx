import { Button as UIButton } from "@/shared/components/ui/button"
import { Loader2, Plus, Save, X } from "lucide-react";
import { cn } from "../utils/utils";
import { useMemo } from "react";
import { useIsMobile } from "../hooks/use-mobile";

type ButtonProps = React.ComponentProps<typeof UIButton> & {
  icon?: React.ReactNode;
  controlSize?: boolean,
  isLoading?: boolean;
}

export function Button({
  children,
  icon,
  className,
  size,
  type = 'button',
  isLoading = false,
  controlSize = false,
  ...props
}: ButtonProps) {
  const isMobile = useIsMobile();
  
  const buttonClassName = useMemo(() => {
    if (controlSize) return isMobile ? 'w-full' : 'w-fit'
  }, [controlSize, isMobile])

  const buttonSize = useMemo(() => {
    if (size) return size
    if (controlSize) return isMobile ? 'lg' : 'sm'
    return 'lg'
  }, [controlSize, isMobile, size])

  return (
    <UIButton
      {...props}
      type={type}
      size={buttonSize}
      className={cn(buttonClassName, className)}
    >
      {
        isLoading && <Loader2 className="animate-spin text-current" size={16} />
      }
      {
        !isLoading && icon
      }
      {children}
    </UIButton>
  )
}

type CustomButtonProps = Omit<ButtonProps, 'children'>

export function AddButton({ ...props }: CustomButtonProps) {
  return (
    <Button
      icon={<Plus size={16} />}
      controlSize
      {...props}
    >
      Adicionar
    </Button>
  )
}

export function CancelButton({ ...props }: CustomButtonProps) {
  return (
    <Button
      icon={<X size={16} />}
      variant="outline"
      controlSize
      {...props}
    >
      Cancelar
    </Button>
  )
}

export function SaveButton({ ...props }: CustomButtonProps) {
  return (
    <Button
      icon={<Save size={16} />}
      controlSize
      {...props}
    >
      Salvar
    </Button>
  )
}

export function NewButton({ ...props }: CustomButtonProps) {
  return (
    <Button
      size="sm"
      icon={<Plus size={16} />}
      {...props}
    >
      Novo
    </Button>
  )
}


export function IconButton({ icon, ...props }: CustomButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      icon={icon}
      {...props}
    >
    </Button>
  )
}

export function IconCloseButton({ ...props }: CustomButtonProps) {
  return (
    <Button
      variant="outline" icon={<X size={16} />} size="sm" {...props} >
    </Button>
  )
}
