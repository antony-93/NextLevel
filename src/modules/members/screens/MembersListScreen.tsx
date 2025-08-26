import { Button } from "@/shared/components/button"
import { Input } from "@/shared/components/input"
import { PlusIcon } from "lucide-react"
import { useMembers } from "../hooks/UseMember"
import { useNavigate } from "react-router-dom";
import MemberCard from "../components/card/MemberCard";
import type Member from "../domain/entities/Member";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { EnumFilterOperator } from "@/shared/enums/EnumFilterOperator";
import { useDebouncedCallback } from "@/shared/hooks/UseDebounce";

export default function MembersListScreen() {
    const {
        members,
        isLoading,
        setFilters,
        filters
    } = useMembers()

    const navigate = useNavigate();

    const handleNovo = () => {
        navigate("/members/create");
    }

    const handleEdit = (member: Member) => {
        navigate(`/members/edit/${member.id}`);
    }

    const handleSearch = useDebouncedCallback((name: string) => {
        if (!name) {
            return setFilters(filters.filter(filter => filter.field !== 'name'));
        }

        setFilters([
            ...filters,
            {
                field: 'name',
                value: name,
                operator: EnumFilterOperator.GreaterThanOrEquals
            },
            {
                field: 'name',
                value: `${name}\uf8ff`,
                operator: EnumFilterOperator.LessThanOrEquals
            }
        ]);
    });

    return (
        <div className="flex flex-col p-4">
            <div className="flex flex-row gap-2 items-center mb-4">
                <div className="flex flex-col gap-1 flex-1">
                    <p className="text-3xl font-bold">
                        Alunos
                    </p>

                    <span className="text-muted-foreground">
                        {!isLoading ? `${members?.length} alunos` : <Skeleton className="h-6 w-20" />}
                    </span>
                </div>

                <Button
                    variant="outline"
                    className="aspect-square"
                    onClick={handleNovo}
                >
                    <PlusIcon className="opacity-60" size={16} aria-hidden="true" />
                    <span>Novo</span>
                </Button>
            </div>

            <Input
                className="mb-4"
                placeholder="Buscar por nome do aluno"
                onChange={(e) => handleSearch(e.target.value)}
            />

            {!isLoading && members?.map(member => (
                <MemberCard
                    key={member.id}
                    member={member}
                    onClickEdit={handleEdit}
                    className="mb-4"
                />
            ))}

            {isLoading && Array.from({ length: 10 }).map((_, index) => (
                <Skeleton key={index} className="h-50 w-full mb-4 rounded-lg" />
            ))}
        </div>
    )
}