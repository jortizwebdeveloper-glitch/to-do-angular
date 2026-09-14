import { Component, signal } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { OptionsService } from '@app/core/shared/service/options.service';
import { PRIORITY_OPTIONS } from '@app/features/task';
import { CheckboxList, InputSelect } from '@components/01-atoms/form-controls';

import type { TaskZod } from './form.type';
import { FormTask } from './form-task';

const fakeOptionsService = {
  categoryOptions: () => [
    { label: 'Casa', value: 1 },
    { label: 'Trabajo', value: 2 },
  ],
  tagOptions: () => [
    { label: 'Urgente', value: 1 },
    { label: 'Compras', value: 2 },
  ],
};

@Component({
  imports: [FormTask],
  template: `<app-form-task
    [title]="title()"
    [next]="next()"
    [fields]="fields()"
    (eventClose)="onClose()"
    (eventSubmit)="onSubmit($event)"
  ></app-form-task>`,
})
class FormTaskHost {
  title = signal('Nueva tarea');
  next = signal('Crear');
  fields = signal<TaskZod | null>(null);
  closed = 0;
  submitted: TaskZod[] = [];
  onClose() {
    this.closed++;
  }
  onSubmit(value: TaskZod) {
    this.submitted.push(value);
  }
}

describe('FormTask', () => {
  it('should create', async () => {
    await TestBed.configureTestingModule({
      imports: [FormTask],
      providers: [{ provide: OptionsService, useValue: fakeOptionsService }],
    }).compileComponents();

    const fixture = TestBed.createComponent(FormTask);
    fixture.componentRef.setInput('title', 'Nueva tarea');
    fixture.componentRef.setInput('next', 'Crear');
    await fixture.whenStable();

    expect(fixture.componentInstance).toBeTruthy();
  });

  describe('render en host', () => {
    let fixture: ComponentFixture<FormTaskHost>;
    let host: FormTaskHost;

    const closeXButton = () =>
      fixture.debugElement.query(By.css('button[aria-label="Cerrar"]'))
        .nativeElement as HTMLElement;
    const closeFooterButton = () =>
      fixture.debugElement.query(By.css('button[type=button]')).nativeElement as HTMLElement;
    const submitButton = () =>
      fixture.debugElement.query(By.css('button[type=submit]')).nativeElement as HTMLButtonElement;
    const form = () => fixture.debugElement.query(By.css('form')).nativeElement as HTMLFormElement;
    const selects = () => fixture.debugElement.queryAll(By.directive(InputSelect));
    const checkboxList = () =>
      fixture.debugElement.query(By.directive(CheckboxList)).componentInstance as CheckboxList;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [FormTaskHost],
        providers: [{ provide: OptionsService, useValue: fakeOptionsService }],
      }).compileComponents();

      fixture = TestBed.createComponent(FormTaskHost);
      host = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('renderiza el título en el header y el label de "next" en el botón submit', () => {
      const heading = fixture.debugElement.query(By.css('h2')).nativeElement as HTMLElement;
      expect(heading.textContent?.trim()).toBe('Nueva tarea');
      expect(submitButton().textContent?.trim()).toBe('Crear');
    });

    it('click en la "x" del header emite eventClose', () => {
      closeXButton().click();

      expect(host.closed).toBe(1);
    });

    it('click en "Cerrar" del footer emite eventClose', () => {
      closeFooterButton().click();

      expect(host.closed).toBe(1);
    });

    it('el select de categoría antepone "Elige una categoría" (value 0) a las opciones del servicio', () => {
      const options = selects()[0].componentInstance.options();
      expect(options[0]).toEqual({ label: 'Elige una categoría', value: 0 });
      expect(options.slice(1)).toEqual(fakeOptionsService.categoryOptions());
    });

    it('el select de prioridad antepone "Elige una prioridad" (value \'\') a las opciones del servicio', () => {
      const options = selects()[1].componentInstance.options();
      expect(options[0]).toEqual({ label: 'Elige una prioridad', value: '' });
      expect(options.slice(1)).toEqual(PRIORITY_OPTIONS);
    });

    it('la lista de etiquetas usa tagOptions() del servicio directamente, sin opción default', () => {
      expect(checkboxList().options()).toEqual(fakeOptionsService.tagOptions());
    });

    it('con el formulario vacío, el submit no pasa la validación y no emite eventSubmit', () => {
      form().dispatchEvent(new Event('submit', { cancelable: true }));
      fixture.detectChanges();

      expect(host.submitted).toEqual([]);
    });

    it('completando todos los campos válidos, el submit emite eventSubmit con esos valores', () => {
      const titleInput = fixture.debugElement.query(By.css('app-input-text input'))
        .nativeElement as HTMLInputElement;
      titleInput.value = 'Comprar insumos';
      titleInput.dispatchEvent(new Event('input'));

      const textarea = fixture.debugElement.query(By.css('app-input-textarea textarea'))
        .nativeElement as HTMLTextAreaElement;
      textarea.value = 'Harina y leche';
      textarea.dispatchEvent(new Event('input'));

      const categoriaSelect = fixture.debugElement.queryAll(By.css('app-input-select select'))[0]
        .nativeElement as HTMLSelectElement;
      categoriaSelect.value = '1';
      categoriaSelect.dispatchEvent(new Event('change', { bubbles: true }));

      const tagCheckbox = fixture.debugElement.query(
        By.css('app-checkbox-list input[type=checkbox]'),
      ).nativeElement as HTMLInputElement;
      tagCheckbox.checked = true;
      tagCheckbox.dispatchEvent(new Event('input'));

      const prioridadSelect = fixture.debugElement.queryAll(By.css('app-input-select select'))[1]
        .nativeElement as HTMLSelectElement;
      prioridadSelect.value = 'alta';
      prioridadSelect.dispatchEvent(new Event('change', { bubbles: true }));

      const dateInput = fixture.debugElement.query(By.css('app-input-date input'))
        .nativeElement as HTMLInputElement;
      dateInput.value = '2026-09-20';
      dateInput.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      form().dispatchEvent(new Event('submit', { cancelable: true }));
      fixture.detectChanges();

      expect(host.submitted).toEqual([
        {
          title: 'Comprar insumos',
          description: 'Harina y leche',
          categoria: 1,
          tags: [1],
          priority: 'alta',
          dueDate: '2026/09/20',
        },
      ]);
    });

    it('con `fields` seteado, arranca precargado con esos valores', async () => {
      host.fields.set({
        title: 'Tarea existente',
        description: 'Ya cargada',
        categoria: 2,
        tags: [2],
        priority: 'media',
        dueDate: '2026/09/15',
      });
      fixture.detectChanges();
      await fixture.whenStable();

      const titleInput = fixture.debugElement.query(By.css('app-input-text input'))
        .nativeElement as HTMLInputElement;
      expect(titleInput.value).toBe('Tarea existente');
    });
  });
});
