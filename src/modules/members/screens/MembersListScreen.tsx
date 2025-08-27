import { Button } from "@/shared/components/button"
import { Input } from "@/shared/components/input"
import { PlusIcon } from "lucide-react"
import { useInfiniteMembers } from "../hooks/UseMember"
import { useNavigate } from "react-router-dom";
import MemberCard from "../components/card/MemberCard";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { EnumFilterOperator } from "@/shared/enums/EnumFilterOperator";
import { useDebouncedCallback } from "@/shared/hooks/UseDebounce";
import { useEffect, useRef } from "react";

export default function MembersListScreen() {
    const {
        members,
        fetchNextPage,
        setFilters,
        filters,
        isLoading,
        pageSize,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteMembers()

    const navigate = useNavigate();

    const handleSearch = useDebouncedCallback((name: string) => {
        const formatedFilters = filters.filter(filter => filter.field !== 'name');

        if (!name) {
            return setFilters(formatedFilters);
        }

        setFilters([
            ...formatedFilters,
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

    const loaderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!hasNextPage) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                fetchNextPage();
            }
        });

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => {
            if (loaderRef.current) {
                observer.unobserve(loaderRef.current);
            }
        };
    }, [fetchNextPage, hasNextPage]);

    return (
        <div className="flex flex-1 flex-col p-4">
            <div className="flex flex-row gap-2 items-center mb-4">
                <div className="flex flex-col gap-1 flex-1">
                    <p className="text-3xl font-bold">
                        Alunos
                    </p>

                    <span className="text-muted-foreground">
                        {members?.length} alunos
                    </span>
                </div>

                <Button
                    variant="outline"
                    className="aspect-square"
                    onClick={() => navigate("/members/create")}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {members?.map(member => (
                    <MemberCard
                        key={member.id}
                        member={member}
                        onClickEdit={() => navigate(`/members/edit/${member.id}`)}
                    />
                ))}

                {isLoading || isFetchingNextPage && <MembersListLoader pageSize={pageSize} />}
            </div>

            <div ref={loaderRef} className="h-10"></div>
        </div>
    )
}

type TMembersListLoaderProps = {
    pageSize: number
}

function MembersListLoader({ pageSize }: TMembersListLoaderProps) {
    return (
        <>
            {Array.from({ length: pageSize }).map((_, index) => (
                <Skeleton key={index} className="h-50 w-full mb-4 rounded-lg" />
            ))}
        </>
    )
}