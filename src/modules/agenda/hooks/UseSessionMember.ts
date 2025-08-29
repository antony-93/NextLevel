import { useQueryInfinite } from "@/shared/hooks/UseQuery";
import type { TQueryParams } from "@/shared/types/QueryParamsTypes";
import { useQueryParams } from "@/shared/hooks/UseQueryParams";
import SessionMember from "../domain/entities/SessionMember";
import SessionMemberRepository from "../repository/SessionMemberRepository";
import useActionMutation from "@/shared/hooks/UseActionMutation";
import type { TCreateSessionMemberDto } from "../domain/dto/InsertMemberSessionDto";
import type Session from "../domain/entities/Session";
import InsertMemberIntoSessionValidator from "../domain/validators/InsertMemberIntoSessionValidator";
import { BusinessError } from "@/shared/utils/errors/Error";

const _repository = new SessionMemberRepository();

export function useInfiniteSessionsMembersQuery(params?: TQueryParams<SessionMember>) {
    const {
        filters,
        sort,
        pageSize,
        ...restQueryParams
    } = useQueryParams<SessionMember>(params);

    const {
        data,
        ...restQuery
    } = useQueryInfinite({
        repository: _repository,
        queryKey: 'sessionMembers',
        queryParams: {
            filters,
            sort,
            pageSize
        }
    });

    return {
        sessionMembers: data,
        ...restQuery,
        filters,
        sort,
        pageSize,
        ...restQueryParams
    };
}

export function useCreateSessionMember(session: Session) {
    const {
        mutateAsync: createSessionMember,
        isPending: isCreatingSessionMember
    } = useActionMutation<SessionMember, TCreateSessionMemberDto>({
        mutationFn: async (dto: TCreateSessionMemberDto) => {
            const result = InsertMemberIntoSessionValidator.validate(session);

            if (!result.success && result.message) {
                throw new BusinessError("Atenção!", result.message);
            }
            
            const sessionMember = new SessionMember(dto.memberId, dto.sessionId, dto.name);

            return await _repository.create(sessionMember);
        },
        successMessage: 'Aluno adicionado com sucesso!',
        queryKey: 'sessionMembers'
    })

    return {
        createSessionMember,
        isCreatingSessionMember
    }
}

export function useDeleteSessionMember() {
    const {
        mutateAsync: deleteSessionMember,
        isPending: isDeletingSessionMember
    } = useActionMutation<void, string>({
        mutationFn: async (id: string) => {
            return await _repository.delete(id);
        },
        successMessage: 'Aluno removido com sucesso!',
        queryKey: 'sessionMembers'
    })

    return {
        deleteSessionMember,
        isDeletingSessionMember
    }
}