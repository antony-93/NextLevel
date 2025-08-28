
import { useNavigate, useParams } from "react-router-dom";
import { useSessionQuery, useSessionMutations } from "../hooks/UseSessionApi";
import Session from "../domain/entities/Session";
import SessionForm from "../components/form/SessionForm";
import { IconCloseButton } from "@/shared/components/button";
import { useCallback } from "react";
import { FormContainer } from "@/shared/components/Container";
import { toastSuccess } from "@/shared/components/Toast";

export default function SessionEditScreen() {
    const navigate = useNavigate();

    const {
        id
    } = useParams();

    const {
        updateSession,
        updateSessionLoading
    } = useSessionMutations();

    const onSubmit = useCallback(async (updatedSession: Session) => {
        await updateSession({
            data: { ...updatedSession, id: id! },
            refetch: true
        });
        
        toastSuccess("Sucesso!", "Aula atualizada com sucesso!");

        navigate("/sessions/agenda");
    }, [updateSession, navigate, id]);

    const {
        session,
        isLoading
    } = useSessionQuery(id!);

    return (
        <FormContainer>
            <div className="flex flex-row justify-between items-center mb-8">
                <p className="text-3xl font-bold">
                    Editar aula
                </p>

                <IconCloseButton
                    onClick={() => navigate("/sessions/agenda")}
                />
            </div>

            {isLoading ? (
                <div>Carregando...</div>
            ) : (
                <SessionForm
                    onSubmit={onSubmit}
                    onClickCancel={() => navigate("/sessions/agenda")}
                    isSaving={updateSessionLoading}
                    session={session}
                />
            )}
        </FormContainer>
    );
}