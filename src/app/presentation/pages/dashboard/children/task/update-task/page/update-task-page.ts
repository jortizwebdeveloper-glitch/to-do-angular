import { Component, inject, input, linkedSignal, model } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { TaskController } from '@app/features/task';
import type { TaskZod } from '@components/02-molecules/form-task/form-task';
import { FormTask } from '@components/02-molecules/form-task/form-task';
import { Modal } from '@components/02-molecules/modal/modal';
import { of } from 'rxjs';

@Component({
  selector: 'app-update-task',
  imports: [FormTask, Modal],
  templateUrl: './update-task-page.html',
})
export class UpdateTaskPage {
  taskController = inject(TaskController);
  show = model<boolean>();
  id = input.required<number>();

  close() {
    this.show.set(false);
  }

  task = rxResource({
    params: () => this.id(),
    stream: ({ params: id }) => {
      const res = this.taskController.getTask(id);
      return res.ok ? res.data : of(undefined);
    },
  });
  fields = linkedSignal(() => this.task.value() ?? null);

  async onSubmit(values: TaskZod) {
    const res = await this.taskController.updateTask(this.id(), values);
    alert(res.ok ? 'Tarea actualizada' : res.message);
    this.close();
  }
}
