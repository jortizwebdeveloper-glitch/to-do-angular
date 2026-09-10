import { TestBed } from '@angular/core/testing';

import { TaskController } from './task.controller';
import { createTaskSchemaDTO } from './task.dto';
import { TaskService } from './task.service';
import type { TaskViewModel } from './task.view';

describe('TaskController', () => {
  let controller: TaskController;
  let taskService: { getTaskByIdWithRelation: ReturnType<typeof vi.fn>; createTask: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    taskService = {
      getTaskByIdWithRelation: vi.fn(),
      createTask: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [TaskController, { provide: TaskService, useValue: taskService }],
    });

    controller = TestBed.inject(TaskController);
  });

  describe('getTaskWithRelation (camino síncrono)', () => {
    it('devuelve { ok: true, data } cuando el service encuentra la tarea', () => {
      const fakeTask = { id: 1, title: 'Tarea' } as TaskViewModel;
      taskService.getTaskByIdWithRelation.mockReturnValue(fakeTask);

      const res = controller.getTaskWithRelation(1);

      expect(res).toEqual({ ok: true, data: fakeTask });
      expect(taskService.getTaskByIdWithRelation).toHaveBeenCalledWith(1);
    });

    it('devuelve { ok: true, data: undefined } cuando no existe la tarea', () => {
      taskService.getTaskByIdWithRelation.mockReturnValue(undefined);

      const res = controller.getTaskWithRelation(999);

      expect(res).toEqual({ ok: true, data: undefined });
    });
  });

  describe('createTask (camino async con Zod)', () => {
    const validBody = {
      title: 'Comprar insumos',
      description: 'Ir a la tienda',
      categoria: 1,
      tags: [1],
      priority: 'alta',
      dueDate: '2026-01-01',
    };

    it('devuelve { ok: true, data } cuando el body es válido y el service resuelve', async () => {
      taskService.createTask.mockResolvedValue(42);

      const res = await controller.createTask(validBody);

      expect(res).toEqual({ ok: true, data: 42 });
    });

    it('devuelve el mensaje específico del campo cuando el body no pasa la validación de Zod', async () => {
      const invalidBody = { ...validBody, title: 'ab' }; // menos de 5 caracteres
      const expectedMessage = createTaskSchemaDTO.safeParse(invalidBody).error?.issues[0]?.message;

      const res = await controller.createTask(invalidBody);

      expect(res.ok).toBe(false);
      if (!res.ok) {
        expect(res.message).toBe(expectedMessage);
        expect(res.message).not.toBe('Ocurrió un error inesperado');
      }
      expect(taskService.createTask).not.toHaveBeenCalled();
    });

    it('devuelve el mensaje genérico cuando el service falla por una razón no relacionada a validación', async () => {
      taskService.createTask.mockRejectedValue(new Error('Dexie: quota exceeded'));

      const res = await controller.createTask(validBody);

      expect(res).toEqual({
        ok: false,
        error: expect.any(Error),
        message: 'Ocurrió un error inesperado',
      });
    });
  });
});
