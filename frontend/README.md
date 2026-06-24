# Universidad Tecnológica La Mejor - Frontend

Este es el proyecto frontend (prototipo web navegable) de la plataforma universitaria integrada. Está construido con tecnologías web modernas, priorizando el rendimiento, la experiencia de usuario y una arquitectura escalable.

## Tecnologías principales

- **Framework principal:** [React 19](https://react.dev/) con [Vite](https://vitejs.dev/)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Enrutamiento:** [TanStack Router](https://tanstack.com/router/latest) (Enrutamiento basado en archivos con seguridad de tipos)
- **Estilos y componentes:** [Tailwind CSS v4](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/) y [@base-ui/react](https://base-ui.com/)
- **Gestión de formularios:** [TanStack Form](https://tanstack.com/form/latest)
- **Gestor de paquetes:** [pnpm](https://pnpm.io/)

## Estructura del proyecto

El código fuente principal se encuentra en el directorio `/src`:

- `src/components/`: Componentes de interfaz de usuario reutilizables (incluye los componentes generados de Shadcn UI).
- `src/hooks/`: Hooks personalizados de React para lógica reutilizable.
- `src/lib/`: Utilidades generales, configuraciones de formato y funciones compartidas.
- `src/routes/`: Estructura de rutas de la aplicación manejada por TanStack Router.
- `src/router.tsx`: Configuración inicial y declaración del router de TanStack.
- `src/styles.css`: Estilos globales de la aplicación y configuración de Tailwind.

## Cómo ejecutar el proyecto localmente

### 1. Requisitos previos

Asegúrate de tener instalado [Node.js](https://nodejs.org/) y el gestor de paquetes **pnpm**.

Si no tienes pnpm instalado, puedes instalarlo globalmente con:
```bash
npm install -g pnpm
```

### 2. Instalación de dependencias

Entra al directorio `frontend` y ejecuta el comando de instalación de pnpm:

```bash
pnpm install
```

### 3. Servidor de desarrollo

Para iniciar el servidor local con recarga rápida (HMR):

```bash
pnpm run dev
```

El proyecto estará disponible por defecto en `http://localhost:3000`.

### 4. Construcción para producción

Para generar la versión optimizada de producción (los archivos estáticos se generarán en la carpeta `dist/`):

```bash
pnpm run build
```

Para previsualizar la compilación de producción localmente:

```bash
pnpm run preview
```

