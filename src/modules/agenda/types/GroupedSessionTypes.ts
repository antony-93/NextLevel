import type Session from "../domain/entities/Session";

export type TGroupedSession = {
    sessionDate: Date;
    sessions: Session[];
}