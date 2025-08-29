import { cn } from "@/shared/utils/utils";
import MembersCombobox from "../../../components/combobox/MembersCombobox";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { AddButton } from "@/shared/components/button";
import { useSessionContext } from "../../../context/UseEditSessionContext";
import type { TCreateSessionMemberDto } from "../../../domain/dto/InsertMemberSessionDto";
import { useCreateSessionMember } from "../../../hooks/UseSessionMember";
import SessionMemberList from "./SessionMemberList";
import { useUpdateSessionMembersQuantity } from "@/modules/agenda/hooks/UseSessionApi";

type TabParticipantsProps = {
    className?: string;
}

const addMemberSchema = z.object({
    member: z.object({
        id: z.string(),
        name: z.string()
    })
});

type AddMemberFormValues = z.infer<typeof addMemberSchema>;

export default function TabParticipants({ className }: TabParticipantsProps) {
    const {
        session
    } = useSessionContext();

    const { control, handleSubmit, reset, formState } = useForm<AddMemberFormValues>({
        resolver: zodResolver(addMemberSchema)
    });

    const {
        createSessionMember,
        isCreatingSessionMember
    } = useCreateSessionMember(session);

    const {
        updateSessionMembersQuantity
    } = useUpdateSessionMembersQuantity(session.id!);

    const onSubmit = async (data: AddMemberFormValues) => {
        const dto: TCreateSessionMemberDto = {
            sessionId: session.id!,
            memberId: data.member!.id,
            name: data.member!.name
        };

        await createSessionMember(dto);

        await updateSessionMembersQuantity({ 
            sessionMembersQuant: session.quantSessionMembers + 1 
        });
        
        reset();
    };

    return (
        <div className={cn("flex flex-col justify-between py-4", className)}>
            <form onSubmit={handleSubmit((data: AddMemberFormValues) => onSubmit(data))} className="mb-4">
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
                    disabled={!formState.isValid || isCreatingSessionMember}
                >
                </AddButton>
            </form>

            <SessionMemberList />
        </div>
    )
}