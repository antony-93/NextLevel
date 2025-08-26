import AppLayout from "@/shared/layout/AppLayout";
import { Navigate, Route, Routes } from "react-router-dom";
import AgendaScreen from "../screens/AgendaScreen";
import SessionCreateScreen from "../screens/SessionCreateScreen";
import SessionEditScreen from "../screens/SessionEditScreen";
import SessionDetailsScreen from "../screens/SessionDetailsScreen";

export default function AgendaRouter() {
    return (
        <Routes>
            <Route path="create" element={<SessionCreateScreen />} />
            <Route path="edit/:id" element={<SessionEditScreen />} />
            <Route index element={<Navigate to="agenda" />} />
            <Route path="agenda" element={<AgendaScreen />} />
            <Route path="details/:id" element={<SessionDetailsScreen />} />
        </Routes>
    );
}