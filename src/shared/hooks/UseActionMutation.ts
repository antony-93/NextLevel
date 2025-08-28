import { useMutation as useRQMutation, useQueryClient } from "@tanstack/react-query";
import type { TActionMutation } from "../types/MutationTypes";
import { toastError, toastSuccess } from "../components/Toast";
import type { AppError } from "../utils/errors/Error";

export default function useActionMutation<Result, DTO>(config: TActionMutation<Result, DTO>) {
    const queryClient = useQueryClient();

    const handleCache = (refetch?: boolean) => {
        const action = refetch ? "refetchQueries" : "invalidateQueries";

        queryClient[action]({ queryKey: [config.queryKey] });
        queryClient[action]({ queryKey: [config.queryKey, "count"] });
    };

    return useRQMutation({
        mutationFn: config.mutationFn,

        onSuccess: (data: Result, variables: DTO) => {
            handleCache(true);

            if (config.successMessage) {
                toastSuccess(config.successTitle || "Sucesso!", config.successMessage);
            }
            
            config.onSuccessMutation?.(data, variables);
        },

        onError: (error: AppError) => {
            toastError("Erro", error.message);
        }
    });
}