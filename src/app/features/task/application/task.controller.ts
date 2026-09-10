import { inject, Service } from '@angular/core';
import { ControllerBoundary } from '@app/core/shared/utils/controller-boundary';

import {
  createTaskSchemaDTO,
  finishedTaskSchemaDTO,
  idTaskSchemaDTO,
  statusTaskSchemaDTO,
  updateTaskSchemaDTO,
} from './task.dto';
import { TaskService } from './task.service';

@Service()
export class TaskController extends ControllerBoundary {
  private taskService = inject(TaskService);

  private parseId(id: number) {
    return idTaskSchemaDTO.parse({ id }).id;
  }

  getTasks() {
    return this.run(() => this.taskService.$tasks(), 'TaskController:getTasks');
  }
  selectTask(id: number) {
    return this.run(
      () => this.taskService.selectTask(this.parseId(id)),
      'TaskController:selectTask',
    );
  }
  getTask() {
    return this.run(() => this.taskService.$task(), 'TaskController:getTask');
  }
  getTaskWithRelation(id: number) {
    return this.run(
      () => this.taskService.getTaskByIdWithRelation(this.parseId(id)),
      'TaskController:getTaskWithRelation',
    );
  }
  async updateTaskStatus(id: number, status: string) {
    return this.runAsync(
      () =>
        this.taskService.updateStatusTaskById(
          this.parseId(id),
          statusTaskSchemaDTO.parse({ status }),
        ),
      'TaskController:updateTaskStatus',
    );
  }
  async updateTaskFinished(id: number, finished: boolean) {
    return this.runAsync(
      () =>
        this.taskService.updateFinishedTaskById(
          this.parseId(id),
          finishedTaskSchemaDTO.parse({ finished }),
        ),
      'TaskController:updateTaskFinished',
    );
  }
  async createTask(body: Record<string, unknown>) {
    return this.runAsync(
      () => this.taskService.createTask(createTaskSchemaDTO.parse(body)),
      'TaskController:createTask',
    );
  }
  async updateTask(id: number, body: Record<string, unknown>) {
    return this.runAsync(
      () => this.taskService.updateTaskById(this.parseId(id), updateTaskSchemaDTO.parse(body)),
      'TaskController:updateTask',
    );
  }
  async deleteTask(id: number) {
    return this.runAsync(
      () => this.taskService.deleteTaskById(this.parseId(id)),
      'TaskController:deleteTask',
    );
  }
}
