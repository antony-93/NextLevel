import { Button } from "@/shared/components/button";
import { Card, CardContent } from "@/shared/components/card";
import { Calendar, Clock } from "lucide-react";

export default function TabDataSession() {
    return (
        <div className="flex flex-col justify-between py-4">
            <div className="flex flex-col gap-2 mb-4">
                <p className="text-sm font-medium">Aula de rotina matinal teste do antony 123</p>

                <Card>
                    <CardContent>
                        <div className="flex flex-row gap-2">
                            <Calendar size={20} />
                            <p className="text-sm font-medium">Data: 00/00/0000</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <div className="flex flex-row gap-2">
                            <Clock size={20} />
                            <p className="text-sm font-medium">Horário: 00:00</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Button size="lg" className="w-full">
                <p className="text-base font-medium">Finalizar aula</p>
            </Button>
        </div>
    )
}