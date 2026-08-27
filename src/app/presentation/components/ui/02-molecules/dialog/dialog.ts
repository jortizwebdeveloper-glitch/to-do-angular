import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import type { TColor } from '@app/core/shared/theme/color.registry';
import { AppButton } from '@components/01-atoms/button/button.directive';
import { Icon } from '@components/01-atoms/icon/icon';

interface TData {
  title?: string;
  description?: string;
  next?: {
    label?: string;
    variant?: TColor;
  };
}

@Component({
  selector: 'app-dialog',
  imports: [AppButton, Icon],
  templateUrl: './dialog.html',
})
export class Dialog {
  dialogRef = inject<DialogRef<boolean>>(DialogRef);
  data = inject<TData>(DIALOG_DATA);
  onCancel() {
    this.dialogRef.close(false);
  }
  onAccept() {
    this.dialogRef.close(true);
  }
}
