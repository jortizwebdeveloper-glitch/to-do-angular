import { computed, Service, signal } from '@angular/core';
import type { TTask } from '@/types/task.type';
import tasks from '@public/tasks.json';
import categories from '@public/categorias.json';
import tags from '@public/tags.json';
import { TNavasideItem } from '@/types/nav.type';

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
}

@Service()
export class CategoryService {
  private _categories = signal(
    Object.fromEntries(
      categories.map((item) => [
        item.id,
        {
          ...item,
          link: { query: { categoria: String(item.id) } },
          count: 0,
        },
      ]),
    ),
  );
  readonly categories = this._categories.asReadonly();
}

@Service()
export class TagService {
  private _tags = signal(
    tags.map((item) => ({
      ...item,
      link: { query: { tag: String(item.id) } },
    })) as TNavasideItem[],
  );
  readonly tags = this._tags.asReadonly();
}
