import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import type { TaskViewModel } from '@app/features/task';

import { TaskStore } from '@/app/presentation/shared/task.store';

import { DashboardPage } from './dashboard-page';

/** "YYYY/MM/DD" desde las partes locales, igual que persiste la app (ver `date.ts`). */
function localDay(offset = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}

function buildTask(overrides: Partial<TaskViewModel> = {}): TaskViewModel {
  return {
    id: 1,
    title: 'Comprar pan',
    description: 'En la panadería',
    categoria: { id: 1, name: 'Casa', color: 'blue' },
    tags: [{ id: 1, name: 'Urgente', color: 'red' }],
    status: 'pendiente',
    dueDate: localDay(0),
    completeDate: '',
    priority: 'alta',
    finished: false,
    ...overrides,
  } as TaskViewModel;
}

/**
 * `DashboardPage.tasks` es lo más denso en lógica de la app: cinco filtros encadenados
 * (categoría, tag, estado, fecha y búsqueda) sobre el Map que devuelve `TaskController`.
 *
 * Se prueba el computed **sin renderizar el template**: nunca se llama a `detectChanges()`, así
 * que los hijos (`Card`, `Tabs`, `InputSearch`) no se montan y el test queda sobre la lógica de
 * filtrado, no sobre el DOM. Solo hace falta stubear `TaskStore`, el único seam entre la
 * página y los datos.
 */
describe('DashboardPage', () => {
  let fixture: ComponentFixture<DashboardPage>;
  let page: DashboardPage;
  let taskStore: { getTasks: ReturnType<typeof vi.fn>; updateStatus: ReturnType<typeof vi.fn> };

  /** Títulos de las tareas que sobreviven al filtrado, en orden. */
  const titulos = () => page.tasks().map((task) => task.title);

  const setTasks = (tasks: TaskViewModel[]) =>
    taskStore.getTasks.mockReturnValue({
      ok: true,
      data: new Map(tasks.map((task) => [task.id, task])),
    });

  function setFilters(filters: Partial<Record<string, string>> = {}) {
    const { categoria = 'all', tag = 'all', estado = 'all', fecha = 'hoy', search } = filters;
    fixture.componentRef.setInput('categoria', categoria);
    fixture.componentRef.setInput('tag', tag);
    fixture.componentRef.setInput('estado', estado);
    fixture.componentRef.setInput('fecha', fecha);
    fixture.componentRef.setInput('search', search);
  }

  beforeEach(() => {
    taskStore = { getTasks: vi.fn(), updateStatus: vi.fn() };

    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: TaskStore, useValue: taskStore }],
    });

    fixture = TestBed.createComponent(DashboardPage);
    page = fixture.componentInstance;
    setTasks([buildTask()]);
  });

  describe('sin filtros aplicados', () => {
    it('con los filtros por defecto, devuelve las tareas de hoy', () => {
      setFilters();

      expect(titulos()).toEqual(['Comprar pan']);
    });

    it('si falta el filtro de fecha en la URL, la lista queda vacía', () => {
      // Es exactamente lo que evita `taxonomyGuard`: sin `fecha`, la comparación contra
      // `filterByDate` nunca matchea y el usuario vería el dashboard en blanco.
      // Los inputs se setean a mano porque `setFilters` repondría el default 'hoy'.
      fixture.componentRef.setInput('categoria', 'all');
      fixture.componentRef.setInput('tag', 'all');
      fixture.componentRef.setInput('estado', 'all');

      expect(page.fecha()).toBeUndefined();
      expect(titulos()).toEqual([]);
    });

    it('si el store falla, devuelve una lista vacía en vez de explotar', () => {
      taskStore.getTasks.mockReturnValue({ ok: false, message: 'Dexie caída' });
      setFilters();

      expect(titulos()).toEqual([]);
    });
  });

  describe('filtro por categoría', () => {
    beforeEach(() => {
      setTasks([
        buildTask({ id: 1, title: 'De casa', categoria: { id: 1, name: 'Casa', color: 'blue' } }),
        buildTask({
          id: 2,
          title: 'De trabajo',
          categoria: { id: 2, name: 'Trabajo', color: 'green' },
        }),
      ]);
    });

    it('"all" no filtra nada', () => {
      setFilters({ categoria: 'all' });

      expect(titulos()).toEqual(['De casa', 'De trabajo']);
    });

    it('un id deja solo las de esa categoría', () => {
      setFilters({ categoria: '2' });

      expect(titulos()).toEqual(['De trabajo']);
    });
  });

  describe('filtro por tag', () => {
    beforeEach(() => {
      setTasks([
        buildTask({ id: 1, title: 'Urgente', tags: [{ id: 1, name: 'Urgente', color: 'red' }] }),
        buildTask({
          id: 2,
          title: 'Varias etiquetas',
          tags: [
            { id: 2, name: 'Compras', color: 'green' },
            { id: 3, name: 'Casa', color: 'blue' },
          ],
        }),
      ]);
    });

    it('"all" no filtra nada', () => {
      setFilters({ tag: 'all' });

      expect(titulos()).toEqual(['Urgente', 'Varias etiquetas']);
    });

    it('deja las tareas que tengan ese tag, aunque tengan varios', () => {
      setFilters({ tag: '3' });

      expect(titulos()).toEqual(['Varias etiquetas']);
    });

    it('un tag que nadie tiene deja la lista vacía', () => {
      setFilters({ tag: '99' });

      expect(titulos()).toEqual([]);
    });
  });

  describe('filtro por estado', () => {
    beforeEach(() => {
      setTasks([
        buildTask({ id: 1, title: 'Pendiente', status: 'pendiente' }),
        buildTask({ id: 2, title: 'En curso', status: 'en_curso' }),
      ]);
    });

    it('"all" no filtra nada', () => {
      setFilters({ estado: 'all' });

      expect(titulos()).toEqual(['Pendiente', 'En curso']);
    });

    it('un estado deja solo las tareas en ese estado', () => {
      setFilters({ estado: 'en_curso' });

      expect(titulos()).toEqual(['En curso']);
    });
  });

  describe('filtro por fecha', () => {
    beforeEach(() => {
      setTasks([
        buildTask({ id: 1, title: 'Hoy', dueDate: localDay(0) }),
        buildTask({ id: 2, title: 'Próxima', dueDate: localDay(5) }),
        buildTask({ id: 3, title: 'Vencida', dueDate: localDay(-5) }),
        buildTask({ id: 4, title: 'Finalizada', dueDate: localDay(-2), finished: true }),
      ]);
    });

    it('"hoy" deja solo las que vencen hoy', () => {
      setFilters({ fecha: 'hoy' });

      expect(titulos()).toEqual(['Hoy']);
    });

    it('"proximas" deja solo las futuras', () => {
      setFilters({ fecha: 'proximas' });

      expect(titulos()).toEqual(['Próxima']);
    });

    it('"vencidas" deja las pasadas sin finalizar, no las finalizadas', () => {
      setFilters({ fecha: 'vencidas' });

      expect(titulos()).toEqual(['Vencida']);
    });

    it('"finalizadas" se decide por el flag finished, no por la fecha', () => {
      setFilters({ fecha: 'finalizadas' });

      expect(titulos()).toEqual(['Finalizada']);
    });

    it('"all" NO funciona como comodín en fecha y vacía la lista', () => {
      // Asimetría intencional a documentar: categoría, tag y estado aceptan "all", fecha no.
      // `filterByDate` solo devuelve hoy/proximas/vencidas/finalizadas.
      setFilters({ fecha: 'all' });

      expect(titulos()).toEqual([]);
    });
  });

  describe('búsqueda por título', () => {
    beforeEach(() => {
      setTasks([
        buildTask({ id: 1, title: 'Comprar pan' }),
        buildTask({ id: 2, title: 'Llamar al médico' }),
      ]);
    });

    it('una búsqueda vacía no filtra nada', () => {
      setFilters({ search: '' });

      expect(titulos()).toEqual(['Comprar pan', 'Llamar al médico']);
    });

    it('matchea por coincidencia parcial', () => {
      setFilters({ search: 'pan' });

      expect(titulos()).toEqual(['Comprar pan']);
    });

    it('ignora mayúsculas y acentos', () => {
      setFilters({ search: 'MEDICO' });

      expect(titulos()).toEqual(['Llamar al médico']);
    });

    it('ignora los espacios', () => {
      setFilters({ search: 'comprarpan' });

      expect(titulos()).toEqual(['Comprar pan']);
    });

    it('sin coincidencias, devuelve lista vacía', () => {
      setFilters({ search: 'inexistente' });

      expect(titulos()).toEqual([]);
    });
  });

  describe('varios filtros combinados', () => {
    it('aplica todos a la vez, en AND', () => {
      setTasks([
        buildTask({ id: 1, title: 'La buscada', status: 'en_curso' }),
        buildTask({ id: 2, title: 'La buscada', status: 'pendiente' }), // cae por estado
        buildTask({ id: 3, title: 'Otra cosa', status: 'en_curso' }), // cae por búsqueda
        buildTask({ id: 4, title: 'La buscada', status: 'en_curso', dueDate: localDay(9) }), // cae por fecha
      ]);

      setFilters({ estado: 'en_curso', fecha: 'hoy', search: 'buscada' });

      expect(page.tasks().map((task) => task.id)).toEqual([1]);
    });
  });

  describe('navegación', () => {
    it('cambiar la búsqueda navega conservando el resto de query params', () => {
      const router = TestBed.inject(Router);
      const navigate = vi.spyOn(router, 'navigate');

      page.onChangeSearch('pan');

      expect(navigate).toHaveBeenCalledWith([], {
        queryParams: { search: 'pan' },
        queryParamsHandling: 'merge',
      });
    });

    it('cambiar de pestaña navega con el nuevo estado', () => {
      const router = TestBed.inject(Router);
      const navigate = vi.spyOn(router, 'navigate');

      page.onChangeStatus({ index: 1, value: 'completada' });

      expect(navigate).toHaveBeenCalledWith([], {
        queryParams: { estado: 'completada' },
        queryParamsHandling: 'merge',
      });
    });
  });
});
