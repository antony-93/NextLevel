export type TPaginatedResult<T> = {
    data: T[];
    hasMore: boolean;
    nextPageCursorValues?: (string | number | boolean | Date | null | undefined)[];
}