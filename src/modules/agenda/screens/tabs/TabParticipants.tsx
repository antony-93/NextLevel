import { cn } from "@/shared/utils/utils";
import MembersCombobox from "../../components/combobox/MembersCombobox";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/shared/components/button";
import { useCountParticipants, useInfiniteParticipants, useParticipantMutations } from "../../hooks/UseParticipants";
import { useSessionContext } from "../../context/UseEditSessionContext";
import { toast } from "sonner";
import SessionParticipants from "../../domain/entities/SessionParticipants";
import { useCallback } from "react";
import { Plus } from "lucide-react";
import { EnumFilterOperator } from "@/shared/enums/EnumFilterOperator";

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
        count,
        isLoading: isLoadingCount
    } = useCountParticipants({
        filters: [{
            field: 'sessionId',
            operator: EnumFilterOperator.Equals,
            value: session.id!
        }]
    });

    const {
        createParticipant,
        createParticipantLoading
    } = useParticipantMutations();

    const { control, handleSubmit, reset, formState: { isValid, isDirty } } = useForm<AddMemberFormValues>({
        resolver: zodResolver(addMemberSchema)
    });

    const onSubmit = useCallback(async (data: AddMemberFormValues) => {
        const result = session.canAddParticipant(count!);

        if (!result.success) {
            return toast.error(result.message);
        }

        const participant = new SessionParticipants(
            data.member!.id,
            session.id!,
            data.member!.name
        );

        await createParticipant({
            data: participant
        });

        reset();

        toast.success('Aluno adicionado com sucesso');
    }, [session, count]);

    const {
        participants
    } = useInfiniteParticipants();

    return (
        <div className={cn("flex flex-col justify-between py-4", className)}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    control={control}
                    name="member"
                    render={({ field }) => (
                        <MembersCombobox
                            value={field.value?.id}
                            onChange={field.onChange}
                            label="Alunos"
                            className="mb-4"
                            placeholder="Selecionar aluno"
                        />
                    )}
                />

                <Button
                    size="lg"
                    className="w-full"
                    type="submit"
                    disabled={createParticipantLoading || !isValid}
                >
                    <Plus className="s-4" />
                    Adicionar
                </Button>
            </form>

            <div className="flex flex-col gap-4">
                {
                    participants.map((participant) => (
                        <div key={participant.id}>
                            {participant.name}
                        </div>
                    ))
                }
            </div>
        </div>
    )
}