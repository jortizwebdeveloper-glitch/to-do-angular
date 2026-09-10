import { Component, signal } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import type { TColor } from '@app/core/shared/theme/color.registry';

import { AppButton } from './button.directive';

type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  imports: [AppButton],
  template: `
    <button appButton [variant]="variant()" [size]="size()" [outline]="outline()">Guardar</button>
    <a appButton>Enlace</a>
  `,
})
class ButtonHost {
  variant = signal<TColor>('blue');
  size = signal<ButtonSize>('md');
  outline = signal(false);
}

describe('AppButton', () => {
  let fixture: ComponentFixture<ButtonHost>;
  let host: ButtonHost;

  const buttonClasses = () =>
    (fixture.debugElement.query(By.css('button[appButton]')).nativeElement as HTMLElement).classList;
  const anchorClasses = () =>
    (fixture.debugElement.query(By.css('a[appButton]')).nativeElement as HTMLElement).classList;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ButtonHost] }).compileComponents();

    fixture = TestBed.createComponent(ButtonHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('se aplica tanto sobre <button appButton> como sobre <a appButton>', () => {
    expect(fixture.debugElement.queryAll(By.directive(AppButton))).toHaveLength(2);
  });

  it('mantiene las clases base en cualquier configuración', () => {
    for (const cls of ['inline-block', 'text-center', 'cursor-pointer']) {
      expect(buttonClasses()).toContain(cls);
    }
  });

  it('usa variant "blue" y size "md" por defecto', () => {
    const classes = buttonClasses();
    expect(classes).toContain('bg-blue-600');
    for (const cls of ['px-6', 'py-2.5', 'rounded-xl']) {
      expect(classes).toContain(cls);
    }
  });

  it('deriva las clases "btn" del color indicado en variant', () => {
    host.variant.set('red');
    fixture.detectChanges();

    expect(buttonClasses()).toContain('bg-red-600');
    expect(buttonClasses()).not.toContain('bg-blue-600');
  });

  it('reacciona al cambio de variant sin recrear el fixture', () => {
    host.variant.set('green');
    fixture.detectChanges();
    expect(buttonClasses()).toContain('bg-green-600');

    host.variant.set('purple');
    fixture.detectChanges();
    expect(buttonClasses()).toContain('bg-purple-600');
    expect(buttonClasses()).not.toContain('bg-green-600');
  });

  it('con outline=true usa el set "btn-outline" en vez de "btn"', () => {
    host.outline.set(true);
    fixture.detectChanges();

    const classes = buttonClasses();
    // el borde y el relleno translúcido sólo existen en el set "btn-outline"
    expect(classes).toContain('border-blue-600');
    expect(classes).toContain('bg-blue-600/15');
    // y no aparece el hover del set sólido
    expect(classes).not.toContain('hover:bg-blue-700');
  });

  it('con size "sm" aplica el set compacto', () => {
    host.size.set('sm');
    fixture.detectChanges();

    const classes = buttonClasses();
    for (const cls of ['px-4', 'py-1', 'rounded-lg', 'text-sm']) {
      expect(classes).toContain(cls);
    }
    expect(classes).not.toContain('rounded-xl');
  });

  it('size "lg" cae al set por defecto (el switch no lo contempla)', () => {
    host.size.set('lg');
    fixture.detectChanges();

    const classes = buttonClasses();
    for (const cls of ['px-6', 'py-2.5', 'rounded-xl']) {
      expect(classes).toContain(cls);
    }
    expect(classes).not.toContain('text-sm');
  });

  it('cae a neutral cuando variant no existe en el registro', () => {
    host.variant.set('zzz' as unknown as TColor);
    fixture.detectChanges();

    expect(buttonClasses()).toContain('bg-neutral-600');
  });

  it('el <a appButton> recibe el mismo tratamiento de clases', () => {
    expect(anchorClasses()).toContain('inline-block');
    expect(anchorClasses()).toContain('bg-blue-600');
    expect(anchorClasses()).toContain('rounded-xl');
  });

  it('classes() concatena clases base + tema + tamaño', () => {
    const dir = fixture.debugElement.query(By.directive(AppButton)).injector.get(AppButton);

    expect(dir.btnSize()).toBe('px-6 py-2.5 rounded-xl');
    expect(dir.classes()).toContain('inline-block text-center cursor-pointer');
    expect(dir.classes()).toContain(dir.btnTheme().btn);
  });
});
