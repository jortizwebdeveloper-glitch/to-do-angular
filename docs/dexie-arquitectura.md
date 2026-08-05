# Arquitectura de persistencia con Dexie

> Guía de diseño para implementar la capa de datos de la app de tareas.
> Los bloques de código son **ejemplos de referencia**, no código final: adáptalos.

## 1. Objetivo

Sustituir el estado en memoria de `src/app/services/task.service.ts` por persistencia real en
IndexedDB, sin que los componentes se enteren. Al terminar, recargar el navegador debe conservar las
tareas.

## 2. Estructura de carpetas

```
src/app/
├── db/
│   ├── app.db.ts             clase AppDatabase extends Dexie
│   ├── db.provider.ts        InjectionToken APP_DB (SSR-safe)
│   └── schema/
│       ├── task.schema.ts
│       ├── category.schema.ts
│       └── tag.schema.ts
├── repositories/
│   ├── base.repository.ts    CRUD genérico
│   └── task.repository.ts
├── services/                 ya existe
├── guards/                   ya existe
└── components/               sin cambios

src/types/task.type.ts        ya existe — tipos de dominio
```

**Regla de oro:** las dependencias van en una sola dirección.

```
components  →  services  →  repositories  →  db
```

Un componente nunca importa `dexie` ni un repository. Si algún día cambias Dexie por otra cosa,
solo se reescriben `db/` y `repositories/`.

### ¿Por qué tres capas y no dos?

| Capa | Responsabilidad | Qué NO hace |
|---|---|---|
| `db/` | Declarar tablas, índices y versiones. Abrir la conexión. | No sabe de negocio |
| `repositories/` | Traducir intenciones de datos a consultas Dexie. Convertir fila ↔ dominio. | No conoce Angular ni signals |
| `services/` | Estado reactivo, signals, orquestación para la UI. | No escribe consultas |

## 3. Modelado: el paso que más se subestima

Tu tipo de dominio actual (`src/types/task.type.ts`) es:

```ts
export type TTask = {
  id: number;
  title: string;
  description: string;
  categoria: TCategory;      // ← objeto anidado
  tags: Array<TType>;        // ← array de objetos
  status: TStatusTask;
  dueDate: string;
  priority: TProrityTask;
};
```

IndexedDB **sí** puede guardar objetos anidados, pero **no** puede indexarlos de forma útil, y
duplicar la categoría dentro de cada tarea significa que renombrarla obliga a reescribir todas las
filas. La solución estándar es **normalizar**: guardas referencias por id y las categorías/tags
viven en sus propias tablas.

Distingue dos tipos:

- **Tipo de dominio** (`TTask`): lo que usa la UI, con los objetos ya resueltos.
- **Tipo de fila** (`TaskRow`): lo que se guarda en IndexedDB, plano y con ids.

```ts
// src/app/db/schema/task.schema.ts
import type { TTask } from '@/types/task.type';

export const TASKS_TABLE = 'tasks';

/** Lo que realmente se guarda en IndexedDB. */
export type TaskRow = Omit<TTask, 'id' | 'categoria' | 'tags'> & {
  id?: number;          // opcional: Dexie lo asigna con ++id al insertar
  categoriaId: number;
  tagIds: number[];
};

/**
 * Índices de la tabla.
 *   ++id    → clave primaria autoincremental
 *   *tagIds → multi-entry: indexa cada elemento del array por separado
 * Solo se indexa lo que se usa en where(); indexar de más ralentiza las escrituras.
 */
export const TASK_INDEXES = '++id, status, priority, dueDate, categoriaId, *tagIds';
```

> **Nota:** `dueDate` es un `string`. Los índices de IndexedDB ordenan strings
> lexicográficamente, así que solo funcionarán rangos (`between`, `above`) si el formato es
> `YYYY-MM-DD`. Si no lo es, normalízalo antes de guardar o guarda un `timestamp: number` aparte.

Haz lo mismo en `category.schema.ts` (`++id, name`) y `tag.schema.ts` (`++id, name`).

## 4. El "pool": la instancia de Dexie

Dexie ya mantiene internamente su conexión; el "pool" aquí es simplemente **una única instancia
compartida** de la clase. Se consigue con la inyección de dependencias de Angular, no con un
singleton manual.

```ts
// src/app/db/app.db.ts
import Dexie, { type Table } from 'dexie';
import { TASKS_TABLE, TASK_INDEXES, type TaskRow } from './schema/task.schema';
// ...imports de category/tag

export class AppDatabase extends Dexie {
  // Dexie rellena estas propiedades a partir de los nombres en stores()
  tasks!: Table<TaskRow, number>;
  categories!: Table<CategoryRow, number>;
  tags!: Table<TagRow, number>;

  constructor() {
    super('todo-db');

    this.version(1).stores({
      [TASKS_TABLE]: TASK_INDEXES,
      [CATEGORIES_TABLE]: CATEGORY_INDEXES,
      [TAGS_TABLE]: TAG_INDEXES,
    });
  }
}
```

> ⚠️ **No hagas `export const db = new AppDatabase()`.** Eso se ejecuta al importar el módulo —
> también en el servidor de SSR, donde `indexedDB` no existe, y la app revienta antes de renderizar.

## 5. SSR: instanciar solo en navegador

```ts
// src/app/db/db.provider.ts
import { InjectionToken, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AppDatabase } from './app.db';

export const APP_DB = new InjectionToken<AppDatabase | null>('APP_DB', {
  providedIn: 'root',
  factory: () => (isPlatformBrowser(inject(PLATFORM_ID)) ? new AppDatabase() : null),
});
```

Qué te da esto:

- `providedIn: 'root'` → **una sola instancia** por inyector raíz. Ese es tu pool.
- En SSR vale `null`, la página renderiza vacía y se rellena tras la hidratación.
- No hay que tocar `app.config.ts`.
- En tests puedes sobrescribirlo: `{ provide: APP_DB, useValue: fakeDb }`.

## 6. Repository base: el guard de SSR se escribe una vez

El truco está en que **ningún repository concreto** repita el `if (!db) return []`. Se centraliza
aquí:

```ts
// src/app/repositories/base.repository.ts
import type { Table } from 'dexie';

export abstract class BaseRepository<T, K> {
  /** Devuelve null en servidor (sin IndexedDB). */
  protected abstract table(): Table<T, K> | null;

  async getAll(): Promise<T[]> {
    return (await this.table()?.toArray()) ?? [];
  }

  async getById(id: K): Promise<T | null> {
    return (await this.table()?.get(id)) ?? null;
  }

  async add(item: T): Promise<K | null> {
    return (await this.table()?.add(item)) ?? null;
  }

  async update(id: K, changes: Partial<T>): Promise<void> {
    await this.table()?.update(id, changes);
  }

  async remove(id: K): Promise<void> {
    await this.table()?.delete(id);
  }
}
```

El `?.` sobre la tabla es lo que hace toda la app SSR-safe: si no hay DB, cada operación devuelve un
valor neutro en lugar de lanzar.

## 7. Repository de tareas

```ts
// src/app/repositories/task.repository.ts
import { Injectable, inject } from '@angular/core';
import { liveQuery, type Table } from 'dexie';
import { APP_DB } from '@app/db/db.provider';
import { BaseRepository } from './base.repository';
import type { TaskRow } from '@app/db/schema/task.schema';
import type { TStatusTask } from '@/types/task.type';

@Injectable({ providedIn: 'root' })
export class TaskRepository extends BaseRepository<TaskRow, number> {
  private readonly db = inject(APP_DB);

  protected override table(): Table<TaskRow, number> | null {
    return this.db?.tasks ?? null;
  }

  byStatus(status: TStatusTask): Promise<TaskRow[]> {
    return this.table()?.where('status').equals(status).toArray() ?? Promise.resolve([]);
  }

  /** Rango de fechas — requiere dueDate en formato YYYY-MM-DD. */
  betweenDates(from: string, to: string): Promise<TaskRow[]> {
    return this.table()?.where('dueDate').between(from, to, true, true).toArray()
      ?? Promise.resolve([]);
  }

  countByDate(date: string): Promise<number> {
    return this.table()?.where('dueDate').equals(date).count() ?? Promise.resolve(0);
  }

  /** Observable que reemite solo cuando cambian los datos implicados. */
  liveAll() {
    return liveQuery(() => this.getAll());
  }
}
```

Para el contador de tareas por fecha (la feature de tu último commit), reutiliza los helpers de
`src/shared/utils/date.ts` para calcular las fechas de `ayer/hoy/mañana`; no escribas lógica de
fechas nueva dentro del repository.

## 8. El service: reactividad con signals

`liveQuery` de Dexie emite automáticamente cuando cambia cualquier dato que la consulta leyó. Con
`toSignal` lo conviertes en algo que la plantilla consume directo:

```ts
// src/app/services/task.service.ts (esqueleto)
import { Injectable, inject, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { from } from 'rxjs';
import { TaskRepository } from '@app/repositories/task.repository';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly repo = inject(TaskRepository);

  private readonly rows = toSignal(from(this.repo.liveAll()), { initialValue: [] });

  /** Filtros derivados: no vuelven a tocar la DB. */
  readonly pending = computed(() => this.rows().filter(t => t.status === 'pendiente'));

  async create(task: Omit<TaskRow, 'id'>) {
    await this.repo.add(task as TaskRow);   // la vista se refresca sola vía liveQuery
  }
}
```

**Mantén la API pública del service igual que ahora.** Si los componentes de `05-page/tasks` y
`05-page/dashboard` siguen llamando a los mismos métodos y leyendo los mismos signals, no tocas ni
un componente.

Te queda un punto de diseño a resolver: la UI espera `TTask` (con `categoria` y `tags` como
objetos), pero la DB devuelve `TaskRow` (con ids). Decide dónde "hidratar":

- **Opción A** — en el repository, haciendo el join con las tablas de categorías/tags. El service
  solo ve `TTask`. Más limpio.
- **Opción B** — en el service con un `computed`, cruzando contra los signals de categorías ya
  cargadas. Menos consultas, más código de estado.

Empieza por A; es más fácil de razonar.

## 9. Versionado y migraciones

Cuando cambies la forma de los datos, **nunca** edites `version(1)`: añade una nueva.

```ts
this.version(1).stores({ tasks: '++id, status, dueDate' });

this.version(2)
  .stores({ tasks: '++id, status, dueDate, priority' })  // nuevo índice
  .upgrade(tx => tx.table('tasks').toCollection().modify(t => {
    t.priority ??= 'media';                              // rellenar datos existentes
  }));
```

Dexie aplica en cadena las versiones que le falten a cada navegador. Si durante el desarrollo te
lías, borra la base desde DevTools → Application → IndexedDB y vuelve a empezar.

## 10. Errores comunes

1. **Instanciar Dexie en el ámbito del módulo** → rompe SSR. Va en el factory del token.
2. **Indexarlo todo** → cada índice cuesta en cada escritura. Indexa solo lo que va en un `where()`.
3. **Guardar objetos anidados y luego querer filtrar por ellos** → normaliza a ids (sección 3).
4. **Olvidar `*` en índices de array** → sin `*tagIds` no puedes buscar tareas por tag.
5. **Mezclar `await db.tasks...` dentro de una transacción con código no-Dexie** → las transacciones
   de Dexie se cierran si cedes el control a un `await` ajeno. Usa `db.transaction('rw', ...)`.
6. **Asumir que el `id` existe antes de insertar** → con `++id`, `add()` te devuelve el id generado.

## 11. Orden de implementación sugerido

- [ ] `db/schema/task.schema.ts` — decide `TaskRow` y los índices. **Es el paso que más piensa.**
- [ ] `db/schema/category.schema.ts` y `tag.schema.ts`
- [ ] `db/app.db.ts` — clase con `version(1).stores(...)`
- [ ] `db/db.provider.ts` — token `APP_DB`
- [ ] `repositories/base.repository.ts`
- [ ] `repositories/task.repository.ts` — primero solo `getAll` + `add`
- [ ] Comprobar en DevTools que la tabla se crea y que `add()` inserta
- [ ] Adaptar `services/task.service.ts` a `liveQuery` + `toSignal`
- [ ] Resolver la hidratación `TaskRow → TTask` (sección 8)
- [ ] Seed inicial opcional: `db/seed.ts` invocado si `tasks.count() === 0`
- [ ] Actualizar `services/task.service.spec.ts` mockeando `TaskRepository`

*(Opcional)* añadir alias en `tsconfig.json`:
`"@db/*": ["./src/app/db/*"]` y `"@repositories/*": ["./src/app/repositories/*"]`.
Con `@app/*` ya funciona (`@app/db/app.db`), así que es puramente cosmético.

## 12. Cómo verificar

1. `pnpm start` → crear/editar/borrar una tarea, recargar el navegador, comprobar que persiste.
   En DevTools → Application → IndexedDB debe verse `todo-db` con sus tablas.
2. SSR: `pnpm build && pnpm serve:ssr:to-do`, abrir `/tasks` y `/dashboard`. No debe aparecer
   `ReferenceError: indexedDB is not defined`; la página renderiza y se rellena tras hidratar.
3. `pnpm test`. Para testear el repository real contra una DB de verdad en jsdom, añade
   `fake-indexeddb` como devDependency e impórtalo en el setup de tests.
4. `pnpm build-storybook` para confirmar que ningún componente arrastra Dexie al bundle.
