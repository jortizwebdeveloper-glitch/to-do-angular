import { Component, computed, input } from '@angular/core';
import { getColor, type TColor } from '@app/core/shared/theme/color.registry';
import { Icon } from '@components/01-atoms/icon/icon';
import type { IconName } from '@components/01-atoms/icon/icon.registry';

@Component({
  selector: 'app-icon-text',
  imports: [Icon],
  templateUrl: './icon-text.html',
})
export class IconText {
  icon = input<IconName>();
  textColor = input<boolean>(false);
  color = input<TColor>('neutral');
  setColor = computed(() => {
    const color = getColor(this.color());
    return { color, textColor: { [color.text]: this.textColor() } };
  });
}
