import { inject, Service } from '@angular/core';
import { ControllerException } from '@app/core/shared/utils/errors';

import { createTaskSchemaDTO, idTaskSchemaDTO, updateTaskSchemaDTO } from './task.dto';
import { TaskService } from './task.service';

@Service()
export class TaskController extends ControllerException {
  private taskService = inject(TaskService);
  getTasks() {
    return this.validate(() => this.taskService.$tasks(), 'TaskController:getTasks');
  }
  getTask(id: number) {
    return this.validate(
      () => this.taskService.getTaskById(idTaskSchemaDTO.parse({ id }).id),
      'TaskController:getTask',
    );
  }
  getTaskWithRelation(id: number) {
    return this.validate(
      () => this.taskService.getTaskByIdWithRelation(idTaskSchemaDTO.parse({ id }).id),
      'TaskController:getTaskWithRelation',
    );
  }
  async createTask(body: Record<string, unknown>) {
    return this.validateAsync(
      () => this.taskService.createTask(createTaskSchemaDTO.parse(body)),
      'TaskController:createTask',
    );
  }
  async updateTask(id: number, body: Record<string, unknown>) {
    return this.validateAsync(
      () =>
        this.taskService.updateTaskById(
          idTaskSchemaDTO.parse({ id }).id,
          updateTaskSchemaDTO.parse(body),
        ),
      'TaskController:updateTask',
    );
  }
}
