import { AgendaCalendar } from "@/shared/components/agenda"
import { Button } from "@/shared/components/ui/button"
import { Loader2, PlusIcon } from "lucide-react"
import { useCallback, useState } from "react"
import { useNavigate } from "react-router-dom";
import { useGroupedSessionByDate } from "../hooks/UseGroupedSession";
import GroupedSessionCard from "../components/card/GroupedSessionCard";
import type { TGroupedSession, TSessionGroupedSession } from "../types/GroupedSessionTypes";
import { EnumFilterOperator } from "@/shared/enums/EnumFilterOperator";
import { Skeleton } from "@/shared/components/skeleton";

export default function AgendaScreen() {
  const [
    currentDate,
    setCurrentDate
  ] = useState(new Date())

  const navigate = useNavigate();

  const handleCurrentDate = useCallback((date: Date) => {
    setCurrentDate(date);
  }, [setCurrentDate]);

  const {
    groupedSessions,
    isLoading,
    filters,
    setFilters
  } = useGroupedSessionByDate();

  const handleEdit = useCallback((session: TSessionGroupedSession) => {
    navigate(`/sessions/edit/${session.id}`);
  }, [navigate]);

  const handleMembers = useCallback((session: TSessionGroupedSession) => {
    navigate(`/sessions/details/${session.id}`);
  }, [navigate]);

  const handleFilterDateChange = useCallback((initialDate: Date, finalDate: Date) => {
    setFilters([{
      field: 'sessionDate',
      operator: EnumFilterOperator.GreaterThanOrEquals,
      value: initialDate
    }, {
      field: 'sessionDate',
      operator: EnumFilterOperator.LessThanOrEquals,
      value: finalDate
    }, ...filters]);
  }, [setFilters]);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-row justify-between items-center p-4 mb-2">
        <div className="flex flex-col gap-1 flex-1">
          <p className="text-3xl font-bold">
            Agenda
          </p>

          <span className="text-muted-foreground">
            12 aulas
          </span>
        </div>

        <Button
          variant="outline"
          className="aspect-square"
          onClick={() => navigate("/sessions/create")}
        >
          <PlusIcon className="opacity-60" size={16} aria-hidden="true" />
          <span>Novo</span>
        </Button>
      </div>

      <AgendaLoader
        currentDate={currentDate}
        setCurrentDate={handleCurrentDate}
        groupedSessions={groupedSessions}
        handleEdit={handleEdit}
        handleMembers={handleMembers}
        isLoading={isLoading}
        onFilterDateChange={handleFilterDateChange}
      />
    </div>
  )
}

type AgendaLoaderProps = {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  groupedSessions: TGroupedSession[];
  handleEdit: (session: TSessionGroupedSession) => void;
  handleMembers: (session: TSessionGroupedSession) => void;
  onFilterDateChange: (initialDate: Date, finalDate: Date) => void;
  isLoading: boolean;
}

function AgendaLoader({ 
  currentDate, 
  setCurrentDate, 
  groupedSessions, 
  handleEdit, 
  handleMembers, 
  onFilterDateChange, 
  isLoading 
}: AgendaLoaderProps) {
  return (
    <AgendaCalendar
      className="flex-1"
      currentDate={currentDate}
      setCurrentDate={setCurrentDate}
      onFilterDateChange={onFilterDateChange}
    >
      {groupedSessions.map(group => (
        <GroupedSessionCard
          key={group.sessionDate.toISOString()}
          group={group}
          onClickEdit={handleEdit}
          onClickMembers={handleMembers}
          className="mb-2"
        />
      ))}

      {isLoading && Array.from({ length: 10 }).map((_, index) => (
        <div className="p-4 mb-2">
          <Skeleton key={index} className="h-50 rounded-lg" />
        </div>
      ))}
    </AgendaCalendar>
  )
}