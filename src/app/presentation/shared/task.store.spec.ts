import { TestBed } from '@angular/core/testing';
import type { TaskViewModel } from '@app/features/task';
import { TaskController } from '@app/features/task';
import { toast } from 'vanilla-toast-js';

import { TaskStore } from './task.store';

vi.mock('vanilla-toast-js', () => ({ toast: vi.fn() }));

const toastMock = vi.mocked(toast);

function buildTask(overrides: Partial<TaskViewModel> = {}): TaskViewModel {
  return { id: 7, title: 'Comprar pan', status: 'pendiente', ...overrides } as TaskViewModel;
}

/** Mensaje y tipo del último toast disparado, para no repetir el índice en cada aserción. */
function lastToast() {
  const call = toastMock.mock.calls.at(-1);
  return { message: call?.[0], options: call?.[1] };
}

describe('TaskStore', () => {
  let store: TaskStore;
  let taskController: Record<string, ReturnType<typeof vi.fn>>;

  beforeEach(() => {
    toastMock.mockClear();
    taskController = {
      getTasks: vi.fn(),
      getTask: vi.fn(),
      getTaskWithRelation: vi.fn(),
      selectTask: vi.fn(),
      createTask: vi.fn(),
      updateTask: vi.fn(),
      deleteTask: vi.fn(),
      updateTaskFinished: vi.fn(),
      updateTaskStatus: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [TaskStore, { provide: TaskController, useValue: taskController }],
    });

    store = TestBed.inject(TaskStore);
  });

  describe('lecturas', () => {
    it('pasan derecho al controller, sin notificar nada', () => {
      taskController['getTasks'].mockReturnValue({ ok: true, data: new Map() });
      taskController['getTaskWithRelation'].mockReturnValue({ ok: true, data: buildTask() });

      expect(store.getTasks()).toEqual({ ok: true, data: new Map() });
      expect(store.getTaskWithRelation(7)).toEqual({ ok: true, data: buildTask() });
      expect(taskController['getTaskWithRelation']).toHaveBeenCalledWith(7);
      expect(toastMock).not.toHaveBeenCalled();
    });
  });

  describe('createTask', () => {
    it('en éxito, notifica y devuelve true', async () => {
      taskController['createTask'].mockResolvedValue({ ok: true, data: 42 });

      const ok = await store.createTask({ title: 'Nueva' });

      expect(ok).toBe(true);
      expect(lastToast()).toEqual({
        message: 'Tarea creada',
        options: { type: 'success', closeButton: true, position: 'top-right' },
      });
    });

    it('en error, notifica el mensaje del controller y devuelve false', async () => {
      taskController['createTask'].mockResolvedValue({
        ok: false,
        error: new Error('x'),
        message: 'El título debe ser mínimo de 5 caracteres',
      });

      const ok = await store.createTask({ title: 'ab' });

      expect(ok).toBe(false);
      expect(lastToast()).toEqual({
        message: 'El título debe ser mínimo de 5 caracteres',
        options: { type: 'error', closeButton: true, position: 'top-right' },
      });
    });
  });

  describe('updateTask', () => {
    it('cuando modifica filas, notifica el éxito', async () => {
      taskController['updateTask'].mockResolvedValue({ ok: true, data: 1 });

      const ok = await store.updateTask(7, { title: 'Editada' });

      expect(ok).toBe(true);
      expect(lastToast().message).toBe('Tarea actualizada');
    });

    it('cuando no modifica ninguna fila (tarea finalizada), no dice que se actualizó', async () => {
      // El repositorio filtra por !task.finished, así que modify() devuelve 0.
      taskController['updateTask'].mockResolvedValue({ ok: true, data: 0 });

      const ok = await store.updateTask(7, { title: 'Editada' });

      expect(ok).toBe(true); // la página igual cierra el diálogo
      expect(toastMock).not.toHaveBeenCalled();
    });
  });

  describe('updateStatus', () => {
    it('cambia el estado y notifica cuando es distinto al actual', async () => {
      taskController['updateTaskStatus'].mockResolvedValue({ ok: true, data: 1 });

      const ok = await store.updateStatus('completada', buildTask({ status: 'pendiente' }));

      expect(ok).toBe(true);
      expect(taskController['updateTaskStatus']).toHaveBeenCalledWith(7, 'completada');
      expect(lastToast().message).toBe('Estado actualizado');
    });

    it('si el estado elegido es el que ya tenía, no escribe ni notifica', async () => {
      const ok = await store.updateStatus('pendiente', buildTask({ status: 'pendiente' }));

      expect(ok).toBe(false);
      expect(taskController['updateTaskStatus']).not.toHaveBeenCalled();
      expect(toastMock).not.toHaveBeenCalled();
    });

    it('sin tarea, no hace nada', async () => {
      const ok = await store.updateStatus('completada', undefined);

      expect(ok).toBe(false);
      expect(taskController['updateTaskStatus']).not.toHaveBeenCalled();
    });
  });

  describe('finishTask y deleteTask', () => {
    it('finishTask marca finished en true y notifica', async () => {
      taskController['updateTaskFinished'].mockResolvedValue({ ok: true, data: 1 });

      const ok = await store.finishTask(7);

      expect(ok).toBe(true);
      expect(taskController['updateTaskFinished']).toHaveBeenCalledWith(7, true);
      expect(lastToast().message).toBe('Tarea finalizada');
    });

    it('deleteTask notifica y devuelve true', async () => {
      taskController['deleteTask'].mockResolvedValue({ ok: true, data: undefined });

      const ok = await store.deleteTask(7);

      expect(ok).toBe(true);
      expect(lastToast().message).toBe('Tarea eliminada');
    });

    it('si el borrado falla, devuelve false para que la página no navegue', async () => {
      taskController['deleteTask'].mockResolvedValue({
        ok: false,
        error: new Error('x'),
        message: 'Ocurrió un error inesperado',
      });

      expect(await store.deleteTask(7)).toBe(false);
      expect(lastToast().options).toEqual({
        type: 'error',
        closeButton: true,
        position: 'top-right',
      });
    });
  });

  it('todas las operaciones usan la misma configuración de toast', async () => {
    taskController['createTask'].mockResolvedValue({ ok: true, data: 1 });
    taskController['deleteTask'].mockResolvedValue({ ok: true, data: undefined });
    taskController['updateTaskFinished'].mockResolvedValue({ ok: true, data: 1 });

    await store.createTask({});
    await store.deleteTask(7);
    await store.finishTask(7);

    const configuraciones = toastMock.mock.calls.map((call) => call[1]);
    expect(configuraciones).toHaveLength(3);
    configuraciones.forEach((config) =>
      expect(config).toEqual({ type: 'success', closeButton: true, position: 'top-right' }),
    );
  });
});
