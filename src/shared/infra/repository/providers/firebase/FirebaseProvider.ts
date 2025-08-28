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

export default class FirebaseProvider<Entity> {
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

    getQuery(filters?: TFilter<Entity>[], sort?: TSort<Entity>[], startAfterValues?: TStartAfterValues, pageSize?: number): Query {
        let dataQuery = this.userId ? query(this.getCollection(), where('userId', '==', this.userId)) : this.getCollection();

        dataQuery = this.applyFilters(dataQuery, filters || []);

        dataQuery = this.applySort(dataQuery, sort);

        dataQuery = this.applyStartAfter(dataQuery, startAfterValues);

        dataQuery = this.applyPagination(dataQuery, pageSize);

        return dataQuery;
    }

    applyFilters(dataQuery: Query, filters?: TFilter<Entity>[]): Query {
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

    applySort(dataQuery: Query, sort?: TSort<Entity>[]): Query {
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

    formatDocumentData<Entity extends DocumentData>(docData: Entity): Entity {
        const convertedData: any = { ...docData };

        for (const key in convertedData) {
            if (Object.prototype.hasOwnProperty.call(convertedData, key)) {
                const value = convertedData[key];

                if (value instanceof Timestamp) {
                    convertedData[key] = value.toDate();
                }
            }
        }

        return convertedData as Entity;
    }

    cleanData<Entity extends DocumentData>(data: Partial<Entity>): Partial<Entity> {
        const cleanData = Object.fromEntries(
            Object.entries(data as any).filter(([_, value]) => value !== undefined)
        );

        delete data.id;

        return cleanData as Partial<Entity>;
    }

    getSortFields(sort?: TSort<Entity>[], filters?: TFilter<Entity>[]): TSort<Entity>[] {
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

        return [{ field: 'id' as keyof Entity & string, direction: 'asc' }];
    }

    async getDocs(queryParams: TQueryParams<Entity>): Promise<TPaginatedResult<Entity>> {
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
            data: data.map(this.formatDocumentData) as Entity[],
            hasMore: hasMore,
            nextPageCursorValues: nextPageCursorValues
        };
    }

    async getDocById(id: string): Promise<Entity | null> {
        const docRef = doc(db, this.collectionName, id),
            docSnap = await getDoc(docRef);

        return this.formatDocumentData({
            ...docSnap.data()
        }) as Entity;
    }

    async getCountDocs(queryParams: TQueryParams<Entity>): Promise<number> {
        const querySnapshot = await getAggregateFromServer(this.getQuery(queryParams.filters, queryParams.sort), {
            count: count()
        });

        return querySnapshot.data().count || 0;
    }

    async createDoc(data: Omit<Entity, 'id'>): Promise<Entity> {
        const cleanData = this.cleanData(data);

        const docData = {
            ...cleanData,
            createdAt: new Date()
        };

        const docRef = await addDoc(this.getCollection(), docData);

        return { id: docRef.id, ...data } as Entity;
    }

    async updateDoc(id: string, data: Partial<Entity>): Promise<Partial<Entity>> {
        const docRef = doc(db, this.collectionName, id);

        await updateDoc(docRef, {
            ...this.cleanData(data),
            updatedAt: new Date()
        });

        return { id, ...data } as unknown as Partial<Entity>;
    }

    async deleteDoc(id: string): Promise<void> {
        const docRef = doc(db, this.collectionName, id);

        await deleteDoc(docRef);
    }
}