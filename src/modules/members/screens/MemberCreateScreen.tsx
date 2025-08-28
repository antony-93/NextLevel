import { useNavigate } from "react-router-dom";
import MemberForm from "../components/form/MemberForm";
import { IconCloseButton } from "@/shared/components/button";
import { FormContainer } from "@/shared/components/Container";
import { useCreateMember } from "../hooks/UseMemberApi";
import { useCallback } from "react";
import type { TMemberFormData } from "../types/MemberFormDataTypes";


export default function MemberCreateScreen() {
    const {
        createMember,
        isCreatingMember
    } = useCreateMember();

    const navigate = useNavigate();

    const onSubmit = useCallback(async (member: TMemberFormData) => {
        await createMember(member);
        navigate("/members/list");
    }, [createMember, navigate]);

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
                isSaving={isCreatingMember}
            />
        </FormContainer>
    );
}