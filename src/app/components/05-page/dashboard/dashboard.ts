import { Component, computed, effect, inject, input, model, signal } from '@angular/core';
import { Card } from '../../02-molecules/card/card';
import { Tabs, type TOutputOnChangeTabs, TTabs } from '../../02-molecules/tabs/tabs';
import { Input } from '../../01-atoms/input/input';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { TaskService } from '@/app/services/task.service';
import { STATUS_TASK } from '@/types/task.type';

@Component({
  selector: 'app-dashboard',
  imports: [Card, Tabs, Input, RouterOutlet, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private taskService = inject(TaskService);
  private router = inject(Router);

  categoria = input();
  tag = input();
  estado = input();
  search = input();

  tasks = computed(() =>
    this.taskService
      .tasks()
      .filter(
        (item) =>
          (this.categoria() != 'all' ? item.categoria.id == this.categoria() : true) &&
          (this.tag() != 'all' ? item.tags.find((t) => t.id == this.tag()) : true) &&
          (this.estado() != 'all' ? item.status == this.estado() : true) &&
          (this.search()
            ? this.onNormalize(item.title).includes(this.onNormalize(this.search() as string))
            : true),
      ),
  );

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

  onNormalize(value: string) {
    return value.toLowerCase().replaceAll(' ', '');
  }

  onChangeSearch(search: string) {
    console.log(search)
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
