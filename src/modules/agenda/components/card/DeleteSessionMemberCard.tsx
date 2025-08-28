import { Card, CardContent } from "@/shared/components/card";
import type SessionParticipants from "../../domain/entities/SessionMember";
import { IconButton } from "@/shared/components/button";
import { Trash2 } from "lucide-react";
import { useCallback } from "react";

type DeleteSessionMemberCardProps = {
    sessionMember: SessionParticipants
    onClickDelete: (id: string) => void
}

export default function DeleteSessionMemberCard({ sessionMember, onClickDelete }: DeleteSessionMemberCardProps) {
    const handleDelete = useCallback(() => {
        onClickDelete(sessionMember.id!);
    }, [onClickDelete, sessionMember]);

    return (
        <Card>
            <CardContent className="flex flex-row items-center justify-between">
                <p className="text-sm font-medium">
                    {sessionMember.name}
                </p>

                <IconButton 
                    icon={<Trash2 size={16} />} 
                    onClick={handleDelete} 
                />
            </CardContent>
        </Card>
    )
}