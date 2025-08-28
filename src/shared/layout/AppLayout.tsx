import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "../components/sidebar";
import MenuSidebar from "./MenuSidebar";

export default function AppLayout() {
    return (
        <div className="flex h-full w-full">
            <SidebarProvider>
                <MenuSidebar />

                <main className="w-full flex flex-col">
                    <div className="sticky top-0 z-10 bg-background border-b flex flex-row items-center px-4 py-3 md:p-4">
                        <SidebarTrigger iconClassName="!size-6" className="cursor-pointer p-4" />
                    </div>

                    <div className="flex-1 w-full overflow-y-auto">
                        <Outlet />
                    </div>
                </main>
            </SidebarProvider>
        </div>
    )
}