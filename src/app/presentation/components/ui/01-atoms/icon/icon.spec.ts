import { Component, signal } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Icon } from './icon';
import type { IconName } from './icon.registry';

@Component({
  imports: [Icon],
  template: `<app-icon [name]="name()" />`,
})
class IconHost {
  name = signal<IconName>('check');
}

describe('Icon', () => {
  it('should create', async () => {
    await TestBed.configureTestingModule({ imports: [Icon] }).compileComponents();

    const fixture = TestBed.createComponent(Icon);
    fixture.componentRef.setInput('name', 'check');
    await fixture.whenStable();

    expect(fixture.componentInstance).toBeTruthy();
  });

  describe('render en host', () => {
    let fixture: ComponentFixture<IconHost>;
    let host: IconHost;

    const iconEl = () => fixture.debugElement.query(By.css('i'));

    beforeEach(async () => {
      await TestBed.configureTestingModule({ imports: [IconHost] }).compileComponents();

      fixture = TestBed.createComponent(IconHost);
      host = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('carga y renderiza el SVG del ícono dentro de un <i>', () => {
      const el = iconEl().nativeElement as HTMLElement;
      expect(el.getAttribute('aria-hidden')).toBe('true');
      expect(el.innerHTML).toContain('<svg');
      expect(el.innerHTML).toContain('lucide-check');
    });

    it('reacciona a un cambio de name cargando el nuevo ícono', async () => {
      host.name.set('x');
      fixture.detectChanges();
      await fixture.whenStable();

      const el = iconEl().nativeElement as HTMLElement;
      expect(el.innerHTML).toContain('lucide-x');
      expect(el.innerHTML).not.toContain('lucide-check');
    });

    it('con un name que no existe en el registro, no renderiza el <i> (error silencioso)', async () => {
      host.name.set('no-existe' as IconName);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(iconEl()).toBeNull();
    });
  });
});
