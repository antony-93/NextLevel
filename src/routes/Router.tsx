import AppLayout from "@/shared/layout/AppLayout";
import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const MemberRouter = lazy(() => import('@/modules/members/routes/Router'));
const SessionRouter = lazy(() => import('@/modules/agenda/routes/Router'));

export default function Router() {
    return (
        <Routes>
            <Route element={<AppLayout />}>
                <Route path="/" element={<Navigate to="/members" />} />
                <Route path="/members/*" element={<MemberRouter />} />
                <Route path="/sessions/*" element={<SessionRouter />} />
            </Route>
        </Routes>
    );
}