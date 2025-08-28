import { useQuery, useQueryCount, useQueryInfinite } from "@/shared/hooks/UseQuery";
import type { TQueryParams } from "@/shared/types/QueryParamsTypes";
import { useQueryParams } from "@/shared/hooks/UseQueryParams";
import ParticipantRepository from "../repository/ParticipantRepository";
import { useMutation } from "@/shared/hooks/UseMutation";
import type SessionParticipants from "../domain/entities/SessionParticipants";

export function useInfiniteParticipantsQuery(params?: TQueryParams<SessionParticipants>) {
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

    return {
        participants: data,
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
        deleteMutation,
    } = useMutation({
        repository: new ParticipantRepository(),
        queryKey: 'sessionParticipants'
    });

    return {
        createParticipant: createMutation.mutateAsync,
        createParticipantLoading: createMutation.isPending,
        updateParticipant: updateMutation.mutateAsync,
        updateParticipantLoading: updateMutation.isPending,
        deleteParticipant: deleteMutation.mutateAsync,
        deleteParticipantLoading: deleteMutation.isPending
    };
}