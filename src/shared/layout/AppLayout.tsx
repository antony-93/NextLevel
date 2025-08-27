import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "../components/sidebar";
import MenuSidebar from "./MenuSidebar";

export default function AppLayout() {
    return (
        <div className="flex h-full w-full">
            <SidebarProvider>
                <MenuSidebar />

                <main className="w-full flex flex-col">
                    <div className="flex flex-row items-center px-4 py-3 md:p-4 border-b">
                        <SidebarTrigger iconClassName="!size-6" className="cursor-pointer p-4" />
                    </div>

                    <Outlet />
                </main>
            </SidebarProvider>
        </div>
    )
}