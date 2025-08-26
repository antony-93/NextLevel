import { useQuery, useQueryById } from "@/shared/hooks/UseQuery";
import type { TFilter, TQueryParams } from "@/shared/types/QueryParamsTypes";
import { useState } from "react";
import SessionRepository from "../repository/SessionRepository";
import type Session from "../domain/entities/Session";
import { useMutation } from "@/shared/hooks/UseMutation";

export function useSessions(params?: TQueryParams<Session>) {
    const [
        filters, 
        setFilters
    ] = useState<TFilter<Session>[]>(params?.filters ?? []);
    
    const {
        data: sessions,
        isLoading,
        isError,
        error
    } = useQuery({
        repository: new SessionRepository(),
        queryKey: 'sessions',
        filters,
    });

    return {
        sessions,
        filters,
        setFilters,
        isLoading,
        isError,
        error
    };
}

export function useSession(id: string) {
    const {
        data: session,
        isLoading,
        isError,
        error
    } = useQueryById({
        repository: new SessionRepository(),
        queryKey: 'sessions',
        id,
    });

    return {
        session,
        isLoading,
        isError,
        error
    };
}

export function useSessionMutations() {
    const { 
        createMutation, 
        updateMutation,
        updateManyMutation,
        deleteMutation,
        deleteManyMutation
    } = useMutation({
        repository: new SessionRepository(),
        queryKey: 'sessions'
    });

    return {
        createSession: createMutation.mutateAsync,
        createSessionLoading: createMutation.isPending,
        updateSession: updateMutation.mutateAsync,
        updateSessionLoading: updateMutation.isPending,
        updateManySessions: updateManyMutation.mutateAsync,
        updateManySessionsLoading: updateManyMutation.isPending,
        deleteSession: deleteMutation.mutateAsync,
        deleteSessionLoading: deleteMutation.isPending,
        deleteManySessions: deleteManyMutation.mutateAsync,
        deleteManySessionsLoading: deleteManyMutation.isPending
    };
}