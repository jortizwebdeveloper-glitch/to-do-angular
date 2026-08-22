import { computed, inject, Service } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { CategoryService } from '@app/features/category';
import { TagService } from '@app/features/tag';
import { TaskRepository } from '@app/features/task/infraestruture/task.repository.dexie';

import type { CreateTaskDTO, UpdateTaskDTO } from './task.dto';
import type { TaskViewModel } from './task.view';

@Service()
export class TaskService {
  private taskRepository = inject(TaskRepository);

  private categoryService = inject(CategoryService);
  private tagService = inject(TagService);

  private taskResource = rxResource({
    stream: () => this.taskRepository.getAll(),
  });

  $tasks = computed(() => {
    const categories = this.categoryService.$categories();
    const tags = this.tagService.$tags();
    return new Map(
      (this.taskResource.value() ?? []).map((task) => [
        task!.id,
        {
          ...task,
          categoria: categories.get(task.categoria),
          tags: task.tags.map((t) => tags.get(t)),
        }! as TaskViewModel,
      ]),
    );
  });
  getTaskById(id: number) {
    return this.taskRepository.getById(id);
  }
  getTaskByIdWithRelation(id: number) {
    const task = this.$tasks().get(id);
    if (!task) return;

    return task;
  }
  async createTask(body: CreateTaskDTO) {
    return await this.taskRepository.add({ ...body, status: 'pendiente' });
  }
  async updateTaskById(id: number, body: UpdateTaskDTO) {
    return await this.taskRepository.update(id, body);
  }
}
