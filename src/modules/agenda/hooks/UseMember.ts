import { useQueryInfinite } from "@/shared/hooks/UseQuery";
import type { TQueryParams } from "@/shared/types/QueryParamsTypes";
import type Member from "../domain/entities/Member";
import MemberRepository from "../repository/MemberRepository";
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