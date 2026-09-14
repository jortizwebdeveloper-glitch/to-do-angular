import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject, linkedSignal } from '@angular/core';
import type { TaskZod } from '@components/02-molecules/form-task/form.type';
import { taskSchema } from '@components/02-molecules/form-task/form.type';
import { FormTask } from '@components/02-molecules/form-task/form-task';

import { TaskStore } from '@/app/presentation/shared/task.store';

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

  private taskStore = inject(TaskStore);

  constructor() {
    this.taskStore.selectTask(this.data.id);
  }

  fields = linkedSignal(() => {
    const task = this.taskStore.getTask();
    return task.ok && task.data ? taskSchema.parse(task.data) : null;
  });

  onClose() {
    this.dialogRef.close();
  }

  async onSubmit(values: TaskZod) {
    if (await this.taskStore.updateTask(this.data.id, values)) {
      this.onClose();
    }
  }
}
