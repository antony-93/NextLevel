import { TabsTrigger } from "@/shared/components/ui/tabs";
import { cn } from "@/shared/utils/utils";

type TabTriggerProps = {
    label: string;
    value: string;
    className?: string;
}

function TabTrigger({ label, value, className }: TabTriggerProps) {
  return (
    <TabsTrigger
        value={value}
        className={cn("data-[state=active]:after:bg-primary cursor-pointer relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none", className)}
    >
      {label}
    </TabsTrigger>
  )
}

export {
  Tabs,
  TabsContent,
  TabsList,
} from "@/shared/components/ui/tabs"

export { 
  TabTrigger
};