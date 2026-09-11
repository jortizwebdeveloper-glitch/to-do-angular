import { Component, signal } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import type { ValidationError } from '@angular/forms/signals';
import { By } from '@angular/platform-browser';

import { InputLabel } from './input-label';

@Component({
  imports: [InputLabel],
  template: `
    <app-input-label [label]="label()" [invalid]="invalid()" [errors]="errors()">
      <input type="text" />
    </app-input-label>
  `,
})
class InputLabelHost {
  label = signal<string | undefined>('Título');
  invalid = signal(false);
  errors = signal<readonly ValidationError[]>([]);
}

describe('InputLabel', () => {
  it('should create', async () => {
    await TestBed.configureTestingModule({ imports: [InputLabel] }).compileComponents();

    const fixture = TestBed.createComponent(InputLabel);
    await fixture.whenStable();

    expect(fixture.componentInstance).toBeTruthy();
  });

  describe('render en host', () => {
    let fixture: ComponentFixture<InputLabelHost>;
    let host: InputLabelHost;

    const fieldset = () =>
      fixture.debugElement.query(By.css('fieldset')).nativeElement as HTMLElement;
    const legend = () => fixture.debugElement.query(By.css('legend'));
    const errorParagraphs = () =>
      fixture.debugElement.queryAll(By.css('p')).map((de) => (de.nativeElement as HTMLElement).textContent?.trim());

    beforeEach(async () => {
      await TestBed.configureTestingModule({ imports: [InputLabelHost] }).compileComponents();

      fixture = TestBed.createComponent(InputLabelHost);
      host = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('muestra el <legend> con el label recibido', () => {
      expect(legend()?.nativeElement.textContent.trim()).toBe('Título');
    });

    it('sin label, no renderiza <legend>', () => {
      host.label.set(undefined);
      fixture.detectChanges();

      expect(legend()).toBeNull();
    });

    it('usa el borde neutral por defecto (invalid=false)', () => {
      expect(fieldset().classList).toContain('border-black/15');
      expect(fieldset().classList).not.toContain('border-red-500');
    });

    it('con invalid=true, usa el borde rojo', () => {
      host.invalid.set(true);
      fixture.detectChanges();

      expect(fieldset().classList).toContain('border-red-500');
      expect(fieldset().classList).not.toContain('border-black/15');
    });

    it('sin invalid, no renderiza los mensajes de error aunque haya errors()', () => {
      host.errors.set([{ kind: 'required', message: 'Obligatorio' }]);
      fixture.detectChanges();

      expect(errorParagraphs()).toEqual([]);
    });

    it('con invalid=true, renderiza un <p> por cada error', () => {
      host.invalid.set(true);
      host.errors.set([
        { kind: 'required', message: 'Obligatorio' },
        { kind: 'minLength', message: 'Mínimo 5 caracteres' },
      ]);
      fixture.detectChanges();

      expect(errorParagraphs()).toEqual(['Obligatorio', 'Mínimo 5 caracteres']);
    });

    it('proyecta el contenido (ng-content) dentro del fieldset', () => {
      const input = fixture.debugElement.query(By.css('fieldset input'));
      expect(input).not.toBeNull();
    });
  });
});
