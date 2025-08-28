import type { EnumPlanType } from "../domain/enums/EnumPlanType";

export type TMemberFormData = {
    name: string;
    birthDate: Date;
    cpf: string;
    plan: EnumPlanType;
    address: string;
    city: string;
    neighborhood: string;
}