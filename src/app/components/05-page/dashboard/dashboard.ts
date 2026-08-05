import { Component, computed, effect, inject, input, model, signal } from '@angular/core';
import { Card } from '../../02-molecules/card/card';
import { Tabs, type TOutputOnChangeTabs, TTabs } from '../../02-molecules/tabs/tabs';
import { Input } from '../../01-atoms/input/input';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { TaskService } from '@/app/services/task.service';
import { STATUS_TASK, TTask } from '@/types/task.type';
import { filterByDate } from '@/shared/utils/date';
import { strNormalize } from '@/shared/utils/string';

@Component({
  selector: 'app-dashboard',
  imports: [Card, Tabs, Input, RouterOutlet, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private taskService = inject(TaskService);
  private router = inject(Router);

  categoria = input<string>();
  tag = input<string>();
  estado = input<string>();
  search = input<string>();
  fecha = input<string>();

  tasks = computed(() => {
    const $tasks = this.taskService.$tasks();
    const iCat = this.categoria();
    const iTag = this.tag();
    const iEst = this.estado();
    const iSearch = strNormalize((this.search() ?? '') as string);
    const iFecha = this.fecha();

    const tasks: TTask[] = [];
    for (const [_, task] of $tasks) {
      if (iCat != 'all' && task.categoria.id != Number(iCat)) continue;
      if (iTag != 'all' && !task.tags.some((t) => t.id === Number(iTag))) continue;
      if (iEst != 'all' && task.status !== iEst) continue;
      if (iFecha !== filterByDate(task.dueDate, task.status === 'completada')) continue;
      if (iSearch && !strNormalize(task.title).includes(iSearch)) continue;

      tasks.push(task);
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
  ];
  
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
