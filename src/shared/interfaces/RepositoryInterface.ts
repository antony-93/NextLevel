import type { TQueryParams } from "@/shared/types/QueryParamsTypes";
import type { TPaginatedResult } from "../types/PaginatedResultType";
import type { TServiceResult } from "../types/ServiceResult";

export interface IRepository<T> {
    list(queryParams: TQueryParams<T>): Promise<TServiceResult<TPaginatedResult<T>>>;

    findById(id: string): Promise<TServiceResult<T | null>>;
    
    countRecords(queryParams: TQueryParams<T>): Promise<TServiceResult<number>>;
    
    create(data: Omit<T, 'id'>): Promise<T>;
    
    update(id: string, data: Partial<T>): Promise<Partial<T>>;
    
    delete(id: string): Promise<void>;
}