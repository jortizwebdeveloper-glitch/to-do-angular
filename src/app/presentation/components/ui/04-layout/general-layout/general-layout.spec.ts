import { Component } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Icon } from '@components/01-atoms/icon/icon';

import { GeneralLayout } from './general-layout';

@Component({
  imports: [GeneralLayout],
  template: `
    <app-general-layout>
      <nav aside-content>Menú lateral</nav>
      <button aside-footer>Crear tarea</button>
      <p main-content>Contenido principal</p>
    </app-general-layout>
  `,
})
class GeneralLayoutHost {}

describe('GeneralLayout', () => {
  it('should create', async () => {
    await TestBed.configureTestingModule({ imports: [GeneralLayout] }).compileComponents();

    const fixture = TestBed.createComponent(GeneralLayout);
    await fixture.whenStable();

    expect(fixture.componentInstance).toBeTruthy();
  });

  describe('render en host', () => {
    let fixture: ComponentFixture<GeneralLayoutHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({ imports: [GeneralLayoutHost] }).compileComponents();

      fixture = TestBed.createComponent(GeneralLayoutHost);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('renderiza el ícono y el título "TaskFlow" del header', () => {
      expect(fixture.debugElement.query(By.directive(Icon)).componentInstance.name()).toBe('check');
      expect(fixture.debugElement.query(By.css('header')).nativeElement.textContent.trim()).toBe(
        'TaskFlow',
      );
    });

    it('proyecta [aside-content] dentro del <aside>', () => {
      const aside = fixture.debugElement.query(By.css('aside')).nativeElement as HTMLElement;
      expect(aside.querySelector('nav')?.textContent?.trim()).toBe('Menú lateral');
    });

    it('proyecta [aside-footer] dentro del <aside>, separado del contenido', () => {
      const aside = fixture.debugElement.query(By.css('aside')).nativeElement as HTMLElement;
      expect(aside.querySelector('button')?.textContent?.trim()).toBe('Crear tarea');
    });

    it('proyecta [main-content] dentro del <main>', () => {
      const main = fixture.debugElement.query(By.css('main')).nativeElement as HTMLElement;
      expect(main.querySelector('p')?.textContent?.trim()).toBe('Contenido principal');
    });
  });
});
