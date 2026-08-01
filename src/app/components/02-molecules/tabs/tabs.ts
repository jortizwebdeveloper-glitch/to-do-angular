import { computeMsgId } from '@angular/compiler';
import { afterEveryRender, Component, computed, input, model, output, signal } from '@angular/core';

export type TTabs = {
  label: string;
  value: string;
};

export type TOutputOnChangeTabs = {
  index: number;
  value: string;
};

@Component({
  selector: 'app-tabs',
  imports: [],
  templateUrl: './tabs.html',
  styleUrl: './tabs.css',
})
export class Tabs {
  items = input.required<TTabs[]>();
  key = input.required();

  value = computed(() => this.key());
  position = computed(() => {
    const index = this.items().findIndex((i) => i.value == this.key());
    return index > 0 ? index : 0;
  });

  onChange = output<TOutputOnChangeTabs>();
  onSetCurrent(event: TOutputOnChangeTabs) {
    const { index, value } = event;
    this.onChange.emit({ index, value });
  }
}
