import { computed, Directive, input } from '@angular/core';
import { getColor, type TColor } from '@app/core/shared/theme/color.registry';

type ButtonSize = 'sm' | 'md' | 'lg';
@Directive({
  selector: 'button[appButton], a[appButton]',
  host: {
    '[class]': 'classes()',
  },
})
export class AppButton {
  variant = input<TColor>('blue');
  size = input<ButtonSize>('md');
  outline = input<boolean>(false);

  btnTheme = computed(() => {
    return getColor(this.variant());
  });
  btnSize = computed(() => {
    switch(this.size()){
      case 'sm':
        return "px-4 py-1 rounded-lg text-sm";
      default: 
        return "px-6 py-2.5 rounded-xl"
    }
  });
  classes = computed(() => {
    const style = this.outline() ? 'btn-outline' : 'btn';
    return [
      'inline-block text-center cursor-pointer',
      this.btnTheme()[style],
      this.btnSize()
    ].join(' ');
  });
}
