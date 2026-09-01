import { Component, computed, inject, input } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { OptionsService } from '@app/core/shared/service/options.service';
import { InputSearch } from '@components/01-atoms/input/input-search';
import { Card } from '@components/02-molecules/card/card';
import type { TTabs } from '@components/02-molecules/tabs/tabs';
import { Tabs, type TOutputOnChangeTabs } from '@components/02-molecules/tabs/tabs';

import { filterByDate } from '@/app/core/shared/utils/date';
import { strNormalize } from '@/app/core/shared/utils/string';
import type { TaskViewModel, TStatusTask } from '@/app/features/task';
import { STATUS_TASK, TaskController } from '@/app/features/task';

@Component({
  selector: 'app-dashboard',
  imports: [Card, Tabs, InputSearch, RouterOutlet],
  templateUrl: './dashboard-page.html',
})
export class DashboardPage {
  private taskController = inject(TaskController);
  private router = inject(Router);

  categoria = input<string>();
  tag = input<string>();
  estado = input<string>();
  search = input<string>();
  fecha = input<string>();

  tasks = computed(() => {
    const $tasks = this.taskController.getTasks();
    const tasks: TaskViewModel[] = [];
    if ($tasks.ok) {
      const iCat = this.categoria();
      const iTag = this.tag();
      const iEst = this.estado();
      const iSearch = strNormalize((this.search() ?? '') as string);
      const iFecha = this.fecha();

      for (const [, task] of $tasks.data) {
        if (iCat != 'all' && task.categoria.id != Number(iCat)) continue;
        if (iTag != 'all' && !task.tags.some((t) => t.id === Number(iTag))) continue;
        if (iEst != 'all' && task.status !== iEst) continue;
        if (iFecha !== filterByDate(task.dueDate, task.finished)) continue;
        if (iSearch && !strNormalize(task.title).includes(iSearch)) continue;

        tasks.push(task);
      }
    }

    return tasks;
  });

  statusList: TTabs[] = [
    {
      label: 'Todo',
      value: 'all',
    },
    {
      label: STATUS_TASK['pendiente'],
      value: 'pendiente',
    },
    {
      label: STATUS_TASK['en_curso'],
      value: 'en_curso',
    },
    {
      label: STATUS_TASK['completada'],
      value: 'completada',
    },
  ];

  optionsService = inject(OptionsService);

  async onUpdateStatus(status: TStatusTask, task: TaskViewModel) {
    this.optionsService.onUpdateStatus(status, task);
  }

  onChangeSearch(search: string) {
    this.router.navigate([], {
      queryParams: {
        search,
      },
      queryParamsHandling: 'merge',
    });
  }

  onChangeStatus({ value: estado }: TOutputOnChangeTabs) {
    this.router.navigate([], {
      queryParams: {
        estado,
      },
      queryParamsHandling: 'merge',
    });
  }
}
