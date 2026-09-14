import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import type { TaskZod } from '@components/02-molecules/form-task/form.type';
import { FormTask } from '@components/02-molecules/form-task/form-task';
import { Modal } from '@components/02-molecules/modal/modal';

import { TaskStore } from '@/app/presentation/shared/task.store';

@Component({
  selector: 'app-create-task',
  imports: [FormTask, Modal],
  templateUrl: './create-task-page.html',
})
export class CreateTaskPage {
  private router = inject(Router);
  private taskStore = inject(TaskStore);

  close() {
    this.router.navigate(['dashboard'], {
      queryParamsHandling: 'merge',
    });
  }

  async onSubmit(values: TaskZod) {
    if (await this.taskStore.createTask(values)) {
      this.close();
    }
  }
}
