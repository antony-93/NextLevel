import type { IRepositoryProvider } from "@/shared/interfaces/RepositoryProviderInterface";
import type { TFilter, TSort, TQueryParams } from "@/shared/types/QueryParamsTypes";
import { chunkArray } from "@/shared/utils/Array";
import { ErrorFactory } from "@/shared/utils/ErrorFactory";
import { getAuth } from "firebase/auth";
import { db } from "FirebaseConfig";
import {
    collection,
    query,
    where,
    orderBy,
    documentId,
    getDocs,
    getDoc,
    getAggregateFromServer,
    addDoc,
    updateDoc,
    deleteDoc,
    writeBatch,
    type WhereFilterOp,
    doc,
    count,
    type DocumentData,
    Timestamp,
    Query,
    limit,
    DocumentSnapshot,
    startAfter
} from "firebase/firestore";
import type { TPaginatedResult } from "@/shared/types/PaginatedResultType";
import { v4 } from "uuid";
import { EnumFilterOperator } from "@/shared/enums/EnumFilterOperator";


export default class FirebaseRepProvider<T> implements IRepositoryProvider<T> {
    private userId: string | undefined;
    private cursorMap: Map<string, DocumentSnapshot> = new Map();

    constructor(
        private collectionName: string,
        filterByUserId: boolean = true
    ) {
        if (filterByUserId) this.userId = getAuth().currentUser?.uid;
    }

    protected getCollection() {
        return collection(db, this.collectionName);
    }

    protected getQuery(filters?: TFilter<T>[], sort?: TSort<T>[], startAfterValues?: (string | number | boolean | Date | null | undefined)[], pageSize?: number): Query {
        let dataQuery = this.userId ? query(this.getCollection(), where('userId', '==', this.userId)) : this.getCollection();

        dataQuery = this.applyFilters(dataQuery, filters || []);

        dataQuery = this.applySort(dataQuery, sort);

        dataQuery = this.applyStartAfter(dataQuery, startAfterValues);

        dataQuery = this.applyPagination(dataQuery, pageSize);

        return dataQuery;
    }

    protected applyFilters(dataQuery: Query, filters?: TFilter<T>[]): Query {
        return filters?.reduce((currentQuery, filter) => {
            return query(
                currentQuery,
                where(
                    filter.field === 'id' ? documentId() : filter.field,
                    filter.operator as WhereFilterOp,
                    filter.value
                )
            );
        }, dataQuery) || dataQuery;
    }

    protected applySort(dataQuery: Query, sort?: TSort<T>[]): Query {
        if (!sort || sort.length === 0) {
            return query(dataQuery, orderBy(documentId()));
        }

        return sort.reduce((currentQuery, s) => {
            return query(
                currentQuery,
                orderBy(s.field === 'id' ? documentId() : s.field, s.direction)
            );
        }, dataQuery);
    }

    protected applyPagination(dataQuery: Query, pageSize?: number): Query {
        if (!pageSize) return dataQuery;
        
        return query(dataQuery, limit(pageSize + 1));
    }

    protected applyStartAfter(dataQuery: Query, startAfterValues?: (string | number | boolean | Date | null | undefined)[]): Query {
        if (!startAfterValues || startAfterValues.length === 0) return dataQuery;
        
        return query(dataQuery, startAfter(...startAfterValues));
    }

    protected formatDocumentData<T extends DocumentData>(docData: T): T {
        const convertedData: any = { ...docData };

        for (const key in convertedData) {
            if (Object.prototype.hasOwnProperty.call(convertedData, key)) {
                const value = convertedData[key];

                if (value instanceof Timestamp) {
                    convertedData[key] = value.toDate();
                }
            }
        }

        return convertedData as T;
    }

    protected cleanData<T extends DocumentData>(data: Partial<T>): Partial<T> {
        const cleanData = Object.fromEntries(
            Object.entries(data as any).filter(([_, value]) => value !== undefined)
        );

        delete data.id;

        return cleanData as Partial<T>;
    }

    protected getSortFields(sort?: TSort<T>[], filters?: TFilter<T>[]): TSort<T>[] {
        if (sort && sort.length > 0) return sort;

        const rangeFilterField = filters?.find(f => 
            f.operator === EnumFilterOperator.GreaterThanOrEquals || 
                f.operator === EnumFilterOperator.LessThanOrEquals ||
                f.operator === EnumFilterOperator.GreaterThan ||
                f.operator === EnumFilterOperator.LessThan
        )?.field;

        if (rangeFilterField) {
            return [{ field: rangeFilterField, direction: 'asc' }];
        }

        return [{ field: 'id' as keyof T & string, direction: 'asc' }];
    }

    async get(queryParams: TQueryParams<T>): Promise<TPaginatedResult<T>> {
        try {
            const sortFields = this.getSortFields(queryParams.sort, queryParams.filters);

            const dataQuery = this.getQuery(queryParams.filters, sortFields, queryParams.startAfterValues, queryParams.pageSize);

            const querySnapshot = await getDocs(dataQuery);

            const hasMore = (queryParams.pageSize !== undefined) && (querySnapshot.docs.length > queryParams.pageSize);

            const docsForCurrentPage = hasMore ? querySnapshot.docs.slice(0, queryParams.pageSize) : querySnapshot.docs;

            let nextPageCursorValues: (string | number | boolean | Date | null | undefined)[] | undefined = undefined;
            
            if (hasMore) {
                const lastDoc = docsForCurrentPage[docsForCurrentPage.length - 1];

                nextPageCursorValues = [];
                
                for (const s of sortFields) {
                    if (s.field === 'id') {
                        nextPageCursorValues.push(lastDoc.id);
                        continue;
                    } 
                        
                    nextPageCursorValues.push(lastDoc.data()[s.field as string]);
                }

                if (!sortFields || sortFields.length === 0) {
                    nextPageCursorValues.push(lastDoc.id);
                }
            }

            const data = docsForCurrentPage.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            return {
                data: data.map(this.formatDocumentData) as T[],
                hasMore: hasMore,
                nextPageCursorValues: nextPageCursorValues
            };
        } catch (error) {
            throw ErrorFactory.create(error);
        }
    }

    async getById(id: string): Promise<T | null> {
        try {
            const docRef = doc(db, this.collectionName, id),
                docSnap = await getDoc(docRef);

            return this.formatDocumentData({
                id: docSnap.id,
                ...docSnap.data()
            }) as T;
        } catch (error) {
            throw ErrorFactory.create(error);
        }
    }

    async getCount(queryParams: TQueryParams<T>): Promise<number> {
        try {
            const querySnapshot = await getAggregateFromServer(this.getQuery(queryParams.filters, queryParams.sort), {
                count: count()
            });

            return querySnapshot.data().count || 0;
        } catch (error) {
            throw ErrorFactory.create(error);
        }
    }

    async create(data: Omit<T, 'id'>): Promise<T> {
        try {
            const cleanData = this.cleanData(data);

            const docData = {
                ...cleanData,
                createdAt: new Date()
            };

            const docRef = await addDoc(this.getCollection(), docData);

            return { id: docRef.id, ...data } as T;
        } catch (error) {
            throw ErrorFactory.create(error);
        }
    }

    async update(id: string, data: Partial<T>): Promise<Partial<T>> {
        try {
            const docRef = doc(db, this.collectionName, id);

            await updateDoc(docRef, {
                ...this.cleanData(data),
                updatedAt: new Date()
            });

            return { id, ...data } as unknown as Partial<T>;
        } catch (error) {
            throw ErrorFactory.create(error);
        }
    }

    async updateMany(data: Array<{ id: string, data: Omit<Partial<T>, 'id'> }>): Promise<Partial<T>[]> {
        try {
            const batches = chunkArray(data, 500);

            for (const batchData of batches) {
                const batch = writeBatch(db);

                batchData.forEach(item => {
                    const docRef = doc(db, this.collectionName, item.id);
                    batch.update(docRef, item.data);
                });

                await batch.commit();
            }

            return data.map(item => ({ id: item.id, ...item.data })) as unknown as Partial<T>[];
        } catch (error) {
            throw ErrorFactory.create(error);
        }
    }

    async delete(id: string): Promise<void> {
        try {
            const docRef = doc(db, this.collectionName, id);
            await deleteDoc(docRef);

        } catch (error) {
            throw ErrorFactory.create(error);
        }
    }

    async deleteMany(ids: string[]): Promise<void> {
        try {
            const batches = chunkArray(ids, 500);

            for (const batchIds of batches) {
                const batch = writeBatch(db);

                batchIds.forEach(id => {
                    const docRef = doc(db, this.collectionName, id);
                    batch.delete(docRef);
                });

                await batch.commit();
            }

        } catch (error) {
            throw ErrorFactory.create(error);
        }
    }
}