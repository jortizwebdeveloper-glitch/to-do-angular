import { computed, Directive, input } from '@angular/core';
import { getColor, type TColor } from '@app/core/shared/theme/color.registry';

@Directive({
  selector: 'button[appButton], a[appButton]',
  host: {
    '[class]': 'classes()',
  },
})
export class AppButton {
  variant = input<TColor>('blue');
  outline = input<boolean>(false);
  theme = computed(() => {
    return getColor(this.variant());
  });
  classes = computed(() => {
    const style = this.outline() ? 'btn-outline' : 'btn';
    return [
      'px-6 py-2.5 rounded-xl inline-block text-center cursor-pointer',
      this.theme()[style],
    ].join(' ');
  });
}
