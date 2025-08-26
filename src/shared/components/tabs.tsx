import { TabsTrigger } from "@/shared/components/ui/tabs";

function TabTrigger({ label, value }: { label: string, value: string }) {
  return (
    <TabsTrigger
    value={value}
    className="data-[state=active]:after:bg-primary relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
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