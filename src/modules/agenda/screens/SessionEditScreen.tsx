
import { useNavigate, useParams } from "react-router-dom";
import { useSessionQueryId, useUpdateSession } from "../hooks/UseSessionApi";
import SessionForm from "../components/form/SessionForm";
import { IconCloseButton } from "@/shared/components/button";
import { useCallback } from "react";
import { FormContainer } from "@/shared/components/Container";  
import type { TSessionFormData } from "../types/SessionFormDataTypes";
import type { TUpdateSessionDto } from "../domain/dto/UpdateSessionDto";

export default function SessionEditScreen() {
    const navigate = useNavigate();

    const {
        id
    } = useParams();

    const {
        updateSession,
        isUpdatingSession
    } = useUpdateSession(id!);

    const {
        session,
        isLoading
    } = useSessionQueryId(id!);

    const onSubmit = useCallback(async (sessionData: TSessionFormData) => {
        const dto: TUpdateSessionDto = {
            description: sessionData.description,
            sessionType: sessionData.sessionType,
            status: session!.status,
            sessionDate: sessionData.sessionDate,
            sessionHour: sessionData.sessionHour,
            maxParticipants: sessionData.maxParticipants,
            allowJoinAfterStart: sessionData.allowJoinAfterStart
        };

        await updateSession(dto);

        navigate("/sessions/agenda");
    }, [session]);

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
                    isSaving={isUpdatingSession}
                    session={session}
                />
            )}
        </FormContainer>
    );
}