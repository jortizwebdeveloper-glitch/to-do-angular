import { Component, linkedSignal } from '@angular/core';

import { InputBase } from '@/app/presentation/components/ui/01-atoms/form-controls/input-base';
import { InputLabel } from '@/app/presentation/components/ui/01-atoms/form-controls/input-label/input-label';

@Component({
  selector: 'app-input-date',
  templateUrl: './input-date.html',
  imports: [InputLabel],
})
export class InputDate extends InputBase<string> {
  visibleValue = linkedSignal(() => this.value()?.replace(/\//g, '-') ?? '');
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value.set(input.value.replace(/-/g, '/'));
  }
}
