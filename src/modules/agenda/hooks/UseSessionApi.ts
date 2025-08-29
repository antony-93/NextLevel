import { useQueryById, useQueryInfinite } from "@/shared/hooks/UseQuery";
import type { TQueryParams } from "@/shared/types/QueryParamsTypes";
import SessionRepository from "../repository/SessionRepository";
import Session from "../domain/entities/Session";
import { useQueryParams } from "@/shared/hooks/UseQueryParams";
import useActionMutation from "@/shared/hooks/UseActionMutation";
import { EnumStatusSession } from "../domain/enums/EnumStatusSession";
import type { TCreateSessionDto } from "../domain/dto/CreateSessionDto";
import type { TUpdateSessionDto } from "../domain/dto/UpdateSessionDto";
import type { TUpdateSessionMembersCountDto } from "../domain/dto/UpdateSessionMembersCountDto";

const _repository = new SessionRepository();

export function useInfiniteSessionsQuery(params?: TQueryParams<Session>) {
    const {
        filters,
        sort,
        pageSize,
        ...restQueryParams
    } = useQueryParams<Session>(params);

    const {
        data,
        ...restQuery
    } = useQueryInfinite({
        repository: _repository,
        queryKey: 'sessions',
        queryParams: {
            filters,
            sort,
            pageSize
        }
    });

    return {
        sessions: data,
        filters,
        sort,
        pageSize,
        ...restQueryParams,
        ...restQuery
    };
}

export function useSessionQueryId(id: string) {
    const {
        data: session,
        ...rest
    } = useQueryById({
        repository: new SessionRepository(),
        queryKey: 'sessions',
        id,
    });

    return {
        session,
        ...rest
    };
}

export function useCreateSession() {
    const {
        mutateAsync: createSession,
        isPending: isCreatingSession
    } = useActionMutation<Session, TCreateSessionDto>({
        mutationFn: async (dto: TCreateSessionDto) => {
            const session = new Session(
                dto.description,
                EnumStatusSession.PENDING,
                dto.sessionType,
                dto.sessionDate,
                dto.sessionHour,
                dto.maxParticipants,
                dto.allowJoinAfterStart,
                dto.quantSessionMembers
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
    } = useActionMutation<Partial<Session>, TUpdateSessionDto>({
        mutationFn: async (dto: TUpdateSessionDto) => {
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
        queryKey: 'sessions',
        refetch: false
    })

    return {
        completeSession,
        isCompletingSession
    }
}

export function useUpdateSessionMembersQuantity(id: string) {
    const {
        mutateAsync: updateSessionMembersQuantity,
        isPending: isUpdatingSessionMembersQuantity
    } = useActionMutation<Partial<Session>, TUpdateSessionMembersCountDto>({
        mutationFn: async (dto: TUpdateSessionMembersCountDto) => {
            return await _repository.updateSessionMembersCount(id, dto.sessionMembersQuant);
        },
        successMessage: 'Quantidade de membros da sessão atualizada com sucesso!',
        queryKey: 'sessions',
        refetch: false
    })

    return {
        updateSessionMembersQuantity,
        isUpdatingSessionMembersQuantity
    }
}
