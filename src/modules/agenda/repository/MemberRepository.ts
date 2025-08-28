import Repository from "@/shared/infra/repository/Repository";
import type Member from "../domain/entities/Member";
import FirebaseRepository from "@/shared/infra/repository/providers/firebase/FireBaseRepository";

export default class MemberRepository extends Repository<Member> {
    constructor() {
        super(new FirebaseRepository<Member>('members', false));
    }
}   