import { useCallback, useLayoutEffect, useRef, useState } from "react"
import {
  BellIcon,
  Calendar,
  ClipboardCheck,
  FileText,
  Newspaper,
  Trash2,
  Users,
  XIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

const tabs = [
  { value: "noticias", label: "Noticias", icon: Newspaper },
  { value: "evaluaciones", label: "Evaluaciones", icon: ClipboardCheck },
  { value: "calendario", label: "Calendario", icon: Calendar },
  { value: "social", label: "Social", icon: Users },
  { value: "documentos", label: "Documentos", icon: FileText },
] as const

const emptyMessages: Record<string, string> = {
  noticias: "No hay noticias nuevas",
  evaluaciones: "No hay evaluaciones pendientes",
  calendario: "No hay eventos en el calendario",
  social: "No hay actividad social",
  documentos: "No hay documentos nuevos",
}

type NotificationItem = {
  id: string
  title: string
  group?: string
  description: string
  date: string
  time: string
  seen: boolean
}

const initialNotifications: Record<string, NotificationItem[]> = {
  noticias: [
    {
      id: "not-1",
      title: "Inglés I",
      group: "07",
      description: "Hay una nueva noticia en el curso.",
      date: "01/06/2026",
      time: "09:15 AM",
      seen: false,
    },
    {
      id: "not-2",
      title: "Lenguajes de programación",
      group: "02",
      description: "Hay una nueva noticia en el curso.",
      date: "31/05/2026",
      time: "07:40 PM",
      seen: true,
    },
    {
      id: "not-3",
      title: "Bases de datos II",
      group: "02",
      description: "Hay una nueva noticia en el curso.",
      date: "31/05/2026",
      time: "04:10 PM",
      seen: false,
    },
    {
      id: "not-4",
      title: "Comunidades IC Cartago",
      description: "Hay una nueva noticia en la comunidad.",
      date: "30/05/2026",
      time: "08:25 PM",
      seen: true,
    },
  ],
  evaluaciones: [
    {
      id: "eva-1",
      title: "Calificación actualizada",
      description: "Tu nota de Examen parcial 1 fue actualizada por el profesor.",
      date: "30/05/2026",
      time: "10:05 AM",
      seen: false,
    },
    {
      id: "eva-2",
      title: "Entrega próxima",
      description: "La fecha límite de Tarea 3 es hoy a las 11:59 PM.",
      date: "01/06/2026",
      time: "08:05 AM",
      seen: false,
    },
    {
      id: "eva-3",
      title: "Retroalimentación disponible",
      description: "Se adjuntaron archivos de retroalimentación en Tarea 2.",
      date: "29/05/2026",
      time: "06:50 PM",
      seen: true,
    },
  ],
  calendario: [
    {
      id: "cal-1",
      title: "Evento próximo",
      description: "Tienes una actividad programada para hoy a las 6:00 PM.",
      date: "01/06/2026",
      time: "11:20 AM",
      seen: true,
    },
    {
      id: "cal-2",
      title: "Evento reprogramado",
      description: "La tutoría de mañana cambió para las 5:30 PM.",
      date: "31/05/2026",
      time: "01:12 PM",
      seen: false,
    },
    {
      id: "cal-3",
      title: "Recordatorio de reunión",
      description: "Reunión de equipo hoy en sala virtual a las 7:00 PM.",
      date: "01/06/2026",
      time: "03:40 PM",
      seen: false,
    },
  ],
  social: [
    {
      id: "soc-1",
      title: "Nuevo mensaje del grupo",
      description: "Recibiste un mensaje en el grupo del proyecto final.",
      date: "01/06/2026",
      time: "08:32 AM",
      seen: false,
    },
    {
      id: "soc-2",
      title: "Nueva respuesta en foro",
      description: "Alguien respondió tu comentario en el foro de dudas.",
      date: "31/05/2026",
      time: "09:22 PM",
      seen: true,
    },
    {
      id: "soc-3",
      title: "Solicitud de unión",
      description: "Un compañero solicitó unirse a tu grupo de proyecto.",
      date: "30/05/2026",
      time: "05:15 PM",
      seen: false,
    },
  ],
  documentos: [
    {
      id: "doc-1",
      title: "Inglés I",
      group: "07",
      description: "Uno o más archivos han sido añadidos a los documentos del curso.",
      date: "29/05/2026",
      time: "04:55 PM",
      seen: true,
    },
    {
      id: "doc-2",
      title: "Compiladores e intérpretes",
      group: "01",
      description: "Uno o más archivos han sido añadidos a los documentos del curso.",
      date: "01/06/2026",
      time: "10:44 AM",
      seen: false,
    },
    {
      id: "doc-3",
      title: "Comunidad Estudiantes IC",
      description: "Uno o más archivos han sido añadidos a los documentos de la comunidad.",
      date: "31/05/2026",
      time: "12:28 PM",
      seen: false,
    },
  ],
}

function measureIndicator(
  tabsListEl: HTMLElement,
  wrapperEl: HTMLElement,
): { left: number; width: number } | null {
  const trigger = tabsListEl.querySelector<HTMLElement>(
    '[data-slot="tabs-trigger"][aria-selected="true"]',
  )
  if (!trigger) return null

  const wrapperRect = wrapperEl.getBoundingClientRect()
  const triggerRect = trigger.getBoundingClientRect()

  return {
    left: triggerRect.left - wrapperRect.left,
    width: triggerRect.width,
  }
}

export function NotificationsPopover() {
  const [activeTab, setActiveTab] = useState("noticias")
  const [notificationsByTab, setNotificationsByTab] = useState(initialNotifications)
  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: number
    width: number
  } | null>(null)
  const tabsListRef = useRef<HTMLDivElement>(null)
  const separatorWrapperRef = useRef<HTMLDivElement>(null)

  const tryMeasure = useCallback(() => {
    const tabsEl = tabsListRef.current
    const wrapperEl = separatorWrapperRef.current
    if (!tabsEl || !wrapperEl) return
    const pos = measureIndicator(tabsEl, wrapperEl)
    if (pos) setIndicatorStyle(pos)
  }, [])

  const tabsListCallbackRef = useCallback((node: HTMLDivElement | null) => {
    tabsListRef.current = node
  }, [])

  const separatorCallbackRef = useCallback((node: HTMLDivElement | null) => {
    separatorWrapperRef.current = node
    if (node && tabsListRef.current) {
      const pos = measureIndicator(tabsListRef.current, node)
      if (pos) setIndicatorStyle(pos)
    }
  }, [])

  useLayoutEffect(() => {
    tryMeasure()
  }, [activeTab, tryMeasure])

  useLayoutEffect(() => {
    const wrapper = separatorWrapperRef.current
    if (!wrapper) return

    const ro = new ResizeObserver(() => tryMeasure())
    ro.observe(wrapper)

    return () => ro.disconnect()
  }, [tryMeasure])

  const totalNotifications = Object.values(notificationsByTab).reduce(
    (acc, items) => acc + items.length,
    0,
  )

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="ghost" size="icon" aria-label="Notificaciones" className="relative overflow-visible">
            <span className="relative inline-flex overflow-visible">
              <BellIcon />
              {totalNotifications > 0 ? (
                <span className="absolute -right-1.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-0.5 text-[9px] font-semibold leading-none [font-variant-numeric:tabular-nums] text-primary-foreground">
                  {totalNotifications}
                </span>
              ) : null}
            </span>
          </Button>
        }
      />
      <PopoverContent align="end" sideOffset={8} className="w-[min(24rem,calc(100vw-1rem))] p-0">
        <div className="flex items-center justify-between px-[15px] pt-[15px]">
          <span className="text-sm font-semibold leading-none">Notificaciones</span>
          <Button
            variant="ghost"
            aria-label="Limpiar"
            className="h-auto w-auto p-0"
            onClick={() =>
              setNotificationsByTab((prev) => ({
                ...prev,
                [activeTab]: [],
              }))
            }
          >
            <Trash2 className="size-4" />
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v)} className="gap-0">
          <div
            ref={tabsListCallbackRef}
            className="overflow-x-auto overscroll-x-contain touch-pan-x pt-1.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="flex min-w-full justify-center">
              <div ref={separatorCallbackRef} className="relative w-max min-w-max px-[15px] pb-px">
                <TabsList variant="line" className="min-w-max justify-start">
                  {tabs.map(({ value, label, icon: Icon }) => (
                    <TabsTrigger key={value} value={value} className="flex-col gap-0.5 py-1.5">
                      <span className="relative inline-flex overflow-visible">
                        <Icon className="size-4" />
                        {notificationsByTab[value].length > 0 ? (
                          <span className="absolute -right-2 -top-1 grid h-3.5 min-w-3.5 place-items-center rounded-full bg-primary px-0.5 text-[8px] font-semibold leading-none [font-variant-numeric:tabular-nums] text-primary-foreground">
                            {notificationsByTab[value].length}
                          </span>
                        ) : null}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium">
                        <span>{label}</span>
                      </span>
                    </TabsTrigger>
                  ))}
                </TabsList>
                {indicatorStyle && (
                  <div
                    className="absolute bottom-0 h-0.5 bg-foreground transition-[left,width] duration-300 ease"
                    style={{
                      left: indicatorStyle.left,
                      width: indicatorStyle.width,
                    }}
                  />
                )}
              </div>
            </div>
          </div>
          <Separator />

          <ScrollArea className="h-64">
              {tabs.map(({ value }) => (
                <TabsContent key={value} value={value} className="m-0">
                  {notificationsByTab[value].length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-2 px-[15px] py-12 text-muted-foreground">
                      <BellIcon className="size-8" />
                      <p className="text-sm">{emptyMessages[value]}</p>
                    </div>
                  ) : (
                    <div>
                      {notificationsByTab[value].map((notification, index) => (
                        <article
                          key={notification.id}
                          className={
                            notification.seen
                              ? `relative px-[15px] py-2.5 pr-8 ${index < notificationsByTab[value].length - 1 ? "border-b border-border" : ""}`
                              : `relative bg-accent/40 px-[15px] py-2.5 pr-8 ${index < notificationsByTab[value].length - 1 ? "border-b border-border" : ""}`
                          }
                        >
                          <button
                            type="button"
                            className="absolute right-2 top-1.5 rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                            aria-label={`Quitar notificación ${notification.title}`}
                            onClick={() =>
                              setNotificationsByTab((prev) => ({
                                ...prev,
                                [value]: prev[value].filter((item) => item.id !== notification.id),
                              }))
                            }
                          >
                            <XIcon className="size-4" />
                          </button>
                          <div className="mb-1 flex items-center gap-2">
                            <p className="text-sm font-semibold leading-tight">{notification.title}</p>
                            {notification.group ? <Badge variant="secondary">{`Grupo ${notification.group}`}</Badge> : null}
                          </div>
                          <p className="text-sm text-muted-foreground">{notification.description}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {notification.date} {notification.time}
                          </p>
                        </article>
                      ))}
                    </div>
                  )}
                </TabsContent>
              ))}
            </ScrollArea>
        </Tabs>
      </PopoverContent>
    </Popover>
  )
}
