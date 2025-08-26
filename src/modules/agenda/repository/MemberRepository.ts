import Repository from "@/shared/infra/Repository";
import type Member from "../domain/entities/Member";
import FirebaseRepProvider from "@/shared/infra/providers/FirebaseRepProvider";

export default class MemberRepository extends Repository<Member> {
    constructor() {
        super(new FirebaseRepProvider<Member>('members'));
    }
}   