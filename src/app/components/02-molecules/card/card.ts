import { Component, computed, input } from '@angular/core';
import { Tag } from '@components/01-atoms/tag/tag';
import { Badge } from '@components/01-atoms/badge/badge';
import { IconText } from '@components/01-atoms/icon-text/icon-text';
import { DATE_COLOR, DATE_TASK, getPriority, getStatus, TTask } from '@/types/task.type';
import { getColor } from '@/shared/theme/color.registry';
import { Icon } from '../../01-atoms/icon/icon';
import { keyDate } from '@/shared/utils/date';
import { RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-card',
  imports: [Tag, Badge, IconText, Icon, RouterLinkActive],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class Card {
  data = input.required<TTask>();
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
