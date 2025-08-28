import type { IRepository } from "@/shared/interfaces/RepositoryInterface";
import type { TQueryParams } from "@/shared/types/QueryParamsTypes";
import { ErrorFactory } from "@/shared/utils/errors/ErrorFactory";
import type { TPaginatedResult } from "@/shared/types/PaginatedResultType";
import FirebaseProvider from "./FirebaseProvider";
import { AppError } from "@/shared/utils/errors/Error";
import { ErrorCodes } from "@/shared/types/ErrorTypes";

export default class FirebaseRepository<Entity> implements IRepository<Entity> {
    protected _provider: FirebaseProvider<Entity>;

    constructor(collectionName: string, filterByUserId: boolean = true) {
        this._provider = new FirebaseProvider<Entity>(collectionName, filterByUserId);
    }

    async list(queryParams: TQueryParams<Entity>): Promise<TPaginatedResult<Entity>> {
        try {
            const dataResult = await this._provider.getDocs(queryParams);

            return dataResult;
        } catch (error) {
            throw ErrorFactory.create(error);
        }
    }

    async findById(id: string): Promise<Entity | null>{
        try {
            const dataResult = await this._provider.getDocById(id);

            if (!dataResult || Object.keys(dataResult).length === 0) {
                throw new AppError("Nenhum dado encontrado", ErrorCodes.NOT_FOUND_DATA);
            }

            return {
                ...dataResult,
                id
            } as Entity;
        } catch (error) {
            throw ErrorFactory.create(error);
        }
    }

    async countRecords(queryParams: TQueryParams<Entity>): Promise<number> {
        try {
            return await this._provider.getCountDocs(queryParams);
        } catch (error) {
            throw ErrorFactory.create(error);
        }
    }

    async create(data: Omit<Entity, 'id'>): Promise<Entity> {
        try {
            return await this._provider.createDoc(data);
        } catch (error) {
            throw ErrorFactory.create(error);
        }
    }

    async update(id: string, data: Partial<Entity>): Promise<Partial<Entity>> {
        try {
            return await this._provider.updateDoc(id, data);
        } catch (error) {
            throw ErrorFactory.create(error);
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await this._provider.deleteDoc(id);
        } catch (error) {
            throw ErrorFactory.create(error);
        }
    }
}