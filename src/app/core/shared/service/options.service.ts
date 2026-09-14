import { computed, inject, Service } from '@angular/core';
import { CategoryService } from '@app/features/category';
import { TagService } from '@app/features/tag';
import type { TaskViewModel, TStatusTask } from '@app/features/task';
import { TaskController } from '@app/features/task';
import { toast } from 'vanilla-toast-js';

/**
 * Opciones que se derivan del estado reactivo de otras features. Las que salen de un enum
 * (`STATUS_OPTIONS`, `PRIORITY_OPTIONS`) no viven acá: son constantes exportadas desde
 * `features/task`, así quien solo las necesita no arrastra estos servicios.
 */
@Service()
export class OptionsService {
  categoryService = inject(CategoryService);
  tagService = inject(TagService);

  categoryOptions = computed(() =>
    this.categoryService.$categoryArray().map((i) => ({ label: i.name, value: i.id })),
  );
  tagOptions = computed(() =>
    this.tagService.$tagArray().map((i) => ({ label: i.name, value: i.id })),
  );

  private taskController = inject(TaskController);
  async onUpdateStatus(status: TStatusTask, task?: TaskViewModel) {
    if (task) {
      if (status === task.status) return;
      const res = await this.taskController.updateTaskStatus(task.id, status);
      if (res.ok) {
        toast('Estado actualizado', {
          type: 'success',
          closeButton: true,
          position: 'top-right',
        });
      } else {
        toast(res.message, {
          type: 'error',
          position: 'top-right',
        });
      }
    }
  }
}
