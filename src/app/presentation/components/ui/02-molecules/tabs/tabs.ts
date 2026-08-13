import { Component, computed, input, output } from '@angular/core';

export interface TTabs {
  label: string;
  value: string;
}

export interface TOutputOnChangeTabs {
  index: number;
  value: string;
}

@Component({
  selector: 'app-tabs',
  imports: [],
  templateUrl: './tabs.html',
  styleUrl: './tabs.css',
})
export class Tabs {
  items = input.required<TTabs[]>();
  value = input.required();

  key = computed(() => this.value());
  position = computed(() => {
    const index = this.items().findIndex((i) => i.value == this.value());
    return index > 0 ? index : 0;
  });

  valueChange = output<TOutputOnChangeTabs>();
  onSetCurrent(event: TOutputOnChangeTabs) {
    const { index, value } = event;
    this.valueChange.emit({ index, value });
  }
}
