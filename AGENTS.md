# AGENTS.md

Guía operativa para agentes de código en este repo. Documentos complementarios, con su *cuándo*:

- [`README.md`](README.md) — qué hace el producto y por qué existe.
- [`docs/arquitectura.md`](docs/arquitectura.md) — leer antes de mover código entre capas.
- [`docs/dexie-arquitectura.md`](docs/dexie-arquitectura.md) — leer antes de tocar la persistencia
  o el schema de Dexie.

**TaskFlow** es un proyecto de portafolio/estudio (primer Angular del autor), sin backend: todo se
persiste local en el navegador (IndexedDB vía Dexie).

## Comandos

```bash
pnpm start                           # dev server → http://localhost:4200
npx ng test --watch=false            # corre toda la suite una vez
pnpm storybook                       # catálogo de componentes → puerto 6006
pnpm lint / pnpm lint:fix            # ESLint (con autofix)
pnpm typecheck                       # tsc --noEmit (app + specs)
pnpm build
pnpm build && pnpm serve:ssr:to-do   # build + servidor SSR
```

## Convenciones de código

Solo lo que contradice el default de la herramienta o no se deduce leyendo un archivo suelto. El
resto del estilo (orden de imports, `import type`, alias, formato) ya lo enforcean ESLint y
Prettier.

- **Regla de dependencia, en una sola dirección**:
  `presentation → application → domain ← infrastructure`. `presentation/` nunca importa Dexie ni un
  repository directo: siempre pasa por `application/`.
- **Estilos solo con Tailwind 4 inline** en el template. El proyecto no usa `.css` por componente.
- **Colores del theme** vía `getColor(key)` de `core/shared/theme/color.registry.ts` (cae a
  `'neutral'` si la key no existe). No hardcodear clases de color sueltas.
- **Angular 22 con Signals**. Formularios con `form()` / `FormField` de `@angular/forms/signals` y
  validación con `validateStandardSchema` sobre un esquema Zod — **no** reactive forms ni
  template-driven:

```ts
// form.type.ts — el esquema Zod es la fuente de verdad de la validación (recortado)
export const taskSchema = z.object({
  title: z.string().min(5, 'El título debe ser mínimo de 5 caracteres'),
  tags: z.array(z.number()).min(1, 'Debes elegir como mínimo 1 etiqueta'),
});
export type TaskZod = z.infer<typeof taskSchema>;

// form-task.ts
inputs = linkedSignal(() => this.fields() ?? { title: '', tags: [] });
formInputs = form(this.inputs, (f) => {
  validateStandardSchema(f, taskSchema);
});
onSubmit() {
  submit(this.formInputs, async (fields) => this.eventSubmit.emit(fields().value()));
}
```

```html
<!-- el átomo se wirea por [formField], nunca con un [(value)] suelto -->
<app-input-text [formField]="formInputs.title" placeholder="Título"></app-input-text>
```

## Testing

Vitest vía el builder `@angular/build:unit-test` (no Karma ni Jest). Stories con
`@storybook/angular` v10 en CSF3.

- Cada componente de UI lleva un `*.spec.ts` que prueba comportamiento real: nunca dejar el
  scaffold `should create` a secas.
- Los servicios respaldados por IndexedDB (`OptionsService`, `CategoryService`, `TagService`,
  `TaskController`) **nunca** se instancian reales en un spec o story: se stubean con los métodos
  que el componente realmente consume.
- Con `RouterLink` / `RouterLinkActive`, leer el link resuelto por `RouterLink.href` (el input
  `routerLink` no tiene getter público).
- En las stories, los outputs se mockean con `fn()` de `storybook/test`, nunca con `() => {}`.

Esqueleto de un spec de componente:

```ts
@Component({
  imports: [Card],
  template: `<app-card [data]="data()" (eventStatusChenge)="onChange($event)"></app-card>`,
})
class CardHost {
  data = signal<TaskViewModel>(buildTask()); // lo que cambia en runtime va en signals (zoneless)
  changed: TStatusTask[] = [];
  onChange(value: TStatusTask) {
    this.changed.push(value);
  }
}

await TestBed.configureTestingModule({
  imports: [CardHost],
  providers: [provideRouter([]), { provide: OptionsService, useValue: fakeOptionsService }],
}).compileComponents();

const badge = fixture.debugElement.query(By.directive(Badge)).componentInstance as Badge;
```

## Git / commits

- Mensajes en español, imperativo, formato `tipo(scope): Mensaje` (`test`, `fix`, `docs`,
  `chore`...). Ver `git log` para el estilo ya establecido.
- Un commit por componente o cambio lógico, no por archivo.
- Nunca `--no-verify`, `--force` ni `--amend` sobre un commit ya existente, salvo pedido explícito.

## Límites

**Siempre**

- Correr `npx ng test --watch=false` antes de dar por terminado un cambio en `src/`, y contrastar
  los fallos con los que ya existían antes de tocar nada.
- Borrar el código muerto que aparezca de paso (un `.css` vacío con su `styleUrl`, un `@Input()`
  sin consumidores): ya está confirmado como muerto, no hace falta preguntar.
- Preguntar antes de asumir una interpretación ambigua del pedido.

**Preguntar primero**

- Cambios de arquitectura, o que muevan código entre capas.
- Cambios en la configuración de build/test (`angular.json`, `tsconfig*.json`, config de
  Storybook/Vitest).
- Renombrar, mover o eliminar un componente de UI que ya tiene spec + story.
- Cambios de branding o de copy visible.

**Nunca**

- Nunca cambiar el schema de Dexie (versión de la DB, stores, índices en `core/database`) sin
  aprobación expresa: una migración mal hecha rompe datos ya guardados en el navegador del usuario.
- Nunca violar la regla de dependencia unidireccional (ver Convenciones de código).
- Nunca agregar ni quitar una dependencia de `package.json` sin preguntar primero, por trivial que
  parezca.
- Nunca hacer `git push` sin que se pida explícitamente — los commits locales sí son parte del
  flujo normal de trabajo.
