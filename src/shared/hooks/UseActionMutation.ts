import { useMutation as useRQMutation, useQueryClient } from "@tanstack/react-query";
import type { TActionMutation } from "../types/MutationTypes";
import { toastError, toastSuccess, toastWarning } from "../components/Toast";
import { BusinessError } from "../utils/errors/Error";

export default function useActionMutation<Result, DTO>(config: TActionMutation<Result, DTO>) {
    const queryClient = useQueryClient();

    const handleCache = () => {
        const action = config.refetch ? "refetchQueries" : "invalidateQueries";

        queryClient[action]({ queryKey: [config.queryKey] });
        queryClient[action]({ queryKey: [config.queryKey, "count"] });
    };

    return useRQMutation({
        mutationFn: config.mutationFn,

        onSuccess: (data: Result, variables: DTO) => {
            handleCache();

            if (config.successMessage) {
                toastSuccess(config.successTitle || "Sucesso!", config.successMessage);
            }

            config.onSuccessMutation?.(data, variables);
        },

        onError: (error) => {
            if (error instanceof BusinessError) {
                toastWarning("Atenção!", error.message);
            } else {
                toastError("Erro", error.message);
            }
        }
    });
}