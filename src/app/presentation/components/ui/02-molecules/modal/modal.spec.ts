import { Component } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { Modal } from './modal';

@Component({
  imports: [Modal],
  template: `<app-modal (eventClose)="onClose()"><p>Contenido del modal</p></app-modal>`,
})
class ModalHost {
  closed = 0;
  onClose() {
    this.closed++;
  }
}

describe('Modal', () => {
  let fixture: ComponentFixture<ModalHost>;
  let host: ModalHost;

  const backdrop = () => document.querySelector('.cdk-overlay-backdrop') as HTMLElement | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ModalHost] }).compileComponents();

    fixture = TestBed.createComponent(ModalHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('proyecta el contenido dentro del overlay', () => {
    expect(document.body.textContent).toContain('Contenido del modal');
  });

  it('crea un backdrop con blur y fondo oscuro', () => {
    const el = backdrop();
    expect(el).not.toBeNull();
    expect(el?.classList).toContain('backdrop-blur');
    expect(el?.classList).toContain('bg-black/50');
  });

  it('click en el backdrop emite eventClose', () => {
    backdrop()?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();

    expect(host.closed).toBe(1);
  });

  it('al destruir el fixture, se limpia el overlay del DOM', () => {
    expect(backdrop()).not.toBeNull();

    fixture.destroy();

    expect(backdrop()).toBeNull();
  });
});
