import { Component, input, signal } from '@angular/core';
import { form, FormField, minLength, required, submit } from '@angular/forms/signals';
import { AppButton } from "@components/01-atoms/button/button.directive";
import type { Meta, StoryObj } from '@storybook/angular';
import { fn } from 'storybook/test';

import { CheckboxList } from './checkbox-list/checkbox-list';
import { FormHandle } from './form-handle';
import { InputDate } from './input-date/input-date';
import { InputSelect } from './input-select/input-select';
import { InputText } from './input-text/input-text';
import { InputTextarea } from './input-textarea/input-textarea';

interface OptionSelect {
  label: string;
  value: unknown;
}

interface DemoValue {
  title: string;
  description: string;
  categoria: number;
  tags: number[];
  dueDate: string;
}

/**
 * Componente solo para esta story: arma un formulario real con los átomos de
 * `form-controls` ya probados, wireados vía `form()`/`FormField` de
 * `@angular/forms/signals` (igual que `FormTask`, el único consumidor real de
 * `app-form-handle`). Al hacer submit, usa `submit()` para leer el value del
 * form signal y se lo pasa al spy recibido por `onSubmitSpy` — así el panel
 * Actions muestra el objeto realmente enviado, no solo que hubo un submit.
 */
@Component({
  selector: 'app-form-handle-demo',
  imports: [FormHandle, FormField, InputText, InputTextarea, InputSelect, CheckboxList, InputDate, AppButton],
  template: `
    <app-form-handle (submitHandle)="onSubmit()">
      <div style="display:flex;flex-direction:column;gap:12px;max-width:420px">
        <app-input-text [formField]="formValue.title" placeholder="Título" />
        <app-input-textarea [formField]="formValue.description" placeholder="Descripción" />
        <app-input-select [options]="categorias" [formField]="formValue.categoria" placeholder="Categoría" />
        <app-checkbox-list [options]="etiquetas" [formField]="formValue.tags" label="Etiquetas" />
        <app-input-date [formField]="formValue.dueDate" placeholder="Fecha" />
        <button appButton type="submit" style="margin-top: 4px">Guardar</button>
      </div>
    </app-form-handle>
  `,
})
class FormHandleDemo {
  onSubmitSpy = input<(value: DemoValue) => void>();

  categorias: OptionSelect[] = [
    { label: 'Elige una categoría', value: 0 },
    { label: 'Casa', value: 1 },
    { label: 'Trabajo', value: 2 },
  ];
  etiquetas: OptionSelect[] = [
    { label: 'Urgente', value: 1 },
    { label: 'Casa', value: 2 },
  ];

  data = signal<DemoValue>({ title: '', description: '', categoria: 0, tags: [], dueDate: '' });
  formValue = form(this.data, (f) => {
    required(f.title, { message: 'Título obligatorio' });
    minLength(f.title, 5, { message: 'Mínimo 5 caracteres' });
  });

  onSubmit() {
    submit(this.formValue, async (fields) => {
      this.onSubmitSpy()?.(fields().value());
    });
  }
}

type FormHandleArgs = FormHandleDemo;

const meta: Meta<FormHandleArgs> = {
  title: 'Atoms/FormControls/FormHandle',
  component: FormHandleDemo,
  tags: ['autodocs'],
  args: {
    onSubmitSpy: fn(),
  },
  argTypes: {
    onSubmitSpy: {
      control: false,
      description:
        'Recibe el value del form signal (`fields().value()`) en cada submit válido — ver panel Actions.',
    },
  },
};

export default meta;
type Story = StoryObj<FormHandleArgs>;

/**
 * `app-form-handle` envolviendo un formulario real (título, descripción,
 * categoría, etiquetas y fecha). El submit queda bloqueado por los
 * validadores (`required`/`minLength` en título) hasta completarlo.
 */
export const Default: Story = {};
