import { Directive, input, model, output } from '@angular/core';
import type { FormValueControl, ValidationError } from '@angular/forms/signals';

@Directive()
export abstract class InputBase<T> implements FormValueControl<T | null> {
  readonly value = model<T | null>(null);
  name = input.required<string>();
  touched = input<boolean>(false);
  invalid = input<boolean>(false);
  errors = input<readonly ValidationError[]>([]);
  touch = output<void>();

  placeholder = input<string>();
  label = input<string>();

  onBlur() {
    this.touch.emit();
  }

  abstract onInput(event: Event, value?:unknown): void;
}
