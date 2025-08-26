import { cn } from "@/shared/utils/utils";
import type { TGroupedSession, TSessionGroupedSession } from "../../types/GroupedSessionTypes";
import SessionCard from "./SessionCard";

type GroupedSessionCardProps = {
    group: TGroupedSession;
    onClickEdit: (session: TSessionGroupedSession) => void;
    onClickMembers: (session: TSessionGroupedSession) => void;
    className?: string;
}

export default function GroupedSessionCard({ group, ...props }: GroupedSessionCardProps) {
    const sessionDate = group.sessionDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });

    return (
        <div className={cn("p-4 flex flex-col gap-2", props.className)}>
            <div className="flex flex-row items-center w-full gap-2">
                <p className="font-medium">
                    {sessionDate.toUpperCase()}
                </p>

                <hr className="flex-1" />
            </div>

            {group.sessions.map(session => (
                <SessionCard 
                    key={session.id} 
                    session={session} 
                    {...props}
                />
            ))}
        </div>
    )
}