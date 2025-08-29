import FirebaseRepository from "@/shared/infra/repository/providers/firebase/FireBaseRepository";
import Repository from "@/shared/infra/repository/Repository";
import type Session from "../domain/entities/Session";
import { ErrorFactory } from "@/shared/utils/errors/ErrorFactory";
import { EnumStatusSession } from "../domain/enums/EnumStatusSession";

export default class SessionRepository extends Repository<Session> {
    constructor() {
        super(new FirebaseRepository<Session>('sessions', false));
    }

    async completeSession(id: string): Promise<Partial<Session>> {
        try {
            return await this.update(id, {
                status: EnumStatusSession.COMPLETED
            });
        } catch (error) {
            throw ErrorFactory.create(error);
        }
    }

    async updateSessionMembersCount(id: string, sessionMembersQuant: number): Promise<Partial<Session>> {
        try {
            return await this.update(id, {
                quantSessionMembers: sessionMembersQuant
            });
        } catch (error) {
            throw ErrorFactory.create(error);
        }
    }
}