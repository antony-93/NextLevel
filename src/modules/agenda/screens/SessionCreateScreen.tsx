import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { X } from "lucide-react";
import { useSessionMutations } from "../hooks/UseSession";
import type Session from "../domain/entities/Session";
import SessionForm from "../components/form/SessionForm";

export default function SessionCreateScreen() {
    const {
        createSession,
        createSessionLoading
    } = useSessionMutations();

    const navigate = useNavigate();

    const onSubmit = async (session: Session) => {
        await createSession({ data: session, refetch: true });
        navigate("/sessions");
    }

    return (
        <div className="min-h-screen p-4">
            <div className="flex flex-row justify-between items-center mb-8">
                <p className="text-3xl font-bold">
                    Nova aula
                </p>

                <Button
                    variant="outline"
                    className="aspect-square"
                    onClick={() => navigate("/sessions")}
                >
                    <X className="opacity-60" size={16} aria-hidden="true" />
                </Button>
            </div>

            <SessionForm
                onSubmit={onSubmit}
                onClickCancel={() => navigate("/sessions")}
                isSaving={createSessionLoading}
            />
        </div>
    );
}