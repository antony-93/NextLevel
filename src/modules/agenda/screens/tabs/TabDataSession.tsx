import { Button } from "@/shared/components/button";
import { Card, CardContent } from "@/shared/components/card";
import { Calendar, Clock } from "lucide-react";
import { useSessionContext } from "../../context/UseEditSessionContext";
import { cn } from "@/shared/utils/utils";
import { EnumStatusSession } from "../../domain/enums/EnumStatusSession";
import { useSessionMutations } from "../../hooks/UseSessionApi";
import { useNavigate } from "react-router-dom";
import { toastSuccess } from "@/shared/components/Toast";

type TabDataSessionProps = {
    className?: string;
}

export default function TabDataSession({ className }: TabDataSessionProps) {
    const { session } = useSessionContext();

    const {
        updateSession,
        updateSessionLoading
    } = useSessionMutations();

    const handleFinishSession = async () => {
        await updateSession({
            data: {
                id: session.id!,
                status: EnumStatusSession.COMPLETED
            },
            refetch: true
        });

        toastSuccess("Sucesso!", "Aula finalizada com sucesso!");
    }

    return (
        <div className={cn("flex flex-col justify-between py-4", className)}>
            <div className="flex flex-col gap-2 flex-1">
                <Card
                    className={cn(
                        "bg-yellow-500 py-4",
                        session.status === EnumStatusSession.COMPLETED && "bg-green-500"
                    )}
                >
                    <CardContent
                        className="flex items-center justify-center"
                    >
                        <p className="text-lg font-medium text-white">
                            {session.status}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex flex-row gap-2">
                        <Calendar size={20} />
                        <p className="text-sm font-medium overflow-auto break-words">
                            Data: {session.sessionDate.toLocaleDateString()}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex flex-row gap-2">
                        <Clock size={20} />
                        <p className="text-sm font-medium overflow-auto break-words">
                            Horário: {session.sessionHour}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex flex-row gap-2">
                        <p className="font-medium overflow-auto break-words">
                            {session.description}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Button
                size="lg"
                className="w-full"
                onClick={handleFinishSession}
                disabled={updateSessionLoading}
                hidden={session.status === EnumStatusSession.COMPLETED}
                isLoading={updateSessionLoading}
            >
                <p className="text-base font-medium">
                    Finalizar aula
                </p>
            </Button>
        </div>
    )
}