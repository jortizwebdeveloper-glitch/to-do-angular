import { Component, input } from '@angular/core';

import { InputBase } from '@/app/presentation/components/ui/01-atoms/form-controls/input-base';
import { InputLabel } from '@/app/presentation/components/ui/01-atoms/form-controls/input-label/input-label';

interface OptionSelect {
  label: string;
  value: unknown;
}

@Component({
  selector: 'app-input-select',
  templateUrl: './input-select.html',
  imports: [InputLabel],
})
export class InputSelect extends InputBase<unknown> {
  options = input.required<OptionSelect[]>();
  onInput(e: Event) {
    const v = (e.target as HTMLSelectElement).value;
    const $options = this.options();
    const value = $options.find((i) => String(i.value) === v)?.value ?? $options[0].value;
    this.value.set(value);
  }
}
