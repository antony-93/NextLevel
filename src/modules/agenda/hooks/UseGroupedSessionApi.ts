import { useInfiniteSessionsQuery } from "./UseSessionApi";
import { useMemo } from "react";
import type { TGroupedSession, TSessionGroupedSession } from "../types/GroupedSessionTypes";
import type { TQueryParams } from "@/shared/types/QueryParamsTypes";
import type Session from "../domain/entities/Session";

export function useGroupedSessionByDate(queryParams: TQueryParams<Session>) {
    const { 
        sessions, 
        filters,
        setFilters,
        isLoading, 
        isError,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
        pageSize
    } = useInfiniteSessionsQuery(queryParams);

    const groupedSessions = useMemo<TGroupedSession[]>(() => {
        const groups: TGroupedSession[] = [];

        sessions.forEach(session => {
            const sessionDateOnly = new Date(session.sessionDate);

            sessionDateOnly.setHours(0, 0, 0, 0);

            const existingGroup = groups.find(group => {
                const groupDateOnly = new Date(group.sessionDate);

                groupDateOnly.setHours(0, 0, 0, 0);

                return groupDateOnly.getTime() === sessionDateOnly.getTime();
            });

            if (existingGroup) return existingGroup.sessions.push({
                ...session,
                quantParticipants: 0
            } as TSessionGroupedSession);

            groups.push({
                sessionDate: sessionDateOnly,
                sessions: [{
                    ...session,
                    quantParticipants: 0
                } as TSessionGroupedSession]
            });
        });

        return groups;
    }, [sessions]);

    return {
        groupedSessions,
        isFetchingNextPage,
        isLoading,
        isError,
        filters,
        setFilters,
        fetchNextPage,
        hasNextPage,
        pageSize
    };
}
