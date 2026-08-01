import { Component, model, output } from '@angular/core';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-input',
  templateUrl: './input.html',
  styleUrl: './input.css',
  imports: [Icon],
})
export class Input {
  value = model<string>('');
  onChange = output<string>();
  onInput({ target }: Event) {
    const { value } = target as HTMLInputElement;
    this.value.set(value);
    this.onChange.emit(value);
  }
}
