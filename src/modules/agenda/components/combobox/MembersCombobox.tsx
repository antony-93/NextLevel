import Select from "@/shared/components/select";
import { useInfiniteMembers } from "../../hooks/UseMember";
import { SelectItem } from "@/shared/components/ui/select";
import { useEffect, useRef } from "react";

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

    return (
        <Select
            {...props}
            searchPlaceholder="Pesquisar membros"
            onSearch={(value) => {
                console.log(value);
            }}
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