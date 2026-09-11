import { Component } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { FormHandle } from './form-handle';

@Component({
  imports: [FormHandle],
  template: `
    <app-form-handle (submitHandle)="onSubmit()">
      <input type="text" />
      <button type="submit">Guardar</button>
    </app-form-handle>
  `,
})
class FormHandleHost {
  submitCount = 0;
  onSubmit() {
    this.submitCount++;
  }
}

describe('FormHandle', () => {
  it('should create', async () => {
    await TestBed.configureTestingModule({ imports: [FormHandle] }).compileComponents();

    const fixture = TestBed.createComponent(FormHandle);
    await fixture.whenStable();

    expect(fixture.componentInstance).toBeTruthy();
  });

  describe('render en host', () => {
    let fixture: ComponentFixture<FormHandleHost>;
    let host: FormHandleHost;

    const form = () => fixture.debugElement.query(By.css('form')).nativeElement as HTMLFormElement;
    const submitButton = () =>
      fixture.debugElement.query(By.css('button[type=submit]')).nativeElement as HTMLButtonElement;

    beforeEach(async () => {
      await TestBed.configureTestingModule({ imports: [FormHandleHost] }).compileComponents();

      fixture = TestBed.createComponent(FormHandleHost);
      host = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('proyecta el contenido dentro de un <form> real', () => {
      expect(form()).not.toBeNull();
      expect(fixture.debugElement.query(By.css('form input'))).not.toBeNull();
      expect(submitButton().textContent?.trim()).toBe('Guardar');
    });

    it('el submit del <form> emite submitHandle', () => {
      form().dispatchEvent(new Event('submit', { cancelable: true }));
      fixture.detectChanges();

      expect(host.submitCount).toBe(1);
    });

    it('previene el comportamiento nativo del submit (no navega)', () => {
      const event = new Event('submit', { cancelable: true });
      form().dispatchEvent(event);

      expect(event.defaultPrevented).toBe(true);
    });

    it('cada submit emite una vez más (sin duplicar handlers)', () => {
      form().dispatchEvent(new Event('submit', { cancelable: true }));
      form().dispatchEvent(new Event('submit', { cancelable: true }));
      fixture.detectChanges();

      expect(host.submitCount).toBe(2);
    });

    it('clickear el botón submit proyectado también dispara el submit', () => {
      submitButton().click();
      fixture.detectChanges();

      expect(host.submitCount).toBe(1);
    });
  });
});
