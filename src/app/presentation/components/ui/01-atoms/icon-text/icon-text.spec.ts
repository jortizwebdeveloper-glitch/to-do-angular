import { Component, signal } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import type { TColor } from '@app/core/shared/theme/color.registry';
import { Icon } from '@components/01-atoms/icon/icon';
import type { IconName } from '@components/01-atoms/icon/icon.registry';

import { IconText } from './icon-text';

@Component({
  imports: [IconText],
  template: `
    <app-icon-text [icon]="icon()" [color]="color()" [textColor]="textColor()">{{ text() }}</app-icon-text>
  `,
})
class IconTextHost {
  icon = signal<IconName | undefined>(undefined);
  color = signal<TColor>('neutral');
  textColor = signal(false);
  text = signal('Categoría');
}

describe('IconText', () => {
  it('should create', async () => {
    await TestBed.configureTestingModule({ imports: [IconText] }).compileComponents();

    const fixture = TestBed.createComponent(IconText);
    await fixture.whenStable();

    expect(fixture.componentInstance).toBeTruthy();
  });

  describe('render en host', () => {
    let fixture: ComponentFixture<IconTextHost>;
    let host: IconTextHost;

    const iconSpan = () => fixture.debugElement.query(By.css('app-icon-text > div > span:first-child'));
    const iconDebug = () => fixture.debugElement.query(By.directive(Icon));
    const textSpan = () =>
      fixture.debugElement.query(By.css('app-icon-text > div > span:last-child')).nativeElement as HTMLElement;

    beforeEach(async () => {
      await TestBed.configureTestingModule({ imports: [IconTextHost] }).compileComponents();

      fixture = TestBed.createComponent(IconTextHost);
      host = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('sin icon, renderiza el punto de color (bg) en vez de app-icon', () => {
      expect(iconDebug()).toBeNull();

      const dot = iconSpan().nativeElement as HTMLElement;
      expect(dot.classList).toContain('bg-neutral-500');
      expect(dot.classList).toContain('size-2');
      expect(dot.classList).toContain('rounded-[3px]');
    });

    it('con icon, renderiza app-icon con el name recibido en vez del punto', () => {
      host.icon.set('check');
      fixture.detectChanges();

      expect(iconDebug()).not.toBeNull();
      expect(iconDebug().componentInstance.name()).toBe('check');
      expect(iconSpan().nativeElement.classList).toContain('text-neutral-500');
      expect(iconSpan().nativeElement.classList).toContain('size-[1.2em]');
    });

    it('reacciona a un cambio de icon: aparece y desaparece app-icon según corresponda', () => {
      host.icon.set('check');
      fixture.detectChanges();
      expect(iconDebug()).not.toBeNull();

      host.icon.set(undefined);
      fixture.detectChanges();
      expect(iconDebug()).toBeNull();
    });

    it('deriva la clase de color (text/bg) del color indicado', () => {
      host.color.set('blue');
      fixture.detectChanges();

      expect(iconSpan().nativeElement.classList).toContain('bg-blue-500');
      expect(iconSpan().nativeElement.classList).not.toContain('bg-neutral-500');
    });

    it('cae a neutral cuando color no existe en el registro', () => {
      host.color.set('zzz' as unknown as TColor);
      fixture.detectChanges();

      expect(iconSpan().nativeElement.classList).toContain('bg-neutral-500');
    });

    it('con textColor=false (default), el texto proyectado no lleva la clase de color', () => {
      host.color.set('blue');
      fixture.detectChanges();

      expect(textSpan().classList).not.toContain('text-blue-500');
    });

    it('con textColor=true, el texto proyectado sí lleva la clase de color', () => {
      host.color.set('blue');
      host.textColor.set(true);
      fixture.detectChanges();

      expect(textSpan().classList).toContain('text-blue-500');
    });

    it('proyecta el contenido dentro del span de texto', () => {
      host.text.set('Trabajo');
      fixture.detectChanges();

      expect(textSpan().textContent?.trim()).toBe('Trabajo');
    });
  });
});
