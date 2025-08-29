import FirebaseRepository from "@/shared/infra/repository/providers/firebase/FireBaseRepository";
import Repository from "@/shared/infra/repository/Repository";
import type SessionMember from "../domain/entities/SessionMember";

export default class SessionMemberRepository extends Repository<SessionMember> {
    constructor() {
        super(new FirebaseRepository<SessionMember>('sessionMembers', false));
    }
}