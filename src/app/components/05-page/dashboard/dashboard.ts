import { Component, computed, effect, inject, input, model, signal } from '@angular/core';
import { Card } from '../../02-molecules/card/card';
import { Tabs, type TOutputOnChangeTabs, TTabs } from '../../02-molecules/tabs/tabs';
import { Input } from '../../01-atoms/input/input';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { TaskService } from '@/app/services/task.service';
import { STATUS_TASK, TTask } from '@/types/task.type';
import { filterByDate } from '@/shared/utils/date';
import { NavService } from '@/app/services/nav.service';

@Component({
  selector: 'app-dashboard',
  imports: [Card, Tabs, Input, RouterOutlet, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private taskService = inject(TaskService);
  private navService = inject(NavService);
  private router = inject(Router);

  categoria = input<string>();
  tag = input<string>();
  estado = input<string>();
  search = input<string>();
  fecha = input<string>();

  tasks = computed(() => {
    const fechas: Record<string, number> = {};
    const categorias: Record<string, number> = {};
    const tasks: TTask[] = [];

    for (const item of this.taskService.tasks()) {
      const cat = this.categoria();
      const catID = item.categoria.id;
      const categoria = cat != 'all' ? catID == Number(cat) : true;

      const tag = this.tag() != 'all' ? item.tags.find((t) => t.id == Number(this.tag())) : true;
      const estado = this.estado() != 'all' ? item.status == this.estado() : true;
      const search = this.search()
        ? this.onNormalize(item.title).includes(this.onNormalize(this.search() as string))
        : true;
      const keyFecha = filterByDate(item.dueDate, item.status == 'completada');
      const fecha = this.fecha() == keyFecha;

      if (!fechas[keyFecha]) fechas[keyFecha] = 0;
      fechas[keyFecha]++;

      if (fecha) {
        if (!categorias[catID]) categorias[catID] = 0;
        categorias[catID]++;
      }

      if (categoria && tag && estado && search && fecha) {
        tasks.push(item);
      }
    }

    Object.keys(fechas).forEach((key) => {
      const items = this.navService.date_menu().items;
      if (!Array.isArray(items)) {
        items[key].count = fechas[key];
      }
    });

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

  onNormalize(value: string) {
    return value.toLowerCase().replaceAll(' ', '');
  }

  onChangeSearch(search: string) {
    console.log(search);
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
