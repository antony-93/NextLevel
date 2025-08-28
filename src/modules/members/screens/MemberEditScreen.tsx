
import { useNavigate, useParams } from "react-router-dom";
import { useMember, useUpdateMember } from "../hooks/UseMemberApi";
import MemberForm from "../components/form/MemberForm";
import { IconCloseButton } from "@/shared/components/button";
import { useCallback } from "react";
import { FormContainer } from "@/shared/components/Container";
import type { TSaveMemberDto } from "../domain/dto/SaveMemberDto";
import type { TMemberFormData } from "../types/MemberFormDataTypes";

export default function MemberEditScreen() {
    const navigate = useNavigate();

    const { id } = useParams();

    const {
        updateMember,
        isUpdatingMember
    } = useUpdateMember(id!);

    const onSubmit = useCallback(async (data: TMemberFormData) => {
        const dto: TSaveMemberDto = {
            name: data.name,
            birthDate: data.birthDate,
            cpf: data.cpf,
            plan: data.plan,
            address: data.address,
            city: data.city,
            neighborhood: data.neighborhood
        };
        
        await updateMember(dto);
        
        navigate("/members/list");
    }, [updateMember, navigate]);

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
                    isSaving={isUpdatingMember}
                    member={member}
                />
            )}
        </FormContainer>
    );
}