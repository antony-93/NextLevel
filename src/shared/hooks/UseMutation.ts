import { useMutation as useRQMutation, useQueryClient } from "@tanstack/react-query";
import type { TMutation } from "../types/MutationTypes";
import { toastError } from "../components/Toast";
import type { AppError } from "../utils/errors/Error";

type TParamsMutation<T> = {
    data: T
    refetch?: boolean
}

export function useMutation<T>(config: TMutation<T>) {
    const queryClient = useQueryClient();

    const createMutation = useRQMutation({
        mutationFn: async (params: TParamsMutation<Omit<T, 'id'>>): Promise<T> => {
            const { data } = params;
            
            return await config.repository.create(data);
        },

        onSuccess: (_data: T, params: TParamsMutation<Omit<T, 'id'>>) => {
            const action = params.refetch ? 'refetchQueries' : 'invalidateQueries';

            queryClient[action]({ queryKey: [config.queryKey] });
            queryClient[action]({ queryKey: [config.queryKey, 'count'] });
        },

        onError: (error: AppError) => {
            toastError("Erro", error.message);
        }
    });

    const updateMutation = useRQMutation({
        mutationFn: async (params: TParamsMutation<Partial<T> & { id: string }>): Promise<Partial<T>> => {
            const { data } = params;
            return await config.repository.update(data.id, data);
        },

        onSuccess: (_data: Partial<T>, params: TParamsMutation<Partial<T> & { id: string }>) => {
            const action = params.refetch ? 'refetchQueries' : 'invalidateQueries';

            queryClient[action]({ queryKey: [config.queryKey] });
            queryClient[action]({ queryKey: [config.queryKey, 'count'] });
        },

        onError: (error: AppError) => {
            toastError("Erro", error.message);
        }
    });

    const deleteMutation = useRQMutation({
        mutationFn: async ({ data: id }: TParamsMutation<string>): Promise<string> => {
            await config.repository.delete(id);

            return id;
        },

        onSuccess: (_data: string, params: TParamsMutation<string>) => {
            const action = params.refetch ? 'refetchQueries' : 'invalidateQueries';

            queryClient[action]({ queryKey: [config.queryKey] });
            queryClient[action]({ queryKey: [config.queryKey, 'count'] });
        },

        onError: (error: AppError) => {
            toastError("Erro", error.message);
        }
    });


    return {
        createMutation,
        updateMutation,
        deleteMutation,
    }
}