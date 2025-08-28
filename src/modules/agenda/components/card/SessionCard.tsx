import { Card, CardContent } from "@/shared/components/card";
import { Clock, Edit, Eye, Users } from "lucide-react";
import { Badge } from "@/shared/components/badge";
import { IconButton } from "@/shared/components/button";
import { useCallback } from "react";
import type Session from "../../domain/entities/Session";

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
                            <Badge variant="success">
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

                    <div className="flex flex-row gap-1 items-center">
                        <Clock size={24} className="opacity-60" />
                        <p className="text-sm flex-1 text-ellipsis overflow-hidden whitespace-nowrap">
                            {session.sessionHour}
                        </p>
                    </div>

                    <div className="flex flex-row gap-1 items-center">
                        <Users size={24} className="opacity-60" />

                        <p className="text-sm mr-2">
                            {session.sessionMembers.length || 0} / {session.maxParticipants}
                        </p>

                        {session.allowJoinAfterStart && (
                            <Badge variant="outline">
                                Permitir agendamento tardio
                            </Badge>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}