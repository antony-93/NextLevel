import { useState } from "react";
import type { TFilter, TQueryParams, TSort } from "../types/QueryParamsTypes";

export function useQueryParams<T>(params?: TQueryParams<T>, defaultParams?: TQueryParams<T>) {
    const [
        filters, 
        setFilters
    ] = useState<TFilter<T>[]>(params?.filters || defaultParams?.filters || []);

    const [
        sort, 
        setSort
    ] = useState<TSort<T>[]>(params?.sort || defaultParams?.sort || []);

    const [
        pageSize, 
        setPageSize
    ] = useState<number>(params?.pageSize || defaultParams?.pageSize || 50);

    return {
        filters,
        setFilters,
        sort,
        setSort,
        pageSize,
        setPageSize
    }
}