import { EnumFilterOperator } from "@/shared/enums/EnumFilterOperator";

export type TQueryParams<T> = {
    sort?: TSort<T>[];
    filters?: TFilter<T>[];
    pageSize?: number;
    startAfterValues?: (string | number | boolean | Date | null | undefined)[]; 
}

export type TSort<T> = {
    field: keyof T & string;
    direction: 'asc' | 'desc';
};

export type TFilter<T> = {
    field: keyof T & string;
    operator: EnumFilterOperator;
    value: T[keyof T & string] | T[keyof T & string][];
};