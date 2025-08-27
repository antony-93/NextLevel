import type { TQueryParams } from '@/shared/types/QueryParamsTypes';
import type { IRepositoryProvider } from '../interfaces/RepositoryProviderInterface';
import type { IRepository } from '../interfaces/RepositoryInterface';
import type { TPaginatedResult } from '../types/PaginatedResultType';

export default abstract class Repository<T> implements IRepository<T> {
    constructor(
        private readonly _repositoryProvider: IRepositoryProvider<T>
    ) {
    }

    async get(queryParams: TQueryParams<T>): Promise<TPaginatedResult<T>> {
        return this._repositoryProvider.get(queryParams);
    }

    async getById(id: string): Promise<T | null> {
        return this._repositoryProvider.getById(id);
    }

    async getCount(queryParams: TQueryParams<T>): Promise<number> {
        return this._repositoryProvider.getCount(queryParams);
    }

    async create(data: Omit<T, 'id'>): Promise<T> {
        return this._repositoryProvider.create(data);
    }

    async update(id: string, data: Partial<T>): Promise<Partial<T>> {
        return this._repositoryProvider.update(id, data);
    }

    async updateMany(data: Array<{ id: string, data: Partial<T> }>): Promise<Partial<T>[]> {
        return this._repositoryProvider.updateMany(data);
    }

    async delete(id: string): Promise<void> {
        return this._repositoryProvider.delete(id);
    }

    async deleteMany(ids: string[]): Promise<void> {
        return this._repositoryProvider.deleteMany(ids);
    }
}