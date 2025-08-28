import { cn } from "@/shared/utils/utils";
import MembersCombobox from "../../components/combobox/MembersCombobox";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { AddButton } from "@/shared/components/button";
import { useInfiniteParticipantsQuery, useParticipantMutations } from "../../hooks/UseParticipantsApi";
import { useSessionContext } from "../../context/UseEditSessionContext";
import { toast } from "sonner";
import SessionParticipants from "../../domain/entities/SessionParticipants";
import { useCallback } from "react";
import { EnumFilterOperator } from "@/shared/enums/EnumFilterOperator";
import DeleteSessionParticipantCard from "../../components/card/DeleteSessionParticipantCard";
import { toastSuccess, toastWarning } from "@/shared/components/Toast";
import { useSessionMutations } from "../../hooks/UseSessionApi";

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
        createParticipant,
        createParticipantLoading,
        deleteParticipant
    } = useParticipantMutations();

    const { control, handleSubmit, reset, formState: { isValid } } = useForm<AddMemberFormValues>({
        resolver: zodResolver(addMemberSchema)
    });

    const updateSessionParticipantsCount = useCallback(async (participantsCount: number) => {  
        await updateSession({
            data: {
                ...session,
                participantsCount,
                id: session.id!
            }
        });
    }, [session]);


    const onSubmit = useCallback(async (data: AddMemberFormValues) => {
        const result = session.canAddParticipant();

        if (!result.success) {
            return toastWarning('Atenção', result.message);
        }

        const participant = new SessionParticipants(
            data.member!.id,
            session.id!,
            data.member!.name
        );

        const participantsCount = participants.length + 1;

        await createParticipant({
            data: participant
        });

        updateSessionParticipantsCount(participantsCount);

        toastSuccess('Sucesso!', 'Aluno adicionado com sucesso');
        
        reset();
    }, [session, updateSessionParticipantsCount]);

    const {
        updateSession
    } = useSessionMutations();
    
    const {
        participants
    } = useInfiniteParticipantsQuery({
        filters: [{
            field: 'sessionId',
            operator: EnumFilterOperator.Equals,
            value: session.id!
        }]
    });

    const handleDelete = async (participant: SessionParticipants) => {
        await deleteParticipant({
            data: participant.id!
        });

        toast.success('Aluno removido com sucesso');
    }

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
                    disabled={createParticipantLoading || !isValid}
                >
                </AddButton>
            </form>

            <div className="flex flex-col gap-4">
                {
                    participants.map((participant) => (
                        <DeleteSessionParticipantCard
                            key={participant.id}
                            participant={participant}
                            onClickDelete={handleDelete}
                        />
                    ))
                }
            </div>
        </div>
    )
}