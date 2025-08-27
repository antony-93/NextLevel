import { Navigate, Route, Routes } from "react-router-dom";
import MemberCreateScreen from "../screens/MemberCreateScreen";
import MemberEditScreen from "../screens/MemberEditScreen";
import MembersListScreen from "../screens/MembersListScreen";


export default function MemberRouter() {
    return (
        <Routes>
            <Route index element={<Navigate to="list" />} />
            <Route path="create" element={<MemberCreateScreen />} />
            <Route path="edit/:id" element={<MemberEditScreen />} />
            <Route path="list" element={<MembersListScreen />} />
        </Routes>
    );
}