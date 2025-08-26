import { Tabs, TabsContent, TabsList, TabTrigger } from "@/shared/components/tabs";
import { Button } from "@/shared/components/ui/button";
import { X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import TabDataSession from "./tabs/TabDataSession";
import TabParticipants from "./tabs/TabParticipants";
import { SessionContextProvider, useSessionContext } from "../context/UseEditSessionContext";
import { useSession } from "../hooks/UseSession";

export default function SessionDetailsScreen() {
    const navigate = useNavigate();

    const { id } = useParams();

    const { 
        session 
    } = useSession(id!);

    return (
        <div className="h-screen p-4 flex flex-col">
            <div className="flex flex-row items-center mb-8 justify-between">
                <p className="text-3xl font-bold">
                    Detalhes da sessão
                </p>
                
                <Button variant="outline" size="icon" onClick={() => navigate("/sessions")}>
                    <X size={24} />
                </Button>
            </div>

            <div className="flex flex-col gap-4 flex-1 w-full">
                <Tabs defaultValue="tab-1">
                    <TabsList>
                        <TabTrigger label="Dados da aula" value="tab-1" />
                        <TabTrigger label="Participantes" value="tab-2" />
                    </TabsList>

                    <SessionContextProvider>
                        <TabsContent value="tab-1">
                            <TabDataSession />
                        </TabsContent>

                        <TabsContent value="tab-2">
                            <TabParticipants />
                        </TabsContent>
                    </SessionContextProvider>
                </Tabs>
            </div>
        </div>
    )
}