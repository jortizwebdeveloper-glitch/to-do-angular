import { Component, signal } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { InputSearch } from './input-search';

@Component({
  imports: [InputSearch],
  template: `<app-input-search [value]="value()" (valueChange)="onValueChange($event)" />`,
})
class InputSearchHost {
  value = signal('');
  emitted: string[] = [];
  onValueChange(v: string) {
    this.emitted.push(v);
  }
}

describe('InputSearch', () => {
  it('should create', async () => {
    await TestBed.configureTestingModule({ imports: [InputSearch] }).compileComponents();

    const fixture = TestBed.createComponent(InputSearch);
    await fixture.whenStable();

    expect(fixture.componentInstance).toBeTruthy();
  });

  describe('render en host', () => {
    let fixture: ComponentFixture<InputSearchHost>;
    let host: InputSearchHost;

    const input = () => fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    const cleanButton = () => fixture.debugElement.query(By.css('button'));

    beforeEach(async () => {
      await TestBed.configureTestingModule({ imports: [InputSearchHost] }).compileComponents();

      fixture = TestBed.createComponent(InputSearchHost);
      host = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('sin value, no muestra el botón de limpiar', () => {
      expect(input().value).toBe('');
      expect(cleanButton()).toBeNull();
    });

    it('con un value inicial no vacío, muestra el input con ese valor y el botón de limpiar', () => {
      host.value.set('tarea');
      fixture.detectChanges();

      expect(input().value).toBe('tarea');
      expect(cleanButton()).not.toBeNull();
    });

    it('escribir emite valueChange con el nuevo valor', () => {
      input().value = 'comprar';
      input().dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(host.emitted).toEqual(['comprar']);
    });

    it('escribir actualiza el value mostrado en el input aunque el host no haga round-trip', () => {
      input().value = 'comprar';
      input().dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(input().value).toBe('comprar');
    });

    it('clickear el botón de limpiar emite valueChange("") y vacía el input', () => {
      host.value.set('tarea');
      fixture.detectChanges();

      cleanButton().nativeElement.click();
      fixture.detectChanges();

      expect(host.emitted).toEqual(['']);
      expect(input().value).toBe('');
    });

    it('reacciona a un cambio externo de value() (round-trip del consumidor)', () => {
      host.value.set('urgente');
      fixture.detectChanges();

      expect(input().value).toBe('urgente');
      expect(cleanButton()).not.toBeNull();
    });

    it('el botón de limpiar aparece tras escribir, sin esperar un round-trip de [value]', () => {
      expect(cleanButton()).toBeNull();

      input().value = 'comprar';
      input().dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(cleanButton()).not.toBeNull();
    });
  });
});
