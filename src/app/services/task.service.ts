import { computed, inject, Service, signal } from '@angular/core';
import type { TTask } from '@/types/task.type';
import { rxResource } from '@angular/core/rxjs-interop';
import { TaskRepository } from '../repository/task/task.repository';
import { CategoryRepository } from '../repository/category/category.repository';
import { TagRepository } from '../repository/tag/tag.repository';

@Service()
export class TaskService {
  private taskRepository = inject(TaskRepository);
  private categoryRepository = inject(CategoryRepository);
  private tagRepository = inject(TagRepository);

  private taskResource = rxResource({
    stream: () => this.taskRepository.getTasks(),
  });
  private categoryResource = rxResource({
    stream: () => this.categoryRepository.getCategories(),
  });
  private tagResource = rxResource({
    stream: () => this.tagRepository.getTags(),
  });

  $categories = computed(
    () => new Map((this.categoryResource.value() ?? []).map((cat) => [cat!.id, cat!])),
  );
  $tags = computed(() => new Map((this.tagResource.value() ?? []).map((tag) => [tag!.id, tag!])));
  $tasks = computed(() => {
    const categories = this.$categories();
    const tags = this.$tags();
    return new Map(
      (this.taskResource.value() ?? []).map((task) => [
        task.id,
        {
          ...task,
          categoria: categories.get(task.categoria),
          tags: task.tags.map((t) => tags.get(t)),
        } as TTask,
      ]),
    );
  });
  getTaskById(id: number) {
    const task = this.$tasks().get(id);
    if (!task) return;

    return task;
  }
}
