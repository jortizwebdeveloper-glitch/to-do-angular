import { Component } from '@angular/core';

import { InputBase } from '@/app/presentation/components/ui/01-atoms/form-controls/input-base';
import { InputLabel } from '@/app/presentation/components/ui/01-atoms/form-controls/input-label/input-label';

@Component({
  selector: 'app-input-text',
  templateUrl: './input-text.html',
  imports: [InputLabel],
})
export class InputText extends InputBase<string> {
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value.set(input.value);
  }
}
