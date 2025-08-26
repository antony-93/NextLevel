import { useNavigate } from "react-router-dom";
import { useMemberMutations } from "../hooks/UseMember";
import Member from "../domain/entities/Member";
import MemberForm from "../components/form/MemberForm";
import { Button } from "@/shared/components/ui/button";
import { X } from "lucide-react";


export default function MemberCreateScreen() {
    const {
        createMember,
        createMemberLoading
    } = useMemberMutations();

    const navigate = useNavigate();

    const onSubmit = async (member: Member) => {
        await createMember({ data: member, refetch: true });
        navigate("/members");
    }

    return (
        <div className="min-h-screen p-4">
            <div className="flex flex-row justify-between items-center mb-8">
                <p className="text-3xl font-bold">
                    Novo aluno
                </p>

                <Button
                    variant="outline"
                    className="aspect-square"
                    onClick={() => navigate("/members")}
                >
                    <X className="opacity-60" size={16} aria-hidden="true" />
                </Button>
            </div>

            <MemberForm
                onSubmit={onSubmit}
                onClickCancel={() => navigate("/members")}
                isSaving={createMemberLoading}
            />
        </div>
    );
}