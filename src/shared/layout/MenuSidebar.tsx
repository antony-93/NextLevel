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
} from "../components/sidebar";


export default function MenuSidebar() {
    const navigate = useNavigate();

    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center gap-2 p-2">
                    <div className="flex items-center gap-2 bg-primary rounded-lg p-2">
                        <Dumbbell size={24} className="text-white" />
                    </div>

                    <p className="text-2xl font-bold">
                        txen Level
                    </p>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        Modulos
                    </SidebarGroupLabel>

                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton className="cursor-pointer" onClick={() => navigate("/members/list")} size="lg">
                                    <Users size={20} />
                                    <span>Alunos</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <SidebarMenuButton className="cursor-pointer" onClick={() => navigate("/sessions/agenda")} size="lg">
                                    <Calendar size={20} />
                                    <span>Agenda</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}