import { Dialog } from '@angular/cdk/dialog';
import { Component, computed, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Badge } from '@components/01-atoms/badge/badge';
import { AppButton } from '@components/01-atoms/button/button.directive';
import { Dropdown } from '@components/01-atoms/dropdown/dropdown';
import { Icon } from '@components/01-atoms/icon/icon';
import { IconText } from '@components/01-atoms/icon-text/icon-text';
import { Tag } from '@components/01-atoms/tag/tag';
import { Dialog as AppDialog } from '@components/02-molecules/dialog/dialog';
import { UpdateTaskPage } from '@pages/dashboard/children/task/children/update-task/page/update-task-page';
import { toast } from 'vanilla-toast-js';

import { getColor } from '@/app/core/shared/theme/color.registry';
import { DATE_COLOR, DATE_TASK, keyDate, overDue } from '@/app/core/shared/utils/date';
import type {
  TStatusTask} from '@/app/features/task';
import {
  getPriority,
  getStatus,
  STATU_TASK_VALUES,
  STATUS_TASK,
  TaskController
} from '@/app/features/task';

@Component({
  selector: 'app-item-list',
  template:
    '<li class="py-3 border-b border-stone-300 dark:border-slate-700 flex justify-between gap-2 text-sm"><ng-content/></li>',
})
export class ItemList {}

@Component({
  selector: 'app-tasks',
  imports: [Dropdown, Icon, Badge, IconText, ItemList, Tag, RouterLink, AppButton],
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

  statusOptions = STATU_TASK_VALUES.map((value) => ({ value, label: STATUS_TASK[value] }));
  async onUpdateStatus(status: TStatusTask) {
    const $task = this.task();
    if($task && status === $task.status)
      return;

    const res = await this.taskController.updateTaskStatus(this.id(), status);
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

  dialog = inject(Dialog);
  onDialogEdit() {
    this.dialog.open(UpdateTaskPage, {
      data: {
        id: this.id(),
      },
    });
  }
  onDialogDelete() {
    const dialog = this.dialog.open<boolean>(AppDialog, {
      data: {
        title: 'Eliminar tarea',
        description: 'Vas a elminar la tarea ¿Esta seguro?',
        next: { label: 'Eliminar', variant: 'rose' },
      },
    });
    dialog.closed.subscribe((value) => {
      if (value) this.onDelete();
    });
  }
  async onDelete() {
    const res = await this.taskController.deleteTask(this.id());
    if (res.ok) {
      toast('Tarea eliminada', {
        type: 'success',
        closeButton: true,
        position: 'top-right',
      });
      this.router.navigate(['dashboard'], {
        queryParamsHandling: 'merge',
      });
    } else {
      toast(res.message, {
        type: 'error',
        position: 'top-right',
      });
    }
  }
}
