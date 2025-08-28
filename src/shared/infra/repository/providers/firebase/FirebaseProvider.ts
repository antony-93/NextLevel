import type { TFilter, TQueryParams, TSort, TStartAfterValues } from "@/shared/types/QueryParamsTypes";
import { getAuth } from "firebase/auth";
import { db } from "FirebaseConfig";
import {
    collection,
    query,
    where,
    orderBy,
    documentId,
    type WhereFilterOp,
    type DocumentData,
    Timestamp,
    Query,
    limit,
    startAfter,
    getDocs as getDocsFirebase,
    doc,
    getDoc,
    count,
    getAggregateFromServer,
    addDoc,
    updateDoc,
    deleteDoc
} from "firebase/firestore";
import { EnumFilterOperator } from "@/shared/enums/EnumFilterOperator";
import type { TPaginatedResult } from "@/shared/types/PaginatedResultType";

export default class FirebaseProvider<T> {
    protected userId: string | undefined;

    constructor(
        protected collectionName: string,
        filterByUserId: boolean = true
    ) {
        if (filterByUserId) this.userId = getAuth().currentUser?.uid;
    }

    protected getCollection() {
        return collection(db, this.collectionName);
    }

    getQuery(filters?: TFilter<T>[], sort?: TSort<T>[], startAfterValues?: TStartAfterValues, pageSize?: number): Query {
        let dataQuery = this.userId ? query(this.getCollection(), where('userId', '==', this.userId)) : this.getCollection();

        dataQuery = this.applyFilters(dataQuery, filters || []);

        dataQuery = this.applySort(dataQuery, sort);

        dataQuery = this.applyStartAfter(dataQuery, startAfterValues);

        dataQuery = this.applyPagination(dataQuery, pageSize);

        return dataQuery;
    }

    applyFilters(dataQuery: Query, filters?: TFilter<T>[]): Query {
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

    applySort(dataQuery: Query, sort?: TSort<T>[]): Query {
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

    applyPagination(dataQuery: Query, pageSize?: number): Query {
        if (!pageSize) return dataQuery;

        return query(dataQuery, limit(pageSize + 1));
    }

    applyStartAfter(dataQuery: Query, startAfterValues?: TStartAfterValues): Query {
        if (!startAfterValues || startAfterValues.length === 0) return dataQuery;

        return query(dataQuery, startAfter(...startAfterValues));
    }

    formatDocumentData<T extends DocumentData>(docData: T): T {
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

    cleanData<T extends DocumentData>(data: Partial<T>): Partial<T> {
        const cleanData = Object.fromEntries(
            Object.entries(data as any).filter(([_, value]) => value !== undefined)
        );

        delete data.id;

        return cleanData as Partial<T>;
    }

    getSortFields(sort?: TSort<T>[], filters?: TFilter<T>[]): TSort<T>[] {
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

    async getDocs(queryParams: TQueryParams<T>): Promise<TPaginatedResult<T>> {
        const sortFields = this.getSortFields(queryParams.sort, queryParams.filters);

        const dataQuery = this.getQuery(queryParams.filters, sortFields, queryParams.startAfterValues, queryParams.pageSize);

        const querySnapshot = await getDocsFirebase(dataQuery);

        const hasMore = (queryParams.pageSize !== undefined) && (querySnapshot.docs.length > queryParams.pageSize);

        const docsForCurrentPage = hasMore ? querySnapshot.docs.slice(0, queryParams.pageSize) : querySnapshot.docs;

        let nextPageCursorValues: TStartAfterValues | undefined = undefined;

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
    }

    async getDocById(id: string): Promise<T | null> {
        const docRef = doc(db, this.collectionName, id),
            docSnap = await getDoc(docRef);

        return this.formatDocumentData({
            ...docSnap.data()
        }) as T;
    }

    async getCountDocs(queryParams: TQueryParams<T>): Promise<number> {
        const querySnapshot = await getAggregateFromServer(this.getQuery(queryParams.filters, queryParams.sort), {
            count: count()
        });

        return querySnapshot.data().count || 0;
    }

    async createDoc(data: Omit<T, 'id'>): Promise<T> {
        const cleanData = this.cleanData(data);

        const docData = {
            ...cleanData,
            createdAt: new Date()
        };

        const docRef = await addDoc(this.getCollection(), docData);

        return { id: docRef.id, ...data } as T;
    }

    async updateDoc(id: string, data: Partial<T>): Promise<Partial<T>> {
        const docRef = doc(db, this.collectionName, id);

        await updateDoc(docRef, {
            ...this.cleanData(data),
            updatedAt: new Date()
        });

        return { id, ...data } as unknown as Partial<T>;
    }

    async deleteDoc(id: string): Promise<void> {
        const docRef = doc(db, this.collectionName, id);

        await deleteDoc(docRef);
    }
}