import { computed, inject, Service } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { CategoryService } from '@app/features/category';
import { TagService } from '@app/features/tag';
import type { TaskEntity } from '@app/features/task/domine/task.entity';
import { TaskRepository } from '@app/features/task/infraestruture/task.repository.dexie';

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
    const task = this.$tasks().get(id);
    if (!task) return;

    return task;
  }
  async updateTaskById(id: number, body: Partial<Omit<TaskEntity, 'id'>>) {
    await this.taskRepository.update(Number(id), {
      title: body.title,
      categoria: Number(body.categoria),
      dueDate: body.dueDate,
      tags: body.tags?.length ? body.tags : [],
    });
  }
}
