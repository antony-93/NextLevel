import { useQueryById, useQueryInfinite } from "@/shared/hooks/UseQuery";
import type { TQueryParams } from "@/shared/types/QueryParamsTypes";
import SessionRepository from "../repository/SessionRepository";
import Session from "../domain/entities/Session";
import { useQueryParams } from "@/shared/hooks/UseQueryParams";
import useActionMutation from "@/shared/hooks/UseActionMutation";
import { EnumStatusSession } from "../domain/enums/EnumStatusSession";
import type { TInsertMemberSessionDto } from "../domain/dto/InsertMemberSessionDto";
import SessionMember from "../domain/entities/SessionMember";
import InsertMemberIntoSessionValidator from "../domain/validators/InsertMemberIntoSessionValidator";
import { BusinessError } from "@/shared/utils/errors/Error";
import type { TSaveSessionDto } from "../domain/dto/SaveSessionDto";

const _repository = new SessionRepository();

export function useInfiniteSessionsQuery(params?: TQueryParams<Session>) {
    const {
        filters,
        setFilters,
        sort,
        setSort,
        pageSize,
        setPageSize,
    } = useQueryParams<Session>(params);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isLoading,
        isError,
        error,
        isFetchingNextPage
    } = useQueryInfinite({
        repository: new SessionRepository(),
        queryKey: 'sessions',
        queryParams: {
            filters,
            sort,
            pageSize
        }
    });

    return {
        sessions: data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        filters,
        setFilters,
        setSort,
        sort,
        pageSize,
        setPageSize,
        isLoading,
        isError,
        error
    };
}

export function useSessionQuery(id: string) {
    const {
        data: session,
        isLoading,
        isError,
        error
    } = useQueryById({
        repository: new SessionRepository(),
        queryKey: 'sessions',
        id,
    });

    return {
        session,
        isLoading,
        isError,
        error
    };
}

export function useCreateSession() {
    const {
        mutateAsync: createSession,
        isPending: isCreatingSession
    } = useActionMutation<Session, TSaveSessionDto>({
        mutationFn: async (dto: TSaveSessionDto) => {
            const session = new Session(
                dto.description,
                EnumStatusSession.PENDING,
                dto.sessionType,
                dto.sessionDate,
                dto.sessionHour,
                dto.maxParticipants,
                dto.allowJoinAfterStart,
            );

            return await _repository.create(session);
        },
        successMessage: 'Aula criada com sucesso!',
        queryKey: 'sessions'
    })

    return {
        createSession,
        isCreatingSession
    }
}

export function useUpdateSession(id: string) {
    const {
        mutateAsync: updateSession,
        isPending: isUpdatingSession
    } = useActionMutation<Partial<Session>, TSaveSessionDto>({
        mutationFn: async (dto: TSaveSessionDto) => {
            const session: Partial<Session> = {
                description: dto.description,
                sessionType: dto.sessionType,
                sessionDate: dto.sessionDate,
                sessionHour: dto.sessionHour,
                maxParticipants: dto.maxParticipants,
                allowJoinAfterStart: dto.allowJoinAfterStart
            };

            return await _repository.update(id, session);
        },
        successMessage: 'Aula atualizada com sucesso!',
        queryKey: 'sessions'
    })

    return {
        updateSession,
        isUpdatingSession
    }
}

export function useCompleteSession(id: string) {
    const {
        mutateAsync: completeSession,
        isPending: isCompletingSession
    } = useActionMutation<Partial<Session>, void>({
        mutationFn: async () => {
            return await _repository.completeSession(id);
        },
        successMessage: 'Sessão finalizada com sucesso!',
        queryKey: 'sessions'
    })

    return {
        completeSession,
        isCompletingSession
    }
}


export function useInsertMemberSession(session: Session) {
    const {
        mutateAsync: insertMemberSession,
        isPending: isInsertingMemberSession
    } = useActionMutation<Partial<Session>, TInsertMemberSessionDto>({
        mutationFn: async (dto: TInsertMemberSessionDto) => {
            const result = InsertMemberIntoSessionValidator.validate(session);

            debugger;

            if (!result.success) {
                throw new BusinessError("Atenção", result.message!);
            }


            const sessionResult = await _repository.updateMembers(session.id!, [
                ...session.sessionMembers,
                {
                    memberId: dto.memberId,
                    sessionId: session.id!,
                    name: dto.name
                }
            ]);

            return sessionResult;
        },
        successMessage: 'Adicionado aluno com sucesso!',
        queryKey: 'sessions'
    })

    return {
        insertMemberSession,
        isInsertingMemberSession
    }
}

export function useDeleteSessionMember(session: Session) {
    const {
        mutateAsync: deleteSessionMember,
        isPending: isDeletingSessionMember
    } = useActionMutation<Partial<Session>, string>({
        mutationFn: async (id: string) => {
            const sessionMembers = session.sessionMembers.filter(member => member.id !== id);

            return await _repository.updateMembers(session.id!, sessionMembers);
        },
        successMessage: 'Removido aluno com sucesso!',
        queryKey: 'sessions'
    })

    return {
        deleteSessionMember,
        isDeletingSessionMember
    }
}