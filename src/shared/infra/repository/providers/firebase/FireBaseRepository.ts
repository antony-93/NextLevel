import type { IRepository } from "@/shared/interfaces/RepositoryInterface";
import type { TQueryParams } from "@/shared/types/QueryParamsTypes";
import { ErrorFactory } from "@/shared/utils/errors/ErrorFactory";
import type { TPaginatedResult } from "@/shared/types/PaginatedResultType";
import FirebaseProvider from "./FirebaseProvider";
import type { TServiceResult } from "@/shared/types/ServiceResult";
import { AppError } from "@/shared/utils/errors/Error";
import { ErrorCodes } from "@/shared/types/ErrorTypes";

export default class FirebaseRepository<T> implements IRepository<T> {
    protected _provider: FirebaseProvider<T>;

    constructor(collectionName: string, filterByUserId: boolean = true) {
        this._provider = new FirebaseProvider<T>(collectionName, filterByUserId);
    }

    async list(queryParams: TQueryParams<T>): Promise<TServiceResult<TPaginatedResult<T>>> {
        try {
            const dataResult = await this._provider.getDocs(queryParams);

            const result: TServiceResult<TPaginatedResult<T>> = {
                success: true,
                data: dataResult
            };

            return result;
        } catch (error) {
            const formattedError = ErrorFactory.create(error);

            return {
                success: false,
                error: formattedError
            };
        }
    }

    async findById(id: string): Promise<TServiceResult<T | null>>{
        try {
            const dataResult = await this._provider.getDocById(id);

            if (!dataResult || Object.keys(dataResult).length === 0) {
                return {
                    success: false,
                    error: new AppError("Nenhum dado encontrado", ErrorCodes.NOT_FOUND_DATA)
                };
            }

            const result: TServiceResult<T | null> = {
                success: true,
                data: {
                    ...dataResult,
                    id
                } as T
            };

            return result;
        } catch (error) {
            const formattedError = ErrorFactory.create(error);

            return {
                success: false,
                error: formattedError
            };
        }
    }

    async countRecords(queryParams: TQueryParams<T>): Promise<TServiceResult<number>> {
        try {
            const dataResult = await this._provider.getCountDocs(queryParams);

            const result: TServiceResult<number> = {
                success: true,
                data: dataResult
            };

            return result;
        } catch (error) {
            const formattedError = ErrorFactory.create(error);

            return {
                success: false,
                error: formattedError
            };
        }
    }

    async create(data: Omit<T, 'id'>): Promise<T> {
        try {
            return await this._provider.createDoc(data);
        } catch (error) {
            throw ErrorFactory.create(error);
        }
    }

    async update(id: string, data: Partial<T>): Promise<Partial<T>> {
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