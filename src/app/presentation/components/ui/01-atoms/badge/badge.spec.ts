import { Component, signal } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import type { TColor } from '@app/core/shared/theme/color.registry';

import { Badge } from './badge';

@Component({
  imports: [Badge],
  template: `<app-badge [color]="color()">{{ text() }}</app-badge>`,
})
class BadgeHost {
  color = signal<TColor>('neutral');
  text = signal('pendiente');
}

describe('Badge', () => {
  it('should create', async () => {
    await TestBed.configureTestingModule({ imports: [Badge] }).compileComponents();

    const fixture = TestBed.createComponent(Badge);
    await fixture.whenStable();

    expect(fixture.componentInstance).toBeTruthy();
  });

  describe('render en host', () => {
    let fixture: ComponentFixture<BadgeHost>;
    let host: BadgeHost;

    const spanClasses = () =>
      (fixture.debugElement.query(By.css('app-badge span')).nativeElement as HTMLElement).classList;

    beforeEach(async () => {
      await TestBed.configureTestingModule({ imports: [BadgeHost] }).compileComponents();

      fixture = TestBed.createComponent(BadgeHost);
      host = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('usa el color neutral por defecto', () => {
      expect(spanClasses()).toContain('text-neutral-500');
    });

    it('aplica la clase de texto del color indicado', () => {
      host.color.set('blue');
      fixture.detectChanges();

      expect(spanClasses()).toContain('text-blue-500');
      expect(spanClasses()).not.toContain('text-neutral-500');
    });

    it('reacciona al cambio del input signal sin recrear el fixture', () => {
      host.color.set('blue');
      fixture.detectChanges();
      expect(spanClasses()).toContain('text-blue-500');

      host.color.set('red');
      fixture.detectChanges();

      expect(spanClasses()).toContain('text-red-500');
      expect(spanClasses()).not.toContain('text-blue-500');
    });

    it('mantiene las clases estáticas en cualquier color', () => {
      host.color.set('green');
      fixture.detectChanges();

      const classes = spanClasses();
      for (const cls of ['rounded', 'uppercase', 'font-bold', 'bg-current/10']) {
        expect(classes).toContain(cls);
      }
    });

    it('proyecta el contenido dentro del span', () => {
      host.text.set('Hola');
      fixture.detectChanges();

      const span = fixture.debugElement.query(By.css('app-badge span'))
        .nativeElement as HTMLElement;
      expect(span.textContent?.trim()).toBe('Hola');
    });

    it('cae a neutral cuando el color no existe en el registro', () => {
      host.color.set('zzz' as unknown as TColor);
      fixture.detectChanges();

      expect(spanClasses()).toContain('text-neutral-500');
    });
  });

  it('setColor() deriva la clase de texto Tailwind del color', async () => {
    await TestBed.configureTestingModule({ imports: [Badge] }).compileComponents();

    const fixture = TestBed.createComponent(Badge);
    fixture.componentRef.setInput('color', 'green');
    await fixture.whenStable();

    expect(fixture.componentInstance.setColor()).toBe('text-green-500');
  });
});
