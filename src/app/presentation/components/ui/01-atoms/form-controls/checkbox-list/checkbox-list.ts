import { Component, input } from '@angular/core';
import { InputLabel } from '@components/01-atoms/form-controls/input-label/input-label';

import { InputBase } from '@/app/presentation/components/ui/01-atoms/form-controls/input-base';

interface OptionSelect {
  label: string;
  value: unknown;
}

@Component({
  selector: 'app-checkbox-list',
  templateUrl: './checkbox-list.html',
  imports: [InputLabel],
})
export class CheckboxList extends InputBase<unknown[]> {
  options = input.required<OptionSelect[]>();

  onInput(event: Event, value: OptionSelect['value']) {
    const input = event.target as HTMLInputElement;
    const values = new Set(this.value());
    if (input.checked) values.add(value);
    else values.delete(value);

    this.value.set([...values]);
  }
}
