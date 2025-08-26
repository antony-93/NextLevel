import { useQuery } from "@/shared/hooks/UseQuery";
import type { TFilter, TQueryParams, TSort } from "@/shared/types/QueryParamsTypes";
import { useState } from "react";
import type Member from "../domain/entities/Member";
import MemberRepository from "../repository/MemberRepository";

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