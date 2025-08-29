import { useQueryInfinite } from "@/shared/hooks/UseQuery";
import type { TQueryParams } from "@/shared/types/QueryParamsTypes";
import type Member from "../domain/entities/Member";
import MemberRepository from "../repository/MemberRepository";
import { useQueryParams } from "@/shared/hooks/UseQueryParams";

const _repository = new MemberRepository();

export function useInfiniteMembers(params?: TQueryParams<Member>) {
    const {
        filters,
        sort,
        pageSize,
        ...restQueryParams
    } = useQueryParams<Member>(params, {
        sort: [{
            field: 'name',
            direction: 'asc'
        }]
    });

    const {
        data,
        ...restQuery
    } = useQueryInfinite({
        repository: _repository,
        queryKey: 'members',
        queryParams: {
            filters,
            sort,
            pageSize
        }
    });

    return {
        members: data,
        ...restQuery,
        filters,
        sort,
        pageSize,
        ...restQueryParams
    };
}