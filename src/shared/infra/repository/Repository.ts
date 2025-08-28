import type { TQueryParams } from '@/shared/types/QueryParamsTypes';
import type { IRepository } from '../../interfaces/RepositoryInterface';
import type { TPaginatedResult } from '../../types/PaginatedResultType';

export default abstract class Repository<Entity> implements IRepository<Entity> {
    constructor(
        private readonly _repositoryProvider: IRepository<Entity>
    ) {}

    async list(queryParams: TQueryParams<Entity>): Promise<TPaginatedResult<Entity>> {
        return this._repositoryProvider.list(queryParams);
    }

    async findById(id: string): Promise<Entity | null> {
        return this._repositoryProvider.findById(id);
    }

    async countRecords(queryParams: TQueryParams<Entity>): Promise<number> {
        return this._repositoryProvider.countRecords(queryParams);
    }

    async create(data: Entity): Promise<Entity> {
        return this._repositoryProvider.create(data);
    }

    async update(id: string, data: Partial<Entity>): Promise<Partial<Entity>> {
        return this._repositoryProvider.update(id, data);
    }

    async delete(id: string): Promise<void> {
        return this._repositoryProvider.delete(id);
    }
}