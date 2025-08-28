import { cn } from "@/shared/utils/utils";
import MembersCombobox from "../../components/combobox/MembersCombobox";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { AddButton } from "@/shared/components/button";
import { useSessionContext } from "../../context/UseEditSessionContext";
import type { TInsertMemberSessionDto } from "../../domain/dto/InsertMemberSessionDto";
import DeleteSessionMemberCard from "../../components/card/DeleteSessionMemberCard";
import { useInsertMemberSession, useDeleteSessionMember } from "../../hooks/UseSessionApi";

type TabParticipantsProps = {
    className?: string;
}

const addMemberSchema = z.object({
    member: z.object({
        id: z.string(),
        name: z.string()
    }).optional()
});

type AddMemberFormValues = z.infer<typeof addMemberSchema>;

export default function TabParticipants({ className }: TabParticipantsProps) {
    const {
        session
    } = useSessionContext();

    const {
        deleteSessionMember,
    } = useDeleteSessionMember(session);

    const { control, handleSubmit, reset, formState: { isValid } } = useForm<AddMemberFormValues>({
        resolver: zodResolver(addMemberSchema)
    });

    const {
        insertMemberSession,
        isInsertingMemberSession
    } = useInsertMemberSession(session);

    const onSubmit = async (data: AddMemberFormValues) => {
        const dto: TInsertMemberSessionDto = {
            memberId: data.member!.id,
            name: data.member!.name,
        };

        await insertMemberSession(dto);
        
        reset();
    };

    const handleDelete = async (id: string) => {
        await deleteSessionMember(id);
    };

    return (
        <div className={cn("flex flex-col justify-between py-4", className)}>
            <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
                <Controller
                    control={control}
                    name="member"
                    render={({ field }) => (
                        <MembersCombobox
                            value={field.value?.id}
                            onChange={field.onChange}
                            label="Aluno"
                            className="mb-4"
                            placeholder="Selecionar aluno"
                        />
                    )}
                />

                <AddButton
                    className="w-full"
                    type="submit"
                    controlSize={false}
                    disabled={!isValid || isInsertingMemberSession}
                >
                </AddButton>
            </form>

            <div className="flex flex-col gap-4">
                {
                    session.sessionMembers.map((sessionMember) => (
                        <DeleteSessionMemberCard
                            key={sessionMember.id}
                            sessionMember={sessionMember}
                            onClickDelete={handleDelete}
                        />
                    ))
                }
            </div>
        </div>
    )
}