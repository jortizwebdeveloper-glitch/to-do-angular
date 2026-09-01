import { Component, input, linkedSignal, output } from '@angular/core';
import { Icon } from '@components/01-atoms/icon/icon';

@Component({
  selector: 'app-input-search',
  templateUrl: './input-search.html',
  imports: [Icon],
})
export class InputSearch {
  value = input<string>('');
  valueChange = output<string>();
  valueLink = linkedSignal(() => this.value() ?? '');

  onInput({ target }: Event) {
    const { value } = target as HTMLInputElement;
    this.onChange(value);
  }
  onClean() {
    this.onChange('');
  }
  onChange(value: string) {
    this.valueLink.set(value);
    this.valueChange.emit(value);
  }
}
