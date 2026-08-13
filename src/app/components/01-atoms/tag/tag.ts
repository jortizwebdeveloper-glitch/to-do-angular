import { Component, computed, input } from '@angular/core';
import { getColor, type TColor } from '../../../core/shared/theme/color.registry';

@Component({
  selector: 'app-tag',
  imports: [],
  templateUrl: './tag.html',
  styleUrl: './tag.css',
})
export class Tag {
  color = input<TColor>('neutral');
  active = input<boolean>(false);
  size = input<'xs' | 'sm'>('xs');
  className = computed(() => {
    const classes = [this.setSize(), this.setActive()];
    return classes.join(' ');
  });
  setActive() {
    const color = this.setColor();
    return this.active() ? `${color.bg} text-white border-transparent` : `${color.text} bg-current/10 border-current/50`;
  }
  setColor() {
    return getColor(this.color());
  }
  setSize() {
    return this.size() == 'sm' ? 'text-sm' : 'text-xs';
  }
}
