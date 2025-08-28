import { Calendar, Dumbbell, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "../components/sidebar";
import { useIsMobile } from "@/shared/hooks/use-mobile";


export default function MenuSidebar() {
    const navigate = useNavigate();

    const { toggleSidebar } = useSidebar();

    const isMobile = useIsMobile();

    const handleNavigate = (path: string) => {
        navigate(path);
        if (isMobile) {
            toggleSidebar();
        }
    }

    return (
        <Sidebar>
            <SidebarHeader className="border-b md:p-3 p-4 flex-row items-center">
                <div className="flex items-center gap-2 bg-primary rounded-lg p-2">
                    <Dumbbell size={24} className="text-white" />
                </div>

                <p className="text-2xl font-bold">
                    Next Level
                </p>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-sm font-medium">
                        Modulos
                    </SidebarGroupLabel>

                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton className="cursor-pointer h-15" onClick={() => handleNavigate("/members/list")} size="lg">
                                    <Users className="!size-5 mr-1" />
                                    <span className="text-base font-medium">Alunos</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <SidebarMenuButton className="cursor-pointer h-15" onClick={() => handleNavigate("/sessions/agenda")} size="lg">
                                    <Calendar className="!size-5 mr-1" />
                                    <span className="text-base font-medium">Agenda</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}