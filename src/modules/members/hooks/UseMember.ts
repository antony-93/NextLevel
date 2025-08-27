import type { TQueryParams } from "@/shared/types/QueryParamsTypes";
import type Member from "../domain/entities/Member";
import MemberRepository from "../repository/MemberRepository";
import { useQueryById, useQueryInfinite } from "@/shared/hooks/UseQuery";
import { useMutation } from "@/shared/hooks/UseMutation";
import { useQueryParams } from "@/shared/hooks/UseQueryParams";
import { useMemo } from "react";

export function useInfiniteMembers(params?: TQueryParams<Member>) {
    const {
        filters,
        setFilters,
        sort,
        setSort,
        pageSize,
        setPageSize,
    } = useQueryParams<Member>(params, {
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
        repository: new MemberRepository(),
        queryKey: 'members',
        queryParams: {
            filters,
            sort,
            pageSize
        }
    });

    const members = useMemo(() => {
        if (!data || !('pages' in data)) return [];
        return data.pages.flatMap(page => page.data);
    }, [data]);

    return {
        members,
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
        updateManyMutation,
        deleteMutation,
        deleteManyMutation
    } = useMutation({
        repository: new MemberRepository(),
        queryKey: 'members'
    });

    return {
        createMember: createMutation.mutateAsync,
        createMemberLoading: createMutation.isPending,
        updateMember: updateMutation.mutateAsync,
        updateMemberLoading: updateMutation.isPending,
        updateManyMembers: updateManyMutation.mutateAsync,
        updateManyMembersLoading: updateManyMutation.isPending,
        deleteMember: deleteMutation.mutateAsync,
        deleteMemberLoading: deleteMutation.isPending,
        deleteManyMembers: deleteManyMutation.mutateAsync,
        deleteManyMembersLoading: deleteManyMutation.isPending
    };
}