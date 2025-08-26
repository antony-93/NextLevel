import { Button } from "@/shared/components/button";
import { Input } from "@/shared/components/input";
import { CreditCard, Loader2, MapPin, Save, User, X } from "lucide-react";
import { z } from "zod";
import { EnumPlanType } from "../../domain/enums/EnumPlanType";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Member from "../../domain/entities/Member";
import DateField from "@/shared/components/datafield";
import { getLocalTimeZone, parseDate } from "@internationalized/date";
import PlanTypeCombobox from "../combobox/PlanTypeCombobox";
import { cn } from "@/shared/utils/utils";
import { Suspense } from "react";

const formSchema = z.object({
    name: z.string().min(5, { message: "Nome é obrigatório" }),
    birthDate: z.date({ message: "Data de nascimento é obrigatória" }),
    cpf: z.string(),
    plan: z.enum(EnumPlanType, { message: "Plano é obrigatório" }),
    address: z.string(),
    city: z.string(),
    neighborhood: z.string(),
})

type FormData = z.infer<typeof formSchema>;

type MemberFormProps = {
    onSubmit: (member: Member) => void;
    onClickCancel: () => void;
    member?: Member | null;
    isSaving?: boolean;
    className?: string;
}

export default function MemberForm({ onSubmit, onClickCancel, member, isSaving, className }: MemberFormProps) {
    const { register, control, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        mode: "onBlur",
        defaultValues: {
            name: member?.name,
            birthDate: member?.birthDate,
            cpf: member?.cpf,
            plan: member?.plan ?? EnumPlanType.MENSAL,
            address: member?.address,
            city: member?.city,
            neighborhood: member?.neighborhood
        }
    })

    const handleSubmitMember = (data: FormData) => {
        const member = new Member(
            data.name,
            data.birthDate,
            data.plan,
            data.cpf,
            data.address,
            data.city,
            data.neighborhood
        )

        onSubmit(member);
    }

    return (
        <Suspense
            fallback={
                <div>Carregando...</div>
            }            
        >
            <form onSubmit={handleSubmit(handleSubmitMember)}>
                <div className={cn("flex flex-col", className)}>
                    <div className="flex flex-row gap-2">
                        <User size={24} />
                        <p>Informações pessoais</p>
                    </div>

                    <hr className="my-4" />

                    <div className="flex flex-col gap-3 mb-6">
                        <Input
                            {...register("name")}
                            label="Nome"
                            placeholder="Digite o nome do aluno"
                            required
                            error={errors.name?.message}
                        />

                        <Controller
                            control={control}
                            name="birthDate"
                            render={({ field }) => (
                                <DateField
                                    {...field}
                                    value={field.value ? parseDate(field.value.toISOString().slice(0, 10)) : undefined}
                                    onChange={(date) => field.onChange(date ? new Date(date.toDate(getLocalTimeZone())) : undefined)}
                                    label="Data de nascimento"
                                    required
                                    error={errors.birthDate?.message}
                                />
                            )}
                        />

                        <Input
                            {...register("cpf")}
                            label="CPF"
                            placeholder="Digite o CPF do aluno"
                        />
                    </div>

                    <div className="flex flex-row gap-2">
                        <CreditCard size={24} />
                        <p>Plano</p>
                    </div>

                    <hr className="my-4" />

                    <div className="flex flex-col gap-3 mb-6">
                        <Controller
                            control={control}
                            name="plan"
                            render={({ field }) => (
                                <PlanTypeCombobox
                                    {...field}
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    label="Plano"
                                    required
                                    error={errors.plan?.message}
                                />
                            )}
                        />
                    </div>

                    <div className="flex flex-row gap-2">
                        <MapPin size={24} />
                        <p>Endereço</p>
                    </div>

                    <hr className="my-4" />

                    <div className="flex flex-col gap-3 mb-6">
                        <Input
                            {...register("address")}
                            label="Endereço"
                            placeholder="Digite o endereço do aluno"
                            error={errors.address?.message}
                        />

                        <Input
                            {...register("city")}
                            label="Cidade"
                            placeholder="Digite a cidade do aluno"
                            error={errors.city?.message}
                        />

                        <Input
                            {...register("neighborhood")}
                            label="Bairro"
                            placeholder="Digite o bairro do aluno"
                            error={errors.neighborhood?.message}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Button
                            type="submit"
                            size="lg"
                            className="w-full"
                            disabled={isSaving}
                        >
                            {isSaving ? <Loader2 size={16} /> : <Save size={16} />}
                            Salvar
                        </Button>

                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full"
                            onClick={onClickCancel}
                        >
                            <X size={16} />
                            Cancelar
                        </Button>
                    </div>
                </div>
            </form>
        </Suspense>
    )
}