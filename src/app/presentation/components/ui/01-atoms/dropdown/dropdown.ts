import { Component, input, output, signal } from '@angular/core';

interface TOption<T> {
  label: string;
  value: T;
}

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.html',
})
export class Dropdown<T> {
  options = input.required<TOption<T>[]>();
  eventChange = output<T>();

  open = signal(false);
  onToggle() {
    this.open.update((s) => !s);
  }
  onClose(e: FocusEvent) {
    const container = e.currentTarget as HTMLElement;
    const newFocusedElement = e.relatedTarget as HTMLElement | null;

    if (!newFocusedElement || !container.contains(newFocusedElement)) {
      this.open.set(false);
    }
  }
  onChange(value: T) {
    this.eventChange.emit(value);
    this.open.set(false);
  }
}
