export type TServiceResult<T> = {
    data?: T;
    message?: string;
    success?: boolean;
    total?: number;
}