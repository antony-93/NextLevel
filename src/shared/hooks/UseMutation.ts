import { useMutation as useRQMutation, useQueryClient } from "@tanstack/react-query";
import type { TMutation } from "../types/MutationTypes";

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

        onError: (error: Error) => {
            console.error('err', error);
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

        onError: (error: Error) => {
            console.error(error);
        }
    });

    const updateManyMutation = useRQMutation({
        mutationFn: async (params: TParamsMutation<Array<Partial<T> & { id: string }>>): Promise<Partial<T>[]> => {
            const dataFormated = params.data.map(i => ({ id: i.id, data: i }));
            
            return await config.repository.updateMany(dataFormated);
        },

        onSuccess: (_data: Partial<T>[], params: TParamsMutation<Array<Partial<T> & { id: string }>>) => {
            const action = params.refetch ? 'refetchQueries' : 'invalidateQueries';

            queryClient[action]({ queryKey: [config.queryKey] });
            queryClient[action]({ queryKey: [config.queryKey, 'count'] });
        },

        onError: (error: Error) => {
            console.error(error);
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

        onError: (error: Error) => {
            console.error(error);
        }
    });

    const deleteManyMutation = useRQMutation({
        mutationFn: async ({ data: ids }: TParamsMutation<string[]>): Promise<string[]> => {
            await config.repository.deleteMany(ids);

            return ids;
        },

        onSuccess: (_data: string[], params: TParamsMutation<string[]>) => {
            const action = params.refetch ? 'refetchQueries' : 'invalidateQueries';

            queryClient[action]({ queryKey: [config.queryKey] });
            queryClient[action]({ queryKey: [config.queryKey, 'count'] });
        },

        onError: (error: Error) => {
            console.error(error);
        }
    });

    return {
        createMutation,
        updateMutation,
        updateManyMutation,
        deleteMutation,
        deleteManyMutation
    }
}