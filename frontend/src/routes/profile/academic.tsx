import { createFileRoute } from '@tanstack/react-router'

import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

export const Route = createFileRoute('/profile/academic')({
  component: ProfileAcademic,
})

function ProfileAcademic() {
  return (
    <div className="mx-auto grid w-full max-w-5xl gap-4 md:grid-cols-2">
      <DisabledInput id="career" label="Carrera" value="Ingeniería en Computación" />
      <DisabledInput id="campus" label="Sede" value="Sede Central" />
      <DisabledInput id="schedule" label="Jornada" value="Diurna" />
    </div>
  )
}

function DisabledInput({ id, label, value }: { id: string; label: string; value: string }) {
  return (
    <Field data-disabled>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input id={id} value={value} disabled />
    </Field>
  )
}
