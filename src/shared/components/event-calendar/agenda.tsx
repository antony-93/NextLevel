"use client"

import { useMemo } from "react"
import { RiCalendarCheckLine } from "@remixicon/react"
import {
  addDays,
  format,
  isSameMonth,
} from "date-fns"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Filter,
} from "lucide-react"

import { cn } from "@/shared/utils/utils"
import { Button } from "@/shared/components/ui/button"
import { AgendaDaysToShow, EventGap, EventHeight, WeekCellsHeight } from "./constants"

export interface AgendaProps {
  filterButtonTitle?: string
  className?: string
  children?: React.ReactNode
  currentDate: Date
  onClickFilterButton?: () => void
  setCurrentDate: (date: Date) => void
  onFilterDateChange?: (initialDate: Date, finalDate: Date) => void
}

export function AgendaCalendar({
  filterButtonTitle = "Filtro",
  className,
  children,
  currentDate = new Date(),
  onClickFilterButton,
  setCurrentDate
}: AgendaProps) {

  const handlePrevious = () => {
    setCurrentDate(addDays(currentDate, -AgendaDaysToShow))
  }

  const handleNext = () => {
    setCurrentDate(addDays(currentDate, AgendaDaysToShow))
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const viewTitle = useMemo(() => {
    const start = currentDate,
      end = addDays(currentDate, AgendaDaysToShow - 1)

    if (isSameMonth(start, end)) {
      return format(start, "MMMM yyyy")
    } else {
      return `${format(start, "MMM")} - ${format(end, "MMM yyyy")}`
    }
  }, [currentDate])

  return (
    <div
      className={cn("flex flex-col md:rounded-lg md:border h-full has-data-[slot=month-view]:flex-1", className)}
      style={
        {
          "--event-height": `${EventHeight}px`,
          "--event-gap": `${EventGap}px`,
          "--week-cells-height": `${WeekCellsHeight}px`,
        } as React.CSSProperties
      }
    >
      <div
        className={cn(
          "flex items-center justify-between p-2 sm:p-4 w-full md:border-b md:border-t-0 border-y border-gray-200",
        )}
      >
        <Button
          variant="outline"
          className="max-[479px]:aspect-square max-[479px]:p-0!"
          onClick={handleToday}
        >
          <RiCalendarCheckLine
            className="min-[480px]:hidden"
            size={16}
            aria-hidden="true"
          />
          <span className="max-[479px]:sr-only">Hoje</span>
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevious}
            aria-label="Previous"
          >
            <ChevronLeftIcon size={16} aria-hidden="true" />
          </Button>

          <h2 className="text-sm font-semibold sm:text-lg md:text-xl">
            {viewTitle}
          </h2>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            aria-label="Next"
          >
            <ChevronRightIcon size={16} aria-hidden="true" />
          </Button>
        </div>

        <Button
          className="max-[479px]:aspect-square max-[479px]:p-0!"
          variant="outline"
          onClick={onClickFilterButton}
        >
          <Filter
            className="opacity-60 sm:-ms-1"
            size={16}
            aria-hidden="true"
          />
          <span className="max-sm:sr-only">{filterButtonTitle}</span>
        </Button>
      </div>

      <div className="flex flex-1 flex-col">
        {children}
      </div>
    </div>
  )
}
