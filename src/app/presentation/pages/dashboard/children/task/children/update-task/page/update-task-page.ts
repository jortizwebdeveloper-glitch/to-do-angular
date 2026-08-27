import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject, linkedSignal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { TaskController } from '@app/features/task';
import type { TaskZod } from '@components/02-molecules/form-task/form-task';
import { FormTask } from '@components/02-molecules/form-task/form-task';
import { of } from 'rxjs';
import { toast } from 'vanilla-toast-js';

interface TData {
  id: number;
}

@Component({
  selector: 'app-update-task',
  imports: [FormTask],
  templateUrl: './update-task-page.html',
})
export class UpdateTaskPage {
  dialogRef = inject<DialogRef<boolean>>(DialogRef<boolean>);
  data = inject<TData>(DIALOG_DATA);

  taskController = inject(TaskController);
  task = rxResource({
    stream: () => {
      const res = this.taskController.getTask(this.data.id);
      return res.ok ? res.data : of(undefined);
    },
  });
  fields = linkedSignal(() => this.task.value() ?? null);

  onClose() {
    this.dialogRef.close();
  }
  async onSubmit(values: TaskZod) {
    const res = await this.taskController.updateTask(this.data.id, values);
    if (res.ok) {
      toast('Tarea actualizada', {
        type: 'success',
        closeButton: true,
        position: 'top-right',
      });
      this.onClose();
    } else {
      toast(res.message, {
        type: 'error',
        position: 'top-right',
      });
    }
  }
}
