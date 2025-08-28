import { Button, CancelButton, SaveButton } from "@/shared/components/button";
import { Input } from "@/shared/components/input";
import { Clipboard, Loader2, Save, Users, X } from "lucide-react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/shared/utils/utils";
import { EnumStatusSession } from "../../domain/enums/EnumStatusSession";
import Session from "../../domain/entities/Session";
import SessionCombobox from "../combobox/SessionCombobox";
import { EnumSessionType } from "../../domain/enums/EnumSessionType";
import { getLocalTimeZone, parseDate } from "@internationalized/date";
import DateField from "@/shared/components/datafield";
import HourField from "@/shared/components/hourfield";
import Checkbox from "@/shared/components/checkbox";
import { FormContainerButton } from "@/shared/components/Container";

const formSchema = z.object({
    description: z.string().min(1, { message: "Descrição é obrigatória" }),
    status: z.enum(EnumStatusSession, { message: "Status é obrigatório" }),
    sessionType: z.enum(EnumSessionType, { message: "Tipo de aula é obrigatório" }),
    sessionDate: z.date({ message: "Data da aula é obrigatória" })
        .refine(date => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const sessionDate = new Date(date);
            sessionDate.setHours(0, 0, 0, 0);

            return sessionDate >= today;
        }, {
            message: "Data da aula deve ser maior que a data atual"
        }),
    sessionHour: z.string().min(5, { message: "Hora da aula é obrigatória" }),
    maxParticipants: z.number().int().min(1, { message: "Máximo de participantes é obrigatório" }),
    allowJoinAfterStart: z.boolean()
})

type FormData = z.infer<typeof formSchema>;

type SessionFormProps = {
    onSubmit: (session: Session) => void;
    onClickCancel: () => void;
    session?: Session | null;
    isSaving?: boolean;
    className?: string;
}

export default function SessionForm({ onSubmit, onClickCancel, session, isSaving, className }: SessionFormProps) {
    const { register, control, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        mode: "onBlur",
        defaultValues: {
            description: session?.description,
            status: session?.status || EnumStatusSession.PENDING,
            sessionType: session?.sessionType || EnumSessionType.CROSSFIT,
            sessionDate: session?.sessionDate,
            sessionHour: session?.sessionHour || "08:00",
            maxParticipants: session?.maxParticipants || 20,
            allowJoinAfterStart: session?.allowJoinAfterStart ? true : false
        }
    })

    const handleSubmitMember = (data: FormData) => {
        const [hours, minutes] = data.sessionHour.split(":");

        data.sessionDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        const session = new Session(
            data.description,
            data.status,
            data.sessionType,
            data.sessionDate,
            data.sessionHour,
            data.maxParticipants,
            data.allowJoinAfterStart
        );

        onSubmit(session);
    }

    return (
        <form onSubmit={handleSubmit(handleSubmitMember)}>
            <div className={cn("flex flex-col", className)}>
                <div className="flex flex-row gap-2">
                    <Clipboard size={24} />
                    <p>Dados da aula</p>
                </div>

                <hr className="my-4" />

                <div className="flex flex-col gap-3 mb-6">
                    <Input
                        {...register("description")}
                        label="Descrição"
                        placeholder="Digite a descrição da aula"
                        required
                        error={errors.description?.message}
                    />

                    <Controller
                        control={control}
                        name="sessionType"
                        render={({ field }) => (
                            <SessionCombobox
                                {...field}
                                value={field.value}
                                onValueChange={field.onChange}
                                label="Tipo de aula"
                                required
                                error={errors.sessionType?.message}
                            />
                        )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Controller
                            control={control}
                            name="sessionDate"
                            render={({ field }) => (
                                <DateField
                                    {...field}
                                    value={field.value ? parseDate(field.value.toISOString().slice(0, 10)) : undefined}
                                    onChange={(date) => field.onChange(date ? new Date(date.toDate(getLocalTimeZone())) : undefined)}
                                    label="Data da aula"
                                    required
                                    error={errors.sessionDate?.message}
                                />
                            )}
                        />

                        <HourField
                            {...register("sessionHour")}
                            label="Hora da aula"
                            placeholder="--:--"
                            required
                            error={errors.sessionHour?.message}
                        />
                    </div>
                </div>

                <div className="flex flex-row gap-2">
                    <Users size={24} />
                    <p>Participantes</p>
                </div>

                <hr className="my-4" />

                <div className="flex flex-col gap-5 mb-6">
                    <Controller
                        control={control}
                        name="maxParticipants"
                        render={({ field }) => (
                            <Input
                                {...field}
                                onChange={e => field.onChange(parseInt(e.target.value))}
                                label="Máximo de participantes"
                                placeholder="Digite o máximo de participantes"
                                required
                                type="number"
                                error={errors.maxParticipants?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="allowJoinAfterStart"
                        render={({ field }) => (
                            <Checkbox
                                {...field}
                                value={field.value ? 'true' : 'false'}
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="w-full"
                                label="Permitir inscrição após o início da aula"
                            />
                        )}
                    />
                </div>

                <FormContainerButton>
                    <SaveButton
                        className="md:mr-2 md:mb-0 mb-2"
                        type="submit"
                        disabled={isSaving}
                        isLoading={isSaving}
                    />

                    <CancelButton
                        onClick={onClickCancel}
                    />
                </FormContainerButton>
            </div>
        </form>
    )
}