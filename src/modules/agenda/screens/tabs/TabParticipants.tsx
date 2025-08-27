import { cn } from "@/shared/utils/utils";
import MembersCombobox from "../../components/combobox/MembersCombobox";

type TabParticipantsProps = {
    className?: string;
}

export default function TabParticipants({ className }: TabParticipantsProps) {
    return (
        <div className={cn("flex flex-col justify-between py-4", className)}>
            <MembersCombobox label="Alunos" />
        </div>
    )
}