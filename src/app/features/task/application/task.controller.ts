import { inject, Service } from '@angular/core';

import { createTaskSchemaDTO, idTaskSchemaDTO, updateTaskSchemaDTO } from './task.dto';
import { TaskService } from './task.service';

@Service()
export class TaskController {
  private taskService = inject(TaskService);
  getTasks() {
    return this.taskService.$tasks();
  }
  getTask(id: number) {
    const ID = idTaskSchemaDTO.parse({ id }).id;
    return this.taskService.getTaskById(ID);
  }
  getTaskWithRelation(id: number) {
    return this.taskService.getTaskByIdWithRelation(Number(id));
  }
  async createTask(body: Record<string, unknown>) {
    try {
      const id = await this.taskService.createTask(createTaskSchemaDTO.parse(body));
      console.log('Tarea creada: ', id);
    } catch (e) {
      console.warn('TaskController:createTask', e);
    }
  }
  async updateTask(id: number, body: Record<string, unknown>) {
    try {
      const changes = await this.taskService.updateTaskById(
        Number(id),
        updateTaskSchemaDTO.parse(body),
      );
      console.log('Registros afectados: ', changes);
    } catch (e) {
      console.warn('TaskController:updateTask', e);
    }
  }
}
