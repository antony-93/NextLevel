import type { TQueryParams } from "@/shared/types/QueryParamsTypes";
import type { TPaginatedResult } from "../types/PaginatedResultType";

export interface IRepositoryProvider<T> {
    get(queryParams: TQueryParams<T>): Promise<TPaginatedResult<T>>;

    getById(id: string): Promise<T | null>;
    
    getCount(queryParams: TQueryParams<T>): Promise<number>;
    
    create(data: Omit<T, 'id'>): Promise<T>;
    
    update(id: string, data: Partial<T>): Promise<Partial<T>>;
    
    updateMany(updates: Array<{id: string, data: Omit<Partial<T>, 'id'>}>): Promise<Partial<T>[]>;
    
    delete(id: string): Promise<void>;
    
    deleteMany(ids: string[]): Promise<void>;
}