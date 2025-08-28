import { Card, CardContent } from "@/shared/components/card";
import type SessionParticipants from "../../domain/entities/SessionParticipants";
import { Button, IconButton } from "@/shared/components/button";
import { Trash2 } from "lucide-react";
import { useCallback } from "react";

type ParticipantCardProps = {
    participant: SessionParticipants
    onClickDelete: (participant: SessionParticipants) => void
}

export default function ParticipantCard({ participant, onClickDelete }: ParticipantCardProps) {
    const handleDelete = useCallback(() => {
        onClickDelete(participant);
    }, [onClickDelete, participant]);

    return (
        <Card>
            <CardContent className="flex flex-row items-center justify-between">
                <p className="text-sm font-medium">
                    {participant.name}
                </p>

                <IconButton 
                    icon={<Trash2 size={16} />} 
                    onClick={handleDelete} 
                />
            </CardContent>
        </Card>
    )
}