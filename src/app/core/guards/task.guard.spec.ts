import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, RouterOutlet } from '@angular/router';
import { TaskService } from '@app/features/task/application/task.service';

import { taskGuard } from './task.guard';

/**
 * El guard se prueba sobre rutas de prueba con componentes vacíos, no sobre las rutas reales:
 * `TaskPage` arrastra servicios respaldados por IndexedDB, y acá lo que importa es la decisión
 * del guard. Las rutas son reales (snapshot real del router), solo los destinos son stubs.
 */
@Component({ imports: [RouterOutlet], template: '<router-outlet />' })
class RootStub {}

@Component({ template: 'página' })
class PageStub {}

describe('taskGuard', () => {
  let router: Router;
  let taskService: { hasOwnTask: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    taskService = { hasOwnTask: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'dashboard', component: PageStub },
          { path: 'task/:id', component: PageStub, canActivate: [taskGuard] },
        ]),
        { provide: TaskService, useValue: taskService },
      ],
    });

    router = TestBed.inject(Router);
    const fixture = TestBed.createComponent(RootStub);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('deja entrar cuando la tarea existe', async () => {
    taskService.hasOwnTask.mockResolvedValue(true);

    const navegó = await router.navigateByUrl('/task/7');

    expect(navegó).toBe(true);
    expect(router.url).toBe('/task/7');
  });

  it('consulta el id de la ruta convertido a número, no como string', async () => {
    taskService.hasOwnTask.mockResolvedValue(true);

    await router.navigateByUrl('/task/7');

    expect(taskService.hasOwnTask).toHaveBeenCalledWith(7);
  });

  it('redirige al dashboard cuando la tarea no existe', async () => {
    taskService.hasOwnTask.mockResolvedValue(false);

    await router.navigateByUrl('/task/999');

    expect(router.url).toBe('/dashboard');
  });

  it('con un id no numérico, no deja entrar y redirige al dashboard', async () => {
    taskService.hasOwnTask.mockResolvedValue(false);

    await router.navigateByUrl('/task/abc');

    expect(taskService.hasOwnTask).toHaveBeenCalledWith(NaN);
    expect(router.url).toBe('/dashboard');
  });
});
