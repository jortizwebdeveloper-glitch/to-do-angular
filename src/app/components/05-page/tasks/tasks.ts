import { Component, computed, inject, input } from '@angular/core';
import { Badge } from '@components/01-atoms/badge/badge';
import { IconText } from '@components/01-atoms/icon-text/icon-text';
import { Tag } from '@components/01-atoms/tag/tag';
import { getColor } from '@/shared/theme/color.registry';
import { getPriority, getStatus } from '@/types/task.type';
import { TaskService } from '@/app/services/task.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-item-list',
  template:
    '<li class="py-3 border-b border-stone-300 flex justify-between gap-2 text-sm"><ng-content/></li>',
})
export class ItemList {}

@Component({
  selector: 'app-tasks',
  imports: [Badge, IconText, ItemList, Tag, RouterLink],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks {
  id = input.required<number>();
  color = getColor;
  priority = getPriority;
  status = getStatus;
  taskService = inject(TaskService);
  task = computed(() => this.taskService.getTaskById(Number(this.id())));
}
