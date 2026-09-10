import { computed, inject, Service, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { CategoryService } from '@app/features/category';
import { TagService } from '@app/features/tag';
import { TaskRepository } from '@app/features/task/infrastructure/task.repository.dexie';
import { of } from 'rxjs';

import type { CreateTaskDTO, FinishedTaskDTO, StatusTaskDTO, UpdateTaskDTO } from './task.dto';
import type { TaskViewModel } from './task.view';

@Service()
export class TaskService {
  private taskRepository = inject(TaskRepository);

  private categoryService = inject(CategoryService);
  private tagService = inject(TagService);

  private tasksResource = rxResource({
    stream: () => this.taskRepository.getAll(),
  });

  $tasks = computed(() => {
    const categories = this.categoryService.$categories();
    const tags = this.tagService.$tags();
    return new Map(
      (this.tasksResource.value() ?? []).map((task) => [
        task!.id,
        {
          ...task,
          categoria: categories.get(task.categoria),
          tags: task.tags.map((t) => tags.get(t)),
        } as TaskViewModel,
      ]),
    );
  });

  private taskId = signal<number | null>(null);
  selectTask(id: number) {
    this.taskId.set(id);
  }

  taskResource = rxResource({
    params: () => this.taskId(),
    stream: ({ params: id }) => (id === null ? of(undefined) : this.taskRepository.$getById(id)),
  });
  $task = computed(() => {
    return this.taskResource.value();
  });

  getTaskByIdWithRelation(id: number) {
    const task = this.$tasks().get(id);
    if (!task) return;

    return task;
  }
  async hasOwnTask(id: number) {
    return Boolean(await this.taskRepository.getById(id));
  }
  async createTask(body: CreateTaskDTO) {
    return this.taskRepository.add({ ...body, status: 'pendiente' });
  }
  async updateTaskById(id: number, body: UpdateTaskDTO) {
    return this.taskRepository.update(id, body);
  }
  async updateStatusTaskById(id: number, body: StatusTaskDTO) {
    return this.taskRepository.update(id, body);
  }
  async updateFinishedTaskById(id: number, body: FinishedTaskDTO) {
    return this.taskRepository.update(id, body);
  }
  async deleteTaskById(id: number) {
    return this.taskRepository.delete(id);
  }
}
