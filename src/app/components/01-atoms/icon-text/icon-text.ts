import { Component, computed, input } from '@angular/core';
import { getColor, type TColor } from '@app/core/shared/theme/color.registry';
import { Icon } from '@components/01-atoms/icon/icon';
import type { IconName } from '@components/01-atoms/icon/icon.registry';

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
