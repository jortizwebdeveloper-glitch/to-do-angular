import { Component, input, output } from '@angular/core';
import { Icon } from '@components/01-atoms/icon/icon';

@Component({
  selector: 'app-input',
  templateUrl: './input.html',
  styleUrl: './input.css',
  imports: [Icon],
})
export class Input {
  value = input<string>('');
  valueChange = output<string>();
  onInput({ target }: Event) {
    const { value } = target as HTMLInputElement;
    this.valueChange.emit(value);
  }
}
