
import { useNavigate, useParams } from "react-router-dom";
import { useMember, useMemberMutations } from "../hooks/UseMember";
import Member from "../domain/entities/Member";
import MemberForm from "../components/form/MemberForm";
import { Button } from "@/shared/components/button";
import { X } from "lucide-react";
import { useCallback } from "react";

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
        <div className="min-h-screen p-4">
            <div className="flex flex-row justify-between items-center mb-8">
                <p className="text-3xl font-bold">
                    Editar alunos
                </p>

                <Button
                    variant="outline"
                    className="aspect-square"
                    onClick={() => navigate("/members/list")}
                >
                    <X className="opacity-60" size={16} aria-hidden="true" />
                </Button>
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
        </div>
    );
}