import { Component, computed, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Badge } from '@components/01-atoms/badge/badge';
import { AppButton } from '@components/01-atoms/button/button.directive';
import { Icon } from '@components/01-atoms/icon/icon';
import { IconText } from '@components/01-atoms/icon-text/icon-text';
import { Tag } from '@components/01-atoms/tag/tag';
import { UpdateTaskPage } from '@pages/dashboard/children/task/update-task/page/update-task-page';

import { getColor } from '@/app/core/shared/theme/color.registry';
import { DATE_COLOR, DATE_TASK, keyDate, overDue } from '@/app/core/shared/utils/date';
import { getPriority, getStatus, TaskController } from '@/app/features/task';

@Component({
  selector: 'app-item-list',
  template:
    '<li class="py-3 border-b border-stone-300 dark:border-slate-700 flex justify-between gap-2 text-sm"><ng-content/></li>',
})
export class ItemList {}

@Component({
  selector: 'app-tasks',
  imports: [Icon, Badge, IconText, ItemList, Tag, RouterLink, AppButton, UpdateTaskPage],
  templateUrl: './task-page.html',
})
export class TaskPage {
  id = input.required<number>();
  color = getColor;
  priority = getPriority;
  status = getStatus;

  taskController = inject(TaskController);
  router = inject(Router);

  task = computed(() => {
    const res = this.taskController.getTaskWithRelation(this.id());
    return res.ok ? res.data : undefined;
  });
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

  show = signal<boolean>(false);
  onEdit() {
    this.show.set(true);
  }
  async onDelete() {
    console.log("")
    const ok = confirm('¿Desea elminar esta tarea?');
    if (ok) {
      const res = await this.taskController.deleteTask(this.id());
      alert(res.ok ? 'Tarea elminada' : res.message);
      this.router.navigate(['dashboard'], {
        queryParamsHandling: 'merge'
      })
    }
  }
}
