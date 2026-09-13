import { Component, signal } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import type { TOutputOnChangeTabs, TTabs } from './tabs';
import { Tabs } from './tabs';

const items: TTabs[] = [
  { label: 'Todo', value: 'all' },
  { label: 'Pendiente', value: 'pendiente' },
  { label: 'En curso', value: 'en_curso' },
  { label: 'Completada', value: 'completada' },
];

@Component({
  imports: [Tabs],
  template: `<app-tabs [items]="items" [value]="value()" (valueChange)="onChange($event)"></app-tabs>`,
})
class TabsHost {
  items = items;
  value = signal('all');
  changes: TOutputOnChangeTabs[] = [];
  onChange(event: TOutputOnChangeTabs) {
    this.changes.push(event);
  }
}

describe('Tabs', () => {
  it('should create', async () => {
    await TestBed.configureTestingModule({ imports: [Tabs] }).compileComponents();

    const fixture = TestBed.createComponent(Tabs);
    fixture.componentRef.setInput('items', items);
    fixture.componentRef.setInput('value', 'all');
    await fixture.whenStable();

    expect(fixture.componentInstance).toBeTruthy();
  });

  describe('render en host', () => {
    let fixture: ComponentFixture<TabsHost>;
    let host: TabsHost;

    const buttons = () => fixture.debugElement.queryAll(By.css('button'));
    const activeLi = () => fixture.debugElement.query(By.css('li.active'));
    const indicator = () => fixture.debugElement.query(By.css('ul > span')).nativeElement as HTMLElement;

    beforeEach(async () => {
      await TestBed.configureTestingModule({ imports: [TabsHost] }).compileComponents();

      fixture = TestBed.createComponent(TabsHost);
      host = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('renderiza un botón por cada item, con su label', () => {
      const btns = buttons();
      expect(btns).toHaveLength(4);
      expect(btns.map((b) => (b.nativeElement as HTMLElement).textContent?.trim())).toEqual([
        'Todo',
        'Pendiente',
        'En curso',
        'Completada',
      ]);
    });

    it('el <li> cuyo value coincide con "value" tiene la clase "active"', () => {
      host.value.set('en_curso');
      fixture.detectChanges();

      expect(activeLi()?.nativeElement.textContent.trim()).toBe('En curso');
    });

    it('el indicador se desliza a la posición del item activo (translateX)', () => {
      host.value.set('en_curso');
      fixture.detectChanges();

      expect(indicator().style.transform).toBe('translateX(200%)');
    });

    it('con "value" en el primer item, el indicador queda en translateX(0%)', () => {
      expect(indicator().style.transform).toBe('translateX(0%)');
    });

    it('con "value" que no coincide con ningún item, ningún <li> queda activo', () => {
      host.value.set('no-existe');
      fixture.detectChanges();

      expect(activeLi()).toBeNull();
    });

    it('click en un botón emite valueChange con el index y value de ese item', () => {
      buttons()[2].nativeElement.click();

      expect(host.changes).toEqual([{ index: 2, value: 'en_curso' }]);
    });

    it('varios clicks emiten un evento cada vez, en orden', () => {
      buttons()[1].nativeElement.click();
      buttons()[3].nativeElement.click();

      expect(host.changes).toEqual([
        { index: 1, value: 'pendiente' },
        { index: 3, value: 'completada' },
      ]);
    });
  });
});