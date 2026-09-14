import { Component, computed, inject, input, linkedSignal, output } from '@angular/core';
import { form, FormField, submit, validateStandardSchema } from '@angular/forms/signals';
import { OptionsService } from '@app/core/shared/service/options.service';
import { PRIORITY_OPTIONS } from '@app/features/task';
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

import type { TaskZod } from './form.type';
import { taskSchema } from './form.type';

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
  prioridades = [{ label: 'Elige una prioridad', value: '' }, ...PRIORITY_OPTIONS];

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
