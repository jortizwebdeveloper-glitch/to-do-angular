import { Dialog as CdkDialog, DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject, signal } from '@angular/core';
import { AppButton } from '@components/01-atoms/button/button.directive';
import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { fn } from 'storybook/test';

import { Dialog } from './dialog';

/**
 * `app-dialog` es un diálogo de confirmación genérico, pensado para abrirse
 * vía `Dialog.open(AppDialog, { data })` de `@angular/cdk/dialog` (ver su uso
 * real en `task-page.ts`: confirmar "finalizar"/"eliminar" tarea). No recibe
 * `@Input()`s — `title`/`description`/`next` llegan por `DIALOG_DATA`, y
 * `Cancelar`/`Aceptar`/la "x" cierran vía `DialogRef.close()`. Por eso esta
 * story configura ambos tokens con `applicationConfig` en vez de `args`.
 */
class StoryDialogRef {
  close = fn();
}

const meta: Meta<Dialog> = {
  title: 'Molecules/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  parameters: { controls: { disable: true } },
  decorators: [
    applicationConfig({
      providers: [
        { provide: DialogRef, useClass: StoryDialogRef },
        {
          provide: DIALOG_DATA,
          useValue: {
            title: 'Finalizar tarea',
            description: 'Vas a finalizar la tarea ¿Estás seguro?',
            next: { label: 'Finalizar', variant: 'emerald' },
          },
        },
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<Dialog>;

/** Confirmación con `next` personalizado (label + color). */
export const Default: Story = {};

/** Sin `next`: cae al botón "Aceptar" en `variant="blue"`. */
export const SinNext: Story = {
  decorators: [
    applicationConfig({
      providers: [
        { provide: DialogRef, useClass: StoryDialogRef },
        {
          provide: DIALOG_DATA,
          useValue: { title: 'Cerrar sesión', description: '¿Querés cerrar sesión?' },
        },
      ],
    }),
  ],
};

/** Confirmación destructiva (eliminar). */
export const Eliminar: Story = {
  decorators: [
    applicationConfig({
      providers: [
        { provide: DialogRef, useClass: StoryDialogRef },
        {
          provide: DIALOG_DATA,
          useValue: {
            title: 'Eliminar tarea',
            description: 'Vas a eliminar la tarea ¿Estás seguro?',
            next: { label: 'Eliminar', variant: 'rose' },
          },
        },
      ],
    }),
  ],
};

/**
 * Componente solo para esta story: reproduce el caso de uso real
 * (`onDialogFinished` en `task-page.ts`) — inyecta el `Dialog` de
 * `@angular/cdk/dialog` y lo abre con `AppDialog` + `data`, en vez de recibir
 * `DialogRef`/`DIALOG_DATA` ya resueltos como en las demás stories.
 */
@Component({
  selector: 'app-dialog-trigger',
  imports: [AppButton],
  template: `
    <button appButton (click)="onDialogFinished()">Finalizar tarea</button>
    @if (result() !== undefined) {
      <p style="margin-top: 12px">Resultado: {{ result() }}</p>
    }
  `,
})
class DialogTrigger {
  private dialog = inject(CdkDialog);
  result = signal<boolean | undefined>(undefined);

  onDialogFinished() {
    const dialogRef = this.dialog.open<boolean>(Dialog, {
      data: {
        title: 'Finalizar tarea',
        description: 'Vas a finalizar la tarea ¿Esta seguro?',
        next: { label: 'Finalizar', variant: 'emerald' },
      },
    });
    dialogRef.closed.subscribe((value) => {
      this.result.set(value);
    });
  }
}

/**
 * Caso de uso real: un botón que abre el diálogo vía `Dialog.open()` (el CDK
 * de verdad, no un `DialogRef` stubeado) — igual a como lo hace `TaskPage`
 * para confirmar "Finalizar tarea". Al cerrar, muestra el resultado.
 */
export const AbrirDesdeUnBoton: StoryObj<DialogTrigger> = {
  parameters: { controls: { disable: true } },
  render: () => ({
    moduleMetadata: { imports: [DialogTrigger] },
    template: '<app-dialog-trigger></app-dialog-trigger>',
  }),
};
