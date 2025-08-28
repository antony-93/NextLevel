import type { IRepository } from "../interfaces/RepositoryInterface";

export type TMutation<T> = {
    repository: IRepository<T>
    queryKey: string
}

export type TActionMutation<Result, DTO> = {
    mutationFn: (variables: DTO) => Promise<Result>,
    queryKey: string,
    successTitle?: string,
    successMessage?: string,
    onSuccessMutation?: (data: Result, variables: DTO) => void,
    refetch?: boolean
}