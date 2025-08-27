import { useQueryCount, useQueryInfinite } from "@/shared/hooks/UseQuery";
import type { TQueryParams } from "@/shared/types/QueryParamsTypes";
import { useQueryParams } from "@/shared/hooks/UseQueryParams";
import { useMemo } from "react";
import ParticipantRepository from "../repository/ParticipantRepository";
import { useMutation } from "@/shared/hooks/UseMutation";
import type SessionParticipants from "../domain/entities/SessionParticipants";
import { EnumFilterOperator } from "@/shared/enums/EnumFilterOperator";

export function useInfiniteParticipants(params?: TQueryParams<SessionParticipants>) {
    const {
        filters,
        setFilters,
        sort,
        setSort,
        pageSize,
        setPageSize,
    } = useQueryParams<SessionParticipants>(params, {
        pageSize: 5,
        sort: [{
            field: 'name',
            direction: 'asc'
        }]
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
        repository: new ParticipantRepository(),
        queryKey: 'sessionParticipants',
        queryParams: {
            filters,
            sort,
            pageSize
        }
    });

    const participants = useMemo(() => {
        if (!data || !('pages' in data)) return [];
        return data.pages.flatMap(page => page.data);
    }, [data]);

    return {
        participants,
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

export function useParticipantMutations() {
    const { 
        createMutation, 
        updateMutation,
        updateManyMutation,
        deleteMutation,
        deleteManyMutation
    } = useMutation({
        repository: new ParticipantRepository(),
        queryKey: 'sessionParticipants'
    });

    return {
        createParticipant: createMutation.mutateAsync,
        createParticipantLoading: createMutation.isPending,
        updateParticipant: updateMutation.mutateAsync,
        updateParticipantLoading: updateMutation.isPending,
        updateManyParticipants: updateManyMutation.mutateAsync,
        updateManyParticipantsLoading: updateManyMutation.isPending,
        deleteParticipant: deleteMutation.mutateAsync,
        deleteParticipantLoading: deleteMutation.isPending,
        deleteManyParticipants: deleteManyMutation.mutateAsync,
        deleteManyParticipantsLoading: deleteManyMutation.isPending
    };
}

export function useCountParticipants(queryParams: TQueryParams<SessionParticipants>) {
    const {
        filters
    } = useQueryParams<SessionParticipants>(queryParams);

    const {
        data,
        isLoading,
        isError,
        error
    } = useQueryCount({
        repository: new ParticipantRepository(),
        queryKey: 'sessionParticipants',
        queryParams: {
            filters: filters
        }
    });

    return {
        count: data,
        isLoading,
        isError,
        error
    };
}