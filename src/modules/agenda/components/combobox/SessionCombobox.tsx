import { SelectItem } from "@/shared/components/ui/select";
import Select from "@/shared/components/select";
import { EnumSessionType } from "../../domain/enums/EnumSessionType";

type PlanTypeComboboxProps = React.ComponentProps<typeof Select> & {
    error?: string;
}

export default function PlanTypeCombobox({ ...props }: PlanTypeComboboxProps) {
    return (
        <Select
            {...props}
        >
            <SelectItem value={EnumSessionType.CROSSFIT}>Crossfit</SelectItem>
            <SelectItem value={EnumSessionType.ZUMBA}>Zumba</SelectItem>
            <SelectItem value={EnumSessionType.YOGA}>Yoga</SelectItem>
        </Select>
    )
}