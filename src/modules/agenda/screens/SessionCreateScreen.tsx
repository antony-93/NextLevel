import { useNavigate } from "react-router-dom";
import SessionForm from "../components/form/SessionForm";
import { IconCloseButton } from "@/shared/components/button";
import { FormContainer } from "@/shared/components/Container";
import { useCreateSession } from "../hooks/UseSessionApi";
import type { TSessionFormData } from "../types/SessionFormDataTypes";
import { EnumStatusSession } from "../domain/enums/EnumStatusSession";
import type { TCreateSessionDto } from "../domain/dto/CreateSessionDto";

export default function SessionCreateScreen() {
    const {
        createSession,
        isCreatingSession
    } = useCreateSession();

    const navigate = useNavigate();

    const onSubmit = async (session: TSessionFormData) => {
        const dto: TCreateSessionDto = {
            description: session.description,
            sessionType: session.sessionType,
            status: EnumStatusSession.PENDING,
            sessionDate: session.sessionDate,
            sessionHour: session.sessionHour,
            maxParticipants: session.maxParticipants,
            allowJoinAfterStart: session.allowJoinAfterStart,
            quantSessionMembers: 0
        };

        const createResult = await createSession(dto);

        navigate(`/sessions/details/${createResult.id}`);
    };

    return (
        <FormContainer className="h-full">
            <div className="p-4">
                <div className="flex flex-row justify-between items-center mb-8">
                    <p className="text-3xl font-bold">
                        Nova aula
                    </p>

                    <IconCloseButton
                        onClick={() => navigate("/sessions/agenda")}
                    />
                </div>

                <SessionForm
                    onSubmit={onSubmit}
                    onClickCancel={() => navigate("/sessions")}
                    isSaving={isCreatingSession}
                />
            </div>
        </FormContainer>
    );
}