import { Component, computed, input } from '@angular/core';
import { getColor, TColors } from '../../../../shared/theme/color.registry';

@Component({
  selector: 'app-badge',
  imports: [],
  templateUrl: './badge.html',
  styleUrl: './badge.css',
})
export class Badge {
  color = input<TColors>('neutral');
  setColor = computed(() => getColor(this.color()).text);
}
