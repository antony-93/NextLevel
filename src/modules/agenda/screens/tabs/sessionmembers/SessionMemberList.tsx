import { useSessionContext } from "@/modules/agenda/context/UseEditSessionContext";
import { useDeleteSessionMember, useInfiniteSessionsMembersQuery } from "../../../hooks/UseSessionMember";
import DeleteSessionMemberCard from "@/modules/agenda/components/card/DeleteSessionMemberCard";
import { useUpdateSessionMembersQuantity } from "@/modules/agenda/hooks/UseSessionApi";
import { useCallback } from "react";

export default function SessionMemberList() {
    const {
        session
    } = useSessionContext();
    
    const {
        sessionMembers
    } = useInfiniteSessionsMembersQuery();

    const {
        deleteSessionMember,
        isDeletingSessionMember
    } = useDeleteSessionMember();

    const {
        updateSessionMembersQuantity
    } = useUpdateSessionMembersQuantity(session.id!);

    const handleDelete = useCallback(async (id: string) => {
        await deleteSessionMember(id);
        await updateSessionMembersQuantity({ 
            sessionMembersQuant: session.quantSessionMembers - 1 
        });
    }, [session.quantSessionMembers]);

    return (
        <div className="flex flex-col gap-4">
            {sessionMembers?.map((sessionMember) => (
                <DeleteSessionMemberCard
                    key={sessionMember.id}
                    sessionMember={sessionMember}
                    isDeleting={isDeletingSessionMember}
                    onClickDelete={handleDelete}
                />
            ))}
        </div>
    )
}