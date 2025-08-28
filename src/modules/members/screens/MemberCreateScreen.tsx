import { useNavigate } from "react-router-dom";
import { useMemberMutations } from "../hooks/UseMemberApi";
import Member from "../domain/entities/Member";
import MemberForm from "../components/form/MemberForm";
import { IconCloseButton } from "@/shared/components/button";
import { FormContainer } from "@/shared/components/Container";


export default function MemberCreateScreen() {
    const {
        createMember,
        createMemberLoading
    } = useMemberMutations();

    const navigate = useNavigate();

    const onSubmit = async (member: Member) => {
        await createMember({ data: member, refetch: true });
        navigate("/members/list");
    }

    return (
        <FormContainer>
            <div className="flex flex-row justify-between items-center mb-8">
                <p className="text-3xl font-bold">
                    Novo aluno
                </p>

                <IconCloseButton
                    onClick={() => navigate("/members/list")}
                />
            </div>

            <MemberForm
                onSubmit={onSubmit}
                onClickCancel={() => navigate("/members")}
                isSaving={createMemberLoading}
            />
        </FormContainer>
    );
}