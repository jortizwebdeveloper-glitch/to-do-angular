import { Component, computed, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Icon } from '@components/01-atoms/icon/icon';
import type { IconName } from '@components/01-atoms/icon/icon.registry';
import { Tag } from '@components/01-atoms/tag/tag';

import type { TColor } from '@/app/core/shared/theme/color.registry';
import { getColor } from '@/app/core/shared/theme/color.registry';

export interface TNavasideItem {
  id: number | string;
  icon?: IconName;
  name: string;
  color: TColor;
  link?: {
    path?: string;
    query?: Record<string, string> | null;
  };
  count?: number;
}

export interface TNavaside {
  title: string;
  items: TNavasideItem[] | Record<string, TNavasideItem>;
}

@Component({
  selector: 'app-navaside',
  imports: [Icon, RouterLink, RouterLinkActive, Tag],
  templateUrl: './navaside.html',
  styleUrl: './navaside.css',
})
export class Navaside {
  data = input.required<TNavaside>();
  type = input<'tag' | 'default'>('default');
  list = computed(() => {
    const $items = this.data().items;
    if (Array.isArray($items)) {
      return $items.map((item) => this.mapItem(item));
    } else {
      return Object.keys($items).map((key) => this.mapItem($items[key]));
    }
  });

  mapItem({ color, ...item }: TNavasideItem) {
    return { ...item, color: getColor(color) };
  }
}
