import type { TFilter, TQueryParams, TSort } from "@/shared/types/QueryParamsTypes";
import type Member from "../domain/entities/Member";
import { useState } from "react";
import MemberRepository from "../repository/MemberRepository";
import { useQuery, useQueryById } from "@/shared/hooks/UseQuery";
import { useMutation } from "@/shared/hooks/UseMutation";

export function useMembers(params?: TQueryParams<Member>) {
    const [
        filters, 
        setFilters
    ] = useState<TFilter<Member>[]>(params?.filters ?? []);

    const [
        sort, 
        setSort
    ] = useState<TSort<Member>[]>(params?.sort ?? [{
        field: 'name',
        direction: 'asc'
    }]);
    
    const {
        data: members,
        isLoading,
        isError,
        error
    } = useQuery({
        repository: new MemberRepository(),
        queryKey: 'members',
        filters,
        sort
    });

    return {
        members,
        filters,
        setFilters,
        setSort,
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
    } = useQueryById({
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