import { Link, useNavigate } from "@tanstack/react-router"
import { useState, type FormEvent } from "react"

import { cn } from "@/lib/utils"
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
import { demoUsers, findDemoUser, saveDemoUser } from "@/lib/demo-auth"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate()
  const [error, setError] = useState("")

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get("email") ?? "")
    const password = String(formData.get("password") ?? "")
    const user = findDemoUser(email)

    if (!user || !password.trim()) {
      setError("Usa un correo demo de UTLM y cualquier contraseña no vacía.")
      return
    }

    saveDemoUser(user)
    navigate({ to: "/" })
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Iniciar sesión</CardTitle>
          <CardDescription>
            Ingresa tu correo electrónico a continuación para iniciar sesión.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="estudiante@utlm.cr"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                </div>
                <Input id="password" name="password" type="password" required />
              </Field>
              {error ? <p className="text-sm text-destructive">{error}</p> : null}
              <Field>
                <Button type="submit">Entrar</Button>
                <FieldDescription className="text-center">
                  ¿No tienes cuenta? <Link to="/auth/signup">Crear cuenta</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
        <p className="mb-2 font-medium text-foreground">Cuentas demo</p>
        <div className="space-y-1">
          {demoUsers.map((user) => (
            <p key={user.email}>
              <span className="font-medium text-foreground">{user.roleLabel}:</span>{" "}
              <span className="font-mono">{user.email}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
