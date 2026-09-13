import { Component, input, linkedSignal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { fn } from 'storybook/test';

import type { TOutputOnChangeTabs, TTabs } from './tabs';
import { Tabs } from './tabs';

/**
 * `app-tabs` es un selector de pestañas con un indicador deslizante
 * (`translateX` según la posición del item activo). No mantiene estado
 * propio: `value` llega por `@Input()` y cada click emite `valueChange` con
 * `{ index, value }`, quedando a cargo del consumidor actualizar `value`
 * (uso real en `dashboard-page.ts`, que navega con `queryParamsHandling:
 * 'merge'`). Por eso esta story usa un wrapper (`TabsDemo`) que sí guarda el
 * `value` en un signal y lo realimenta a `app-tabs`, para ver el indicador
 * moverse al hacer click.
 */
@Component({
  selector: 'app-tabs-demo',
  imports: [Tabs],
  template: `
    <div style="max-width:640px">
      <app-tabs [items]="items()" [value]="value()" (valueChange)="onChange($event)" />
    </div>
  `,
})
class TabsDemo {
  items = input.required<TTabs[]>();
  initialValue = input.required<string>();
  onValueChange = input<(event: TOutputOnChangeTabs) => void>();

  value = linkedSignal(() => this.initialValue());

  onChange(event: TOutputOnChangeTabs) {
    this.value.set(event.value);
    this.onValueChange()?.(event);
  }
}

type TabsArgs = TabsDemo;

const meta: Meta<TabsArgs> = {
  title: 'Molecules/Tabs',
  component: TabsDemo,
  tags: ['autodocs'],
  args: {
    items: [
      { label: 'Todo', value: 'all' },
      { label: 'Pendiente', value: 'pendiente' },
      { label: 'En curso', value: 'en_curso' },
      { label: 'Completada', value: 'completada' },
    ],
    initialValue: 'all',
    onValueChange: fn(),
  },
  argTypes: {
    items: { control: 'object', description: 'Lista de pestañas `{ label, value }`.' },
    initialValue: {
      control: 'text',
      description: 'Value inicial (debe matchear el de algún item).',
    },
    onValueChange: {
      control: false,
      description: 'Recibe `{ index, value }` en cada click — ver panel Actions.',
    },
  },
};

export default meta;
type Story = StoryObj<TabsArgs>;

/** Cuatro pestañas, como el filtro de estado en `dashboard-page`. */
export const Default: Story = {};

/** Dos pestañas: el indicador ocupa la mitad del ancho. */
export const DosPestanas: Story = {
  args: {
    items: [
      { label: 'Activas', value: 'activas' },
      { label: 'Archivadas', value: 'archivadas' },
    ],
    initialValue: 'activas',
  },
};

/** `initialValue` sin match en `items`: ninguna pestaña queda activa. */
export const SinCoincidencia: Story = {
  args: { initialValue: 'no-existe' },
};
