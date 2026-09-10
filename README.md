# To-Do App

![Angular](https://img.shields.io/badge/Angular-22-DD0031?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Dexie](https://img.shields.io/badge/Dexie-IndexedDB-FFCA28)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

Aplicación de gestión de tareas construida como proyecto de práctica para portafolio, con foco en
arquitectura limpia en el frontend y persistencia local real (sin backend).

## Idea de negocio

Una libreta digital de tareas: un CRUD simple donde cada tarea se clasifica con una categoría y
etiquetas predefinidas, y se le da seguimiento por estado (pendiente, en curso, completada),
prioridad y fecha límite. Sin cuentas de usuario ni backend — todo vive en el navegador. El
objetivo no es competir con un gestor de tareas real, sino servir de pieza de portafolio que
muestre una arquitectura de frontend bien separada por capas sobre un caso de uso sencillo y
conocido.

## Características

- Crear, editar y eliminar tareas
- Organización por categorías y etiquetas (tags)
- Estados de tarea: pendiente, en curso, completada
- Prioridades: baja, media, alta
- Fecha de vencimiento (`dueDate`) y fecha de finalización (`completeDate`)
- Persistencia local con IndexedDB (los datos sobreviven al recargar el navegador)
- Renderizado del lado del servidor (SSR)

## Stack tecnológico

- **Framework:** Angular 22 (standalone components, Signals)
- **Persistencia:** Dexie (IndexedDB)
- **Validación:** Zod
- **Estilos:** Tailwind CSS 4
- **Testing:** Vitest
- **Documentación de componentes:** Storybook
- **SSR:** Angular Universal + Express

## Arquitectura

El código sigue una separación por capas inspirada en arquitectura hexagonal:

```
core/           configuración transversal: base de datos, guards, utilidades
features/       lógica de negocio por dominio (task, category, tag)
  domain/       entidades y contratos de repositorio
  application/  servicios, DTOs, orquestación
  infrastructure/  implementación concreta (Dexie)
presentation/   UI: componentes (atomic design) y páginas
```

Más detalle sobre el diseño de persistencia en [`docs/dexie-arquitectura.md`](docs/dexie-arquitectura.md).

## Instalación

```bash
pnpm install
```

## Desarrollo

```bash
pnpm start
```

Abre `http://localhost:4200/`.

## Testing

```bash
pnpm test
```

## Storybook

```bash
pnpm storybook
```

## Build

```bash
pnpm build
```

## Build y ejecución SSR

```bash
pnpm build
pnpm serve:ssr:to-do
```

## Licencia

Este proyecto está bajo la licencia [MIT](LICENSE).
