import { Component, computed, inject, input, linkedSignal, output } from '@angular/core';
import { form, FormField, submit, validateStandardSchema } from '@angular/forms/signals';
import { OptionsService } from '@app/core/shared/service/options.service';
import { AppButton } from '@components/01-atoms/button/button.directive';
import {
  CheckboxList,
  FormHandle,
  InputSelect,
  InputText,
} from '@components/01-atoms/form-controls';
import { InputDate } from '@components/01-atoms/form-controls/input-date/input-date';
import { InputTextarea } from '@components/01-atoms/form-controls/input-textarea/input-textarea';
import { Icon } from '@components/01-atoms/icon/icon';
import z from 'zod';

const taskSchema = z.object({
  title: z.string().min(5, 'EL título debe ser minimo de 5 caracteres'),
  description: z.string().nonempty('Descripcion obligatoria'),
  categoria: z.number().min(1, 'Debes selccionar una categoría'),
  tags: z.array(z.number()).min(1, 'Debes elegir como minimo 1 etiqueta'),
  priority: z.string().nonempty('Debes elegir una prioridad'),
  dueDate: z.string().nonempty('Debe asignar una fecha'),
});

export type TaskZod = z.infer<typeof taskSchema>;

@Component({
  selector: 'app-form-task',
  imports: [
    FormField,
    InputText,
    InputSelect,
    CheckboxList,
    InputTextarea,
    InputDate,
    FormHandle,
    AppButton,
    Icon,
  ],
  templateUrl: './form-task.html',
})
export class FormTask {
  title = input.required<string>();
  next = input.required<string>();

  optionsService = inject(OptionsService);
  categorias = computed(() => [
    { label: 'Elige una categoría', value: 0 },
    ...this.optionsService.categoryOptions(),
  ]);
  prioridades = computed(() => [
    { label: 'Elige una prioridad', value: '' },
    ...this.optionsService.priorityOptions(),
  ]);

  fields = input<TaskZod | null>(null);
  inputs = linkedSignal(
    () =>
      this.fields() ?? {
        title: '',
        description: '',
        categoria: 0,
        tags: [],
        priority: '',
        dueDate: '',
      },
  );
  formInputs = form(this.inputs, (f) => {
    validateStandardSchema(f, taskSchema);
  });

  eventClose = output();
  eventSubmit = output<TaskZod>();
  onClose() {
    this.eventClose.emit();
  }
  onSubmit() {
    submit(this.formInputs, async (fields) => {
      const $value = fields().value();
      this.eventSubmit.emit($value);
    });
  }
}
