import { Component, computed, input } from '@angular/core';
import { RouterLinkActive } from '@angular/router';
import { Badge } from '@components/01-atoms/badge/badge';
import { Icon } from '@components/01-atoms/icon/icon';
import { IconText } from '@components/01-atoms/icon-text/icon-text';
import { Tag } from '@components/01-atoms/tag/tag';

import { getColor } from '@/app/core/shared/theme/color.registry';
import { DATE_COLOR, DATE_TASK, keyDate } from '@/app/core/shared/utils/date';
import type { TaskViewModel } from '@/app/features/task';
import { getPriority, getStatus } from '@/app/features/task';

@Component({
  selector: 'app-card',
  imports: [Tag, Badge, IconText, Icon, RouterLinkActive],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class Card {
  data = input.required<TaskViewModel>();
  active = input<boolean>();
  priority = getPriority;
  status = getStatus;
  color = getColor;

  date = computed(() => {
    const date = this.data().dueDate;
    const key = keyDate(date);
    return {
      color: key ? getColor(DATE_COLOR[key]) : null,
      label: key ? DATE_TASK[key] : date,
    };
  });
}
