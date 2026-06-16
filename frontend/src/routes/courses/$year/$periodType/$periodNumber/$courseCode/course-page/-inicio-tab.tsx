import { useState } from 'react'
import { Calendar, Clock, ExternalLink, MapPin, Monitor, User, MoreVertical, Pencil, Trash, Plus } from 'lucide-react'

import { getDemoUser } from '@/lib/demo-auth'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ResponsiveDialog } from '@/components/responsive-dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { Link, useParams } from '@tanstack/react-router'
import { courseInfo, news as initialNews, partialExams as initialExams, topics as initialTopics, type Topic, type PartialExam, type NewsItem } from './-data'

export function InicioTab() {
  const params = useParams({ strict: false }) as any
  const user = getDemoUser()
  const isTeacher = user?.role === 'teacher'

  const [topics, setTopics] = useState<Topic[]>(initialTopics)
  const [exams, setExams] = useState<PartialExam[]>(initialExams)
  const [newsList, setNewsList] = useState<NewsItem[]>(initialNews)

  // Dialog States
  const [topicDialog, setTopicDialog] = useState<{ open: boolean, editing?: Topic, index?: number }>({ open: false })
  const [examDialog, setExamDialog] = useState<{ open: boolean, editing?: PartialExam, index?: number }>({ open: false })
  const [newsDialog, setNewsDialog] = useState<{ open: boolean, editing?: NewsItem, index?: number }>({ open: false })

  // Forms
  const handleSaveTopic = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newTopic: Topic = {
      week: Number(formData.get('week')),
      title: formData.get('title') as string,
      description: formData.get('description') as string,
    }
    if (topicDialog.index !== undefined) {
      const newTopics = [...topics]
      newTopics[topicDialog.index] = newTopic
      setTopics(newTopics)
    } else {
      setTopics([...topics, newTopic].sort((a, b) => a.week - b.week))
    }
    setTopicDialog({ open: false })
  }

  const handleSaveExam = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newExam: PartialExam = {
      name: formData.get('name') as string,
      date: formData.get('date') as string,
      time: formData.get('time') as string,
      scope: formData.get('scope') as string,
      percentage: formData.get('percentage') as string,
    }
    if (examDialog.index !== undefined) {
      const newExams = [...exams]
      newExams[examDialog.index] = newExam
      setExams(newExams)
    } else {
      setExams([...exams, newExam])
    }
    setExamDialog({ open: false })
  }

  const handleSaveNews = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newNews: NewsItem = {
      title: formData.get('title') as string,
      date: formData.get('date') as string,
      description: formData.get('description') as string,
      type: formData.get('type') as 'info' | 'warning' | 'important',
    }
    if (newsDialog.index !== undefined) {
      const updatedNews = [...newsList]
      updatedNews[newsDialog.index] = newNews
      setNewsList(updatedNews)
    } else {
      setNewsList([newNews, ...newsList])
    }
    setNewsDialog({ open: false })
  }

  return (
    <div className="columns-1 gap-6 p-6 md:columns-2 [&>*]:break-inside-avoid [&>*]:mb-6">
      <Card>
        <CardHeader>
          <CardTitle>Información de clases</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <User className="size-4 shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground">Profesor:</span>
            <span className="font-medium">{courseInfo.professor}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <ExternalLink className="size-4 shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground">Zoom:</span>
            <a
              href={courseInfo.zoomLink}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate text-primary underline underline-offset-2"
            >
              {courseInfo.zoomLink}
            </a>
          </div>
          <Separator />
          <div className="flex items-start gap-2 text-sm">
            <Calendar className="size-4 mt-0.5 shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground shrink-0">Horario:</span>
            <div className="flex flex-col">
              {courseInfo.schedule.split('|').map((part, index) => (
                <span key={index}>{part.trim()}</span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="size-4 shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground">Aula:</span>
            <span>{courseInfo.classroom}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Monitor className="size-4 shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground">Modalidad:</span>
            <span>{courseInfo.modality}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Equipo docente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1 text-sm">
            <span className="font-semibold text-muted-foreground">Docente:</span>
            <ul className="list-disc pl-5">
              <li>{courseInfo.professor} ({courseInfo.email})</li>
            </ul>
          </div>
          <div className="space-y-1 text-sm">
            <span className="font-semibold text-muted-foreground">Tutor:</span>
            <ul className="list-disc pl-5">
              <li>Juan Pérez Gómez (jperez@utlm.cr)</li>
            </ul>
          </div>
          <div className="pt-1">
            <Link
              to="/courses/$year/$periodType/$periodNumber/$courseCode/$groupNumber/members"
              params={{
                year: params.year ?? '',
                periodType: params.periodType ?? '',
                periodNumber: params.periodNumber ?? '',
                courseCode: params.courseCode ?? '',
                groupNumber: params.groupNumber ?? '',
              }}
              className="text-sm text-primary font-medium hover:underline cursor-pointer"
            >
              Lista de integrantes
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cronograma de temas</CardTitle>
          {isTeacher && (
            <CardAction>
              <Button variant="outline" size="sm" onClick={() => setTopicDialog({ open: true })}>
                <Plus className="mr-1 size-4" /> Agregar
              </Button>
            </CardAction>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topics.map((topic, idx) => (
              <div key={topic.week}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex min-w-0 flex-1 items-start gap-2">
                    <Badge variant="outline" className="mt-0.5 shrink-0 font-mono tabular-nums">Semana {String(topic.week).padStart(2, '0')}</Badge>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{topic.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{topic.description}</p>
                    </div>
                  </div>
                  {isTeacher && (
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" />}>
                        <MoreVertical className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setTopicDialog({ open: true, editing: topic, index: idx })}>
                          <Pencil className="mr-2 size-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setTopics(topics.filter((_, i) => i !== idx))}>
                          <Trash className="mr-2 size-4" /> Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
                {idx < topics.length - 1 && <Separator className="mt-3" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fechas de parciales</CardTitle>
          {isTeacher && (
            <CardAction>
              <Button variant="outline" size="sm" onClick={() => setExamDialog({ open: true })}>
                <Plus className="mr-1 size-4" /> Agregar
              </Button>
            </CardAction>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {exams.map((exam, idx) => (
              <div key={idx} className="rounded-lg border border-border p-3 flex justify-between items-start gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{exam.name}</p>
                  <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="size-3" />
                      <span>{exam.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="size-3" />
                      <span>{exam.time}</span>
                    </div>
                    <p>Contenido: {exam.scope}</p>
                    <p>Valor: {exam.percentage}</p>
                  </div>
                </div>
                {isTeacher && (
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" />}>
                      <MoreVertical className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setExamDialog({ open: true, editing: exam, index: idx })}>
                        <Pencil className="mr-2 size-4" /> Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setExams(exams.filter((_, i) => i !== idx))}>
                        <Trash className="mr-2 size-4" /> Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Noticias</CardTitle>
          {isTeacher && (
            <CardAction>
              <Button variant="outline" size="sm" onClick={() => setNewsDialog({ open: true })}>
                <Plus className="mr-1 size-4" /> Agregar
              </Button>
            </CardAction>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {newsList.map((item, idx) => (
              <div key={idx} className="rounded-lg border border-border p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{item.title}</p>
                      <Badge
                        variant={item.type === 'important' ? 'destructive' : item.type === 'warning' ? 'secondary' : 'default'}
                        className="shrink-0"
                      >
                        {item.type === 'important' ? 'Importante' : item.type === 'warning' ? 'Aviso' : 'Info'}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{item.date}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  {isTeacher && (
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" />}>
                        <MoreVertical className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setNewsDialog({ open: true, editing: item, index: idx })}>
                          <Pencil className="mr-2 size-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setNewsList(newsList.filter((_, i) => i !== idx))}>
                          <Trash className="mr-2 size-4" /> Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <ResponsiveDialog
        open={topicDialog.open}
        onOpenChange={(o) => setTopicDialog({ open: o })}
        title={topicDialog.editing ? "Editar Tema" : "Agregar Tema"}
      >
        <form onSubmit={handleSaveTopic} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="week">Semana</Label>
            <Input id="week" name="week" type="number" required defaultValue={topicDialog.editing?.week} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input id="title" name="title" required defaultValue={topicDialog.editing?.title} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" name="description" required defaultValue={topicDialog.editing?.description} />
          </div>
          <Button type="submit" className="w-full">Guardar</Button>
        </form>
      </ResponsiveDialog>

      <ResponsiveDialog
        open={examDialog.open}
        onOpenChange={(o) => setExamDialog({ open: o })}
        title={examDialog.editing ? "Editar Parcial" : "Agregar Parcial"}
      >
        <form onSubmit={handleSaveExam} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" name="name" required defaultValue={examDialog.editing?.name} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Fecha</Label>
              <Input id="date" name="date" required defaultValue={examDialog.editing?.date} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Hora</Label>
              <Input id="time" name="time" required defaultValue={examDialog.editing?.time} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="scope">Contenido (Scope)</Label>
            <Input id="scope" name="scope" required defaultValue={examDialog.editing?.scope} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="percentage">Porcentaje</Label>
            <Input id="percentage" name="percentage" required defaultValue={examDialog.editing?.percentage} />
          </div>
          <Button type="submit" className="w-full">Guardar</Button>
        </form>
      </ResponsiveDialog>

      <ResponsiveDialog
        open={newsDialog.open}
        onOpenChange={(o) => setNewsDialog({ open: o })}
        title={newsDialog.editing ? "Editar Noticia" : "Agregar Noticia"}
      >
        <form onSubmit={handleSaveNews} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input id="title" name="title" required defaultValue={newsDialog.editing?.title} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Fecha</Label>
              <Input id="date" name="date" required defaultValue={newsDialog.editing?.date} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select name="type" defaultValue={newsDialog.editing?.type || 'info'}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Información</SelectItem>
                  <SelectItem value="warning">Aviso</SelectItem>
                  <SelectItem value="important">Importante</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" name="description" required defaultValue={newsDialog.editing?.description} />
          </div>
          <Button type="submit" className="w-full">Guardar</Button>
        </form>
      </ResponsiveDialog>
    </div>
  )
}
