import { AgendaCalendar, AgendaDaysToShow } from "@/shared/components/agenda"
import { Button } from "@/shared/components/ui/button"
import { PlusIcon } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";
import { useGroupedSessionByDate } from "../hooks/UseGroupedSession";
import GroupedSessionCard from "../components/card/GroupedSessionCard";
import type { TSessionGroupedSession } from "../types/GroupedSessionTypes";
import { EnumFilterOperator } from "@/shared/enums/EnumFilterOperator";
import { Skeleton } from "@/shared/components/skeleton";
import { addDays } from "date-fns";

export default function AgendaScreen() {
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours());
});

  const navigate = useNavigate();

  const {
    groupedSessions,
    isLoading,
    filters,
    setFilters,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    pageSize
  } = useGroupedSessionByDate({
    filters: [
      {
        field: 'sessionDate',
        operator: EnumFilterOperator.GreaterThanOrEquals,
        value: currentDate
      },
      {
        field: 'sessionDate',
        operator: EnumFilterOperator.LessThanOrEquals,
        value: addDays(currentDate, AgendaDaysToShow - 1)
      }
    ]
  });

  const handleEdit = useCallback((session: TSessionGroupedSession) => {
    navigate(`/sessions/edit/${session.id}`);
  }, [navigate]);

  const handleMembers = useCallback((session: TSessionGroupedSession) => {
    navigate(`/sessions/details/${session.id}`);
  }, [navigate]);

  const handleSetCurrentDate = useCallback((date: Date) => {
    const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours());

    setCurrentDate(normalizedDate)

    const formatedFilters = filters.filter(filter => filter.field !== 'sessionDate'),
      finalDate = addDays(normalizedDate, AgendaDaysToShow);

    console.log(normalizedDate, finalDate);

    setFilters([{
      field: 'sessionDate',
      operator: EnumFilterOperator.GreaterThanOrEquals,
      value: normalizedDate
    }, {
      field: 'sessionDate',
      operator: EnumFilterOperator.LessThanOrEquals,
      value: finalDate
    }, ...formatedFilters]);
  }, [setFilters]);

  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasNextPage) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchNextPage();
      }
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [fetchNextPage, hasNextPage]);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-row justify-between items-center p-4 mb-2">
        <div className="flex flex-col gap-1 flex-1">
          <p className="text-3xl font-bold">
            Agenda
          </p>

          <span className="text-muted-foreground">
            {groupedSessions.length} aulas
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

      <AgendaCalendar
        className="flex-1"
        currentDate={currentDate}
        setCurrentDate={handleSetCurrentDate}
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

        {(isLoading || isFetchingNextPage) && Array.from({ length: pageSize }).map((_, index) => (
          <div className="p-4 mb-2" key={index} >
            <Skeleton className="h-50 rounded-lg" />
          </div>
        ))}

        <div ref={loaderRef} className="h-10"></div>
      </AgendaCalendar>
    </div>
  )
}