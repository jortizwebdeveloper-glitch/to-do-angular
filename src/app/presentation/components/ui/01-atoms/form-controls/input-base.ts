import { _IdGenerator } from '@angular/cdk/a11y';
import { computed, Directive, inject, input, model, output } from '@angular/core';
import type { FormValueControl, ValidationError } from '@angular/forms/signals';

@Directive()
export abstract class InputBase<T> implements FormValueControl<T | null> {
  protected readonly key = inject(_IdGenerator).getId('ng-input-');
  readonly value = model<T | null>(null);
  name = input.required<string>();
  touched = input<boolean>(false);
  invalid = input<boolean>(false);
  errors = input<readonly ValidationError[]>([]);
  touch = output<void>();

  placeholder = input<string>('');
  label = input<string>();

  ngName = computed(() => `${this.key}-${this.name()}`);

  onBlur() {
    this.touch.emit();
  }

  abstract onInput(event: Event, value?: unknown): void;
}
