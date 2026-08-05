import { computed, inject, Service, signal } from '@angular/core';
import type { TTask } from '@/types/task.type';
import tasks from '@public/tasks.json';
import categories from '@public/categorias.json';
import tags from '@public/tags.json';
import { rxResource } from '@angular/core/rxjs-interop';
import { TaskRepository } from '../repository/task.repository';

@Service()
export class TaskService {
  private _tasks = signal<TTask[]>(
    tasks.map((item, id) => ({
      ...item,
      id: id + 1,
      categoria: categories.find((c) => c.id == item.categoria),
      tags: item.tags.map((t) => tags.find((tt) => tt.id == t)),
    })) as Array<TTask>,
  );
  readonly tasks = this._tasks.asReadonly();
  getTasks() {
    return computed(() => this.tasks());
  }
  getTask(id: number) {
    return this.tasks().find((t) => t.id == id);
  }

  private taskRepository = inject(TaskRepository);
  private taskResource = rxResource({
    stream: () => this.taskRepository.getTasks(),
  });
  $tasks = computed(() => this.taskResource.value());
}
