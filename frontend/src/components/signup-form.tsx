import { Link, useNavigate } from "@tanstack/react-router"
import { useState, type FormEvent } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { findDemoUser, saveDemoUser, type DemoUser } from "@/lib/demo-auth"

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const navigate = useNavigate()
  const [error, setError] = useState("")

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")

    const formData = new FormData(event.currentTarget)
    const name = String(formData.get("name") ?? "").trim()
    const email = String(formData.get("email") ?? "").trim().toLowerCase()
    const password = String(formData.get("password") ?? "")
    const confirmPassword = String(formData.get("confirm-password") ?? "")

    if (!email.endsWith("@utlm.cr")) {
      setError("Usa un correo institucional con dominio @utlm.cr.")
      return
    }

    if (!password.trim() || password !== confirmPassword) {
      setError("La contraseña no puede estar vacía y debe coincidir.")
      return
    }

    const existingUser = findDemoUser(email)
    const user: DemoUser = existingUser ?? {
      email,
      name: name || "Estudiante UTLM",
      role: "student",
      roleLabel: "Estudiante",
    }

    saveDemoUser(user)
    navigate({ to: "/" })
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Crear cuenta</CardTitle>
        <CardDescription>
          Simula el registro con un correo institucional de UTLM.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Nombre completo</FieldLabel>
              <Input id="name" name="name" type="text" placeholder="María García" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="estudiante@utlm.cr"
                required
              />
              <FieldDescription>
                Para cuentas nuevas, se asigna el rol de estudiante.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Contraseña</FieldLabel>
              <Input id="password" name="password" type="password" required />
              <FieldDescription>
                Para el prototipo, solo se valida que no esté vacía.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirmar contraseña
              </FieldLabel>
              <Input id="confirm-password" name="confirm-password" type="password" required />
              <FieldDescription>Confirma la contraseña ingresada.</FieldDescription>
            </Field>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <FieldGroup>
              <Field>
                <Button type="submit">Crear cuenta</Button>
                <FieldDescription className="px-6 text-center">
                  ¿Ya tienes cuenta? <Link to="/auth/signin">Iniciar sesión</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
