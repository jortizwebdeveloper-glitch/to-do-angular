import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Badge } from '@components/01-atoms/badge/badge';
import { Icon } from '@components/01-atoms/icon/icon';
import { IconText } from '@components/01-atoms/icon-text/icon-text';
import { Tag } from '@components/01-atoms/tag/tag';

import { getColor } from '@/app/core/shared/theme/color.registry';
import { DATE_COLOR, DATE_TASK, keyDate, overDue } from '@/app/core/shared/utils/date';
import { CategoryService } from '@/app/features/category';
import { TagService } from '@/app/features/tag';
import { getPriority, getStatus, TaskService } from '@/app/features/task';

@Component({
  selector: 'app-item-list',
  template:
    '<li class="py-3 border-b border-stone-300 dark:border-slate-700 flex justify-between gap-2 text-sm"><ng-content/></li>',
})
export class ItemList {}

@Component({
  selector: 'app-tasks',
  imports: [Icon, Badge, IconText, ItemList, Tag, RouterLink],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks {
  id = input.required<number>();
  color = getColor;
  priority = getPriority;
  status = getStatus;

  taskService = inject(TaskService);
  tagService = inject(TagService);
  categoryService = inject(CategoryService);

  task = computed(() => this.taskService.getTaskById(Number(this.id())));
  date = computed(() => {
    const date = this.task()?.dueDate;
    const key = keyDate(date ?? '');
    const over = overDue(date ?? '');
    return {
      overDue: over,
      color: over ? getColor('red') : key ? getColor(DATE_COLOR[key]) : null,
      label: key ? DATE_TASK[key] : date,
    };
  });

  onSubmit(event: SubmitEvent) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const body: Record<string, any> = {};
    for (const [key, value] of formData.entries()) {
      switch (key) {
        case 'dueDate':
          body['dueDate'] = String(value).replaceAll('-', '/');
          break;
        case 'tags':
          if (!body['tags']) body['tags'] = [];

          body['tags'] = [...body['tags'], Number(value)];
          break;
        default:
          body[key] = value;
      }
    }

    this.taskService.updateTaskById(this.id(), body);
  }
}
