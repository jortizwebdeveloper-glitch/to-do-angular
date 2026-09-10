import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject, linkedSignal } from '@angular/core';
import { TaskController } from '@app/features/task';
import type { TaskZod } from '@components/02-molecules/form-task/form.type';
import { taskSchema } from '@components/02-molecules/form-task/form.type';
import { FormTask } from '@components/02-molecules/form-task/form-task';
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

  constructor() {
    this.taskController.selectTask(this.data.id);
  }

  fields = linkedSignal(() => {
    const task = this.taskController.getTask();
    return task.ok && task.data ? taskSchema.parse(task.data) : null;
  });

  onClose() {
    this.dialogRef.close();
  }
  async onSubmit(values: TaskZod) {
    const res = await this.taskController.updateTask(this.data.id, values);
    if (res.ok) {
      if (res.data)
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
