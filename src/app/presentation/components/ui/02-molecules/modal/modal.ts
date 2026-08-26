import type { OverlayRef } from '@angular/cdk/overlay';
import { Overlay } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import type { OnDestroy, TemplateRef } from '@angular/core';
import {
  afterNextRender,
  Component,
  inject,
  output,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.html',
})
export class Modal implements OnDestroy {
  @ViewChild('modalContent') templateRef!: TemplateRef<unknown>;

  private overlay = inject(Overlay);
  private vcr = inject(ViewContainerRef);
  private overlayRef?: OverlayRef;
  eventClose = output();
  constructor() {
    afterNextRender(() => {
      this.overlayRef = this.overlay.create({
        hasBackdrop: true,
        backdropClass: ['backdrop-blur', 'bg-black/50'],
        positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
      });

      const portal = new TemplatePortal(this.templateRef, this.vcr);
      this.overlayRef.attach(portal);

      // cerrar al hacer click en el backdrop
      this.overlayRef.backdropClick().subscribe(() => this.eventClose.emit());
    });
  }
  ngOnDestroy(): void {
    this.overlayRef?.dispose();
  }
}
