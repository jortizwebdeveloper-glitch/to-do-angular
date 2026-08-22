import type { OverlayRef } from '@angular/cdk/overlay';
import { Overlay } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import type { OnDestroy, TemplateRef } from '@angular/core';
import {
  afterNextRender,
  Component,
  computed,
  inject,
  signal,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { form, FormField, submit, validateStandardSchema } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { OptionsService } from '@app/core/shared/service/options.service';
import { TaskController } from '@app/features/task';
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

const createTaskSchema = z.object({
  title: z.string().min(5, 'EL título debe ser minimo de 5 caracteres'),
  description: z.string().nonempty('Descripcion obligatoria'),
  categoria: z.number().min(1, 'Debes selccionar una categoría'),
  tags: z.array(z.number()).min(1, 'Debes elegir como minimo 1 etiqueta'),
  priority: z.string().nonempty('Debes elegir una prioridad'),
  dueDate: z.string().nonempty('Debe asignar una fecha'),
});

type CreateTaskZod = z.infer<typeof createTaskSchema>;

@Component({
  selector: 'app-confirm-dialog',
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
  templateUrl: './create-task-page.html',
})
export class CreateTaskPage implements OnDestroy {
  @ViewChild('modalContent') templateRef!: TemplateRef<unknown>;

  private overlay = inject(Overlay);
  private vcr = inject(ViewContainerRef);
  private router = inject(Router);
  private overlayRef?: OverlayRef;

  constructor() {
    afterNextRender(() => {
      this.overlayRef = this.overlay.create({
        hasBackdrop: true,
        backdropClass: ['backdrop-blur', 'bg-black/50'],
        positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
      });

      const portal = new TemplatePortal(this.templateRef, this.vcr);
      this.overlayRef.attach(portal);

      // cerrar al hacer click en el backdrop
      this.overlayRef.backdropClick().subscribe(() => this.close());
    });
  }

  close() {
    // navegar fuera de la ruta del modal -> Angular destruye el componente
    this.router.navigate(['dashboard'], {
      queryParamsHandling: 'merge',
    });
  }

  ngOnDestroy() {
    this.overlayRef?.dispose();
  }

  taskController = inject(TaskController);
  optionsService = inject(OptionsService);
  categorias = computed(() => [
    { label: 'Elige una categoría', value: 0 },
    ...this.optionsService.categoryOptions(),
  ]);
  prioridades = computed(() => [
    { label: 'Elige una prioridad', value: '' },
    ...this.optionsService.priorityOptions(),
  ]);

  fields = signal<CreateTaskZod>({
    title: '',
    description: '',
    categoria: 0,
    tags: [],
    priority: '',
    dueDate: '',
  });
  createForm = form(this.fields, (f) => {
    validateStandardSchema(f, createTaskSchema);
  });
  createTaskSubmit() {
    submit(this.createForm, async (fields) => {
      const $value = fields().value();
      await this.taskController.createTask($value);
    });
  }
}
