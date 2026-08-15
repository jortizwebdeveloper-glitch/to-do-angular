import { Component, effect, input } from '@angular/core';

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

  onInput(_: Event, value: OptionSelect['value']) {
    this.value.set(value);
  }
}
