
import { useNavigate, useParams } from "react-router-dom";
import { useMember, useMemberMutations } from "../hooks/UseMemberApi";
import Member from "../domain/entities/Member";
import MemberForm from "../components/form/MemberForm";
import { IconCloseButton } from "@/shared/components/button";
import { useCallback } from "react";
import { FormContainer } from "@/shared/components/Container";

export default function MemberEditScreen() {
    const navigate = useNavigate();

    const {
        id
    } = useParams();

    const {
        updateMember,
        updateMemberLoading
    } = useMemberMutations();

    const onSubmit = useCallback(async (updatedMember: Member) => {
        await updateMember({
            data: { ...updatedMember, id: id! },
            refetch: true
        });
        
        navigate("/members/list");
    }, [updateMember, navigate, id]);

    const {
        member,
        isLoading
    } = useMember(id!);

    return (
        <FormContainer>
            <div className="flex flex-row justify-between items-center mb-8">
                <p className="text-3xl font-bold">
                    Editar aluno
                </p>

                <IconCloseButton
                    onClick={() => navigate("/members/list")}
                />
            </div>

            {isLoading ? (
                <div>Carregando...</div>
            ) : (
                <MemberForm
                    onSubmit={onSubmit}
                    onClickCancel={() => navigate("/members/list")}
                    isSaving={updateMemberLoading}
                    member={member}
                />
            )}
        </FormContainer>
    );
}