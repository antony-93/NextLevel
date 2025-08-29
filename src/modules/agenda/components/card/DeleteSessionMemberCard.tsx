import { Card, CardContent } from "@/shared/components/card";
import type SessionParticipants from "../../domain/entities/SessionMember";
import { IconButton } from "@/shared/components/button";
import { Loader2, Trash2 } from "lucide-react";
import { useCallback } from "react";
import { cn } from "@/shared/utils/utils";

type DeleteSessionMemberCardProps = {
    sessionMember: SessionParticipants
    isDeleting: boolean
    className?: string
    onClickDelete: (id: string) => void
}

export default function DeleteSessionMemberCard({ sessionMember, isDeleting, onClickDelete, ...props }: DeleteSessionMemberCardProps) {
    const handleDelete = useCallback(() => {
        onClickDelete(sessionMember.id!);
    }, [onClickDelete, sessionMember.id]);

    return (
        <Card {...props}>
            <CardContent className="flex flex-row items-center justify-between">
                {isDeleting && <Loader2 size={16} className="animate-spin" />}

                <p 
                    className={cn("text-sm font-medium", isDeleting && "opacity-50")}
                >
                    {sessionMember.name}
                </p>

                <IconButton 
                    icon={<Trash2 size={16} />} 
                    disabled={isDeleting}
                    onClick={handleDelete} 
                />
            </CardContent>
        </Card>
    )
}