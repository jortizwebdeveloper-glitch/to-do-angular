import { Component, computed, inject, signal } from '@angular/core';
import { form, FormField, submit, validateStandardSchema } from '@angular/forms/signals';
import { z } from 'zod';

import { CategoryService } from '@/app/features/category';
import { TagService } from '@/app/features/tag';
import { PRIORITY_TASK, PRIORITY_TASK_VALUES } from '@/app/features/task';
import { CheckboxList } from '@/app/presentation/components/ui/01-atoms/form-controls/checkbox-list/checkbox-list';
import { InputSelect } from '@/app/presentation/components/ui/01-atoms/form-controls/input-select/input-select';
import { InputText } from '@/app/presentation/components/ui/01-atoms/form-controls/input-text/input-text';

const formTaskSchema = z.object({
  title: z.string('Titulo requerido').min(4, 'El titulo debe ser minimo 4 caracteres'),
  categoria: z.coerce.number().min(1, 'Elige una categoría'),
  priority: z.string().nonempty('Elige una prioridad'),
  tags: z.array(z.coerce.number()).min(1, 'Elige minimo 1 etiqueta'),
});

type TaskCreateZod = z.infer<typeof formTaskSchema>;

@Component({
  selector: 'app-home',
  imports: [FormField, InputText, InputSelect, CheckboxList],
  templateUrl: './home-page.html',
})
export class HomePage {
  categoryService = inject(CategoryService);
  categoryOptions = computed(() => [
    { label: '----', value: 0 },
    ...this.categoryService.$categoryArray().map((cat) => ({ label: cat.name, value: cat.id })),
  ]);

  tagService = inject(TagService);
  tagOptions = computed(() =>
    this.tagService.$tagArray().map((tag) => ({ label: tag.name, value: tag.id })),
  );

  priorityOptions = computed(() => [
    { label: '----', value: '' },
    ...PRIORITY_TASK_VALUES.map((key) => ({ label: PRIORITY_TASK[key], value: key })),
  ]);

  createFields = signal<TaskCreateZod>({
    title: 'Test',
    categoria: 1,
    priority: 'alta',
    tags: [1, 6],
  });
  formCreate = form(this.createFields, (f) => {
    validateStandardSchema(f, formTaskSchema);
  });

  onSubmit(e: Event) {
    e.preventDefault();
    console.log(this.formCreate().controlValue());
    submit(this.formCreate, async (fields) => {
      console.log('submit', fields().value());
    });
  }
}
