import type { TQueryParams } from "@/shared/types/QueryParamsTypes";
import type { TPaginatedResult } from "../types/PaginatedResultType";
export interface IRepository<Entity> {
    list(queryParams: TQueryParams<Entity>): Promise<TPaginatedResult<Entity>>;

    findById(id: string): Promise<Entity | null>;
    
    countRecords(queryParams: TQueryParams<Entity>): Promise<number>;
    
    create(data: Entity): Promise<Entity>;
    
    update(id: string, data: Partial<Entity>): Promise<Partial<Entity>>;
    
    delete(id: string): Promise<void>;
}