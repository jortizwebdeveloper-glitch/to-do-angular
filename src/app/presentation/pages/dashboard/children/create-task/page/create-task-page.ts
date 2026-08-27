import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TaskController } from '@app/features/task';
import type { TaskZod } from '@components/02-molecules/form-task/form-task';
import { FormTask } from '@components/02-molecules/form-task/form-task';
import { Modal } from '@components/02-molecules/modal/modal';
import { toast } from 'vanilla-toast-js';
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
    if (res.ok) {
      toast('Tarea creada', {
        type: 'success',
        position: 'top-right',
      });
      this.close();
    } else {
      toast(res.message, {
        type: 'error',
        position: 'top-right',
      });
    }
  }
}
