import type { EnumSessionType } from "../domain/enums/EnumSessionType";

export type TSessionFormData = {
    description: string;
    sessionType: EnumSessionType;
    sessionDate: Date;
    sessionHour: string;
    maxParticipants: number;
    allowJoinAfterStart: boolean;
}