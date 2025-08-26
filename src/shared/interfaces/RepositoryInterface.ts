import type { TQueryParams } from "@/shared/types/QueryParamsTypes";
import type { TServiceResult } from "../types/TServiceResult";

export interface IRepository<T> {
    get(queryParams: TQueryParams<T>): Promise<TServiceResult<T[]>>;

    getById(id: string): Promise<TServiceResult<T | null>>;
    
    getCount(queryParams: TQueryParams<T>): Promise<TServiceResult<number>>;
    
    create(data: Omit<T, 'id'>): Promise<TServiceResult<T>>;
    
    update(id: string, data: Partial<T>): Promise<TServiceResult<Partial<T>>>;
    
    updateMany(updates: Array<{ id: string, data: Partial<T> }>): Promise<TServiceResult<Partial<T>[]>>;
    
    delete(id: string): Promise<TServiceResult<void>>;
    
    deleteMany(ids: string[]): Promise<TServiceResult<void>>;
}