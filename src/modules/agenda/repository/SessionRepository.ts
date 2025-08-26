import FirebaseRepProvider from "@/shared/infra/providers/FirebaseRepProvider";
import Repository from "@/shared/infra/Repository";
import type Session from "../domain/entities/Session";

export default class SessionRepository extends Repository<Session> {
    constructor() {
        super(new FirebaseRepProvider<Session>('sessions'));
    }
}