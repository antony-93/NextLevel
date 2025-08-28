import type { EnumSessionType } from "../enums/EnumSessionType";
import { EnumStatusSession } from "../enums/EnumStatusSession";
import type { SessionMember } from "./SessionMember";

export default class Session {
    constructor(
        public description: string,
        public status: EnumStatusSession,
        public sessionType: EnumSessionType,
        public sessionDate: Date,
        public sessionHour: string,
        public maxParticipants: number,
        public allowJoinAfterStart: boolean,
        public id?: string,
        public sessionMembers: SessionMember[] = []
    ) { }
}