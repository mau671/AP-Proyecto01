import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "@tanstack/react-router"
import {
  BotIcon,
  ClipboardListIcon,
  CircleHelpIcon,
  EyeIcon,
  FileTextIcon,
  GridIcon,
  LifeBuoyIcon,
  LightbulbIcon,
  LogOutIcon,
  MailIcon,
  MapIcon,
  MapPinnedIcon,
  PhoneCallIcon,
  SearchIcon,
  SettingsIcon,
  TimerIcon,
  UserCogIcon,
  UserPlusIcon,
  UserIcon,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ModeToggle } from "@/components/mode-toggle"
import { NotificationsPopover } from "@/components/notifications-popover"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { getCourseByParams } from "@/lib/course-catalog"
import { getCommunityLabel } from "@/lib/community-catalog"
import { clearDemoUser, getDemoUser, type DemoUser } from "@/lib/demo-auth"

const apps = [
  { label: "Control de plagio", icon: SearchIcon },
  { label: "Prematrícula", icon: EyeIcon },
  { label: "Feria de ideas de negocios", icon: LightbulbIcon },
  { label: "Expediente estudiantil", icon: FileTextIcon },
  { label: "Gestor de inclusiones", icon: UserPlusIcon },
  { label: "Gestor de inscripción", icon: ClipboardListIcon },
  { label: "Modelo de usuario", icon: UserCogIcon },
] as const

export function Header() {
  const [mounted, setMounted] = useState(false)
  const [time, setTime] = useState(new Date())
  const [demoUser, setDemoUser] = useState<DemoUser | null>(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    setMounted(true)
    setDemoUser(getDemoUser())
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const signOut = () => {
    clearDemoUser()
    setDemoUser(null)
    navigate({ to: "/auth/signin" })
  }

  const formattedTime = time.toLocaleTimeString("es-MX", { hour12: false })

  const pathParts = location.pathname.split("/").filter(Boolean)
  const isCoursePath = pathParts[0] === "courses" && pathParts.length >= 6
  const isCommunityPath = pathParts[0] === "communities" && pathParts.length >= 2
  const isProfilePath = pathParts[0] === "profile" && pathParts.length >= 2

  const courseInfo = isCoursePath
    ? getCourseByParams({
        year: pathParts[1],
        periodType: pathParts[2],
        periodNumber: pathParts[3],
        courseCode: pathParts[4],
        groupNumber: pathParts[5],
      })
    : null

  const breadcrumbItems = isCoursePath
    ? [
        { href: "/courses", label: "Cursos" },
        {
          href: location.pathname,
          label: courseInfo
            ? `${courseInfo.title} Grupo ${courseInfo.groupNumber.padStart(2, "0")}`
            : `Curso Grupo ${pathParts[5].padStart(2, "0")}`,
          isCourseLeaf: true,
        },
      ]
    : isCommunityPath
      ? [
          { href: "/", label: "Comunidades" },
          ...pathParts.slice(1).map((segment, index) => ({
            href: `/communities/${pathParts.slice(1, index + 2).join("/")}`,
            label: getCommunityLabel(segment),
          })),
        ]
    : isProfilePath
      ? [
          { href: "/profile/personal", label: "Perfil" },
          ...pathParts.slice(1).map((segment, index) => ({
            href: `/profile/${pathParts.slice(1, index + 2).join("/")}`,
            label:
              segment === "personal"
                ? "Datos personales"
                : segment === "academic"
                  ? "Datos académicos"
                  : segment === "study-plan"
                    ? "Plan de estudios"
                    : segment === "contact"
                      ? "Contacto"
                      : segment === "documents"
                        ? "Documentos"
                        : segment.charAt(0).toUpperCase() + segment.slice(1),
          })),
        ]
    : pathParts.map((part, index) => {
        const href = "/" + pathParts.slice(0, index + 1).join("/")
        const label =
          part === "courses"
            ? "Cursos"
            : part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, " ")

        return { href, label }
      })

  const lastBreadcrumb = breadcrumbItems[breadcrumbItems.length - 1]

  return (
    <header className="flex h-14 items-center justify-between border-b border-border px-3 sm:px-4 md:px-6">
      <div className="min-w-0">
        <Breadcrumb className="hidden md:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
            </BreadcrumbItem>
            {breadcrumbItems.map((item, index) => {
              const isLast = index === breadcrumbItems.length - 1

              return (
                <BreadcrumbItem key={item.href + item.label}>
                  <BreadcrumbSeparator />
                  {isLast ? (
                    <BreadcrumbPage>
                      {item.isCourseLeaf && courseInfo ? (
                        <span className="inline-flex items-center gap-2">
                          <span>{courseInfo.title}</span>
                          <Badge variant="secondary">{`Grupo ${courseInfo.groupNumber.padStart(2, "0")}`}</Badge>
                        </span>
                      ) : (
                        item.label
                      )}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="max-w-[45vw] truncate text-sm font-medium md:hidden">
          {courseInfo ? (
            <span className="inline-flex items-center gap-1.5">
              <span className="truncate">{courseInfo.title}</span>
              <Badge variant="secondary" className="shrink-0">{`G${courseInfo.groupNumber.padStart(2, "0")}`}</Badge>
            </span>
          ) : (
            <span>{lastBreadcrumb?.label ?? "Inicio"}</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        {mounted && (
          <span className="hidden h-8 items-center rounded-md px-2 text-sm tabular-nums text-muted-foreground md:inline-flex">
            {formattedTime}
          </span>
        )}

        <ModeToggle />

        <Popover>
          <PopoverTrigger
            render={
              <Button variant="ghost" size="icon" aria-label="Apps" className="hidden md:inline-flex">
                <GridIcon />
              </Button>
            }
          />
          <PopoverContent align="end" className="w-80 p-3">
            <h3 className="mb-3 text-sm font-semibold">Aplicaciones</h3>
            <div className="grid grid-cols-3 gap-x-3 gap-y-4">
              {apps.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  type="button"
                  className="flex min-w-0 flex-col items-center gap-1 rounded-md p-1 text-center hover:bg-accent"
                  title={label}
                >
                  <span className="grid size-10 place-items-center rounded-full bg-accent text-foreground">
                    <Icon className="size-5" />
                  </span>
                  <span className="w-full truncate text-sm text-muted-foreground">{label}</span>
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <NotificationsPopover />

        <Popover>
          <PopoverTrigger
            render={
              <Button variant="ghost" size="icon" aria-label="Ayuda" className="hidden md:inline-flex">
                <CircleHelpIcon />
              </Button>
            }
          />
          <PopoverContent align="end" className="w-80 p-0">
            <div className="space-y-3 p-4">
              <h3 className="text-sm font-semibold">Ayuda</h3>

              <div className="space-y-3 px-1.5 text-muted-foreground">
                <div className="flex items-center gap-3"><PhoneCallIcon className="size-5" /><span>+ 506 2550-2069</span></div>
                <div className="flex items-center gap-3"><MailIcon className="size-5" /><span>tec-digital@itcr.ac.cr</span></div>
                <div className="flex items-center gap-3"><TimerIcon className="size-5" /><span>L-V de 7:30am a 4:30pm</span></div>
              </div>

              <div className="border-t border-border" />

              <div className="space-y-2">
                <a
                  href="https://tecdigital.tec.ac.cr/servicios/Mapa_Campus_TEC_CA.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center gap-3 rounded-md px-1.5 py-1.5 text-left text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  <MapIcon className="size-5" />
                  <span>Mapa del campus</span>
                </a>
                <a
                  href="https://t.me/TecKapiBot"
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center gap-3 rounded-md px-1.5 py-1.5 text-left text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  <BotIcon className="size-5" />
                  <span>KapiBOT - Admisión y Registro</span>
                </a>
                <button type="button" className="flex w-full items-center gap-3 rounded-md px-1.5 py-1.5 text-left text-muted-foreground hover:bg-accent hover:text-foreground">
                  <MapPinnedIcon className="size-5" />
                  <span>Guía para estudiantes</span>
                </button>
                <button type="button" className="flex w-full items-center gap-3 rounded-md px-1.5 py-1.5 text-left text-muted-foreground hover:bg-accent hover:text-foreground">
                  <MapPinnedIcon className="size-5" />
                  <span>Guía para profesores</span>
                </button>
                <button type="button" className="flex w-full items-center gap-3 rounded-md px-1.5 py-1.5 text-left text-muted-foreground hover:bg-accent hover:text-foreground">
                  <LifeBuoyIcon className="size-5" />
                  <span>Ingresar una nueva solicitud</span>
                </button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger
            nativeButton={true}
            render={
              <Button variant="ghost" size="icon" aria-label="Cuenta" className="rounded-full p-0">
                <Avatar>
                  <AvatarFallback>
                    <UserIcon className="size-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-64">
            <div className="flex items-center gap-3 px-3 py-2">
              <Avatar className="size-9">
                <AvatarFallback>
                  <UserIcon className="size-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">{demoUser?.name ?? "Invitado"}</span>
                <span className="text-sm text-muted-foreground">
                  {demoUser?.email ?? "Sin sesión activa"}
                </span>
                {demoUser ? (
                  <span className="text-xs text-muted-foreground">{demoUser.roleLabel}</span>
                ) : null}
              </div>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigate({ to: "/profile/personal" })}>
                <UserIcon />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem>
                <SettingsIcon />
                Configuración
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <div className="flex items-center justify-between px-3 py-1.5">
              <span className="text-xs text-muted-foreground">v1.0.0</span>
              <DropdownMenuItem variant="destructive" className="px-2" onClick={signOut}>
                <LogOutIcon />
                Cerrar sesión
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
