import { Component, signal } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, RouterLink } from '@angular/router';
import { Icon } from '@components/01-atoms/icon/icon';
import { Tag } from '@components/01-atoms/tag/tag';

import type { TNavaside } from './navaside';
import { Navaside } from './navaside';

@Component({
  imports: [Navaside],
  template: `<app-navaside [data]="data()" [type]="type()"></app-navaside>`,
})
class NavasideHost {
  data = signal<TNavaside>({ title: 'Categorías', items: [] });
  type = signal<'tag' | 'default'>('default');
}

describe('Navaside', () => {
  it('should create', async () => {
    await TestBed.configureTestingModule({
      imports: [Navaside],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(Navaside);
    fixture.componentRef.setInput('data', { title: 'Categorías', items: [] });
    await fixture.whenStable();

    expect(fixture.componentInstance).toBeTruthy();
  });

  describe('render en host (items como array, modo default)', () => {
    let fixture: ComponentFixture<NavasideHost>;
    let host: NavasideHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [NavasideHost],
        providers: [provideRouter([])],
      }).compileComponents();

      fixture = TestBed.createComponent(NavasideHost);
      host = fixture.componentInstance;
      host.data.set({
        title: 'Categorías',
        items: [
          { id: 1, name: 'Casa', color: 'blue', icon: 'folder', link: { query: { categoria: '1' } } },
          { id: 2, name: 'Trabajo', color: 'green', link: { query: { categoria: '2' } }, count: 3 },
        ],
      });
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('renderiza el título de data', () => {
      const title = fixture.debugElement.query(By.css('p')).nativeElement as HTMLElement;
      expect(title.textContent?.trim()).toBe('Categorías');
    });

    it('renderiza un <li> por cada item, con su nombre', () => {
      const items = fixture.debugElement.queryAll(By.css('nav > ul > li'));
      expect(items).toHaveLength(3);
      expect(items[1].nativeElement.textContent).toContain('Casa');
      expect(items[2].nativeElement.textContent).toContain('Trabajo');
    });

    it('con icon, renderiza app-icon con el name y el color en texto (getColor)', () => {
      const icon = fixture.debugElement.query(By.directive(Icon));
      expect((icon.componentInstance as Icon).name()).toBe('folder');
      expect((icon.nativeElement as HTMLElement).classList).toContain('text-blue-500');
    });

    it('sin icon, renderiza el punto de color en vez de app-icon', () => {
      const secondLi = fixture.debugElement.queryAll(By.css('nav > ul > li'))[2];
      expect(secondLi.query(By.directive(Icon))).toBeNull();
      const dot = secondLi.query(By.css('span > i > span')).nativeElement as HTMLElement;
      expect(dot.classList).toContain('bg-green-500');
    });

    it('con un color inexistente, cae al fallback "neutral" de getColor', () => {
      host.data.set({
        title: 'Categorías',
        items: [{ id: 9, name: 'Rara', color: 'no-existe' as never }],
      });
      fixture.detectChanges();

      const dot = fixture.debugElement.query(By.css('span > i > span')).nativeElement as HTMLElement;
      expect(dot.classList).toContain('bg-neutral-500');
    });

    it('con count, muestra el badge de conteo; sin count, no lo muestra', () => {
      const items = fixture.debugElement.queryAll(By.css('nav > ul > li'));
      expect(items[1].nativeElement.textContent).not.toContain('3');
      expect(items[2].nativeElement.textContent).toContain('3');
    });

    it('el link usa routerLink relativo y las query params del item', () => {
      const links = fixture.debugElement.queryAll(By.directive(RouterLink));
      const casaLink = links[0].injector.get(RouterLink);
      expect(casaLink.href).toBe('/?categoria=1');
    });
  });

  describe('render en host (items como record, modo tag)', () => {
    let fixture: ComponentFixture<NavasideHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [NavasideHost],
        providers: [provideRouter([])],
      }).compileComponents();

      fixture = TestBed.createComponent(NavasideHost);
      fixture.componentInstance.type.set('tag');
      fixture.componentInstance.data.set({
        title: 'Tags',
        items: {
          urgente: { id: 1, name: 'Urgente', color: 'red' },
          casa: { id: 2, name: 'Casa', color: 'blue' },
        },
      });
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('itera sobre los valores del record, uno por key', () => {
      const tags = fixture.debugElement.queryAll(By.directive(Tag));
      expect(tags).toHaveLength(2);
    });

    it('renderiza un app-tag por item con su color y nombre', () => {
      const tags = fixture.debugElement.queryAll(By.directive(Tag));
      expect((tags[0].componentInstance as Tag).color()).toBe('red');
      expect(tags[0].nativeElement.textContent.trim()).toBe('Urgente');
      expect((tags[1].componentInstance as Tag).color()).toBe('blue');
    });
  });
});
