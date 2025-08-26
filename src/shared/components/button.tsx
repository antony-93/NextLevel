import { Button as UIButton } from "@/shared/components/ui/button"

type ButtonProps = React.ComponentProps<typeof UIButton>

function Button({ children, ...props }: ButtonProps) {
  return <UIButton {...props} type={props.type ?? 'button'}>{children}</UIButton>
}

export { Button }
