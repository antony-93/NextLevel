import Select from "@/shared/components/select";
import { useInfiniteMembers } from "../../hooks/UseMember";
import { SelectItem } from "@/shared/components/ui/select";
import { useEffect, useRef } from "react";
import { useDebouncedCallback } from "@/shared/hooks/UseDebounce";
import { EnumFilterOperator } from "@/shared/enums/EnumFilterOperator";

type MembersComboboxProps = Omit<
    React.ComponentProps<typeof Select>,
    "onSearch" | "isLoadingList" | "isLoadingNextPage"
>;


export default function MembersCombobox({
    ...props
}: MembersComboboxProps) {
    const {
        members,
        isLoading,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
        filters,
        setFilters,
    } = useInfiniteMembers();

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
    return (
        <Select
            {...props}
            searchPlaceholder="Pesquisar membros"
            onSearch={handleSearch}
            isLoadingList={isLoading}
            isLoadingNextPage={isFetchingNextPage}
        >
            {members.map((member) => (
                <SelectItem key={member.id} value={member.id!}>
                    {member.name}
                </SelectItem>
            ))}

            {members.length === 0 && (
                <SelectItem value="empty">
                    Nenhum membro encontrado
                </SelectItem>
            )}

            <div ref={loaderRef} className="h-2" />
        </Select>
    )
}