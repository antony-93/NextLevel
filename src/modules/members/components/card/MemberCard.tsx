import { Card, CardContent } from "@/shared/components/card";
import { Button } from "@/shared/components/button";
import { Badge } from "@/shared/components/badge";
import { Calendar, CreditCard, Edit, MapPin } from "lucide-react";
import type Member from "../../domain/entities/Member";
import { useCallback } from "react";
import { useFormattedAddress } from "../../hooks/UseFormattedAddres";

type MemberCardProps = {
    member: Member;
    onClickEdit: (member: Member) => void;
    className?: string;
}

export default function MemberCard({ member, onClickEdit, className }: MemberCardProps) {
    const handleEdit = useCallback(() => {
        onClickEdit(member)
    }, [member, onClickEdit]);

    const formattedAddress = useFormattedAddress({
        address: member.address,
        neighborhood: member.neighborhood,
        city: member.city
    });

    return (
        <Card key={member.id} className={className}>
            <CardContent>
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col">
                        <div className="flex flex-row justify-between items-center">
                            <p className="text-xl font-semibold text-ellipsis overflow-hidden whitespace-nowrap">
                                {member.name}
                            </p>

                            <Button variant="ghost" size="icon" onClick={handleEdit}>
                                <Edit size={24} />
                            </Button>
                        </div>

                        <Badge variant="outline" className="rounded">
                            <p className="text-sm">
                                {member.plan}
                            </p>
                        </Badge>
                    </div>

                    <div className="flex flex-row gap-1 items-center">
                        <Calendar size={24} className="opacity-60" />
                        <p className="text-sm flex-1 text-ellipsis overflow-hidden whitespace-nowrap">22/01/2025</p>
                    </div>

                    <div className="flex flex-row gap-1 items-center">
                        <MapPin size={24} className="opacity-60" />

                        <p className="text-sm flex-1 text-ellipsis overflow-hidden whitespace-nowrap">
                            {formattedAddress || 'Endereço não informado'}
                        </p>
                    </div>

                    <div className="flex flex-row gap-1 items-center">
                        <CreditCard size={24} className="opacity-60" />

                        <p className="text-sm flex-1 text-ellipsis overflow-hidden whitespace-nowrap">
                            {member.cpf}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}