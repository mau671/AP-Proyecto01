import { createFileRoute } from "@tanstack/react-router";
import { startOfWeek } from "date-fns";
import {
  Check,
  ChevronDown,
  Circle,
  Filter,
  RefreshCw,
  Search,
} from "lucide-react";
import { useState, useRef, useMemo } from "react";
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
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
    <div className="flex h-[calc(100vh-3.5rem)] w-full flex-col">
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
    </TooltipProvider>
  );
}

function CoursesPanel({
  selectedGroups,
  initialSelectedGroups,
  onSelectGroup,
}: {
  selectedGroups: Record<string, string>;
  initialSelectedGroups: Record<string, string>;
  onSelectGroup: (courseId: string, group: CourseGroup) => void;
}) {
  const selectedCredits = courses.reduce((total, course) => {
    return selectedGroups[course.id] ? total + course.credits : total;
  }, 0);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="bg-muted/30 px-4 pb-4 pt-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Buscar curso o código..." />
          </div>

          <Button variant="outline" size="icon">
            <Filter className="size-4" />
          </Button>
        </div>
      </div>

      <div className="min-h-0 flex-1 bg-muted/30 px-0 py-0">
        <Card className="m-0 h-full overflow-hidden rounded-none p-0 shadow-none">
          <ScrollArea className="h-full">
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
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-2 bg-muted/30 px-4 py-3">
        <Card className="bg-muted/40">
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">
              Créditos seleccionados
            </p>
            <p className="text-xl font-semibold">{selectedCredits}</p>
          </CardContent>
        </Card>

        <Card className="bg-muted/40">
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">
              Cursos seleccionados
            </p>
            <p className="text-xl font-semibold">
              {Object.keys(selectedGroups).length}
            </p>
          </CardContent>
        </Card>
      </div>
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
            "group flex w-full items-center gap-3 bg-muted/40 px-3 py-2 text-left transition-colors hover:bg-muted/60",
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
    <div className="h-full w-full min-h-0 overflow-auto">
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
    </div>
  );
}
