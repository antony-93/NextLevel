import type Session from "../domain/entities/Session";
import { createContext, type FC, useContext, useState } from "react";

type SessionContextData = {
    session: Session;
}

const SessionContext = createContext<SessionContextData>({} as SessionContextData);

export const SessionContextProvider: FC<{ children: React.ReactNode, session: Session }> = ({ children, session }) => {
    const [sessionContext] = useState<Session>(session);

    return (
        <SessionContext.Provider value={{ session: sessionContext }}>
            {children}
        </SessionContext.Provider>
    );
}

export const useSessionContext = () => useContext(SessionContext);