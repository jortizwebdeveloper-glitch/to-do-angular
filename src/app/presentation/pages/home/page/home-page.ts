import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { form, FormField, submit, validateStandardSchema } from '@angular/forms/signals';
import { z } from 'zod';

import { CategoryService } from '@/app/features/category';
import { TagService } from '@/app/features/tag';
import { PRIORITY_TASK, PRIORITY_TASK_VALUES, TaskService } from '@/app/features/task';
import {
  CheckboxList,
  FormHandle,
  InputSelect,
  InputText,
} from '@components/01-atoms/form-controls';
import { rxResource } from '@angular/core/rxjs-interop';

const formTaskSchema = z.object({
  title: z.string().min(4, 'El titulo debe ser minimo 4 caracteres'),
  categoria: z.coerce.number().min(1, 'Elige una categoría'),
  priority: z.string().nonempty('Elige una prioridad'),
  tags: z.array(z.coerce.number()).min(1, 'Elige minimo 1 etiqueta'),
});

const createTaskSchema = z.object({
  title: z.string('Titulo requerido').min(4, 'El titulo debe ser minimo 4 caracteres'),
  categoria: z.coerce.number().min(1, 'Elige una categoría'),
  priority: z.enum(['alta', 'media', 'baja'], 'La prioridad debe ser Alta, Media, Baja'),
  tags: z.array(z.coerce.number()).min(1, 'Elige minimo 1 etiqueta'),
});

type TaskCreateZod = z.infer<typeof formTaskSchema>;

@Component({
  selector: 'app-home',
  imports: [FormField, InputText, InputSelect, CheckboxList, FormHandle],
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
    title: '',
    categoria: 0,
    priority: '',
    tags: [],
  });
  formCreate = form(this.createFields, (f) => {
    validateStandardSchema(f, formTaskSchema);
  });

  onCreateSubmit() {
    submit(this.formCreate, async (fields) => {
      console.log('submit', fields().value());
      console.log(createTaskSchema.safeParse(fields().value()));
    });
  }

  taskId = signal<number>(2);
  taskService = inject(TaskService);
  taskResource = rxResource({
    params: () => this.taskId(),
    stream: (rsrc) => this.taskService.getTaskById(rsrc.params),
  });
  updateFields = linkedSignal<TaskCreateZod>(
    () =>
      this.taskResource.value() ?? {
        title: '',
        categoria: 0,
        priority: '',
        tags: [],
      },
  );

  formUpdate = form(this.updateFields, (f) => {
    validateStandardSchema(f, formTaskSchema);
  });

  onUpdateSubmit() {
    submit(this.formUpdate, async (fields) => {
      console.log('submit', fields().value());
      console.log(createTaskSchema.safeParse(fields().value()));
    });
  }
}
