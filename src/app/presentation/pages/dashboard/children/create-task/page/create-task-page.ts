import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TaskController } from '@app/features/task';
import type { TaskZod } from '@components/02-molecules/form-task/form-task';
import { FormTask } from '@components/02-molecules/form-task/form-task';
import { Modal } from '@components/02-molecules/modal/modal';

@Component({
  selector: 'app-create-task',
  imports: [FormTask, Modal],
  templateUrl: './create-task-page.html',
})
export class CreateTaskPage {
  private router = inject(Router);
  taskController = inject(TaskController);

  close() {
    this.router.navigate(['dashboard'], {
      queryParamsHandling: 'merge',
    });
  }

  async onSubmit(values: TaskZod) {
    const res = await this.taskController.createTask(values);
    alert(res.ok ? 'Tarea creada' : res.message);
    this.close();
  }
}
