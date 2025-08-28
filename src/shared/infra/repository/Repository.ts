import type { TQueryParams } from '@/shared/types/QueryParamsTypes';
import type { IRepository } from '../../interfaces/RepositoryInterface';
import type { TPaginatedResult } from '../../types/PaginatedResultType';
import type { TServiceResult } from '../../types/ServiceResult';

export default abstract class Repository<T> implements IRepository<T> {
    constructor(
        private readonly _repositoryProvider: IRepository<T>
    ) {}

    async list(queryParams: TQueryParams<T>): Promise<TServiceResult<TPaginatedResult<T>>> {
        return this._repositoryProvider.list(queryParams);
    }

    async findById(id: string): Promise<TServiceResult<T | null>> {
        return this._repositoryProvider.findById(id);
    }

    async countRecords(queryParams: TQueryParams<T>): Promise<TServiceResult<number>> {
        return this._repositoryProvider.countRecords(queryParams);
    }

    async create(data: Omit<T, 'id'>): Promise<T> {
        return this._repositoryProvider.create(data);
    }

    async update(id: string, data: Partial<T>): Promise<Partial<T>> {
        return this._repositoryProvider.update(id, data);
    }

    async delete(id: string): Promise<void> {
        return this._repositoryProvider.delete(id);
    }
}