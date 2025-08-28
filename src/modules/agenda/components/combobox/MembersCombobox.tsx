import Select from "@/shared/components/select";
import { useInfiniteMembers } from "../../hooks/UseMembersApi";
import { SelectItem } from "@/shared/components/ui/select";
import { useEffect, useRef } from "react";
import { useDebouncedCallback } from "@/shared/hooks/UseDebounce";
import { EnumFilterOperator } from "@/shared/enums/EnumFilterOperator";
import type Member from "../../domain/entities/Member";
import { cn } from "@/shared/utils/utils";

type MembersComboboxProps = Omit<
    React.ComponentProps<typeof Select>,
    "onSearch" | "isLoadingList" | "isLoadingNextPage"
> & {
    onChange: (member: Member) => void;
    className?: string;
};

export default function MembersCombobox({
    onChange,
    className,
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

    const handleSelect = (value: string) => {
        const selectedMember = members.find(member => member.id === value);

        if (selectedMember) onChange(selectedMember);
    }

    return (
        <Select
            {...props}
            className={cn("mb-4", className)}
            searchPlaceholder="Pesquisar membros"
            onValueChange={handleSelect}
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

            <div ref={loaderRef}></div>
        </Select>
    )
}