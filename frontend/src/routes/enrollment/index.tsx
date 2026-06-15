import { createFileRoute } from "@tanstack/react-router";
import { startOfWeek, format } from "date-fns";
import { es } from "date-fns/locale";
import { Check, ChevronDown, Circle, Clock, RefreshCw } from "lucide-react";
import { useState, useRef, useMemo, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import Calendar from "@/components/calendar/calendar";
import type { CalendarEvent, Mode } from "@/components/calendar/calendar-types";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { sessionToEvent } from "@/lib/calendar-utils";
import {
  getStudentScheduleEvents,
  studentEnrollmentCourses,
  studentProfile,
} from "@/lib/student-data";

const COURSE_COLORS: Record<string, string> = {
  CI1230: "blue",
  SE1221: "emerald",
  CS3401: "violet",
  IC4810: "orange",
  IC5701: "fuchsia",
  IC6831: "red",
  MA3405: "yellow",
};

const enrollmentAppointment = {
  hasAppointment: true,
  startTime: new Date(2026, 1, 12, 9, 50),
  endTime: new Date(2026, 1, 12, 10, 50),
  approvedCredits: 14,
  failedCredits: 0,
  weightedAverage: 84.286,
};

function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

function getScheduleConflict(
  group: CourseGroup,
  courseId: string,
  selectedGroups: Record<string, string>,
) {
  for (const otherCourse of courses) {
    if (otherCourse.id === courseId) continue;

    const otherGroupId = selectedGroups[otherCourse.id];
    if (!otherGroupId) continue;

    const otherGroup = otherCourse.groups.find((g) => g.id === otherGroupId);
    if (!otherGroup) continue;

    for (const m1 of group.meetings) {
      for (const m2 of otherGroup.meetings) {
        if (m1.weekday === m2.weekday) {
          const start1 = timeToMinutes(m1.starts_at);
          const end1 = timeToMinutes(m1.ends_at);
          const start2 = timeToMinutes(m2.starts_at);
          const end2 = timeToMinutes(m2.ends_at);

          if (start1 < end2 && start2 < end1) {
            return {
              courseCode: otherCourse.code,
              courseName: otherCourse.name,
              groupName: otherGroup.name,
            };
          }
        }
      }
    }
  }
  return null;
}

export const Route = createFileRoute("/enrollment/")({
  component: RouteComponent,
});

type CourseGroup = {
  id: string;
  name: string;
  groupType: string;
  campusName: string;
  meetings: Array<{
    weekday: number;
    starts_at: string;
    ends_at: string;
    classroom: string | null;
  }>;
  teacher: string;
  professors: string[];
  availableSeats: number;
  totalSeats: number;
  status: "Disponible" | "Pocos cupos" | "Lleno";
};

type Course = {
  id: string;
  code: string;
  name: string;
  credits: number;
  groups: CourseGroup[];
};

const courses: Course[] = studentEnrollmentCourses;

const initialSelectedGroups: Record<string, string> = Object.fromEntries(
  courses.flatMap((course) => {
    const selectedGroup = course.groups[0];
    return selectedGroup ? [[course.id, selectedGroup.id]] : [];
  }),
);

function RouteComponent() {
  return (
    <div className="flex h-[calc(100vh-3.5rem)] w-full flex-col max-md:h-auto max-md:min-h-0">
      <EnrollmentSections />
    </div>
  );
}

function EnrollmentSections() {
  const [selectedGroups, setSelectedGroups] = useState<Record<string, string>>(
    initialSelectedGroups,
  );

  const [calendarMode, setCalendarMode] = useState<Mode>("week");
  const [calendarDate, setCalendarDate] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );

  const events = useMemo(() => {
    const weekStart = calendarDate;
    return courses.flatMap((course) => {
      const selectedGroupId = selectedGroups[course.id];
      if (!selectedGroupId) return [];
      const group = course.groups.find((g) => g.id === selectedGroupId);
      if (!group) return [];

      return group.meetings.map((meeting) =>
        sessionToEvent({
          session: meeting,
          courseId: course.id,
          courseCode: course.code,
          courseName: course.name,
          groupCode: group.name,
          groupId: group.id,
          groupType: group.groupType,
          professors: group.professors,
          classroom: meeting.classroom,
          campusName: group.campusName,
          color: COURSE_COLORS[course.code] ?? "blue",
          weekStart,
        }),
      );
    });
  }, [selectedGroups, calendarDate]);

  function handleSelectGroup(courseId: string, group: CourseGroup) {
    setSelectedGroups((current) => {
      const isSelected = current[courseId] === group.id;
      if (isSelected) {
        const copy = { ...current };
        delete copy[courseId];
        return copy;
      }
      return {
        ...current,
        [courseId]: group.id,
      };
    });
  }

  return (
    <TooltipProvider delay={150}>
      {/* Desktop: horizontal split */}
      <div className="hidden md:flex min-h-0 flex-1 w-full">
        <ResizablePanelGroup
          orientation="horizontal"
          className="min-h-0 flex-1 w-full bg-background"
        >
          <ResizablePanel defaultSize="60%" minSize="30%">
            <CoursesPanel
              selectedGroups={selectedGroups}
              initialSelectedGroups={initialSelectedGroups}
              onSelectGroup={handleSelectGroup}
            />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize="40%" minSize="40%">
            <CalendarPanel
              events={events}
              setEvents={() => {}}
              calendarMode={calendarMode}
              setCalendarMode={setCalendarMode}
              calendarDate={calendarDate}
              setCalendarDate={setCalendarDate}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Mobile: courses on top, calendar below */}
      <div className="flex md:hidden flex-col w-full bg-background">
        <CoursesPanel
          selectedGroups={selectedGroups}
          initialSelectedGroups={initialSelectedGroups}
          onSelectGroup={handleSelectGroup}
          hideFooter
        />
        <div className="border-t">
          <CalendarPanel
            events={events}
            setEvents={() => {}}
            calendarMode={calendarMode}
            setCalendarMode={setCalendarMode}
            calendarDate={calendarDate}
            setCalendarDate={setCalendarDate}
          />
        </div>
      </div>
    </TooltipProvider>
  );
}

function AppointmentStatusBadge() {
  const now = new Date();
  const appointment = enrollmentAppointment;

  let status: "in" | "out" | "none";
  if (!appointment.hasAppointment) {
    status = "none";
  } else if (now >= appointment.startTime && now <= appointment.endTime) {
    status = "in";
  } else {
    status = "out";
  }

  const [dialogOpen, setDialogOpen] = useState(false);

  const config = {
    in: {
      label: (
        <>
          <span className="hidden sm:inline">Está en su cita de matrícula</span>
          <span className="sm:hidden">En cita</span>
        </>
      ),
      dotClass: "bg-emerald-500",
      badgeClass:
        "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/15",
    },
    out: {
      label: (
        <>
          <span className="hidden sm:inline">No está en su cita de matrícula</span>
          <span className="sm:hidden">Fuera de cita</span>
        </>
      ),
      dotClass: "bg-red-500",
      badgeClass:
        "bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/15",
    },
    none: {
      label: (
        <>
          <span className="hidden sm:inline">No hay cita asignada</span>
          <span className="sm:hidden">Sin cita</span>
        </>
      ),
      dotClass: "bg-amber-500",
      badgeClass:
        "bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/15",
    },
  };

  const { label, dotClass, badgeClass } = config[status];

  return (
    <>
      <button
        type="button"
        onClick={() => setDialogOpen(true)}
        className={cn(
          "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
          badgeClass,
        )}
      >
        <span className={cn("size-1.5 shrink-0 rounded-full", dotClass)} />
        {label}
      </button>

      <AppointmentInfoModal open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}

function AppointmentInfoModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className="max-h-[85vh] overflow-y-auto"
          showCloseButton
        >
          <SheetHeader>
            <SheetTitle>
              ¿Cómo se calcula la cita de matrícula?
            </SheetTitle>
          </SheetHeader>
          <div className="px-4 pb-4">
            <AppointmentInfoContent />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl" showCloseButton>
        <DialogHeader>
          <DialogTitle>
            ¿Cómo se calcula la cita de matrícula?
          </DialogTitle>
        </DialogHeader>
        <AppointmentInfoContent />
      </DialogContent>
    </Dialog>
  );
}

function AppointmentInfoContent() {
  const appointment = enrollmentAppointment;

  return (
    <div className="flex flex-col gap-3 text-sm text-muted-foreground">
      <div className="flex flex-col gap-3">
        <p>
          <strong className="text-foreground">Paso 1:</strong> La cita de
          matrícula se asigna según el Artículo 35 del Reglamento de Enseñanza
          Aprendizaje, su publicación y/o apelación a la misma se realiza según
          las fechas indicadas en el Calendario Académico e Institucional.
        </p>

        <p>
          <strong className="text-foreground">Paso 2:</strong> Se obtiene la
          diferencia entre créditos aprobados y reprobados.
        </p>
        <p className="text-center font-mono text-xs text-foreground">
          Créditos aprobados − Créditos reprobados = Diferencia de créditos
        </p>

        <p>
          <strong className="text-foreground">Paso 3:</strong> Se realiza el
          ordenamiento de mayor a menor de acuerdo a la diferencia de créditos
          obtenida en el Paso 2.
        </p>

        <p>
          <strong className="text-foreground">Paso 4:</strong> En caso de
          existir igualdad en la diferencia de créditos se considera para el
          ordenamiento el mayor promedio ponderado del periodo.
        </p>
        <p className="text-center font-mono text-xs text-foreground">
          Σ Nota × Créditos / Total de créditos = Promedio ponderado
        </p>

        <p>
          <strong className="text-foreground">Paso 5:</strong> En caso de
          existir empate en el promedio ponderado del periodo, el criterio de
          asignación será:
        </p>
        <ol className="list-inside list-decimal space-y-0.5 text-xs text-foreground">
          <li>Mayor número de créditos ganados</li>
          <li>Menor número de créditos perdidos</li>
          <li>Azar</li>
        </ol>
      </div>

      <Card>
        <CardContent className="space-y-3">
          <p className="text-sm font-semibold text-foreground">
            Información utilizada para calcular su cita de matrícula
          </p>
          <div className="flex items-center justify-between gap-4">
            <ul className="list-disc space-y-1 pl-4 text-xs text-muted-foreground">
              <li>
                Créditos aprobados:{" "}
                <strong className="text-foreground">
                  {appointment.approvedCredits}
                </strong>
              </li>
              <li>
                Créditos reprobados:{" "}
                <strong className="text-foreground">
                  {appointment.failedCredits}
                </strong>
              </li>
              <li>
                Promedio ponderado:{" "}
                <strong className="text-foreground">
                  {appointment.weightedAverage}
                </strong>
              </li>
            </ul>
            <div className="shrink-0 text-center">
              <p className="text-xs text-muted-foreground">Tu cita es</p>
              <p className="text-lg font-bold text-foreground">
                {format(appointment.startTime, "d MMM yyyy HH:mm", {
                  locale: es,
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CoursesPanel({
  selectedGroups,
  initialSelectedGroups,
  onSelectGroup,
  hideFooter,
}: {
  selectedGroups: Record<string, string>;
  initialSelectedGroups: Record<string, string>;
  onSelectGroup: (courseId: string, group: CourseGroup) => void;
  hideFooter?: boolean;
}) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const selectedCredits = courses.reduce((total, course) => {
    return selectedGroups[course.id] ? total + course.credits : total;
  }, 0);

  return (
    <div className="flex h-full min-h-0 flex-col max-md:h-auto">
      <div className="flex h-[33px] shrink-0 items-center justify-between gap-3 border-b bg-background px-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="size-3.5 shrink-0" />
          <span className="font-mono tabular-nums">
            {format(currentTime, "d/M/yyyy HH:mm:ss")}
          </span>
        </div>
        <AppointmentStatusBadge />
      </div>

      <div className="min-h-0 flex-1 bg-background px-0 py-0 max-md:flex-none">
        <ScrollArea className="h-full max-md:overflow-visible max-md:h-auto">
          <div className="divide-y divide-border">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                selectedGroupId={selectedGroups[course.id]}
                selectedGroups={selectedGroups}
                initialSelectedGroups={initialSelectedGroups}
                onSelectGroup={onSelectGroup}
              />
            ))}
          </div>
        </ScrollArea>
      </div>

      {!hideFooter && (
        <div className="grid grid-cols-2 gap-4 border-t bg-background px-4 py-4">
          <div className="flex flex-col space-y-0.5">
            <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
              Créditos seleccionados
            </p>
            <p className="text-2xl font-bold tracking-tight text-foreground">
              {selectedCredits}
            </p>
          </div>

          <div className="flex flex-col space-y-0.5">
            <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
              Cursos seleccionados
            </p>
            <p className="text-2xl font-bold tracking-tight text-foreground">
              {Object.keys(selectedGroups).length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function CourseCard({
  course,
  selectedGroupId,
  selectedGroups,
  initialSelectedGroups,
  onSelectGroup,
}: {
  course: Course;
  selectedGroupId?: string;
  selectedGroups: Record<string, string>;
  initialSelectedGroups: Record<string, string>;
  onSelectGroup: (courseId: string, group: CourseGroup) => void;
}) {
  return (
    <Collapsible defaultOpen={course.code === courses[0]?.code}>
      <div>
        <CollapsibleTrigger
          className={cn(
            "group flex w-full items-center gap-3 bg-transparent px-4 py-3 text-left transition-colors hover:bg-muted/40",
          )}
        >
          <Badge variant="secondary" className="font-mono">
            {course.code}
          </Badge>
          <h3 className="min-w-0 flex-1 truncate font-semibold">
            {course.name}
          </h3>
          <Badge variant="outline">{course.credits} créditos</Badge>
          <ChevronDown className="size-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </CollapsibleTrigger>

        <CollapsibleContent className="px-0 pb-0 pt-0">
          <ScrollArea className="w-full">
            <Table containerClassName="!overflow-x-visible">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px] min-w-[120px] max-w-[200px] align-middle text-xs">
                    Sede
                  </TableHead>
                  <TableHead className="w-[70px] min-w-[70px] text-center align-middle text-xs">
                    Grupo
                  </TableHead>
                  <TableHead className="w-[210px] min-w-[210px] align-middle text-xs">
                    Horario
                  </TableHead>
                  <TableHead className="w-[240px] min-w-[240px] align-middle text-xs">
                    Profesor(es)
                  </TableHead>
                  {/* <TableHead className="align-middle">Aula</TableHead> */}
                  {/* El aula estará en cada linea del Horario*/}
                  <TableHead className="w-[100px] min-w-[100px] align-middle text-xs">
                    Modalidad
                  </TableHead>
                  <TableHead className="w-[90px] min-w-[90px] text-center align-middle text-xs">
                    <span className="inline-flex items-center justify-center gap-1.5">
                      Cupos
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-6"
                        aria-label="Actualizar cupos"
                      >
                        <RefreshCw className="size-3.5" />
                      </Button>
                    </span>
                  </TableHead>
                  <TableHead className="w-[50px] min-w-[50px] align-middle"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {course.groups.map((group) => {
                  const isSelected = selectedGroupId === group.id;
                  const wasInitiallySelected =
                    initialSelectedGroups[course.id] === group.id;

                  let dynamicAvailableSeats = group.availableSeats;
                  if (isSelected && !wasInitiallySelected) {
                    dynamicAvailableSeats = Math.max(
                      0,
                      group.availableSeats - 1,
                    );
                  } else if (!isSelected && wasInitiallySelected) {
                    dynamicAvailableSeats = group.availableSeats + 1;
                  }

                  let dynamicStatus: "Disponible" | "Pocos cupos" | "Lleno" =
                    "Disponible";
                  if (dynamicAvailableSeats <= 0) {
                    dynamicStatus = "Lleno";
                  } else if (dynamicAvailableSeats <= 5) {
                    dynamicStatus = "Pocos cupos";
                  }

                  const conflict = getScheduleConflict(
                    group,
                    course.id,
                    selectedGroups,
                  );
                  const hasConflict = conflict != null;
                  const isButtonDisabled =
                    (dynamicAvailableSeats <= 0 && !isSelected) || hasConflict;

                  const rowCells = (
                    <>
                      <TableCell className="w-[180px] min-w-[120px] max-w-[200px] align-middle text-xs font-mono font-medium text-muted-foreground whitespace-normal">
                        <TruncatedTooltip
                          text={group.campusName.toUpperCase()}
                        />
                      </TableCell>

                      <TableCell className="w-[70px] min-w-[70px] align-middle text-center text-xs font-mono font-medium text-muted-foreground">
                        {group.name.padStart(2, "0").toUpperCase()}
                      </TableCell>

                      <TableCell className="w-[210px] min-w-[210px] align-middle text-xs font-mono font-medium text-muted-foreground">
                        <div className="space-y-1 leading-tight">
                          {group.meetings.map((meeting) => (
                            <div
                              key={`${group.id}-${meeting.weekday}-${meeting.starts_at}`}
                            >
                              {formatWeekday(meeting.weekday)}{" "}
                              {formatTimeRange(meeting)}
                              {meeting.classroom != null &&
                                meeting.classroom !== "" && (
                                  <>
                                    {" "}
                                    <span className="inline-flex items-center gap-1.5">
                                      {meeting.classroom.toUpperCase()}
                                    </span>
                                  </>
                                )}
                            </div>
                          ))}
                        </div>
                      </TableCell>

                      <TableCell className="w-[240px] min-w-[240px] align-middle text-xs font-mono font-medium text-muted-foreground">
                        <div className="space-y-1 leading-tight">
                          {group.professors.map((professor) => (
                            <div key={professor}>{professor.toUpperCase()}</div>
                          ))}
                        </div>
                      </TableCell>

                      <TableCell className="w-[100px] min-w-[100px] align-middle text-xs font-mono font-medium text-muted-foreground">
                        <div className="leading-tight">
                          {group.groupType.toUpperCase()}
                        </div>
                      </TableCell>

                      <TableCell className="w-[90px] min-w-[90px] align-middle text-center text-xs font-mono font-medium">
                        <div className="mx-auto flex flex-col items-center gap-0.5 leading-tight">
                          <div className="leading-tight">
                            {String(dynamicAvailableSeats).padStart(2, "0")} /{" "}
                            {String(group.totalSeats).padStart(2, "0")}
                          </div>
                          <div
                            className={cn(
                              "leading-none",
                              getSeatStatusClass(dynamicStatus),
                            )}
                          >
                            {dynamicStatus.toUpperCase()}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="w-[50px] min-w-[50px] align-middle text-right">
                        <GroupSelectionButton
                          selected={isSelected}
                          disabled={isButtonDisabled}
                          onClick={() => onSelectGroup(course.id, group)}
                        />
                      </TableCell>
                    </>
                  );

                  return hasConflict ? (
                    <Tooltip key={group.id}>
                      <TooltipTrigger
                        render={
                          <TableRow className="opacity-40 bg-muted/10">
                            {rowCells}
                          </TableRow>
                        }
                      />
                      <TooltipContent side="top">
                        Choque de horario con {conflict.courseCode}:{" "}
                        {conflict.courseName} GR{" "}
                        {conflict.groupName.padStart(2, "0")}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <TableRow key={group.id}>{rowCells}</TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

function TruncatedTooltip({ text }: { text: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const checkTruncation = () => {
    const el = containerRef.current;
    if (el) {
      // Al usar line-clamp-2 (multilínea), revisamos el desbordamiento vertical
      const truncated = el.scrollHeight > el.clientHeight;
      if (truncated) {
        setOpen(true);
      }
    }
  };

  const handleMouseLeave = () => {
    setOpen(false);
  };

  return (
    <Tooltip
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) {
          setOpen(false);
        }
      }}
    >
      <TooltipTrigger
        render={
          <div
            ref={containerRef}
            onMouseEnter={checkTruncation}
            onMouseLeave={handleMouseLeave}
            className="w-full line-clamp-2 cursor-default whitespace-normal break-words"
          >
            {text}
          </div>
        }
      />
      <TooltipContent side="top">{text}</TooltipContent>
    </Tooltip>
  );
}

function GroupSelectionButton({
  selected,
  disabled,
  onClick,
}: {
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      size="icon"
      variant="outline"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "size-8 rounded-full border",
        selected &&
          "!border-green-600 !bg-green-600 !text-white hover:!bg-green-700 hover:!text-white",
        !selected && "text-muted-foreground",
      )}
    >
      {selected ? <Check className="size-4" /> : <Circle className="size-4" />}
    </Button>
  );
}

function formatWeekday(weekday: number) {
  const labels: Record<number, string> = {
    0: "D",
    1: "L",
    2: "K",
    3: "M",
    4: "J",
    5: "V",
    6: "S",
  };

  return labels[weekday] ?? String(weekday);
}

function formatTimeRange(meeting: CourseGroup["meetings"][number]) {
  return `${meeting.starts_at.slice(0, 5)} - ${meeting.ends_at.slice(0, 5)}`;
}

function getSeatStatusClass(status: CourseGroup["status"]) {
  if (status === "Disponible") return "text-emerald-600 dark:text-emerald-400";
  if (status === "Pocos cupos") return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

function CalendarPanel({
  events,
  setEvents,
  calendarMode,
  setCalendarMode,
  calendarDate,
  setCalendarDate,
}: {
  events: CalendarEvent[];
  setEvents: (events: CalendarEvent[]) => void;
  calendarMode: Mode;
  setCalendarMode: (mode: Mode) => void;
  calendarDate: Date;
  setCalendarDate: (date: Date) => void;
}) {
  return (
    <ScrollArea className="h-full w-full min-h-0">
      <Calendar
        events={events}
        setEvents={setEvents}
        mode={calendarMode}
        setMode={setCalendarMode}
        date={calendarDate}
        setDate={setCalendarDate}
        calendarIconIsToday={false}
        hourHeight={64}
        dayWidth={150}
      />
    </ScrollArea>
  );
}
