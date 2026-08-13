import { Component, computed, input } from '@angular/core';
import { getColor, type TColor } from '../../../core/shared/theme/color.registry';

@Component({
  selector: 'app-badge',
  imports: [],
  templateUrl: './badge.html',
  styleUrl: './badge.css',
})
export class Badge {
  color = input<TColor>('neutral');
  setColor = computed(() => getColor(this.color()).text);
}
