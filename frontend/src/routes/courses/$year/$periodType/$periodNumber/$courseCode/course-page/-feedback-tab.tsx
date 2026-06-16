import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { getDemoUser } from '@/lib/demo-auth'

const QUESTIONS = [
  '¿El profesor explica los temas de forma clara y comprensible?',
  '¿El profesor fomenta la participación activa de los estudiantes?',
  '¿El profesor muestra dominio y conocimiento actualizado de la materia?',
  '¿El profesor evalúa de forma justa y de acuerdo a los criterios establecidos?',
  '¿El profesor es accesible para aclarar dudas y consultas fuera de clase?'
]

type EvaluationResponse = {
  id: number
  answers: number[]
  comment: string
  submittedAt: string
}

// Datos de prueba para simular evaluaciones ya realizadas
const mockResponses: EvaluationResponse[] = [
  {
    id: 1,
    answers: [9, 8, 10, 8, 9],
    comment: "Muy buen profesor, las clases son dinámicas, pero a veces va un poco rápido.",
    submittedAt: "2026-06-15T14:30:00Z"
  },
  {
    id: 2,
    answers: [10, 10, 10, 9, 10],
    comment: "Excelente curso. Aprendí muchísimo y el material está bien organizado.",
    submittedAt: "2026-06-16T09:15:00Z"
  }
]

export function FeedbackTab() {
  const user = getDemoUser()
  const isTeacher = user?.role === 'teacher'
  
  // Student State
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [answers, setAnswers] = useState<number[]>(QUESTIONS.map(() => 5))
  const [comment, setComment] = useState('')

  // Teacher State
  const [responses, setResponses] = useState<EvaluationResponse[]>(mockResponses)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newResponse: EvaluationResponse = {
      id: Date.now(),
      answers: [...answers],
      comment,
      submittedAt: new Date().toISOString()
    }
    
    setResponses([newResponse, ...responses])
    setHasSubmitted(true)
    toast.success('Evaluación enviada exitosamente')
  }

  const handleAnswerChange = (index: number, value: number) => {
    const newAnswers = [...answers]
    newAnswers[index] = value
    setAnswers(newAnswers)
  }

  return (
    <div className="space-y-6">
      {!isTeacher ? (
        hasSubmitted ? (
          <div className="text-center py-20 max-w-2xl mx-auto p-6">
            <h2 className="text-2xl font-bold text-primary mb-4">¡Gracias por tu participación!</h2>
            <p className="text-lg">
              Tu evaluación ha sido enviada de forma anónima. Esto ayuda a mejorar la calidad del curso.
            </p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto w-full p-6">
            <p className="text-lg font-medium leading-relaxed mb-6">
              Evalúa el desempeño del docente en el curso de forma anónima y utilizando una escala de 1 a 10, donde 1 corresponde a “Muy deficiente” y 10 a “Excelente”.
            </p>
            <form id="teacher-eval-form" onSubmit={handleSubmit} className="space-y-10">
              <div className="space-y-10">
                  {QUESTIONS.map((question, idx) => (
                    <div key={idx} className="space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <Label className="text-base leading-relaxed">
                          {idx + 1}. {question}
                        </Label>
                        <span className="shrink-0 rounded-md bg-primary/10 px-3 py-1 font-mono text-lg font-bold text-primary">
                          {answers[idx]}
                        </span>
                      </div>
                      <div className="px-1">
                        <Slider
                          value={answers[idx]}
                          min={1}
                          max={10}
                          step={1}
                          onValueChange={(vals: any) => handleAnswerChange(idx, Array.isArray(vals) ? vals[0] : vals)}
                          className="py-4"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground px-1 font-medium">
                          <span>1 (Deficiente)</span>
                          <span>10 (Excelente)</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pt-6 border-t">
                  <Label htmlFor="comment" className="text-base font-semibold">Comentarios adicionales (Opcional)</Label>
                  <p className="text-sm text-muted-foreground">
                    Cualquier sugerencia, felicitación o área de mejora que desees compartir.
                  </p>
                  <Textarea
                    id="comment"
                    placeholder="Escribe tus comentarios aquí..."
                    className="min-h-[120px] resize-y"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>
              </form>
            <div className="pt-8 flex justify-end">
              <Button type="submit" form="teacher-eval-form" size="lg" className="w-full sm:w-auto">
                Enviar evaluación
              </Button>
            </div>
          </div>
        )
      ) : (
        <div className="max-w-3xl mx-auto w-full p-6 space-y-6">
          {responses.map((response, i) => {
              const avgScore = response.answers.reduce((a, b) => a + b, 0) / response.answers.length
              return (
                <Card key={response.id} className="flex flex-col">
                  <CardHeader className="pb-3 border-b">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-medium">Evaluación #{responses.length - i}</CardTitle>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                        {format(new Date(response.submittedAt), "dd 'de' MMM, HH:mm", { locale: es })}
                      </span>
                    </div>
                    <CardDescription>
                      Puntuación promedio: <span className="font-bold text-foreground">{avgScore.toFixed(1)} / 10</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4 flex-1">
                    <div className="space-y-3">
                      {QUESTIONS.map((q, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-4 text-sm">
                          <span className="text-muted-foreground line-clamp-1 flex-1" title={q}>
                            {idx + 1}. {q}
                          </span>
                          <span className="font-mono font-medium">{response.answers[idx]}/10</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  {response.comment && (
                    <CardFooter className="border-t bg-muted/20 pt-4 pb-4">
                      <div className="text-sm">
                        <span className="font-semibold block mb-1">Comentario:</span>
                        <p className="text-muted-foreground italic">&ldquo;{response.comment}&rdquo;</p>
                      </div>
                    </CardFooter>
                  )}
                </Card>
              )
            })}
        </div>
      )}
    </div>
  )
}
