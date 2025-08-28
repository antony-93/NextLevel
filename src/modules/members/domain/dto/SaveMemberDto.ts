import type { EnumPlanType } from "../enums/EnumPlanType";

export type TSaveMemberDto = {
    name: string;
    birthDate: Date;
    plan: EnumPlanType;
    cpf?: string;
    address?: string;
    city?: string;
    neighborhood?: string;
}