export default class SessionMember {
    constructor(
        public memberId: string,
        public sessionId: string,
        public name: string,
        public id?: string
    ) {}
}