import type Session from "../entities/Session";
import { EnumStatusSession } from "../enums/EnumStatusSession";
import type { TDomainResult } from "../types/DomainResultTypes";

export default class InsertMemberIntoSessionValidator {

    static validate(session: Session): TDomainResult {
        if (session.status === EnumStatusSession.COMPLETED) {
            return {
                success: false,
                message: 'Aula já finalizada'
            }
        }

        if (session.sessionMembers.length || 0 >= session.maxParticipants) {
            return {
                success: false,
                message: 'Máximo de participantes atingido'
            }
        }

        if (!session.allowJoinAfterStart && session.sessionDate < new Date()) {
            return {
                success: false,
                message: 'Não é possível se inscrever após o início da aula'
            }
        }

        return {
            success: true
        }
    }
}