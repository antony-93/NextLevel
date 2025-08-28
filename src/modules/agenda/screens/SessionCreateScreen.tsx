import { useNavigate } from "react-router-dom";
import { useSessionMutations } from "../hooks/UseSessionApi";
import type Session from "../domain/entities/Session";
import SessionForm from "../components/form/SessionForm";
import { IconCloseButton } from "@/shared/components/button";
import { FormContainer } from "@/shared/components/Container";
import { toastSuccess } from "@/shared/components/Toast";

export default function SessionCreateScreen() {
    const {
        createSession,
        createSessionLoading
    } = useSessionMutations();

    const navigate = useNavigate();

    const onSubmit = async (session: Session) => {
        await createSession({ data: session, refetch: true });

        toastSuccess("Sucesso!", "Aula criada com sucesso!");
        // navigate(`/sessions/details/${session.id}`);
    }

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
                    isSaving={createSessionLoading}
                />
            </div>
        </FormContainer>
    );
}