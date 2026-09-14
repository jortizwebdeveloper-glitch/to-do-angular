import { inject, Service } from '@angular/core';
import type { ControllerResult } from '@app/core/shared/utils/controller-boundary';
import type { TaskViewModel, TStatusTask } from '@app/features/task';
import { TaskController } from '@app/features/task';
import { toast } from 'vanilla-toast-js';

/**
 * Capa de orquestación entre las páginas y `TaskController`.
 *
 * `TaskController` es el adaptador de borde: valida, ejecuta y **devuelve** un
 * `ControllerResult` — el equivalente a un cliente HTTP tipado. Deliberadamente no sabe nada
 * de UI. Quien traduce ese resultado en algo que el usuario ve es este store, que es el único
 * lugar del proyecto donde se decide cómo se notifica una operación de tarea.
 *
 * **No guarda estado**: el estado vive en `TaskService` (`tasksResource` + sus computed) y se
 * lee a través del controller. Si algún día este archivo declara un signal propio, ya hay dos
 * fuentes de verdad y se van a desincronizar.
 *
 * Las escrituras devuelven `boolean` (si salió bien) en vez del resultado completo: el store
 * se hace cargo del feedback, y la página decide qué hacer después — cerrar un diálogo,
 * navegar, o nada.
 */
@Service()
export class TaskStore {
  private taskController = inject(TaskController);

  // --- Lecturas: pasan derecho al controller, sin agregar nada ---

  getTasks() {
    return this.taskController.getTasks();
  }

  getTask() {
    return this.taskController.getTask();
  }

  getTaskWithRelation(id: number) {
    return this.taskController.getTaskWithRelation(id);
  }

  selectTask(id: number) {
    return this.taskController.selectTask(id);
  }

  // --- Escrituras: ejecutan, notifican y dicen si salió bien ---

  async createTask(values: Record<string, unknown>) {
    return this.withFeedback(() => this.taskController.createTask(values), 'Tarea creada');
  }

  /**
   * El repositorio filtra por `!task.finished`, así que actualizar una tarea finalizada
   * modifica 0 filas. En ese caso no se notifica éxito: sería mentirle al usuario.
   */
  async updateTask(id: number, values: Record<string, unknown>) {
    const res = await this.taskController.updateTask(id, values);

    if (!res.ok) {
      this.notifyError(res.message);
      return false;
    }

    if (res.data) this.notifySuccess('Tarea actualizada');
    return true;
  }

  async deleteTask(id: number) {
    return this.withFeedback(() => this.taskController.deleteTask(id), 'Tarea eliminada');
  }

  async finishTask(id: number) {
    return this.withFeedback(
      () => this.taskController.updateTaskFinished(id, true),
      'Tarea finalizada',
    );
  }

  /**
   * Cambia el estado de una tarea. Si el estado elegido es el que ya tenía, no hace nada: es
   * un no-op y no tiene sentido escribir ni notificar.
   */
  async updateStatus(status: TStatusTask, task?: TaskViewModel) {
    if (!task || status === task.status) return false;

    return this.withFeedback(
      () => this.taskController.updateTaskStatus(task.id, status),
      'Estado actualizado',
    );
  }

  // --- Feedback: el único lugar donde se define cómo se ve ---

  private async withFeedback(
    operation: () => Promise<ControllerResult<unknown>>,
    successMessage: string,
  ) {
    const res = await operation();

    if (res.ok) {
      this.notifySuccess(successMessage);
      return true;
    }

    this.notifyError(res.message);
    return false;
  }

  private notifySuccess(message: string) {
    toast(message, { type: 'success', closeButton: true, position: 'top-right' });
  }

  private notifyError(message: string) {
    toast(message, { type: 'error', closeButton: true, position: 'top-right' });
  }
}
