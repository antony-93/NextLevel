import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const AgendaScreen = lazy(() => import('../screens/AgendaScreen'));
const SessionCreateScreen = lazy(() => import('../screens/SessionCreateScreen'));
const SessionEditScreen = lazy(() => import('../screens/SessionEditScreen'));
const SessionDetailsScreen = lazy(() => import('../screens/SessionDetailsScreen'));

export default function AgendaRouter() {
    return (
        <Routes>
            <Route index element={<Navigate to="agenda" />} />
            <Route path="agenda" element={<AgendaScreen />} />
            <Route path="create" element={<SessionCreateScreen />} />
            <Route path="edit/:id" element={<SessionEditScreen />} />
            <Route path="details/:id" element={<SessionDetailsScreen />} />
        </Routes>
    );
}