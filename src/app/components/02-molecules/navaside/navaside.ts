import { Component, computed, Input, input, TemplateRef } from '@angular/core';
import { Icon } from '../../01-atoms/icon/icon';
import { getColor } from '@/shared/theme/color.registry';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TNavaside, TNavasideItem } from '@/types/nav.type';
import { Tag } from '../../01-atoms/tag/tag';

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
