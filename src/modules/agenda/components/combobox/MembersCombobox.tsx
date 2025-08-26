import { Combobox } from "@/shared/components/combobox";
import { useMembers } from "../../hooks/UseMember";

export default function MembersCombobox() {
    const { members } = useMembers();

    return (
        <Combobox
            value={null}
            onChange={() => { }}
            valueField="id"
            labelField="name"
            emptyMessage="No members found"
            searchPlaceholder="Search members"
            items={members}
        />
    )
}