import { SelectItem } from "@/shared/components/ui/select";
import { EnumPlanType } from "../../domain/enums/EnumPlanType";
import Select from "@/shared/components/select";

type PlanTypeComboboxProps = React.ComponentProps<typeof Select> & {
    error?: string;
}

export default function PlanTypeCombobox({ ...props }: PlanTypeComboboxProps) {
    return (
        <Select
            {...props}
        >
            <SelectItem value={EnumPlanType.MENSAL}>Mensal</SelectItem>
            <SelectItem value={EnumPlanType.TRIMESTRAL}>Trimestral</SelectItem>
            <SelectItem value={EnumPlanType.ANUAL}>Anual</SelectItem>
        </Select>
    )
}