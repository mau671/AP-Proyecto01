import { createFileRoute } from '@tanstack/react-router'
import { CameraIcon, MailIcon, PhoneIcon, SmartphoneIcon, UserIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/profile/personal')({
  component: ProfilePersonal,
})

function ProfilePersonal() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const setFile = (file: File | null) => {
    if (!file) return

    const validTypes = ['image/png', 'image/jpeg', 'image/gif']
    if (!validTypes.includes(file.type) || file.size > 2 * 1024 * 1024) return

    setFileName(file.name)
    setPreviewUrl((currentUrl) => {
      if (currentUrl) URL.revokeObjectURL(currentUrl)
      return URL.createObjectURL(file)
    })
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      <div className="flex flex-col items-center gap-4 md:grid md:grid-cols-[112px_minmax(0,520px)] md:items-center md:justify-center md:gap-8">
        <Avatar
          size="lg"
          className="shrink-0 border border-border"
          style={{ width: 112, height: 112 }}
        >
          {previewUrl ? <AvatarImage src={previewUrl} alt="Avatar del estudiante" /> : null}
          <AvatarFallback>
            <UserIcon className="size-8" />
          </AvatarFallback>
        </Avatar>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => {
            event.preventDefault()
            setIsDragging(false)
            setFile(event.dataTransfer.files[0] ?? null)
          }}
          className={cn(
            'flex min-h-28 w-full cursor-pointer flex-col justify-center rounded-xl border border-dashed px-4 py-5 text-left transition-colors md:max-w-[520px]',
            isDragging ? 'border-foreground bg-accent/40' : 'border-border hover:bg-accent/20',
          )}
        >
          <div className="flex flex-col items-center gap-2 text-center md:items-center">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-muted text-foreground">
              <CameraIcon className="size-4" />
            </span>
            <div className="min-w-0 space-y-1">
              <p className="text-sm text-foreground">
                <span className="text-primary transition-colors hover:underline">Haz clic</span>{' '}
                para subir una foto o arrástrala y suéltala.
              </p>
              <p className="text-sm text-muted-foreground">PNG, JPG o GIF (máx. 2 MB)</p>
              {fileName ? <p className="truncate text-sm text-foreground">Archivo seleccionado: {fileName}</p> : null}
            </div>
          </div>
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/gif"
          className="hidden"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <DisabledInput id="full-name" label="Nombre completo" value="Estudiante Demo" />
        <DisabledInput id="id-number" label="Cédula" value="1-2345-0678" />
        <DisabledInput id="student-id" label="Carnet" value="2024143009" />
        <DisabledInput id="email" label="Correo electrónico" value="estudiante@utlm.cr" type="email" icon={MailIcon} />
        <DisabledInput id="mobile-phone" label="Teléfono móvil" value="8888-8888" type="tel" icon={SmartphoneIcon} />
        <DisabledInput id="landline-phone" label="Teléfono fijo" value="2550-0000" type="tel" icon={PhoneIcon} />
        <div className="md:col-span-2">
          <DisabledInput id="permanent-address" label="Dirección permanente" value="Cartago, Costa Rica" />
        </div>
      </div>
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
  icon?: typeof UserIcon
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
