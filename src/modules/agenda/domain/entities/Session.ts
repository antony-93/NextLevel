import type { EnumSessionType } from "../enums/EnumSessionType";
import { EnumStatusSession } from "../enums/EnumStatusSession";
import type { TDomainResult } from "../types/DomainResultTypes";

export default class Session {
    constructor(
        public description: string,
        public status: EnumStatusSession,
        public sessionType: EnumSessionType,
        public sessionDate: Date,
        public sessionHour: string,
        public maxParticipants: number,
        public allowJoinAfterStart: boolean,
        public id?: string,
        public participantsCount?: number,
    ) { }

    canAddParticipant(): TDomainResult {
        if (this.status === EnumStatusSession.COMPLETED) {
            return {
                success: false,
                message: 'Aula já finalizada'
            }
        }

        if (this.participantsCount && this.participantsCount >= this.maxParticipants) {
            return {
                success: false,
                message: 'Máximo de participantes atingido'
            }
        }

        if (!this.allowJoinAfterStart && this.sessionDate < new Date()) {
            return {
                success: false,
                message: 'Não é possível se inscrever após o início da aula'
            }
        }

        return {
            success: true,
            message: 'Inscrição realizada com sucesso'
        }
    }
}