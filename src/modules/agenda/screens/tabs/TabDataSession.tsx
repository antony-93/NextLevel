import { Button } from "@/shared/components/button";
import { Card, CardContent } from "@/shared/components/card";
import { Calendar, Clock, Loader2 } from "lucide-react";
import { useSessionContext } from "../../context/UseEditSessionContext";
import { cn } from "@/shared/utils/utils";
import { EnumStatusSession } from "../../domain/enums/EnumStatusSession";
import { useSessionMutations } from "../../hooks/UseSession";

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
    }

    return (
        <div className={cn("flex flex-col justify-between py-4", className)}>
            <div className="flex flex-col mb-4 flex-1">
                <Card className="mb-2">
                    <CardContent>
                        <div className="flex flex-row gap-2">
                            <Calendar size={20} />
                            <p className="text-sm font-medium">Data: {session.sessionDate.toLocaleDateString()}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="mb-4">
                    <CardContent>
                        <div className="flex flex-row gap-2">
                            <Clock size={20} />
                            <p className="text-sm font-medium">Horário: {session.sessionHour}</p>
                        </div>
                    </CardContent>
                </Card>

                <p className="font-medium">Descrição: {session.description}</p>
            </div>

            <Button size="lg" className="w-full" onClick={handleFinishSession} disabled={updateSessionLoading}>
                {updateSessionLoading && <Loader2 />}
                <p className="text-base font-medium">Finalizar aula</p>
            </Button>
        </div>
    )
}