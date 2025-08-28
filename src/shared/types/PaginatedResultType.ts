import type { TStartAfterValues } from "./QueryParamsTypes";

export type TPaginatedResult<T> = {
    data: T[];
    hasMore: boolean;
    nextPageCursorValues?: TStartAfterValues;
}