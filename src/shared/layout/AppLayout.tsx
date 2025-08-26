import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "../components/sidebar";
import MenuSidebar from "./MenuSidebar";

export default function AppLayout() {
    return (
        <div className="flex h-full w-full">
            <SidebarProvider>
                <MenuSidebar />

                <main className="flex-1 flex flex-col">
                    <div className="flex flex-row items-center p-2 border-b">
                        <SidebarTrigger className="cursor-pointer p-4" />
                    </div>

                    <Outlet />
                </main>
            </SidebarProvider>
        </div>
    )
}