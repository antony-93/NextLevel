import { AgendaCalendar, AgendaDaysToShow } from "@/shared/components/agenda"
import { useCallback, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";
import { useGroupedSessionByDate } from "../hooks/UseGroupedSessionApi";
import GroupedSessionCard from "../components/card/GroupedSessionCard";
import { EnumFilterOperator } from "@/shared/enums/EnumFilterOperator";
import { Skeleton } from "@/shared/components/skeleton";
import { addDays } from "date-fns";
import { NewButton } from "@/shared/components/button";

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


  const handleSetCurrentDate = useCallback((date: Date) => {
    const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours());

    setCurrentDate(normalizedDate)

    const formatedFilters = filters.filter(filter => filter.field !== 'sessionDate'),
      finalDate = addDays(normalizedDate, AgendaDaysToShow);

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
    <div className="flex flex-col h-full">
      <div className="p-4 w-full flex flex-row justify-between items-center">
          <div className="flex flex-col gap-1 flex-1">
            <p className="text-3xl font-bold">
              Agenda
            </p>

            <span className="text-muted-foreground">
              {groupedSessions.length} aulas
            </span>
          </div>

          <NewButton
            onClick={() => navigate("/sessions/create")}
          >
          </NewButton>
      </div>

      <div className="w-full md:p-4 flex-1">
        <AgendaCalendar
          className="flex-1 h-full"
          currentDate={currentDate}
          setCurrentDate={handleSetCurrentDate}
        >
          {groupedSessions.map(group => (
            <GroupedSessionCard
              key={group.sessionDate.toISOString()}
              group={group}
              onClickEdit={session => navigate(`/sessions/edit/${session.id}`)}
              onClickMembers={session => navigate(`/sessions/details/${session.id}`)}
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
    </div>
  )
}