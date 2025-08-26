import { Input } from "./input"

type HourFieldProps = React.ComponentProps<typeof Input>

export default function HourField({ ...props }: HourFieldProps) {
  return (
    <Input
      {...props}
      type="time"
    />
  )
}
