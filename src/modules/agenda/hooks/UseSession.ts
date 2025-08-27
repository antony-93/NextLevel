import { useQueryById, useQueryInfinite } from "@/shared/hooks/UseQuery";
import type { TQueryParams } from "@/shared/types/QueryParamsTypes";
import SessionRepository from "../repository/SessionRepository";
import type Session from "../domain/entities/Session";
import { useMutation } from "@/shared/hooks/UseMutation";
import { useQueryParams } from "@/shared/hooks/UseQueryParams";
import { useMemo } from "react";

export function useInfiniteSessions(params?: TQueryParams<Session>) {
    const {
        filters,
        setFilters,
        sort,
        setSort,
        pageSize,
        setPageSize,
    } = useQueryParams<Session>(params, {
        pageSize: 5
    });

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isLoading,
        isError,
        error,
        isFetchingNextPage
    } = useQueryInfinite({
        repository: new SessionRepository(),
        queryKey: 'sessions',
        queryParams: {
            filters,
            sort,
            pageSize
        }
    });

    const sessions = useMemo(() => {
        if (!data || !('pages' in data)) return [];
        return data.pages.flatMap(page => page.data);
    }, [data]);

    return {
        sessions,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        filters,
        setFilters,
        setSort,
        sort,
        pageSize,
        setPageSize,
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