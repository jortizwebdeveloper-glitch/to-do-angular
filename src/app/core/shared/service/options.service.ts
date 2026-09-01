import { computed, inject, Service } from '@angular/core';
import { CategoryService } from '@app/features/category';
import { TagService } from '@app/features/tag';
import type { TaskViewModel, TStatusTask } from '@app/features/task';
import {
  PRIORITY_TASK,
  PRIORITY_TASK_VALUES,
  STATU_TASK_VALUES,
  STATUS_TASK,
  TaskController,
} from '@app/features/task';
import { toast } from 'vanilla-toast-js';

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
  priorityOptions = computed(() =>
    PRIORITY_TASK_VALUES.map((key) => ({ label: PRIORITY_TASK[key], value: key })),
  );
  statusOptions = STATU_TASK_VALUES.map((value) => ({ value, label: STATUS_TASK[value] }));

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
