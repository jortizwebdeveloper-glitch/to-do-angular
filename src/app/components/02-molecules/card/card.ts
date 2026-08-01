import { Component, input } from '@angular/core';
import { Tag } from '@components/01-atoms/tag/tag';
import { Badge } from '@components/01-atoms/badge/badge';
import { IconText } from '@components/01-atoms/icon-text/icon-text';
import { getPriority, getStatus, TTask } from '@/types/task.type';
import { getColor } from '@/shared/theme/color.registry';
import { Icon } from '../../01-atoms/icon/icon';

@Component({
  selector: 'app-card',
  imports: [Tag, Badge, IconText, Icon],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class Card {
  data = input.required<TTask>();
  priority = getPriority
  status = getStatus
  color = getColor
}
