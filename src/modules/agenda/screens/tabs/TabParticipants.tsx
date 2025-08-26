import { cn } from "@/shared/utils/utils";

type TabParticipantsProps = {
    className?: string;
}

export default function TabParticipants({ className }: TabParticipantsProps) {
    return (
        <div className={cn("flex flex-col gap-4", className)}>
        </div>
    )
}