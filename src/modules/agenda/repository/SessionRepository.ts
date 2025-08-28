import FirebaseRepository from "@/shared/infra/repository/providers/firebase/FireBaseRepository";
import Repository from "@/shared/infra/repository/Repository";
import type Session from "../domain/entities/Session";

export default class SessionRepository extends Repository<Session> {
    constructor() {
        super(new FirebaseRepository<Session>('sessions', false));
    }
}