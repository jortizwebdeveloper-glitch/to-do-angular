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

import { getColor } from '@/app/core/shared/theme/color.registry';
import { getDate } from '@/app/core/shared/utils/date';
import type { TStatusTask } from '@/app/features/task';
import { getPriority, getStatus, STATUS_OPTIONS } from '@/app/features/task';
import { TaskStore } from '@/app/presentation/shared/task.store';

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

  private taskStore = inject(TaskStore);
  router = inject(Router);

  protected readonly statusOptions = STATUS_OPTIONS;

  task = computed(() => {
    const res = this.taskStore.getTaskWithRelation(this.id());
    return res.ok ? res.data : undefined;
  });

  fields = computed(() => {
    const $data = this.task();
    if ($data) {
      const $status = getStatus($data.status);
      const $colorStatus = getColor($status.color);
      const status = { key: $data.status, label: $status.label, color: $colorStatus };

      const priority = getPriority($data.priority);
      const dueDate = getDate($data.dueDate, $data.status);

      return {
        ...$data,
        priority,
        status,
        dueDate,
      };
    }
    return;
  });

  async onUpdateStatus(status: TStatusTask) {
    await this.taskStore.updateStatus(status, this.task());
  }

  dialog = inject(Dialog);
  onDialogEdit() {
    this.dialog.open(UpdateTaskPage, {
      data: {
        id: this.id(),
      },
    });
  }
  onDialogFinished() {
    const dialog = this.dialog.open<boolean>(AppDialog, {
      data: {
        title: 'Finalizar tarea',
        description: 'Vas a finalizar la tarea ¿Estás seguro?',
        next: { label: 'Finalizar', variant: 'emerald' },
      },
    });
    dialog.closed.subscribe((value) => {
      if (value) this.onFinished();
    });
  }
  onDialogDelete() {
    const dialog = this.dialog.open<boolean>(AppDialog, {
      data: {
        title: 'Eliminar tarea',
        description: 'Vas a eliminar la tarea ¿Estás seguro?',
        next: { label: 'Eliminar', variant: 'rose' },
      },
    });
    dialog.closed.subscribe((value) => {
      if (value) this.onDelete();
    });
  }
  async onFinished() {
    await this.taskStore.finishTask(this.id());
  }
  async onDelete() {
    if (await this.taskStore.deleteTask(this.id())) {
      this.router.navigate(['dashboard'], { queryParamsHandling: 'merge' });
    }
  }
}
