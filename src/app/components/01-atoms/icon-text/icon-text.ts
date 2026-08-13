import { Component, computed, input } from '@angular/core';
import type { IconName } from '../icon/icon.registry';
import { Icon } from '../icon/icon';
import { getColor, type TColor } from '../../../core/shared/theme/color.registry';

@Component({
  selector: 'app-icon-text',
  imports: [Icon],
  templateUrl: './icon-text.html',
  styleUrl: './icon-text.css',
})
export class IconText {
  icon = input<IconName>();
  textColor = input<boolean>(false);
  color = input<TColor>('neutral');
  setColor = computed(() => getColor(this.color()));
  setTextColor = computed(() => {
    const key = getColor(this.color()).text;
    return {[key]: this.textColor()}
  });
}
