import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const MembersListScreen = lazy(() => import('../screens/MembersListScreen'));
const MemberCreateScreen = lazy(() => import('../screens/MemberCreateScreen'));
const MemberEditScreen = lazy(() => import('../screens/MemberEditScreen'));

export default function MemberRouter() {
    return (
        <Routes>
            <Route index element={<Navigate to="list" />} />
            <Route path="list" element={<MembersListScreen />} />
            <Route path="create" element={<MemberCreateScreen />} />
            <Route path="edit/:id" element={<MemberEditScreen />} />
        </Routes>
    );
}