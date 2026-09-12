import { Component, signal } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import type { TColor } from '@app/core/shared/theme/color.registry';

import { Tag } from './tag';

@Component({
  imports: [Tag],
  template: `
    <app-tag [color]="color()" [active]="active()" [size]="size()">{{ text() }}</app-tag>
  `,
})
class TagHost {
  color = signal<TColor>('neutral');
  active = signal(false);
  size = signal<'xs' | 'sm'>('xs');
  text = signal('Urgente');
}

describe('Tag', () => {
  it('should create', async () => {
    await TestBed.configureTestingModule({ imports: [Tag] }).compileComponents();

    const fixture = TestBed.createComponent(Tag);
    await fixture.whenStable();

    expect(fixture.componentInstance).toBeTruthy();
  });

  describe('render en host', () => {
    let fixture: ComponentFixture<TagHost>;
    let host: TagHost;

    const spanClasses = () =>
      (fixture.debugElement.query(By.css('app-tag span')).nativeElement as HTMLElement).classList;

    beforeEach(async () => {
      await TestBed.configureTestingModule({ imports: [TagHost] }).compileComponents();

      fixture = TestBed.createComponent(TagHost);
      host = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('usa color neutral, size xs e inactivo por defecto', () => {
      const classes = spanClasses();
      expect(classes).toContain('text-neutral-500');
      expect(classes).toContain('bg-current/10');
      expect(classes).toContain('border-current/50');
      expect(classes).toContain('text-xs');
    });

    it('con active=true, usa el set sólido (bg + texto blanco) en vez del translúcido', () => {
      host.active.set(true);
      fixture.detectChanges();

      const classes = spanClasses();
      expect(classes).toContain('bg-neutral-500');
      expect(classes).toContain('text-white');
      expect(classes).toContain('border-transparent');
      expect(classes).not.toContain('text-neutral-500');
      expect(classes).not.toContain('bg-current/10');
    });

    it('con size="sm", usa text-sm en vez de text-xs', () => {
      host.size.set('sm');
      fixture.detectChanges();

      const classes = spanClasses();
      expect(classes).toContain('text-sm');
      expect(classes).not.toContain('text-xs');
    });

    it('deriva la clase de color del color indicado', () => {
      host.color.set('blue');
      fixture.detectChanges();

      expect(spanClasses()).toContain('text-blue-500');
      expect(spanClasses()).not.toContain('text-neutral-500');
    });

    it('reacciona al cambio de color sin recrear el fixture', () => {
      host.color.set('blue');
      fixture.detectChanges();
      expect(spanClasses()).toContain('text-blue-500');

      host.color.set('red');
      fixture.detectChanges();

      expect(spanClasses()).toContain('text-red-500');
      expect(spanClasses()).not.toContain('text-blue-500');
    });

    it('cae a neutral cuando el color no existe en el registro', () => {
      host.color.set('zzz' as unknown as TColor);
      fixture.detectChanges();

      expect(spanClasses()).toContain('text-neutral-500');
    });

    it('mantiene las clases estáticas en cualquier configuración', () => {
      host.active.set(true);
      host.size.set('sm');
      fixture.detectChanges();

      const classes = spanClasses();
      for (const cls of ['block', 'rounded-full', 'border', 'px-3', 'py-1', 'leading-none', 'font-medium']) {
        expect(classes).toContain(cls);
      }
    });

    it('proyecta el contenido dentro del span', () => {
      host.text.set('En progreso');
      fixture.detectChanges();

      const span = fixture.debugElement.query(By.css('app-tag span')).nativeElement as HTMLElement;
      expect(span.textContent?.trim()).toBe('En progreso');
    });
  });
});
