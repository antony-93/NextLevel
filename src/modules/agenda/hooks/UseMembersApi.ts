import { useQueryInfinite } from "@/shared/hooks/UseQuery";
import type { TQueryParams } from "@/shared/types/QueryParamsTypes";
import type Member from "../domain/entities/Member";
import MemberRepository from "../repository/MemberRepository";
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