
import { useNavigate, useParams } from "react-router-dom";
import { useSession, useSessionMutations } from "../hooks/UseSession";
import Session from "../domain/entities/Session";
import SessionForm from "../components/form/SessionForm";
import { Button } from "@/shared/components/button";
import { X } from "lucide-react";
import { useCallback } from "react";
import { de } from "date-fns/locale";

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
        
        navigate("/sessions/agenda");
    }, [updateSession, navigate, id]);

    const {
        session,
        isLoading
    } = useSession(id!);

    return (
        <div className="flex-1 flex flex-col p-4">
            <div className="flex flex-row justify-between items-center mb-8">
                <p className="text-3xl font-bold">
                    Editar aula
                </p>

                <Button
                    variant="outline"
                    className="aspect-square"
                    onClick={() => navigate("/sessions/agenda")}
                >
                    <X className="opacity-60" size={16} aria-hidden="true" />
                </Button>
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
        </div>
    );
}