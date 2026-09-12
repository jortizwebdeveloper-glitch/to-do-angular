import { Component, signal } from '@angular/core';
import { AppButton } from '@components/01-atoms/button/button.directive';
import type { Meta, StoryObj } from '@storybook/angular';

import { Modal } from './modal';

/**
 * `app-modal` es un contenedor genérico que proyecta su contenido dentro de
 * un overlay de `@angular/cdk/overlay` (centrado, con backdrop con blur).
 * No recibe `@Input()`s: solo emite `eventClose` al hacer click en el
 * backdrop. Uso real en `create-task-page.html`, envolviendo `app-form-task`.
 *
 * El overlay se crea apenas se monta `app-modal` (`afterNextRender` en el
 * constructor), así que si estuviera siempre presente en la story taparía la
 * documentación de `autodocs` con su backdrop. Por eso esta story la monta
 * recién al hacer click en un botón (`@if`), igual que `AbrirDesdeUnBoton`
 * en `dialog.stories.ts`.
 */
@Component({
  selector: 'app-modal-trigger',
  imports: [Modal, AppButton],
  template: `
    <button appButton (click)="open.set(true)">Abrir modal</button>
    @if (open()) {
      <app-modal (eventClose)="open.set(false)">
        <div style="background:#1e293b;color:white;padding:24px;border-radius:8px;max-width:320px">
          <p>Contenido proyectado dentro del modal.</p>
          <p style="opacity:.75;font-size:13px;margin-top:8px">Hacé click fuera (en el backdrop) para cerrar.</p>
        </div>
      </app-modal>
    }
  `,
})
class ModalTrigger {
  open = signal(false);
}

const meta: Meta<ModalTrigger> = {
  title: 'Molecules/Modal',
  component: ModalTrigger,
  tags: ['autodocs'],
  parameters: { controls: { disable: true } },
};

export default meta;
type Story = StoryObj<ModalTrigger>;

/** El modal se monta (y crea su overlay) recién al abrirlo con el botón. */
export const Default: Story = {};
