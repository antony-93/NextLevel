import type { TQueryParams } from "@/shared/types/QueryParamsTypes";
import type Member from "../domain/entities/Member";
import MemberRepository from "../repository/MemberRepository";
import { useQueryById, useQueryInfinite } from "@/shared/hooks/UseQuery";
import { useMutation } from "@/shared/hooks/UseMutation";
import { useQueryParams } from "@/shared/hooks/UseQueryParams";

export function useInfiniteMembers(params?: TQueryParams<Member>) {
    const {
        filters,
        setFilters,
        sort,
        setSort,
        pageSize,
        setPageSize,
    } = useQueryParams<Member>(params, {
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
        repository: new MemberRepository(),
        queryKey: 'members',
        queryParams: {
            filters,
            sort,
            pageSize
        }
    });

    return {
        members: data,
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

export function useMember(id: string) {
    const {
        data: member,
        isLoading,
        isError,
        error
    } = useQueryById<Member>({
        repository: new MemberRepository(),
        queryKey: 'members',
        id
    });

    return {
        member,
        isLoading,
        isError,
        error
    };
}

export function useMemberMutations() {
    const {
        createMutation,
        updateMutation,
        deleteMutation,
    } = useMutation({
        repository: new MemberRepository(),
        queryKey: 'members'
    });

    return {
        createMember: createMutation.mutateAsync,
        createMemberLoading: createMutation.isPending,
        updateMember: updateMutation.mutateAsync,
        updateMemberLoading: updateMutation.isPending,
        deleteMember: deleteMutation.mutateAsync,
        deleteMemberLoading: deleteMutation.isPending
    };
}