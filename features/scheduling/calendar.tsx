"use client"

import * as React from "react"
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar"
import { format, parse, startOfWeek, getDay } from "date-fns"
import { enUS, es, ptBR } from "date-fns/locale"
import { withDragAndDrop } from "react-big-calendar/lib/addons/dragAndDrop"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

import type { ScheduleEvent } from "@/features/scheduling/types"
import { cn } from "@/lib/utils"

const locales = {
  "en-US": enUS,
  "es-ES": es,
  "pt-BR": ptBR,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

const DragAndDropCalendar = withDragAndDrop(Calendar)

const messagesByLocale = {
  "pt-BR": {
    next: "Próximo",
    previous: "Anterior",
    today: "Hoje",
    month: "Mês",
    week: "Semana",
    day: "Dia",
  },
  "en-US": {
    next: "Next",
    previous: "Previous",
    today: "Today",
    month: "Month",
    week: "Week",
    day: "Day",
  },
  "es-ES": {
    next: "Siguiente",
    previous: "Anterior",
    today: "Hoy",
    month: "Mes",
    week: "Semana",
    day: "Día",
  },
}

export function SchedulingCalendar({
  locale,
  events,
}: {
  locale: "pt-BR" | "en-US" | "es-ES"
  events: ScheduleEvent[]
}) {
  const [items, setItems] = React.useState(events)

  const handleEventDrop = React.useCallback(
    ({ event, start, end }: { event: ScheduleEvent; start: Date; end: Date }) => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === event.id ? { ...item, start, end } : item
        )
      )
    },
    []
  )

  const handleEventResize = React.useCallback(
    ({ event, start, end }: { event: ScheduleEvent; start: Date; end: Date }) => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === event.id ? { ...item, start, end } : item
        )
      )
    },
    []
  )

  return (
    <div className={cn("rounded-lg border bg-card p-4")}>
      <DndProvider backend={HTML5Backend}>
        <DragAndDropCalendar
          localizer={localizer}
          events={items}
          defaultView={Views.WEEK}
          views={[Views.DAY, Views.WEEK, Views.MONTH]}
          step={30}
          timeslots={2}
          style={{ height: 680 }}
          messages={messagesByLocale[locale]}
          culture={locale}
          onEventDrop={handleEventDrop}
          onEventResize={handleEventResize}
          resizable
          popup
        />
      </DndProvider>
    </div>
  )
}
