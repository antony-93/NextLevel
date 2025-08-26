import { EnumPlanType } from "../enums/EnumPlanType";

export default class Member {
    constructor(
        public name: string,
        public birthDate: Date,
        public plan: EnumPlanType,
        public cpf?: string,
        public address?: string,
        public city?: string,
        public neighborhood?: string,
        public id?: string
    ) {}

    getFormatedAddress(): string {
        const address = [
            this.address,
            this.neighborhood,
            this.city
        ];

        return address.filter(Boolean).join(', ');
    }
}