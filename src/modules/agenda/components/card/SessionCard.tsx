import { Card, CardContent } from "@/shared/components/card";
import { Clock, Edit, Eye, Users } from "lucide-react";
import { Badge } from "@/shared/components/badge";
import { IconButton } from "@/shared/components/button";
import { useCallback } from "react";
import type Session from "../../domain/entities/Session";
import { cn } from "@/shared/utils/utils";
import { EnumStatusSession } from "../../domain/enums/EnumStatusSession";

type SessionCardProps = {
    session: Session;
    onClickEdit: (session: Session) => void;
    onClickMembers: (session: Session) => void;
}

export default function SessionCard({ session, onClickEdit, onClickMembers }: SessionCardProps) {
    const handleEdit = useCallback(() => {
        onClickEdit(session);
    }, [session, onClickEdit]);

    const handleMembers = useCallback(() => {
        onClickMembers(session);
    }, [session, onClickMembers]);

    return (
        <Card>
            <CardContent>
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col">
                        <div className="flex flex-row justify-between items-center">
                            <p className="text-xl font-semibold text-ellipsis overflow-hidden whitespace-nowrap">
                                {session.description}
                            </p>

                            <div className="flex flex-row">
                                <IconButton
                                    icon={<Eye size={16} />}
                                    onClick={handleMembers}
                                />

                                <IconButton
                                    icon={<Edit size={16} />}
                                    onClick={handleEdit}
                                />
                            </div>
                        </div>

                        <div className="flex flex-row items-center gap-2">
                            <Badge className={cn(
                                session.status === EnumStatusSession.COMPLETED ? "bg-green-500" : "bg-yellow-500"
                            )}>
                                <p className="text-sm">
                                    {session.status}
                                </p>
                            </Badge>

                            <Badge variant="outline">
                                <p className="text-sm">
                                    {session.sessionType}
                                </p>
                            </Badge>
                        </div>
                    </div>

                    {
                        session.allowJoinAfterStart && (
                            <Badge variant="outline">
                                <p className="text-sm">
                                    Permite inscrição tardia
                                </p>
                            </Badge>
                        )
                    }


                    <div className="flex flex-row gap-1 items-center">
                        <Clock size={24} className="opacity-60" />

                        <p className="text-sm flex-1 text-ellipsis overflow-hidden whitespace-nowrap">
                            {session.sessionHour}
                        </p>
                    </div>

                    <div className="flex flex-row gap-1 items-center">
                        <Users size={24} className="opacity-60" />

                        <p className="text-sm mr-2">
                            {session.quantSessionMembers} / {session.maxParticipants}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}