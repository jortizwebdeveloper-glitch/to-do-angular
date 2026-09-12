import { Component, signal } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, RouterLink } from '@angular/router';
import { OptionsService } from '@app/core/shared/service/options.service';
import type { TaskViewModel, TStatusTask } from '@app/features/task';
import { Badge } from '@components/01-atoms/badge/badge';
import { Icon } from '@components/01-atoms/icon/icon';
import { IconText } from '@components/01-atoms/icon-text/icon-text';
import { Tag } from '@components/01-atoms/tag/tag';

import { Card } from './card';

function daysFromNow(offset: number): string {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
}

function buildTask(overrides: Partial<TaskViewModel> = {}): TaskViewModel {
  return {
    id: 7,
    title: 'Comprar insumos',
    description: 'Harina, leche y huevos',
    categoria: { id: 1, name: 'Casa', color: 'blue' },
    tags: [
      { id: 1, name: 'Urgente', color: 'red' },
      { id: 2, name: 'Compras', color: 'green' },
    ],
    status: 'pendiente',
    dueDate: daysFromNow(0),
    completeDate: '',
    priority: 'alta',
    finished: false,
    ...overrides,
  };
}

const fakeOptionsService = {
  statusOptions: [
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'en_curso', label: 'En curso' },
    { value: 'completada', label: 'Completada' },
  ],
};

@Component({
  imports: [Card],
  template: `<app-card [data]="data()" (eventStatusChenge)="onChange($event)"></app-card>`,
})
class CardHost {
  data = signal<TaskViewModel>(buildTask());
  changed: TStatusTask[] = [];
  onChange(value: TStatusTask) {
    this.changed.push(value);
  }
}

describe('Card', () => {
  it('should create', async () => {
    await TestBed.configureTestingModule({
      imports: [Card],
      providers: [provideRouter([]), { provide: OptionsService, useValue: fakeOptionsService }],
    }).compileComponents();

    const fixture = TestBed.createComponent(Card);
    fixture.componentRef.setInput('data', buildTask());
    await fixture.whenStable();

    expect(fixture.componentInstance).toBeTruthy();
  });

  describe('render en host', () => {
    let fixture: ComponentFixture<CardHost>;
    let host: CardHost;

    const statusIcon = () => fixture.debugElement.query(By.directive(Icon)).componentInstance as Icon;
    const badge = () => fixture.debugElement.query(By.directive(Badge)).componentInstance as Badge;
    const iconText = () => fixture.debugElement.query(By.directive(IconText)).componentInstance as IconText;
    const tags = () => fixture.debugElement.queryAll(By.directive(Tag));
    const link = () => fixture.debugElement.query(By.directive(RouterLink)).injector.get(RouterLink);
    const dueDateEl = () =>
      fixture.debugElement.query(By.css('h2 + div')).nativeElement as HTMLElement;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CardHost],
        providers: [provideRouter([]), { provide: OptionsService, useValue: fakeOptionsService }],
      }).compileComponents();

      fixture = TestBed.createComponent(CardHost);
      host = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('renderiza el título de la tarea', () => {
      const title = fixture.debugElement.query(By.css('h2')).nativeElement as HTMLElement;
      expect(title.textContent?.trim()).toBe('Comprar insumos');
    });

    it('renderiza la prioridad con su color en app-badge', () => {
      expect(badge().color()).toBe('red');
      const badgeEl = fixture.debugElement.query(By.directive(Badge)).nativeElement as HTMLElement;
      expect(badgeEl.textContent?.trim()).toBe('Alta');
    });

    it('renderiza la categoría vía app-icon-text con su color', () => {
      expect(iconText().color()).toBe('blue');
      const iconTextEl = fixture.debugElement.query(By.directive(IconText)).nativeElement as HTMLElement;
      expect(iconTextEl.textContent?.trim()).toBe('Casa');
    });

    it('renderiza un app-tag por cada tag, con su color y label', () => {
      const tagEls = tags();
      expect(tagEls).toHaveLength(2);
      expect(tagEls[0].componentInstance.color()).toBe('red');
      expect((tagEls[0].nativeElement as HTMLElement).textContent?.trim()).toBe('Urgente');
      expect(tagEls[1].componentInstance.color()).toBe('green');
    });

    it('el link de la tarjeta apunta a ["task", id]', () => {
      expect(link().href).toBe('/task/7');
    });

    it('con status "pendiente", el ícono del trigger es "circle"', () => {
      expect(statusIcon().name()).toBe('circle');
    });

    it('con status "en_curso", el ícono del trigger es "circle-fading-arrow-up"', () => {
      host.data.set(buildTask({ status: 'en_curso' }));
      fixture.detectChanges();

      expect(statusIcon().name()).toBe('circle-fading-arrow-up');
    });

    it('con status "completada", el ícono del trigger es "circle-check"', () => {
      host.data.set(buildTask({ status: 'completada' }));
      fixture.detectChanges();

      expect(statusIcon().name()).toBe('circle-check');
    });

    it('elegir un estado en el dropdown emite eventStatusChenge con ese valor', () => {
      const trigger = fixture.debugElement.query(By.css('app-dropdown button')).nativeElement as HTMLElement;
      trigger.click();
      fixture.detectChanges();

      const options = fixture.debugElement.queryAll(By.css('app-dropdown-list li button'));
      options[1].nativeElement.click();
      fixture.detectChanges();

      expect(host.changed).toEqual(['en_curso']);
    });

    it('con una tarea completada, la fecha usa el color de estado "completada" (emerald)', () => {
      host.data.set(buildTask({ status: 'completada', dueDate: daysFromNow(-5) }));
      fixture.detectChanges();

      expect(dueDateEl().classList).toContain('text-emerald-500');
      expect(dueDateEl().classList).toContain('font-semibold');
    });

    it('con completeDate presente, muestra ese valor en vez de la etiqueta derivada de dueDate', () => {
      host.data.set(
        buildTask({ status: 'completada', dueDate: daysFromNow(-5), completeDate: daysFromNow(-2) }),
      );
      fixture.detectChanges();

      expect(dueDateEl().textContent?.trim()).toBe(daysFromNow(-2));
    });

    it('sin completeDate, muestra la etiqueta derivada de dueDate (hoy/ayer/mañana/fecha)', () => {
      host.data.set(buildTask({ status: 'pendiente', dueDate: daysFromNow(0) }));
      fixture.detectChanges();

      expect(dueDateEl().textContent?.trim()).toBe('Hoy');
    });

    it('con una tarea vencida (no completada), la fecha usa color rojo', () => {
      host.data.set(buildTask({ status: 'pendiente', dueDate: daysFromNow(-3) }));
      fixture.detectChanges();

      expect(dueDateEl().classList).toContain('text-red-500');
    });

    it('con una fecha sin color especial (ni hoy/ayer/mañana ni vencida), cae al estilo neutral', () => {
      host.data.set(buildTask({ status: 'pendiente', dueDate: daysFromNow(10) }));
      fixture.detectChanges();

      expect(dueDateEl().classList).toContain('opacity-75');
      expect(dueDateEl().classList).toContain('font-medium');
    });

    it('reacciona a un cambio de data (nuevo título) sin recrear el fixture', () => {
      host.data.set(buildTask({ title: 'Nueva tarea' }));
      fixture.detectChanges();

      const title = fixture.debugElement.query(By.css('h2')).nativeElement as HTMLElement;
      expect(title.textContent?.trim()).toBe('Nueva tarea');
    });
  });
});
