export type DemoRole = 'student' | 'teacher' | 'admin'

export type DemoUser = {
  email: string
  name: string
  role: DemoRole
  roleLabel: string
}

const STORAGE_KEY = 'utlm-demo-user'

export const demoUsers: DemoUser[] = [
  {
    email: 'estudiante@utlm.cr',
    name: 'Estudiante Demo',
    role: 'student',
    roleLabel: 'Estudiante',
  },
  {
    email: 'profesor@utlm.cr',
    name: 'Profesor Demo',
    role: 'teacher',
    roleLabel: 'Profesor',
  },
  {
    email: 'admin@utlm.cr',
    name: 'Administrativo Demo',
    role: 'admin',
    roleLabel: 'Administrativo',
  },
]

export function findDemoUser(email: string) {
  return demoUsers.find((user) => user.email === email.trim().toLowerCase())
}

export function saveDemoUser(user: DemoUser) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

export function getDemoUser() {
  const storedUser = localStorage.getItem(STORAGE_KEY)
  if (!storedUser) return null

  try {
    return JSON.parse(storedUser) as DemoUser
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

export function clearDemoUser() {
  localStorage.removeItem(STORAGE_KEY)
}
