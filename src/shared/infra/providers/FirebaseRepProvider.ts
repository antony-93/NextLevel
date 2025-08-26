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
    Timestamp
} from "firebase/firestore";


export default class FirebaseRepProvider<T> implements IRepositoryProvider<T> {
    private userId: string | undefined;

    constructor(
        private collectionName: string,
        filterByUserId: boolean = true
    ) {
        if (filterByUserId) this.userId = getAuth().currentUser?.uid;
    }

    protected getCollection() {
        return collection(db, this.collectionName);
    }

    protected getQuery(filters?: TFilter<T>[], sort?: TSort<T>[]) {
        let dataQuery = this.userId ? query(this.getCollection(), where('userId', '==', this.userId)) : this.getCollection();

        if (!sort?.length && !filters?.length) return dataQuery;

        if (filters?.length) {
            filters.forEach(filter => {
                dataQuery = query(
                    dataQuery,
                    where(
                        filter.field === 'id' ? documentId() : filter.field,
                        filter.operator as WhereFilterOp,
                        filter.value
                    )
                );
            });
        }

        if (sort?.length) {
            sort.forEach(s => {
                dataQuery = query(
                    dataQuery,
                    orderBy(
                        s.field === 'id' ? documentId() : s.field,
                        s.direction
                    )
                );
            });
        }

        return dataQuery;
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

    async get(queryParams: TQueryParams<T>): Promise<T[]> {
        try {
            const {
                filters,
                sort
            } = queryParams;

            const querySnapshot = await getDocs(this.getQuery(filters, sort));

            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));


            return data.map(this.formatDocumentData) as T[];
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