import FirebaseRepProvider from "@/shared/infra/providers/FirebaseRepProvider";
import type SessionParticipants from "../domain/entities/SessionParticipants";
import Repository from "@/shared/infra/Repository";

export default class ParticipantRepository extends Repository<SessionParticipants> {
    constructor() {
        super(new FirebaseRepProvider("sessionParticipants"));
    }
}