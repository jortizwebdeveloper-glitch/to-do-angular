import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AppButton } from '@components/01-atoms/button/button.directive';

import { Dialog } from './dialog';

class FakeDialogRef {
  closedWith: (boolean | undefined)[] = [];
  close(value?: boolean) {
    this.closedWith.push(value);
  }
}

function setup(data: object) {
  return TestBed.configureTestingModule({
    imports: [Dialog],
    providers: [
      { provide: DialogRef, useClass: FakeDialogRef },
      { provide: DIALOG_DATA, useValue: data },
    ],
  }).compileComponents();
}

describe('Dialog', () => {
  let fixture: ComponentFixture<Dialog>;
  let dialogRef: FakeDialogRef;

  const cancelButton = () => fixture.debugElement.query(By.css('footer button:first-child'));
  const nextButton = () => fixture.debugElement.query(By.css('footer button:last-child'));
  const closeButton = () => fixture.debugElement.query(By.css('header button'));

  describe('con data mínima (sin next)', () => {
    beforeEach(async () => {
      await setup({ title: 'Finalizar tarea', description: '¿Estás seguro?' });

      fixture = TestBed.createComponent(Dialog);
      dialogRef = fixture.debugElement.injector.get(DialogRef) as unknown as FakeDialogRef;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('renderiza el título y la descripción de data', () => {
      expect(fixture.debugElement.query(By.css('header p')).nativeElement.textContent.trim()).toBe(
        'Finalizar tarea',
      );
      expect(fixture.debugElement.query(By.css('.leading-loose p')).nativeElement.textContent.trim()).toBe(
        '¿Estás seguro?',
      );
    });

    it('sin data.next, el botón principal dice "Aceptar" y usa variant "blue"', () => {
      expect(nextButton().nativeElement.textContent.trim()).toBe('Aceptar');
      expect(nextButton().injector.get(AppButton).variant()).toBe('blue');
    });

    it('click en "Cancelar" cierra el dialog con false', () => {
      cancelButton().nativeElement.click();

      expect(dialogRef.closedWith).toEqual([false]);
    });

    it('click en "Aceptar" cierra el dialog con true', () => {
      nextButton().nativeElement.click();

      expect(dialogRef.closedWith).toEqual([true]);
    });

    it('el botón "Cancelar" usa variant "slate" con outline', () => {
      const btn = cancelButton().injector.get(AppButton);
      expect(btn.variant()).toBe('slate');
      expect(btn.outline()).toBe(true);
    });
  });

  describe('con data.next personalizado', () => {
    beforeEach(async () => {
      await setup({
        title: 'Eliminar tarea',
        description: '¿Vas a eliminar la tarea?',
        next: { label: 'Eliminar', variant: 'rose' },
      });

      fixture = TestBed.createComponent(Dialog);
      dialogRef = fixture.debugElement.injector.get(DialogRef) as unknown as FakeDialogRef;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('usa el label y variant de data.next en el botón principal', () => {
      expect(nextButton().nativeElement.textContent.trim()).toBe('Eliminar');
      expect(nextButton().injector.get(AppButton).variant()).toBe('rose');
    });

    it('click en el botón principal cierra el dialog con true, sin importar el label', () => {
      nextButton().nativeElement.click();

      expect(dialogRef.closedWith).toEqual([true]);
    });
  });

  it('click en el botón "x" del header cierra el dialog con false', async () => {
    await setup({ title: 'Finalizar tarea', description: '¿Estás seguro?' });

    fixture = TestBed.createComponent(Dialog);
    dialogRef = fixture.debugElement.injector.get(DialogRef) as unknown as FakeDialogRef;
    fixture.detectChanges();
    await fixture.whenStable();

    closeButton().nativeElement.click();

    expect(dialogRef.closedWith).toEqual([false]);
  });
});
