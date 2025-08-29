import type { EnumSessionType } from "../enums/EnumSessionType";
import { EnumStatusSession } from "../enums/EnumStatusSession";

export default class Session {
    constructor(
        public description: string,
        public status: EnumStatusSession,
        public sessionType: EnumSessionType,
        public sessionDate: Date,
        public sessionHour: string,
        public maxParticipants: number,
        public allowJoinAfterStart: boolean,
        public quantSessionMembers: number,
        public id?: string,
    ) { }
}