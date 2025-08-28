import type { TQueryParams } from "@/shared/types/QueryParamsTypes";
import Member from "../domain/entities/Member";
import MemberRepository from "../repository/MemberRepository";
import { useQueryById, useQueryInfinite } from "@/shared/hooks/UseQuery";
import { useQueryParams } from "@/shared/hooks/UseQueryParams";
import useActionMutation from "@/shared/hooks/UseActionMutation";
import type { TSaveMemberDto } from "../domain/dto/SaveMemberDto";

const _repository = new MemberRepository();

export function useInfiniteMembers(params?: TQueryParams<Member>) {
    const {
        filters,
        setFilters,
        sort,
        setSort,
        pageSize,
        setPageSize,
    } = useQueryParams<Member>(params, {
        sort: [{
            field: 'name',
            direction: 'asc'
        }]
    });

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isLoading,
        isError,
        error,
        isFetchingNextPage
    } = useQueryInfinite({
        repository: _repository,
        queryKey: 'members',
        queryParams: {
            filters,
            sort,
            pageSize
        }
    });

    return {
        members: data,
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

export function useMember(id: string) {
    const {
        data: member,
        isLoading,
        isError,
        error
    } = useQueryById<Member>({
        repository: _repository,
        queryKey: 'members',
        id
    });

    return {
        member,
        isLoading,
        isError,
        error
    };
}

export function useCreateMember() {
    const {
        mutate: createMember,
        isPending: isCreatingMember
    } = useActionMutation<Member, TSaveMemberDto>({
        mutationFn: async (dto: TSaveMemberDto) => {
            const member = new Member(
                dto.name,
                dto.birthDate,
                dto.plan,
                dto.cpf,
                dto.address,
                dto.city,
                dto.neighborhood
            );

            return await _repository.create(member);
        },
        successMessage: "Aluno criado com sucesso!",
        queryKey: 'members'
    });

    return {
        createMember,
        isCreatingMember
    };
}

export function useUpdateMember(id: string) {
    const {
        mutateAsync: updateMember,
        isPending: isUpdatingMember
    } = useActionMutation<Partial<Member>, TSaveMemberDto>({
        mutationFn: async (dto: TSaveMemberDto) => {
            const member = new Member(
                dto.name,
                dto.birthDate,
                dto.plan,
                dto.cpf,
                dto.address,
                dto.city,
                dto.neighborhood
            );

            return await _repository.update(id, member);
        },
        successMessage: "Aluno atualizado com sucesso!",
        queryKey: 'members'
    });

    return {
        updateMember,
        isUpdatingMember
    };
}