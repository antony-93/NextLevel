import type Session from "../domain/entities/Session";
import { createContext, type FC, useContext, useState } from "react";

type SessionContextData = {
    session: Session | null;
    setSession: (session: Session) => void;
}

const SessionContext = createContext<SessionContextData>({} as SessionContextData);

export const SessionContextProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);

    const handleSetSession = (session: Session) => {
        setSession(session);
    };

    return (
        <SessionContext.Provider value={{ session, setSession: handleSetSession }}>
            {children}
        </SessionContext.Provider>
    );
}

export const useSessionContext = () => useContext(SessionContext);