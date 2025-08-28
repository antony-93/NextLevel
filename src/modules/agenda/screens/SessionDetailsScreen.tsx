import { Tabs, TabsContent, TabsList, TabTrigger } from "@/shared/components/tabs";
import { Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import TabDataSession from "./tabs/TabDataSession";
import TabParticipants from "./tabs/TabParticipants";
import { SessionContextProvider } from "../context/UseEditSessionContext";
import { useSessionQuery } from "../hooks/UseSessionApi";
import Session from "../domain/entities/Session";
import { useMemo } from "react";
import { IconCloseButton } from "@/shared/components/button";

export default function SessionDetailsScreen() {
    const navigate = useNavigate();

    const { id } = useParams();

    return (
        <div className="p-4 flex flex-col h-full">
            <div className="flex flex-row items-center mb-8 justify-between">
                <p className="text-3xl font-bold">
                    Detalhes da sessão
                </p>

                <IconCloseButton
                    onClick={() => navigate("/sessions")}
                />
            </div>

            <div className="flex flex-col gap-4 flex-1 w-full">
                <SessionDetailsLoader id={id!} />
            </div>
        </div>
    )
}

type SessionDetailsLoaderProps = {
    id: string
}

function SessionDetailsLoader({ id }: SessionDetailsLoaderProps) {
    const {
        session,
        isLoading
    } = useSessionQuery(id);
    
    if (isLoading) {
        return (
            <Loader2 />
        )
    }

    if (!session) {
        return (
            <div>Erro ao carregar a sessão</div>
        )
    }

    return (
        <Tabs className="flex-1 flex-col" defaultValue="tab-1">
            <TabsList>
                <TabTrigger label="Dados da aula" value="tab-1" />
                <TabTrigger label="Participantes" value="tab-2" />
            </TabsList>

            <SessionContextProvider session={session}>
                <TabsContent className="flex-1 flex-col flex" value="tab-1">
                    <TabDataSession className="flex-1" />
                </TabsContent>

                <TabsContent value="tab-2">
                    <TabParticipants />
                </TabsContent>
            </SessionContextProvider>
        </Tabs>
    )
}