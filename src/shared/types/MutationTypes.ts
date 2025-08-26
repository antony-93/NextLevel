import type { IRepository } from "../interfaces/RepositoryInterface";

export type TMutation<T> = {
    repository: IRepository<T>
    queryKey: string
}