# Plataforma Universitaria Frontend

Prototipo web basado en el proyecto `coursia`, refactorizado para ejecutarse como una SPA con Vite + React.

## Stack

- Vite
- React
- TypeScript
- pnpm
- TanStack Router
- TanStack Query
- shadcn/ui
- Tailwind CSS

## Scripts

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
```

## Estructura

- `src/routes`: rutas file-based de TanStack Router.
- `src/components`: componentes de aplicación y componentes shadcn/ui.
- `src/integrations`: integración de TanStack Query y Devtools.
- `src/lib`: utilidades y catálogos de datos.
- `src/styles.css`: estilos originales de shadcn/Tailwind copiados desde `coursia`.

## Notas

- Se eliminó TanStack Start/Nitro y la ruta server-side `/api/auth/$`.
- Se mantiene la UI, componentes shadcn, Tailwind, TanStack Router y TanStack Query.
- La autenticación queda como prototipo visual; no hay backend funcional en este entregable.
