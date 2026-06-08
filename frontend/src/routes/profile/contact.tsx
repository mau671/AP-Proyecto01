import { createFileRoute } from '@tanstack/react-router'
import { MailIcon, PhoneIcon, SmartphoneIcon, UserRoundIcon } from 'lucide-react'

import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

export const Route = createFileRoute('/profile/contact')({
  component: ProfileContact,
})

function ProfileContact() {
  return (
    <div className="mx-auto grid w-full max-w-5xl gap-4 md:grid-cols-2">
      <DisabledInput id="institutional-email" label="Correo institucional" value="estudiante@utlm.cr" type="email" icon={MailIcon} />
      <DisabledInput id="personal-email" label="Correo personal" value="estudiante.demo@gmail.com" type="email" icon={MailIcon} />
      <DisabledInput id="contact-mobile" label="Teléfono móvil" value="8888-8888" type="tel" icon={SmartphoneIcon} />
      <DisabledInput id="contact-landline" label="Teléfono fijo" value="2550-0000" type="tel" icon={PhoneIcon} />
      <div className="md:col-span-2">
        <DisabledInput id="contact-address" label="Dirección permanente" value="Cartago, Costa Rica" />
      </div>
      <DisabledInput id="emergency-contact" label="Contacto de emergencia" value="María Rodríguez" icon={UserRoundIcon} />
      <DisabledInput id="emergency-relation" label="Relación" value="Madre" />
      <DisabledInput id="emergency-phone" label="Teléfono de emergencia" value="8777-7777" type="tel" icon={PhoneIcon} />
    </div>
  )
}

function DisabledInput({
  id,
  label,
  value,
  type = 'text',
  icon: Icon,
}: {
  id: string
  label: string
  value: string
  type?: string
  icon?: typeof UserRoundIcon
}) {
  return (
    <Field data-disabled>
      <FieldLabel htmlFor={id}>
        {Icon ? <Icon className="size-4" /> : null}
        {label}
      </FieldLabel>
      <Input id={id} type={type} value={value} disabled />
    </Field>
  )
}
