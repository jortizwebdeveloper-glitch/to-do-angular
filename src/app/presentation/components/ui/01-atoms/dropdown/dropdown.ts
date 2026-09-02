import type { AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { Component, input, output, signal, ViewChild } from '@angular/core';
import { autoUpdate, computePosition, offset, shift } from '@floating-ui/dom';

interface TOption<T> {
  label: string;
  value: T;
}

@Component({
  selector: 'app-dropdown-list',
  templateUrl: './dropdown-list.html',
})
export class DropdownList implements AfterViewInit, OnDestroy {
  referenceEl = input.required<HTMLElement>();
  @ViewChild('floating', { static: true }) floatingRef!: ElementRef<HTMLElement>;

  private stopAutoUpdate?: () => void;

  ngAfterViewInit(): void {
    const $el = this.floatingRef.nativeElement;
    const $reference = this.referenceEl();
    this.stopAutoUpdate = autoUpdate($reference, $el, () => {
      computePosition($reference, $el, {
        strategy: 'fixed',
        placement: 'bottom-end',
        middleware: [offset({ mainAxis: 8 }), shift()],
      }).then(({ x, y }) => {
        Object.assign($el.style, {
          left: `${x}px`,
          top: `${y}px`,
        });
      });
    });
  }
  ngOnDestroy(): void {
    this.stopAutoUpdate?.();
  }
}

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.html',
  imports: [DropdownList],
})
export class Dropdown<T> {
  options = input.required<TOption<T>[]>();
  eventChange = output<T>();
  @ViewChild('trigger', { static: true }) triggerRef!: ElementRef<HTMLElement>;

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
