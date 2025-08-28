import FirebaseRepository from "@/shared/infra/repository/providers/firebase/FireBaseRepository";
import type SessionParticipants from "../domain/entities/SessionParticipants";
import Repository from "@/shared/infra/repository/Repository";

export default class ParticipantRepository extends Repository<SessionParticipants> {
    constructor() {
        super(new FirebaseRepository<SessionParticipants>("sessionParticipants", false));
    }
}