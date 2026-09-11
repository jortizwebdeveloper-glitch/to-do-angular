import { Component, signal } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { form, FormField, minLength, required } from '@angular/forms/signals';
import { By } from '@angular/platform-browser';

import { CheckboxList } from './checkbox-list/checkbox-list';
import { InputDate } from './input-date/input-date';
import { InputSelect } from './input-select/input-select';
import { InputText } from './input-text/input-text';
import { InputTextarea } from './input-textarea/input-textarea';

interface OptionSelect {
  label: string;
  value: unknown;
}

interface TestValue {
  title: string;
  description: string;
  categoria: number;
  tags: number[];
  dueDate: string;
}

@Component({
  imports: [FormField, InputText, InputTextarea, InputSelect, CheckboxList, InputDate],
  template: `
    <app-input-text [formField]="formValue.title" placeholder="Título" />
    <app-input-textarea [formField]="formValue.description" placeholder="Descripción" />
    <app-input-select [options]="categorias" [formField]="formValue.categoria" placeholder="Categoría" />
    <app-checkbox-list [options]="etiquetas" [formField]="formValue.tags" label="Etiquetas" />
    <app-input-date [formField]="formValue.dueDate" placeholder="Fecha" />
  `,
})
class FormControlsHost {
  categorias: OptionSelect[] = [
    { label: 'Elige', value: 0 },
    { label: 'Casa', value: 1 },
  ];
  etiquetas: OptionSelect[] = [
    { label: 'Urgente', value: 1 },
    { label: 'Casa', value: 2 },
  ];

  data = signal<TestValue>({ title: '', description: '', categoria: 0, tags: [], dueDate: '' });
  formValue = form(this.data, (f) => {
    required(f.title, { message: 'Título obligatorio' });
    minLength(f.title, 5, { message: 'Mínimo 5 caracteres' });
  });
}

describe('form-controls (vía form() real de @angular/forms/signals)', () => {
  let fixture: ComponentFixture<FormControlsHost>;
  let host: FormControlsHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [FormControlsHost] }).compileComponents();

    fixture = TestBed.createComponent(FormControlsHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  describe('InputText', () => {
    const input = () =>
      fixture.debugElement.query(By.css('app-input-text input')).nativeElement as HTMLInputElement;

    it('escribir en el input actualiza el value del field', () => {
      input().value = 'Comprar pan';
      input().dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(host.formValue.title().value()).toBe('Comprar pan');
    });

    it('blur marca el field como touched', () => {
      expect(host.formValue.title().touched()).toBe(false);

      input().dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      expect(host.formValue.title().touched()).toBe(true);
    });

    it('con título vacío tras blur, queda invalid y se pinta el error en el DOM', () => {
      input().dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      expect(host.formValue.title().invalid()).toBe(true);

      const fieldset = fixture.debugElement.query(By.css('app-input-text fieldset'))
        .nativeElement as HTMLElement;
      expect(fieldset.classList).toContain('border-red-500');

      const errorText = fixture.debugElement
        .query(By.css('app-input-text p'))
        .nativeElement.textContent.trim();
      expect(errorText).toBe('Título obligatorio');
    });

    it('con título corto (menos de 5) tras blur, el error es el de minLength', () => {
      input().value = 'Hi';
      input().dispatchEvent(new Event('input'));
      input().dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      expect(host.formValue.title().invalid()).toBe(true);
      const errorText = fixture.debugElement
        .query(By.css('app-input-text p'))
        .nativeElement.textContent.trim();
      expect(errorText).toBe('Mínimo 5 caracteres');
    });
  });

  describe('InputTextarea', () => {
    const textarea = () =>
      fixture.debugElement.query(By.css('app-input-textarea textarea')).nativeElement as HTMLTextAreaElement;

    it('escribir en el textarea actualiza el value del field', () => {
      textarea().value = 'Se necesitan 2kg';
      textarea().dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(host.formValue.description().value()).toBe('Se necesitan 2kg');
    });
  });

  describe('InputSelect', () => {
    const select = () =>
      fixture.debugElement.query(By.css('app-input-select select')).nativeElement as HTMLSelectElement;

    it('elegir una opción actualiza el value del field', () => {
      select().value = '1';
      select().dispatchEvent(new Event('change', { bubbles: true }));
      fixture.detectChanges();

      expect(host.formValue.categoria().value()).toBe(1);
    });

    it('un value que no matchea ninguna opción cae al primer option.value', () => {
      select().value = '999';
      select().dispatchEvent(new Event('change', { bubbles: true }));
      fixture.detectChanges();

      expect(host.formValue.categoria().value()).toBe(host.categorias[0].value);
    });
  });

  describe('CheckboxList', () => {
    const checkboxes = () =>
      fixture.debugElement
        .queryAll(By.css('app-checkbox-list input[type=checkbox]'))
        .map((de) => de.nativeElement as HTMLInputElement);

    it('marcar dos checkboxes agrega ambos values al array', () => {
      const [urgente, casa] = checkboxes();

      urgente.checked = true;
      urgente.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      casa.checked = true;
      casa.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(host.formValue.tags().value()).toEqual([1, 2]);
    });

    it('desmarcar un checkbox lo quita del array sin tocar el resto', () => {
      const [urgente, casa] = checkboxes();

      urgente.checked = true;
      urgente.dispatchEvent(new Event('input'));
      casa.checked = true;
      casa.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      urgente.checked = false;
      urgente.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(host.formValue.tags().value()).toEqual([2]);
    });
  });

  describe('InputDate', () => {
    const input = () =>
      fixture.debugElement.query(By.css('app-input-date input')).nativeElement as HTMLInputElement;

    it('escribir una fecha guarda el value con "/" en vez de "-"', () => {
      input().value = '2026-09-11';
      input().dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(host.formValue.dueDate().value()).toBe('2026/09/11');
    });

    it('el input visible muestra el value con "-" (formato nativo de <input type=date>)', () => {
      input().value = '2026-09-11';
      input().dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(input().value).toBe('2026-09-11');
    });
  });
});
