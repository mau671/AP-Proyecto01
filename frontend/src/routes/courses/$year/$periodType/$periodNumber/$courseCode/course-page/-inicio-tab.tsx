import { Calendar, Clock, ExternalLink, MapPin, Monitor, User } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

import { courseInfo, news, partialExams, topics } from './-data'

export function InicioTab() {
  return (
    <div className="columns-1 gap-4 p-6 md:columns-2 [&>*]:break-inside-avoid [&>*]:mb-4">
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
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="size-4 shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground">Horario:</span>
            <span>{courseInfo.schedule}</span>
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
          <CardTitle>Cronograma de temas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topics.map((topic) => (
              <div key={topic.week}>
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="mt-0.5 shrink-0 font-mono tabular-nums">Semana {String(topic.week).padStart(2, '0')}</Badge>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{topic.title}</p>
                    <p className="text-xs text-muted-foreground">{topic.description}</p>
                  </div>
                </div>
                {topic.week < topics.length && <Separator className="mt-3" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fechas de parciales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {partialExams.map((exam) => (
              <div key={exam.name} className="rounded-lg border border-border p-3">
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
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Noticias</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {news.map((item) => (
              <div key={item.title} className="rounded-lg border border-border p-3">
                <div className="flex items-start justify-between gap-2">
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
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
