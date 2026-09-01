import { Component, computed, inject, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { OptionsService } from '@app/core/shared/service/options.service';
import { Badge } from '@components/01-atoms/badge/badge';
import { Dropdown } from '@components/01-atoms/dropdown/dropdown';
import { Icon } from '@components/01-atoms/icon/icon';
import { IconText } from '@components/01-atoms/icon-text/icon-text';
import { Tag } from '@components/01-atoms/tag/tag';

import { getColor } from '@/app/core/shared/theme/color.registry';
import {   getDate } from '@/app/core/shared/utils/date';
import type { TaskViewModel, TStatusTask } from '@/app/features/task';
import { getPriority, getStatus } from '@/app/features/task';

@Component({
  selector: 'app-card',
  imports: [Tag, Dropdown, Badge, IconText, Icon, RouterLinkActive, RouterLink],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class Card {
  data = input.required<TaskViewModel>();
  active = input<boolean>();
  eventStatusChenge = output<TStatusTask>();

  optionsService = inject(OptionsService);

  onChange(value: TStatusTask) {
    this.eventStatusChenge.emit(value);
  }

  fields = computed(() => {
    const $data = this.data();
    const $status = getStatus($data.status);
    const $colorStatus = getColor($status.color);
    const status = { key: $data.status, label: $status.label, color: $colorStatus };

    const priority = getPriority($data.priority);

    const dueDate = getDate($data.dueDate);

    return {
      ...$data,
      priority,
      status,
      dueDate,
    };
  });
}
