import type { EnumSessionType } from "../enums/EnumSessionType";
import type { EnumStatusSession } from "../enums/EnumStatusSession";

export type TCreateSessionDto = {
    description: string;
    sessionType: EnumSessionType;
    status: EnumStatusSession;
    sessionDate: Date;
    sessionHour: string;
    maxParticipants: number;
    quantSessionMembers: number;
    allowJoinAfterStart: boolean;
}