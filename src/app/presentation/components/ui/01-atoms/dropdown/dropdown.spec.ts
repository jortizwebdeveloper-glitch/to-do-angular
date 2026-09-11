import { Component, signal } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Dropdown, DropdownList } from './dropdown';

interface TestOption {
  label: string;
  value: string;
}

@Component({
  imports: [Dropdown],
  template: `
    <app-dropdown [options]="options()" (eventChange)="onChange($event)">
      {{ label() }}
    </app-dropdown>
  `,
})
class DropdownHost {
  options = signal<TestOption[]>([
    { label: 'Uno', value: 'uno' },
    { label: 'Dos', value: 'dos' },
  ]);
  label = signal('Elegir');
  selected: string | null = null;

  onChange(value: string) {
    this.selected = value;
  }
}

describe('Dropdown', () => {
  it('should create', async () => {
    await TestBed.configureTestingModule({ imports: [Dropdown] }).compileComponents();

    const fixture = TestBed.createComponent<Dropdown<string>>(Dropdown);
    fixture.componentRef.setInput('options', []);
    await fixture.whenStable();

    expect(fixture.componentInstance).toBeTruthy();
  });

  describe('render en host', () => {
    let fixture: ComponentFixture<DropdownHost>;
    let host: DropdownHost;

    const containerDiv = () =>
      fixture.debugElement.query(By.css('app-dropdown > div')).nativeElement as HTMLElement;
    const triggerButton = () =>
      fixture.debugElement.query(By.css('app-dropdown > div > button')).nativeElement as HTMLElement;
    const dropdownList = () => fixture.debugElement.query(By.css('app-dropdown-list'));
    const optionButtons = () =>
      fixture.debugElement
        .queryAll(By.css('app-dropdown-list li button'))
        .map((de) => de.nativeElement as HTMLElement);

    beforeEach(async () => {
      await TestBed.configureTestingModule({ imports: [DropdownHost] }).compileComponents();

      fixture = TestBed.createComponent(DropdownHost);
      host = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('proyecta el contenido dentro del botón trigger', () => {
      expect(triggerButton().textContent?.trim()).toBe('Elegir');
    });

    it('está cerrado por defecto (no renderiza la lista)', () => {
      expect(dropdownList()).toBeNull();
    });

    it('al hacer click en el trigger abre la lista con las opciones', () => {
      triggerButton().click();
      fixture.detectChanges();

      expect(dropdownList()).not.toBeNull();
      const labels = optionButtons().map((btn) => btn.textContent?.trim());
      expect(labels).toEqual(['Uno', 'Dos']);
    });

    it('al hacer click en el trigger de nuevo, cierra la lista (toggle)', () => {
      triggerButton().click();
      fixture.detectChanges();
      expect(dropdownList()).not.toBeNull();

      triggerButton().click();
      fixture.detectChanges();
      expect(dropdownList()).toBeNull();
    });

    it('al seleccionar una opción emite eventChange con su value y cierra la lista', () => {
      triggerButton().click();
      fixture.detectChanges();

      optionButtons()[1].click();
      fixture.detectChanges();

      expect(host.selected).toBe('dos');
      expect(dropdownList()).toBeNull();
    });

    it('focusout sin relatedTarget dentro del contenedor cierra la lista', () => {
      triggerButton().click();
      fixture.detectChanges();
      expect(dropdownList()).not.toBeNull();

      containerDiv().dispatchEvent(new FocusEvent('focusout', { relatedTarget: null }));
      fixture.detectChanges();

      expect(dropdownList()).toBeNull();
    });

    it('focusout hacia un elemento dentro del contenedor no cierra la lista', () => {
      triggerButton().click();
      fixture.detectChanges();
      expect(dropdownList()).not.toBeNull();

      containerDiv().dispatchEvent(new FocusEvent('focusout', { relatedTarget: triggerButton() }));
      fixture.detectChanges();

      expect(dropdownList()).not.toBeNull();
    });

    it('reacciona a un cambio de options() sin recrear el fixture', () => {
      host.options.set([...host.options(), { label: 'Tres', value: 'tres' }]);
      fixture.detectChanges();

      triggerButton().click();
      fixture.detectChanges();

      const labels = optionButtons().map((btn) => btn.textContent?.trim());
      expect(labels).toEqual(['Uno', 'Dos', 'Tres']);
    });
  });
});

describe('DropdownList', () => {
  it('renderiza el contenido proyectado dentro del <ul> flotante sin lanzar', async () => {
    await TestBed.configureTestingModule({ imports: [DropdownList] }).compileComponents();

    const fixture = TestBed.createComponent(DropdownList);
    fixture.componentRef.setInput('referenceEl', document.createElement('button'));
    fixture.detectChanges();
    await fixture.whenStable();

    const ul = fixture.debugElement.query(By.css('ul')).nativeElement as HTMLElement;
    expect(ul.classList).toContain('fixed');
  });

  it('libera el autoUpdate al destruirse sin lanzar', async () => {
    await TestBed.configureTestingModule({ imports: [DropdownList] }).compileComponents();

    const fixture = TestBed.createComponent(DropdownList);
    fixture.componentRef.setInput('referenceEl', document.createElement('button'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(() => fixture.destroy()).not.toThrow();
  });
});
